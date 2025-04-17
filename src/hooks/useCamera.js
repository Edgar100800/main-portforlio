import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook to manage camera devices and selection.
 */
export function useCamera() {
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const streamRef = useRef(null); // Keep track of the stream for permission request

  // Effect for Device Enumeration
  useEffect(() => {
    const getDevices = async () => {
      try {
        // Ensure permission is granted before enumerating
        if (!streamRef.current) {
          // Request a basic stream just to get permission if we haven't already
          const tempStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          // Store it temporarily or just use it for permission and stop tracks immediately
          streamRef.current = tempStream; // We might need a stream later anyway
          // Stop tracks if we only needed permission (optional optimization if stream isn't used elsewhere initially)
          // tempStream.getTracks().forEach(track => track.stop());
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setVideoDevices(videoInputs);

        if (videoInputs.length > 0 && !selectedDeviceId) {
          // Try to select back camera by default if available
          const backCamera = videoInputs.find(
            (device) =>
              device.label.toLowerCase().includes("back") ||
              device.label.toLowerCase().includes("environment")
          );
          setSelectedDeviceId(
            backCamera ? backCamera.deviceId : videoInputs[0].deviceId
          );
        }
      } catch (err) {
        console.error("Error enumerating devices or getting permissions:", err);
        // Handle error (e.g., set an error state)
      }
    };
    getDevices();

    // Cleanup: Stop the temporary stream if it was created just for permission
    // This might interfere if another part of the app needs the stream immediately.
    // Consider if streamRef needs broader scope or better management.
    // return () => {
    //   if (streamRef.current && /* check if it was only temporary */) {
    //     streamRef.current.getTracks().forEach(track => track.stop());
    //     streamRef.current = null;
    //   }
    // };
  }, [selectedDeviceId]); // Re-run if selectedDeviceId changes (might not be necessary here)

  // Action Callback to Switch Camera
  const switchCamera = useCallback(() => {
    if (videoDevices.length > 1) {
      const currentIndex = videoDevices.findIndex(
        (device) => device.deviceId === selectedDeviceId
      );
      const nextIndex = (currentIndex + 1) % videoDevices.length;
      setSelectedDeviceId(videoDevices[nextIndex].deviceId);
    }
  }, [videoDevices, selectedDeviceId]);

  // Return necessary state and functions
  return {
    videoDevices,
    selectedDeviceId,
    setSelectedDeviceId, // Allow external setting if needed elsewhere
    switchCamera,
    canSwitchCamera: videoDevices.length > 1,
  };
}
