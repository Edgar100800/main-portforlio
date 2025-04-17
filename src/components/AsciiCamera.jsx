import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button"; // Import Shadcn Button
// Assuming Checkbox and Label exist in ui, import them if needed
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
import {
  Menu,
  Camera,
  Palette,
  Wand2,
  RefreshCw,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"; // Import icons
import { useCamera } from "../hooks/useCamera"; // Import the new hook

const asciiChars = ["@", "#", "S", "%", "?", "*", "+", ";", ":", "."]; // Ensure 10 levels
const FONT_SIZE = 8; // Assuming fixed font size for grid calculation
const LINE_HEIGHT = 8;
const THROTTLE_INTERVAL_MS = 33; // Approx 30fps

// Helper to parse aspect ratio string
const parseRatio = (ratioStr) => {
  const [w, h] = ratioStr.split(":").map(Number);
  return w / h;
};

export default function AsciiCamera() {
  // Changed component name to AsciiCamera
  const videoRef = useRef(null);
  const asciiContainerRef = useRef(null); // Ref for the main display area
  const [ascii, setAscii] = useState("");
  const [gridSize, setGridSize] = useState({ width: 80, height: 45 }); // Initial 16:9 roughly
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [useUniform, setUseUniform] = useState(true);
  const [uniformColor, setUniformColor] = useState("#eee");
  const [charColorMap, setCharColorMap] = useState(() => {
    const mapping = {};
    for (const c of asciiChars) {
      mapping[c] = "#eee";
    }
    return mapping;
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true); // New state for desktop sidebar
  const [aspectRatio, setAspectRatio] = useState("16:9"); // State for aspect ratio

  // Use the camera hook
  const {
    videoDevices,
    selectedDeviceId,
    setSelectedDeviceId, // We might need this if other hooks interact
    switchCamera,
    canSwitchCamera,
  } = useCamera();

  // State for camera devices - REMOVED
  // const [videoDevices, setVideoDevices] = useState([]);
  // const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  // const streamRef = useRef(null); // Ref to hold the current stream - MOVED to useAsciiRenderer eventually
  const lastUpdateTimeRef = useRef(0);
  const animationFrameRef = useRef();

  // Precompute Brightness -> Char LUT (Improvement 3)
  const brightnessToCharLut = useMemo(() => {
    const lut = new Uint8Array(256);
    const step = 256 / asciiChars.length;
    for (let i = 0; i < asciiChars.length; i++) {
      const charCode = asciiChars[i].charCodeAt(0);
      const start = Math.floor(i * step);
      const end = Math.floor((i + 1) * step);
      lut.fill(charCode, start, end);
    }
    // Ensure the last value is filled
    lut[255] = asciiChars[asciiChars.length - 1].charCodeAt(0);
    return lut;
  }, []); // No dependencies, compute once

  // Calculate character width and set initial aspect ratio
  const charWidthRef = useRef(FONT_SIZE * 0.6);
  useEffect(() => {
    // Set initial aspect ratio based on window dimensions
    const initialRatio = window.innerWidth / window.innerHeight;
    // Default to 16:9 for landscape-ish, 9:16 for portrait-ish
    setAspectRatio(initialRatio >= 1 ? "16:9" : "9:16");

    // Calculate char width
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${FONT_SIZE}px monospace`;
    const metrics = ctx.measureText("M");
    charWidthRef.current = metrics.width;
    // updateLayout will be called by the main layout effect after state is set
  }, []); // Run once on mount

  // Recalculate grid size and detect mobile layout on resize or ratio change
  const updateLayout = useCallback(() => {
    const container = asciiContainerRef.current;
    const charWidth = charWidthRef.current;
    if (container && charWidth > 0) {
      // Ensure charWidth is calculated
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const charHeight = LINE_HEIGHT;
      const targetRatio = parseRatio(aspectRatio);

      // Calculate available pixel dimensions (consider padding)
      const padding = 32; // 1rem padding on each side
      const availableWidth = Math.max(0, containerWidth - padding);
      const availableHeight = Math.max(0, containerHeight - padding);

      if (availableWidth <= 0 || availableHeight <= 0) {
        setGridSize({ width: 10, height: 10 }); // Minimum size if container is too small
        return;
      }

      // Determine grid size based on container and aspect ratio
      let newWidthPx;
      let newHeightPx;
      // Calculate dimensions if width is the limiter
      const widthLimitedHeight = availableWidth / targetRatio;
      // Calculate dimensions if height is the limiter
      const heightLimitedWidth = availableHeight * targetRatio;

      if (widthLimitedHeight <= availableHeight) {
        // Width is the limiting dimension
        newWidthPx = availableWidth;
        newHeightPx = widthLimitedHeight;
      } else {
        // Height is the limiting dimension
        newHeightPx = availableHeight;
        newWidthPx = heightLimitedWidth;
      }

      // Convert pixel dimensions to character grid dimensions
      const newGridWidth = Math.max(10, Math.floor(newWidthPx / charWidth));
      const newGridHeight = Math.max(10, Math.floor(newHeightPx / charHeight));

      setGridSize({ width: newGridWidth, height: newGridHeight });
    }

    const mobile = window.innerWidth < 768;
    setIsMobileLayout(mobile);
    setIsPhone(/Mobi|Android/i.test(navigator.userAgent));
    if (!mobile) {
      setIsMobileSidebarOpen(false);
    }
    if (mobile && isDesktopSidebarOpen) {
      // Ensure desktop sidebar state matches mobile if needed, or manage separately
      // setIsDesktopSidebarOpen(false); // Example: Hide desktop sidebar on mobile
    }
  }, [aspectRatio, isDesktopSidebarOpen]);

  useEffect(() => {
    // Initial calculation might be slightly off until charWidth is measured
    // updateLayout() called in charWidth useEffect will refine it
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [updateLayout]); // updateLayout includes aspectRatio dependency

  // Effect for camera stream and ASCII processing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const streamObj = null; // Changed to const, though it's immediately overwritten
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let videoWidth = 0;
    let videoHeight = 0;

    const setupStream = async (deviceId) => {
      // Stop previous stream if exists
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      const constraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          // Request resolution closer to grid size (Improvement 1)
          // Use idéal to suggest, browser might override
          width: { ideal: gridSize.width }, // Use ideal, not exact
          height: { ideal: gridSize.height },
        },
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        await video.play();

        // Get actual video dimensions once playing
        videoWidth = video.videoWidth;
        videoHeight = video.videoHeight;

        // Resize canvas to match grid size
        canvas.width = gridSize.width;
        canvas.height = gridSize.height;

        // Start the update loop
        lastUpdateTimeRef.current = 0; // Reset throttle timer
        animationFrameRef.current = requestAnimationFrame(update);
      } catch (err) {
        console.error("Error accessing camera:", err);
        // Handle error appropriately (e.g., show message to user)
      }
    };

    const update = () => {
      const drawWidth = gridSize.width;
      const drawHeight = gridSize.height;

      if (
        video.readyState < video.HAVE_ENOUGH_DATA ||
        video.paused ||
        video.ended ||
        drawWidth <= 0 ||
        drawHeight <= 0 ||
        !videoWidth ||
        !videoHeight
      ) {
        animationFrameRef.current = requestAnimationFrame(update);
        return;
      }

      // Throttle UI updates (Improvement 6)
      const now = performance.now();
      const shouldUpdate =
        now - lastUpdateTimeRef.current > THROTTLE_INTERVAL_MS;

      // Calculate cropping parameters to maintain aspect ratio
      let sx = 0,
        sy = 0,
        sWidth = videoWidth,
        sHeight = videoHeight;
      const videoRatio = videoWidth / videoHeight;
      const canvasRatio = drawWidth / drawHeight;

      if (videoRatio > canvasRatio) {
        sWidth = videoHeight * canvasRatio;
        sx = (videoWidth - sWidth) / 2;
      } else if (videoRatio < canvasRatio) {
        sHeight = videoWidth / canvasRatio;
        sy = (videoHeight - sHeight) / 2;
      }

      // Apply grayscale filter before drawing (Improvement 2)
      ctx.filter = "grayscale(100%)";
      // Draw the cropped video portion onto the entire canvas
      ctx.drawImage(
        video,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        drawWidth,
        drawHeight
      );
      // Reset filter if needed elsewhere, though not necessary here
      // ctx.filter = 'none';

      try {
        const imageData = ctx.getImageData(0, 0, drawWidth, drawHeight);
        const data = imageData.data; // This is Uint8ClampedArray

        // Build ASCII frame in a buffer (Improvements 4 & 5)
        const buffer = new Uint8Array(drawWidth * drawHeight + drawHeight); // width*height chars + height newlines
        let bufferPos = 0;

        for (let y = 0; y < drawHeight; y++) {
          for (let x = 0; x < drawWidth; x++) {
            const dataIndex = (y * drawWidth + x) * 4;
            const brightness = data[dataIndex]; // Read only red channel (grayscale) (Improvement 2)
            buffer[bufferPos++] = brightnessToCharLut[brightness]; // Use LUT (Improvement 3)
          }
          buffer[bufferPos++] = 10; // Add newline character (code 10)
        }

        // Update state only if throttled time has passed
        if (shouldUpdate) {
          // Convert buffer to string efficiently (Improvement 5)
          // Use String.fromCharCode directly for potentially better performance on large arrays
          let asciiStr = "";
          // Process in chunks to avoid "Maximum call stack size exceeded"
          const chunkSize = 8192; // Adjust chunk size as needed
          for (let i = 0; i < buffer.length; i += chunkSize) {
            const chunk = buffer.subarray(i, i + chunkSize);
            asciiStr += String.fromCharCode.apply(null, chunk);
          }
          setAscii(asciiStr);
          lastUpdateTimeRef.current = now;
        }
      } catch (error) {
        console.error("Error processing image data:", error);
        // Consider stopping the loop or showing an error
        if (animationFrameRef.current)
          cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
        return; // Stop update loop on error
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    // Initial stream setup
    if (selectedDeviceId) {
      setupStream(selectedDeviceId);
    }

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (video) {
        video.srcObject = null;
        video.pause();
        // video.load(); // Sometimes needed to fully release resources
      }
    };
    // Re-run effect if gridSize or selectedDeviceId changes
  }, [gridSize, selectedDeviceId, brightnessToCharLut]); // selectedDeviceId now comes from useCamera

  // Moved downloadPhoto definition before takePhoto
  const downloadPhoto = useCallback((canvas) => {
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
      alert("Error generating image for download.");
    }
  }, []); // Empty dependency array makes this function stable

  // Capture current ASCII art as PNG with text rendering
  const takePhoto = useCallback(async () => {
    const PHOTO_FONT_SIZE = 16; // Larger font size for saved image definition
    const PHOTO_LINE_HEIGHT = PHOTO_FONT_SIZE; // Keep line height consistent

    // Use gridSize for slicing
    const rows = ascii.split("\n").slice(0, gridSize.height);
    if (gridSize.width <= 0 || gridSize.height <= 0 || rows.length === 0) {
      console.error(
        "Cannot take photo with invalid grid size or empty ascii data."
      );
      return;
    }

    const tmp = document.createElement("canvas");
    const ctx2 = tmp.getContext("2d");

    // --- Calculate character dimensions for the photo font size ---
    ctx2.font = `${PHOTO_FONT_SIZE}px monospace`;
    const metrics = ctx2.measureText("M"); // Measure a representative character
    const photoCharWidth = metrics.width;
    const photoCharHeight = PHOTO_LINE_HEIGHT;
    // -----------------------------------------------------------

    // Set canvas dimensions based on grid size and new character dimensions
    tmp.width = photoCharWidth * gridSize.width;
    tmp.height = photoCharHeight * gridSize.height;

    // Set background color - always black for the saved image in this version
    ctx2.fillStyle = "#000";
    ctx2.fillRect(0, 0, tmp.width, tmp.height);

    // Set text properties
    ctx2.font = `${PHOTO_FONT_SIZE}px monospace`;
    ctx2.textBaseline = "top"; // Align text rendering precisely

    rows.forEach((row, y) => {
      const characters = [...row.padEnd(gridSize.width, " ")];
      characters.slice(0, gridSize.width).forEach((char, x) => {
        // Use white for uniform, bright fallback ('#fff') for non-uniform in download
        const charColor = useUniform ? "#fff" : charColorMap[char] || "#fff";
        ctx2.fillStyle = charColor;
        ctx2.fillText(char, x * photoCharWidth, y * photoCharHeight);
      });
    });

    if (navigator.share && isMobileLayout) {
      try {
        const blob = await new Promise((resolve) =>
          tmp.toBlob(resolve, "image/png")
        );
        if (!blob) throw new Error("Canvas to Blob conversion failed");
        const file = new File([blob], "ascii-photo.png", { type: "image/png" });
        await navigator.share({
          files: [file],
          title: "ASCII Photo",
          text: "Check out this ASCII art!",
        });
        console.log("Shared successfully");
      } catch (error) {
        console.error("Error sharing photo:", error);
        // Fallback to download if sharing fails (e.g., user cancels)
        downloadPhoto(tmp);
      }
    } else {
      // Fallback to download for desktop or if Share API not supported
      downloadPhoto(tmp);
    }
  }, [
    ascii,
    gridSize,
    useUniform,
    charColorMap,
    isMobileLayout,
    downloadPhoto,
  ]); // Removed downloadPhoto dependency

  // Randomize color(s)
  const randomColor = useCallback(() => {
    const randHex = () =>
      `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`;
    if (useUniform) {
      setUniformColor(randHex());
    } else {
      const mapping = {};
      for (const c of asciiChars) {
        mapping[c] = randHex();
      }
      setCharColorMap(mapping);
    }
  }, [useUniform]);

  // Apply a rainbow mapping per character type (based on index in asciiChars)
  const rainbowColors = useEffect(() => {
    setUseUniform(false);
    const mapping = {};
    for (const c of asciiChars) {
      const hue = Math.floor((asciiChars.indexOf(c) / asciiChars.length) * 360);
      mapping[c] = `hsl(${hue},100%,65%)`; // Increased lightness slightly
    }
    setCharColorMap(mapping);
  }, []);

  // Effect for Orientation Change
  useEffect(() => {
    const handleOrientationChange = () => {
      const type = screen.orientation.type;
      console.log("Orientation changed:", type);
      if (type.includes("landscape")) {
        setAspectRatio("16:9");
      } else if (type.includes("portrait")) {
        setAspectRatio("9:16");
      }
      // Recalculate layout after orientation change
      requestAnimationFrame(updateLayout);
    };

    try {
      // Check initial orientation
      handleOrientationChange();
      screen.orientation.addEventListener("change", handleOrientationChange);
      return () =>
        screen.orientation.removeEventListener(
          "change",
          handleOrientationChange
        );
    } catch (error) {
      console.warn("Screen Orientation API not fully supported:", error);
      // Fallback or alternative logic could go here if needed
    }
  }, [updateLayout]); // updateLayout is a dependency

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
      <MobileHeader
        isMobileLayout={isMobileLayout}
        setIsSidebarOpen={setIsMobileSidebarOpen}
      />

      <CameraSettingsSidebar
        isMobileLayout={isMobileLayout}
        isMobileOpen={isMobileSidebarOpen}
        isDesktopOpen={isDesktopSidebarOpen}
        aspectRatio={aspectRatio}
        useUniform={useUniform}
        setUseUniform={setUseUniform}
        uniformColor={uniformColor}
        setUniformColor={setUniformColor}
        charColorMap={charColorMap}
        setCharColorMap={setCharColorMap}
        asciiChars={asciiChars}
      />

      {/* Mobile Overlay */}
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
            top: "50px", // Adjust if header height changes
            left: "220px",
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
        {/* Desktop Sidebar Toggle */}
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

        <AsciiDisplay
          asciiContainerRef={asciiContainerRef}
          ascii={ascii}
          gridSize={gridSize}
          useUniform={useUniform}
          uniformColor={uniformColor}
          charColorMap={charColorMap}
        />

        {/* Action Buttons (Render correct ones based on layout) */}
        {isMobileLayout ? (
          <MobileActionButtons
            randomColor={randomColor}
            rainbowColors={rainbowColors}
            takePhoto={takePhoto}
            switchCamera={switchCamera}
            canSwitchCamera={canSwitchCamera}
          />
        ) : (
          <DesktopActionButtons
            randomColor={randomColor}
            rainbowColors={rainbowColors}
            takePhoto={takePhoto}
            switchCamera={switchCamera}
            canSwitchCamera={canSwitchCamera}
          />
        )}
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

function MobileHeader({ isMobileLayout, setIsSidebarOpen }) {
  if (!isMobileLayout) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 1rem",
        backgroundColor: "#222", // Keep header distinct
        color: "#fff",
        flexShrink: 0,
        height: "50px", // Fixed height
      }}
    >
      <span>ASCII Cam</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsSidebarOpen((v) => !v)}
        aria-label="Toggle Sidebar"
      >
        <Menu size={24} />
      </Button>
    </div>
  );
}

function CameraSettingsSidebar({
  isMobileLayout,
  isMobileOpen,
  isDesktopOpen,
  aspectRatio,
  useUniform,
  setUseUniform,
  uniformColor,
  setUniformColor,
  charColorMap,
  setCharColorMap,
  asciiChars,
}) {
  const isOpen = isMobileLayout ? isMobileOpen : isDesktopOpen;

  const sidebarStyle = {
    width: isOpen ? "220px" : "0",
    position: isMobileLayout ? "fixed" : "static",
    top: isMobileLayout ? "50px" : "0",
    left: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: "#222",
    color: "#eee",
    padding: isOpen ? "1rem" : "0",
    boxSizing: "border-box",
    overflow: "hidden",
    transition: "width 0.3s ease, padding 0.3s ease",
    flexShrink: 0,
    borderRight: !isMobileLayout && isOpen ? "1px solid #444" : "none",
  };

  return (
    <div style={sidebarStyle}>
      {isOpen && (
        <div className="space-y-6 p-4">
          <h2 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-4">
            Settings
          </h2>
          <div className="space-y-2">
            <h3 className="text-sm font-medium ">Aspect Ratio (Auto)</h3>
            <div className="flex gap-2">
              <Button
                variant={aspectRatio === "16:9" ? "secondary" : "outline"}
                size="sm"
                className={`flex-1 ${
                  aspectRatio === "16:9"
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "border-gray-500"
                } text-gray-100 disabled:opacity-80`}
                disabled
              >
                16:9
              </Button>
              <Button
                variant={aspectRatio === "9:16" ? "secondary" : "outline"}
                size="sm"
                className={`flex-1 ${
                  aspectRatio === "9:16"
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "border-gray-500"
                } text-gray-100 disabled:opacity-80`}
                disabled
              >
                9:16
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium ">Colors</h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="uniform-color"
                checked={useUniform}
                onChange={(e) => setUseUniform(e.target.checked)}
              />
              <label htmlFor="uniform-color" className="text-sm cursor-pointer">
                Uniform Color
              </label>
            </div>

            {useUniform && (
              <div className="flex items-center space-x-2 pl-2">
                <label htmlFor="color-picker-uniform" className="text-sm">
                  Color:
                </label>
                <input
                  id="color-picker-uniform"
                  type="color"
                  value={uniformColor}
                  onChange={(e) => setUniformColor(e.target.value)}
                  className="w-8 h-8 border-none rounded cursor-pointer"
                />
              </div>
            )}
            {!useUniform && (
              <div className="space-y-2 pl-2">
                <h4 className="text-xs font-medium ">Character Colors</h4>
                {asciiChars.map((c) => (
                  <div key={c} className="flex items-center space-x-2">
                    <span className="font-mono w-4 text-center">{c}</span>
                    <input
                      type="color"
                      value={charColorMap[c]}
                      onChange={(e) =>
                        setCharColorMap((prev) => ({
                          ...prev,
                          [c]: e.target.value,
                        }))
                      }
                      className="w-8 h-8 border-none rounded cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AsciiDisplay({
  asciiContainerRef,
  ascii,
  gridSize,
  useUniform,
  uniformColor,
  charColorMap,
}) {
  return (
    <div
      ref={asciiContainerRef}
      style={{
        backgroundColor: "#000",
        flex: 1,
        overflow: "hidden",
        padding: "1rem",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <pre
        style={{
          fontFamily: "monospace",
          fontSize: `${FONT_SIZE}px`,
          lineHeight: `${LINE_HEIGHT}px`,
          margin: 0,
          color: useUniform ? uniformColor : "#eee",
          whiteSpace: "pre",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {ascii
          .split("\n")
          .slice(0, gridSize.height)
          .map((row, y) => (
            // eslint-disable-next-line react/no-array-index-key
            <span key={`row-${y}`} style={{ display: "block" }}>
              {row
                .split("")
                .slice(0, gridSize.width)
                .map((char, x) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <span
                    key={`char-${y}-${x}`}
                    style={{
                      color: useUniform
                        ? uniformColor
                        : charColorMap[char] || "#eee",
                    }}
                  >
                    {char}
                  </span>
                ))}
            </span>
          ))}
      </pre>
    </div>
  );
}

function MobileActionButtons({
  randomColor,
  rainbowColors,
  takePhoto,
  switchCamera,
  canSwitchCamera,
}) {
  if (!isMobileLayout) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "calc(1.5rem + env(safe-area-inset-bottom))",
        right: "1rem",
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {canSwitchCamera && (
        <Button
          onClick={switchCamera}
          size="icon"
          // variant="secondary"
          className="bg-white text-black"
          aria-label="Switch Camera"
        >
          <RefreshCw />
        </Button>
      )}
      <Button
        onClick={randomColor}
        size="icon"
        // variant="secondary"
        className="bg-white text-black"
        aria-label="Random Color"
      >
        <Palette />
      </Button>
      <Button
        onClick={rainbowColors}
        size="icon"
        // variant="secondary"
        className="bg-white text-black"
        aria-label="Rainbow Colors"
      >
        <Wand2 />
      </Button>
      <Button
        onClick={takePhoto}
        size="icon"
        // variant="secondary"
        className="bg-white text-black"
        aria-label="Take Photo"
      >
        <Camera />
      </Button>
    </div>
  );
}

function DesktopActionButtons({
  randomColor,
  rainbowColors,
  takePhoto,
  switchCamera,
  canSwitchCamera,
}) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "1rem",
        right: "1rem",
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {canSwitchCamera && (
        <Button
          onClick={switchCamera}
          size="icon"
          // variant="secondary"
          className="bg-white text-black"
          aria-label="Switch Camera"
        >
          <RefreshCw />
        </Button>
      )}
      <Button
        onClick={randomColor}
        // size="icon"
        // variant="secondary"
        className="bg-white text-black"
        aria-label="Random Color"
      >
        <Palette />
      </Button>
      <Button
        onClick={rainbowColors}
        size="icon"
        // variant="secondary"
        className="bg-white text-black"
        aria-label="Rainbow Colors"
      >
        <Wand2 />
      </Button>
      <Button
        onClick={takePhoto}
        size="icon"
        variant="secondary"
        className="bg-white text-black"
        aria-label="Take Photo"
      >
        <Camera />
      </Button>
    </div>
  );
}
