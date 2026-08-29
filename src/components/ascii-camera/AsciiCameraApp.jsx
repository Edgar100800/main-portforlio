import { useState } from "react";
import { useTranslation } from "react-i18next";
import I18nProvider from "@/components/I18nProvider";
import { useAsciiCamera } from "./hooks/useAsciiCamera";
import { CameraViewfinder } from "./viewfinder/CameraViewfinder";
import { ActionBar } from "./viewfinder/ActionBar";
import { ControlPanel, PanelToggleButton } from "./controls/ControlPanel";
import "./retro.css";

/**
 * Thin orchestrator. All state/logic lives in useAsciiCamera; all
 * chrome lives in viewfinder/ and controls/.
 */
function AsciiCamera() {
  const { t, i18n } = useTranslation();
  const cam = useAsciiCamera();

  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);
  const [desktopPanelOpen, setDesktopPanelOpen] = useState(true);

  return (
    <div className="vhs-root">
      <ControlPanel
        isMobileLayout={cam.isMobileLayout}
        mobileOpen={mobileControlsOpen}
        onMobileOpenChange={setMobileControlsOpen}
        desktopOpen={desktopPanelOpen}
        onDesktopOpenChange={setDesktopPanelOpen}
        settings={cam.settings}
        update={cam.update}
        setMirror={cam.setMirror}
        videoDevices={cam.videoDevices}
        selectedDeviceId={cam.selectedDeviceId}
        selectDevice={cam.selectDevice}
        chars={cam.chars}
      />

      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        {!cam.isMobileLayout && (
          <PanelToggleButton open={desktopPanelOpen} onToggle={() => setDesktopPanelOpen((v) => !v)} />
        )}

        <CameraViewfinder
          subscribe={cam.subscribeFrame}
          onMeasure={cam.handleMeasure}
          charW={cam.charW}
          colorMode={cam.settings.colorMode}
          uniformColor={cam.settings.uniformColor}
          colorByIndex={cam.colorByIndex}
          codeFromIndex={cam.codeFromIndex}
          effect={cam.settings.effect}
          status={cam.status}
          onRetry={cam.retry}
          grid={cam.grid}
          locale={i18n.language}
        />

        {cam.isMobileLayout && (
          <ActionBar
            variant="mobile"
            takePhoto={cam.takePhoto}
            switchCamera={cam.switchCamera}
            canSwitchCamera={cam.canSwitchCamera}
            randomColor={cam.randomColor}
            rainbowColors={cam.rainbowColors}
            onOpenControls={() => setMobileControlsOpen(true)}
          />
        )}
      </main>

      {!cam.isMobileLayout && (
        <ActionBar
          variant="desktop"
          takePhoto={cam.takePhoto}
          switchCamera={cam.switchCamera}
          canSwitchCamera={cam.canSwitchCamera}
          randomColor={cam.randomColor}
          rainbowColors={cam.rainbowColors}
        />
      )}

      <video ref={cam.videoRef} className="hidden" playsInline muted autoPlay />
      <h1 className="sr-only">{t("camera.title")}</h1>
    </div>
  );
}

export default function AsciiCameraApp() {
  return (
    <I18nProvider>
      <AsciiCamera />
    </I18nProvider>
  );
}
