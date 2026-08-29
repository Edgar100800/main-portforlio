import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionTitle } from "../SectionTitle";

export function CameraSection({ videoDevices, selectedDeviceId, selectDevice }) {
  const { t } = useTranslation();

  return (
    <section className="space-y-2.5">
      <SectionTitle>{t("camera.controls.camera")}</SectionTitle>
      <Select value={selectedDeviceId ?? ""} onValueChange={selectDevice}>
        <SelectTrigger className="w-full" aria-label={t("camera.controls.camera")}>
          <SelectValue placeholder={t("camera.controls.defaultCamera")} />
        </SelectTrigger>
        <SelectContent className="border-[var(--vhs-border-strong)] bg-[var(--vhs-bg-elev)]">
          {videoDevices.map((device, i) => (
            <SelectItem key={device.deviceId || i} value={device.deviceId}>
              {device.label || t("camera.controls.cameraLabel", { index: i + 1 })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </section>
  );
}
