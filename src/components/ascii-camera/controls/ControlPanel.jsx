import { useTranslation } from "react-i18next";
import { PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CameraSection } from "./sections/CameraSection";
import { DisplaySection } from "./sections/DisplaySection";
import { CharsetSection } from "./sections/CharsetSection";
import { ColorSection } from "./sections/ColorSection";

function PanelBody({ settings, update, setMirror, videoDevices, selectedDeviceId, selectDevice, chars }) {
  return (
    <div className="vhs-panel-scroll flex h-full min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4">
      <DisplaySection settings={settings} update={update} setMirror={setMirror} />
      <CharsetSection settings={settings} update={update} />
      <ColorSection settings={settings} update={update} chars={chars} />
      <CameraSection
        videoDevices={videoDevices}
        selectedDeviceId={selectedDeviceId}
        selectDevice={selectDevice}
      />
    </div>
  );
}

/**
 * Settings shell. Desktop: collapsible aside (in flow, so the viewfinder
 * always fits the remaining space). Mobile: shadcn Sheet.
 */
export function ControlPanel({
  isMobileLayout,
  mobileOpen,
  onMobileOpenChange,
  desktopOpen,
  onDesktopOpenChange,
  ...data
}) {
  const { t } = useTranslation();

  if (isMobileLayout) {
    return (
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent
          side="left"
          className="vhs-panel w-[270px] border-[var(--vhs-border)] p-0 sm:w-[270px]"
        >
          <SheetHeader className="border-b border-[var(--vhs-border)] p-4">
            <SheetTitle className="vhs-hud-text text-sm">{t("camera.controls.settings")}</SheetTitle>
            <SheetDescription className="sr-only">{t("camera.controls.settings")}</SheetDescription>
          </SheetHeader>
          <PanelBody {...data} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={`vhs-panel relative flex h-full shrink-0 flex-col border-r transition-[width] duration-300 ease-in-out ${
        desktopOpen ? "w-[288px]" : "w-0 overflow-hidden border-r-0"
      }`}
    >
      <div className="flex w-[288px] flex-col h-full">
        <header className="flex items-center justify-between border-b border-[var(--vhs-border)] p-4">
          <h2 className="vhs-hud-text text-sm">{t("camera.controls.settings")}</h2>
        </header>
        <div className="min-h-0 flex-1">
          <PanelBody {...data} />
        </div>
      </div>
    </aside>
  );
}

export function PanelToggleButton({ open, onToggle }) {
  const { t } = useTranslation();
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={onToggle}
      aria-label={t(open ? "camera.actions.hidePanel" : "camera.actions.togglePanel")}
      className="absolute left-2 top-2 z-10 size-8 text-[var(--vhs-fg-dim)] hover:text-[var(--vhs-phosphor)]"
    >
      <PanelLeftOpen />
    </Button>
  );
}
