import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useCamera } from "@/hooks/useCamera";
import { useAsciiStream } from "@/hooks/useAsciiStream";
import { AsciiCanvas } from "./AsciiCanvas";
import { SettingsSidebar } from "./SettingsSidebar";
import { ActionButtons } from "./ActionButtons";
import {
  CHARSETS,
  DEFAULT_COLS,
  FONT_SIZE,
  LINE_HEIGHT,
  parseCustomChars,
  parseRatio,
  buildLut,
} from "./constants";
import { frameToPhotoCanvas } from "./render";

const DEFAULT_CHARS = CHARSETS.classic;

function defaultColorMap() {
  const map = {};
  for (const c of DEFAULT_CHARS) map[c] = "#eeeeee";
  return map;
}

const INITIAL_SETTINGS = {
  aspectMode: "auto",
  cols: DEFAULT_COLS,
  contrast: 1,
  gamma: 1,
  invert: false,
  mirror: false,
  charsetKey: "classic",
  customChars: "",
  colorMode: "uniform",
  uniformColor: "#eeeeee",
  charColorMap: defaultColorMap(),
};

const STATUS_MESSAGES = {
  starting: { title: "Starting camera…", body: "", retry: false },
  denied: {
    title: "Camera permission denied",
    body: "Allow camera access in your browser settings and try again.",
    retry: true,
  },
  notFound: {
    title: "No camera found",
    body: "Connect a camera and try again.",
    retry: true,
  },
  busy: {
    title: "Camera is in use",
    body: "Close other apps using the camera and try again.",
    retry: true,
  },
  unsupported: {
    title: "Camera not available",
    body: "This browser or context doesn't support camera access (HTTPS required).",
    retry: false,
  },
  error: {
    title: "Something went wrong",
    body: "Could not start the camera. Please try again.",
    retry: true,
  },
};

export default function AsciiCameraApp() {
  const videoRef = useRef(null);
  const frameRef = useRef(null);
  const frameListenersRef = useRef(new Set());
  const gridSizeRef = useRef({ cols: 0, rows: 0 });
  const settingsRef = useRef(null);
  const userTouchedMirrorRef = useRef(false);

  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const update = useCallback(
    (patch) => setSettings((s) => ({ ...s, ...patch })),
    []
  );

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [charW, setCharW] = useState(FONT_SIZE * 0.6);
  const [ratio, setRatio] = useState(16 / 9);
  const [status, setStatus] = useState("starting");
  const [retryToken, setRetryToken] = useState(0);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const {
    videoDevices,
    selectedDeviceId,
    selectDevice,
    switchCamera,
    canSwitchCamera,
    refreshAfterPermission,
  } = useCamera();

  // ---- Derived charset / LUT / colors ----
  const chars = useMemo(
    () =>
      settings.charsetKey === "custom"
        ? parseCustomChars(settings.customChars)
        : CHARSETS[settings.charsetKey] || CHARSETS.classic,
    [settings.charsetKey, settings.customChars]
  );

  const lut = useMemo(
    () =>
      buildLut({
        chars,
        contrast: settings.contrast,
        gamma: settings.gamma,
        invert: settings.invert,
      }),
    [chars, settings.contrast, settings.gamma, settings.invert]
  );

  const codeFromIndex = useMemo(() => chars.map((c) => c.charCodeAt(0)), [chars]);

  const colorByIndex = useMemo(
    () => chars.map((c) => settings.charColorMap[c] || "#eeeeee"),
    [chars, settings.charColorMap]
  );

  // Live settings snapshot for the render loop (no re-renders per frame)
  useEffect(() => {
    settingsRef.current = {
      lut,
      colorMode: settings.colorMode,
      uniformColor: settings.uniformColor,
      colorByIndex,
      codeFromIndex,
      mirror: settings.mirror,
    };
  }, [lut, settings.colorMode, settings.uniformColor, colorByIndex, codeFromIndex, settings.mirror]);

  // ---- Layout ----
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${FONT_SIZE}px monospace`;
    setCharW(ctx.measureText("M").width || FONT_SIZE * 0.6);
  }, []);

  useEffect(() => {
    if (settings.aspectMode !== "auto") {
      setRatio(parseRatio(settings.aspectMode));
      return undefined;
    }
    const resolve = () => {
      setIsMobileLayout(window.innerWidth < 768);
      const r = window.innerWidth / Math.max(1, window.innerHeight);
      setRatio(Math.min(2, Math.max(0.5, r)));
    };
    resolve();
    window.addEventListener("resize", resolve);
    return () => window.removeEventListener("resize", resolve);
  }, [settings.aspectMode]);

  useEffect(() => {
    if (!containerSize.width || !containerSize.height || !charW) return;
    const margin = 16;
    const availW = Math.max(0, containerSize.width - margin);
    const availH = Math.max(0, containerSize.height - margin);
    if (!availW || !availH) return;

    const cellAspect = charW / LINE_HEIGHT;
    let cols = Math.min(settings.cols, Math.floor(availW / charW));
    let rows = Math.round((cols * cellAspect) / ratio);
    const maxRows = Math.max(10, Math.floor(availH / LINE_HEIGHT));
    if (rows > maxRows) {
      rows = maxRows;
      cols = Math.round((rows * ratio) / cellAspect);
    }
    cols = Math.max(10, Math.min(cols, settings.cols));
    rows = Math.max(10, Math.min(rows, maxRows));

    gridSizeRef.current = { cols, rows };
  }, [containerSize, settings.cols, ratio, charW]);

  const setMirror = useCallback(
    (checked) => {
      userTouchedMirrorRef.current = true;
      update({ mirror: checked });
    },
    [update]
  );

  // ---- Frame plumbing (no state per frame) ----
  const emitFrame = useCallback((frame) => {
    frameRef.current = frame;
    for (const cb of frameListenersRef.current) cb(frame);
  }, []);

  const subscribeFrame = useCallback((cb) => {
    frameListenersRef.current.add(cb);
    return () => frameListenersRef.current.delete(cb);
  }, []);

  const handleMeasure = useCallback((width, height) => {
    setContainerSize((prev) =>
      prev.width === width && prev.height === height
        ? prev
        : { width, height }
    );
  }, []);

  useAsciiStream({
    videoRef,
    selectedDeviceId,
    retryToken,
    gridSizeRef,
    settingsRef,
    onFrame: emitFrame,
    onStatus: setStatus,
    onPermissionGranted: refreshAfterPermission,
    onMirrorSuggestion: (isFront) => {
      if (!userTouchedMirrorRef.current) update({ mirror: isFront });
    },
  });

  // ---- Actions ----
  const randomColor = useCallback(() => {
    const randHex = () =>
      `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")}`;
    if (settings.colorMode === "uniform") {
      update({ uniformColor: randHex() });
      return;
    }
    const map = {};
    for (const c of chars) map[c] = randHex();
    update({
      colorMode: "perChar",
      charColorMap: { ...settings.charColorMap, ...map },
    });
  }, [settings.colorMode, settings.charColorMap, chars, update]);

  const rainbowColors = useCallback(() => {
    const map = {};
    chars.forEach((c, i) => {
      const hue = Math.round((i / chars.length) * 360);
      map[c] = `hsl(${hue}, 100%, 65%)`;
    });
    update({
      colorMode: "perChar",
      charColorMap: { ...settings.charColorMap, ...map },
    });
  }, [chars, settings.charColorMap, update]);

  const downloadCanvas = useCallback((canvas) => {
    try {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = "ascii-photo-text.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Error generating image data URL for download:", e);
    }
  }, []);

  const takePhoto = useCallback(async () => {
    const frame = frameRef.current;
    if (!frame) return;
    try {
      const canvas = frameToPhotoCanvas(frame, {
        colorMode: settings.colorMode,
        uniformColor: settings.uniformColor,
        colorByIndex,
        codeFromIndex,
        bg: "#000",
      });
      const blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png")
      );
      if (blob && navigator.share && isMobileLayout) {
        const file = new File([blob], "ascii-photo.png", { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "ASCII Photo",
            text: "Check out this ASCII art!",
          });
          return;
        }
      }
      downloadCanvas(canvas);
    } catch (error) {
      if (error?.name === "AbortError") return; // user cancelled share
      console.error("Error taking photo:", error);
    }
  }, [
    settings.colorMode,
    settings.uniformColor,
    colorByIndex,
    codeFromIndex,
    isMobileLayout,
    downloadCanvas,
  ]);

  const statusInfo = STATUS_MESSAGES[status];
  const showOverlay = status !== "ready";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobileLayout ? "column" : "row",
        height: "100vh",
        margin: 0,
        overflow: "hidden",
        backgroundColor: "#111",
      }}
    >
      {isMobileLayout && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.5rem 1rem",
            backgroundColor: "#222",
            color: "#fff",
            flexShrink: 0,
            height: "50px",
          }}
        >
          <span>ASCII Cam</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileSidebarOpen((v) => !v)}
            aria-label="Toggle Sidebar"
          >
            <Menu size={24} />
          </Button>
        </div>
      )}

      <SettingsSidebar
        isMobileLayout={isMobileLayout}
        isMobileOpen={isMobileSidebarOpen}
        isDesktopOpen={isDesktopSidebarOpen}
        settings={settings}
        update={update}
        setMirror={setMirror}
        videoDevices={videoDevices}
        selectedDeviceId={selectedDeviceId}
        selectDevice={selectDevice}
        chars={chars}
      />

      {isMobileLayout && isMobileSidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsMobileSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsMobileSidebarOpen(false);
            }
          }}
          style={{
            position: "fixed",
            top: "50px",
            left: "230px",
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9,
          }}
        />
      )}

      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {!isMobileLayout && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            style={{
              position: "absolute",
              top: "0.5rem",
              left: "0.5rem",
              zIndex: 11,
              color: "#999",
            }}
            aria-label="Toggle Sidebar"
          >
            {isDesktopSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
          </Button>
        )}

        <AsciiCanvas
          subscribe={subscribeFrame}
          onMeasure={handleMeasure}
          charW={charW}
          colorMode={settings.colorMode}
          uniformColor={settings.uniformColor}
          colorByIndex={colorByIndex}
          codeFromIndex={codeFromIndex}
        />

        {showOverlay && statusInfo && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              backgroundColor: "rgba(0,0,0,0.75)",
              color: "#eee",
              zIndex: 6,
              textAlign: "center",
              padding: "1rem",
            }}
          >
            <p className="text-lg font-semibold">{statusInfo.title}</p>
            {statusInfo.body && (
              <p className="max-w-sm text-sm text-gray-400">{statusInfo.body}</p>
            )}
            {statusInfo.retry && (
              <Button
                variant="secondary"
                onClick={() => setRetryToken((t) => t + 1)}
              >
                Retry
              </Button>
            )}
          </div>
        )}

        <ActionButtons
          isMobileLayout={isMobileLayout}
          randomColor={randomColor}
          rainbowColors={rainbowColors}
          takePhoto={takePhoto}
          switchCamera={switchCamera}
          canSwitchCamera={canSwitchCamera}
        />
      </div>

      <video
        ref={videoRef}
        style={{ display: "none" }}
        playsInline
        muted
        autoPlay
      />
    </div>
  );
}
