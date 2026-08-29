import { useCallback, useEffect, useRef, useState } from "react";

const BACK_CAMERA_RE = /back|rear|environment|trasera|traser/i;

function pickDefaultDevice(devices) {
  const back = devices.find((d) => BACK_CAMERA_RE.test(d.label));
  return back ? back.deviceId : devices[0]?.deviceId ?? null;
}

/**
 * Custom hook to manage camera device enumeration and selection.
 * Never opens streams itself: permission is triggered by useAsciiStream,
 * which calls refreshAfterPermission() once granted so labels appear.
 */
export function useCamera() {
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const userSelectedRef = useRef(false);

  const selectDevice = useCallback((deviceId) => {
    if (!deviceId) return;
    userSelectedRef.current = true;
    setSelectedDeviceId(deviceId);
  }, []);

  const switchCamera = useCallback(() => {
    if (videoDevices.length < 2) return;
    const currentIndex = videoDevices.findIndex(
      (device) => device.deviceId === selectedDeviceId
    );
    const next = videoDevices[(currentIndex + 1) % videoDevices.length];
    if (next) {
      userSelectedRef.current = true;
      setSelectedDeviceId(next.deviceId);
    }
  }, [videoDevices, selectedDeviceId]);

  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) return undefined;
    let cancelled = false;

    const enumerate = async (autoSelect) => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        if (cancelled) return;
        const inputs = devices.filter((d) => d.kind === "videoinput");
        setVideoDevices(inputs);
        // Before permission is granted labels/deviceIds may be empty; only
        // auto-pick when we have something usable and the user hasn't chosen.
        if (autoSelect && !userSelectedRef.current && inputs[0]?.deviceId) {
          const preferred = pickDefaultDevice(inputs);
          if (preferred) setSelectedDeviceId((prev) => prev ?? preferred);
        }
      } catch {
        // enumeration failures are non-fatal; the stream hook surfaces errors
      }
    };

    enumerate(true);

    const onDeviceChange = () => enumerate(true);
    navigator.mediaDevices.addEventListener?.("devicechange", onDeviceChange);
    return () => {
      cancelled = true;
      navigator.mediaDevices.removeEventListener?.(
        "devicechange",
        onDeviceChange
      );
    };
  }, []);

  // Called once a stream is live: labels are now available, and on devices
  // with a rear camera we can switch to it once (guarded by userSelectedRef).
  const refreshAfterPermission = useCallback((activeDeviceId) => {
    (async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const inputs = devices.filter((d) => d.kind === "videoinput");
        setVideoDevices(inputs);
        if (!userSelectedRef.current && inputs[0]?.deviceId) {
          const preferred = pickDefaultDevice(inputs);
          if (preferred && preferred !== activeDeviceId) {
            userSelectedRef.current = true;
            setSelectedDeviceId(preferred);
          }
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  return {
    videoDevices,
    selectedDeviceId,
    selectDevice,
    switchCamera,
    canSwitchCamera: videoDevices.length > 1,
    refreshAfterPermission,
  };
}
