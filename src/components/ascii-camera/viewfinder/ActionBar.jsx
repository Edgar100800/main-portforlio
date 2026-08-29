import { useTranslation } from "react-i18next";
import { Camera, Palette, RefreshCw, SlidersHorizontal, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function RetroIconButton({ label, onClick, children }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          onClick={onClick}
          aria-label={label}
          className="h-10 w-10 border-[var(--vhs-border-strong)] bg-[var(--vhs-bg-elev)]/80 text-[var(--vhs-fg)] backdrop-blur-sm hover:border-[var(--vhs-phosphor)] hover:bg-[var(--vhs-bg-elev)] hover:text-[var(--vhs-phosphor)]"
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        className="border-[var(--vhs-border-strong)] bg-[var(--vhs-bg-elev)] font-mono text-[var(--vhs-fg)]"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * Photo / device-switch / color actions.
 * variant "desktop": floating dock, bottom-right of the viewfinder.
 * variant "mobile": in-flow bottom bar (always visible, safe-area aware).
 */
export function ActionBar({
  variant,
  takePhoto,
  switchCamera,
  canSwitchCamera,
  randomColor,
  rainbowColors,
  onOpenControls,
}) {
  const { t } = useTranslation();
  const labels = {
    photo: t("camera.actions.photo"),
    switchCamera: t("camera.actions.switchCamera"),
    randomColor: t("camera.actions.randomColor"),
    rainbowColors: t("camera.actions.rainbowColors"),
    openControls: t("camera.actions.openControls"),
  };

  if (variant === "mobile") {
    return (
      <TooltipProvider delayDuration={250}>
        <div
          className="flex shrink-0 items-center justify-center gap-2.5 border-t border-[var(--vhs-border)] bg-[var(--vhs-panel)] px-3"
          style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))", paddingTop: "0.625rem" }}
        >
          <Button
            size="icon"
            onClick={onOpenControls}
            aria-label={labels.openControls}
            className="h-10 w-10 border-[var(--vhs-border-strong)] bg-transparent font-mono text-[var(--vhs-fg)] hover:border-[var(--vhs-phosphor)] hover:text-[var(--vhs-phosphor)]"
            variant="outline"
          >
            <SlidersHorizontal />
          </Button>
          {canSwitchCamera && (
            <RetroIconButton label={labels.switchCamera} onClick={switchCamera}>
              <RefreshCw />
            </RetroIconButton>
          )}
          <RetroIconButton label={labels.randomColor} onClick={randomColor}>
            <Palette />
          </RetroIconButton>
          <RetroIconButton label={labels.rainbowColors} onClick={rainbowColors}>
            <Wand2 />
          </RetroIconButton>
          <Button
            size="icon"
            onClick={takePhoto}
            aria-label={labels.photo}
            className="h-12 w-12 border-[var(--vhs-accent)] bg-[var(--vhs-accent)]/15 text-[var(--vhs-accent)] shadow-[0_0_16px_rgb(255_75_62/0.35)] hover:bg-[var(--vhs-accent)]/25 hover:text-[var(--vhs-accent)]"
            variant="outline"
          >
            <Camera />
          </Button>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={250}>
      <div className="absolute bottom-4 right-4 z-[9] flex flex-col gap-2">
        {canSwitchCamera && (
          <RetroIconButton label={labels.switchCamera} onClick={switchCamera}>
            <RefreshCw />
          </RetroIconButton>
        )}
        <RetroIconButton label={labels.randomColor} onClick={randomColor}>
          <Palette />
        </RetroIconButton>
        <RetroIconButton label={labels.rainbowColors} onClick={rainbowColors}>
          <Wand2 />
        </RetroIconButton>
        <RetroIconButton label={labels.photo} onClick={takePhoto}>
          <Camera />
        </RetroIconButton>
      </div>
    </TooltipProvider>
  );
}
