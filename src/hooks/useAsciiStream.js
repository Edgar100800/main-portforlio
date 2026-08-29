import { useEffect, useRef } from "react";
import { TARGET_FPS } from "@/components/ascii-camera/core/constants";

/**
 * Owns the camera stream lifecycle and the ASCII processing loop.
 *
 * - Stream opens/closes only when selectedDeviceId (or retryToken) changes;
 *   grid size changes just resize the offscreen sample canvas.
 * - Tracks are always stopped on cleanup and on races with newer requests,
 *   so the camera is fully released on unmount and on device switches.
 * - Emits frames through onFrame instead of state to avoid React re-renders
 *   at 30fps.
 *
 * settingsRef.current = {
 *   lut, colorMode, uniformColor, colorByIndex, codeFromIndex, mirror, fps,
 *   effect ("ascii"|"pixel"), quantStep (per-channel quantization step)
 * }
 */
export function useAsciiStream({
  videoRef,
  selectedDeviceId,
  retryToken,
  gridSizeRef,
  settingsRef,
  onFrame,
  onStatus,
  onPermissionGranted,
  onMirrorSuggestion,
}) {
  const callbacksRef = useRef({});
  callbacksRef.current = { onFrame, onStatus, onPermissionGranted, onMirrorSuggestion };

  useEffect(() => {
    const cbs = callbacksRef.current;

    if (!navigator.mediaDevices?.getUserMedia) {
      cbs.onStatus("unsupported");
      return undefined;
    }

    let cancelled = false;
    let stream = null;
    let rafId = 0;
    let lastProcessTime = 0;
    let indexBuffer = null;
    let colorBuffer = null;
    const sampleCanvas = document.createElement("canvas");
    const sampleCtx = sampleCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    const interval = 1000 / TARGET_FPS;

    const loop = () => {
      // schedule first so early returns never kill the loop
      rafId = requestAnimationFrame(loop);

      const video = videoRef.current;
      const s = settingsRef.current;
      if (!video || !s) return;

      const { cols, rows } = gridSizeRef.current;
      if (cols <= 0 || rows <= 0) return;
      if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;

      // Only process frames that will actually be displayed
      const now = performance.now();
      if (now - lastProcessTime < 1000 / (s.fps || TARGET_FPS)) return;
      lastProcessTime = now;

      if (sampleCanvas.width !== cols) sampleCanvas.width = cols;
      if (sampleCanvas.height !== rows) sampleCanvas.height = rows;

      // Center-crop the video to the grid aspect ratio
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      let sx = 0;
      let sy = 0;
      let sw = vw;
      let sh = vh;
      const videoRatio = vw / vh;
      const cellRatio = cols / rows;
      if (videoRatio > cellRatio) {
        sw = vh * cellRatio;
        sx = (vw - sw) / 2;
      } else if (videoRatio < cellRatio) {
        sh = vw / cellRatio;
        sy = (vh - sh) / 2;
      }

      sampleCtx.save();
      if (s.mirror) {
        sampleCtx.translate(cols, 0);
        sampleCtx.scale(-1, 1);
      }
      sampleCtx.drawImage(video, sx, sy, sw, sh, 0, 0, cols, rows);
      sampleCtx.restore();

      let data;
      try {
        data = sampleCtx.getImageData(0, 0, cols, rows).data;
      } catch {
        return;
      }

      const cellCount = cols * rows;
      if (!indexBuffer || indexBuffer.length !== cellCount) {
        indexBuffer = new Uint8Array(cellCount);
      }
      let colorData = null;
      const wantColors = s.colorMode === "video" || s.effect === "pixel";
      if (wantColors) {
        if (!colorBuffer || colorBuffer.length !== cellCount * 3) {
          colorBuffer = new Uint8Array(cellCount * 3);
        }
        colorData = colorBuffer;
      }
      const lut = s.lut;
      // pixel effect: quantize each channel to s.colorLevels flat tones
      const qStep = s.effect === "pixel" ? s.quantStep || 51 : 0;
      const writePixel = s.effect === "pixel";

      if (colorData) {
        if (writePixel) {
          for (let i = 0, p = 0, q = 0; i < cellCount; i++, p += 4, q += 3) {
            indexBuffer[i] = lut[(0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2]) | 0];
            colorData[q] = (Math.round(data[p] / qStep) * qStep) | 0;
            colorData[q + 1] = (Math.round(data[p + 1] / qStep) * qStep) | 0;
            colorData[q + 2] = (Math.round(data[p + 2] / qStep) * qStep) | 0;
          }
        } else {
          for (let i = 0, p = 0, q = 0; i < cellCount; i++, p += 4, q += 3) {
            indexBuffer[i] = lut[(0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2]) | 0];
            colorData[q] = data[p] & 0xf8;
            colorData[q + 1] = data[p + 1] & 0xf8;
            colorData[q + 2] = data[p + 2] & 0xf8;
          }
        }
      } else {
        for (let i = 0, p = 0; i < cellCount; i++, p += 4) {
          indexBuffer[i] = lut[(0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2]) | 0];
        }
      }

      cbs.onFrame({ cols, rows, indices: indexBuffer, colors: colorData });
    };

    const start = async () => {
      cbs.onStatus("starting");
      const video = videoRef.current;
      if (!video) return;

      const videoConstraints = selectedDeviceId
        ? {
            deviceId: { exact: selectedDeviceId },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          }
        : {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          };

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: false,
        });
        // A newer request (or unmount) superseded this one
        if (cancelled) {
          newStream.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = newStream;
        video.srcObject = stream;
        try {
          await video.play();
        } catch {
          // autoplay rejection is fine; the loop waits for readyState
        }

        const track = stream.getVideoTracks()[0];
        const trackSettings = track?.getSettings?.() ?? {};
        cbs.onPermissionGranted?.(trackSettings.deviceId ?? null);
        cbs.onMirrorSuggestion?.(/front|user|facetime|frontal/i.test(track?.label ?? ""));
        cbs.onStatus("ready");

        lastProcessTime = 0;
        rafId = requestAnimationFrame(loop);
      } catch (err) {
        if (cancelled) return;
        const name = err?.name;
        if (name === "NotAllowedError" || name === "SecurityError") {
          cbs.onStatus("denied");
        } else if (
          name === "NotFoundError" ||
          name === "DevicesNotFoundError" ||
          name === "OverconstrainedError"
        ) {
          cbs.onStatus("notFound");
        } else if (
          name === "NotReadableError" ||
          name === "TrackStartError" ||
          name === "AbortError"
        ) {
          cbs.onStatus("busy");
        } else {
          cbs.onStatus("error");
        }
      }
    };

    start();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        stream = null;
      }
      const video = videoRef.current;
      if (video) video.srcObject = null;
    };
    // gridSizeRef/settingsRef/videoRef are stable refs; grid changes are
    // picked up per-frame without restarting the stream.
  }, [selectedDeviceId, retryToken, videoRef, gridSizeRef, settingsRef]);
}
