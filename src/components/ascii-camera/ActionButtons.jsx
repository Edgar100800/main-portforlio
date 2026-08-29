import { Button } from "@/components/ui/button";
import { Camera, Palette, RefreshCw, Wand2 } from "lucide-react";

const BTN = "bg-white text-black";

/**
 * isMobileLayout is passed as a real prop (the previous version referenced
 * an undefined variable here, crashing on mobile).
 */
export function ActionButtons({
  isMobileLayout,
  randomColor,
  rainbowColors,
  takePhoto,
  switchCamera,
  canSwitchCamera,
}) {
  if (isMobileLayout) {
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
          <Button onClick={switchCamera} size="icon" className={BTN} aria-label="Switch Camera">
            <RefreshCw />
          </Button>
        )}
        <Button onClick={randomColor} size="icon" className={BTN} aria-label="Random Color">
          <Palette />
        </Button>
        <Button onClick={rainbowColors} size="icon" className={BTN} aria-label="Rainbow Colors">
          <Wand2 />
        </Button>
        <Button onClick={takePhoto} size="icon" className={BTN} aria-label="Take Photo">
          <Camera />
        </Button>
      </div>
    );
  }

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
        <Button onClick={switchCamera} size="icon" className={BTN} aria-label="Switch Camera">
          <RefreshCw />
        </Button>
      )}
      <Button onClick={randomColor} className={BTN} aria-label="Random Color">
        <Palette />
      </Button>
      <Button onClick={rainbowColors} size="icon" className={BTN} aria-label="Rainbow Colors">
        <Wand2 />
      </Button>
      <Button onClick={takePhoto} variant="secondary" className={BTN} aria-label="Take Photo">
        <Camera />
      </Button>
    </div>
  );
}
