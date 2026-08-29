import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CHARSETS } from "../../core/constants";
import { SectionTitle } from "../SectionTitle";

export function CharsetSection({ settings, update }) {
  const { t } = useTranslation();

  return (
    <section className="space-y-2.5">
      <SectionTitle>{t("camera.controls.charset")}</SectionTitle>

      <Select value={settings.charsetKey} onValueChange={(charsetKey) => update({ charsetKey })}>
        <SelectTrigger className="w-full font-mono" aria-label={t("camera.controls.charset")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="border-[var(--vhs-border-strong)] bg-[var(--vhs-bg-elev)] font-mono">
          {Object.keys(CHARSETS).map((key) => (
            <SelectItem key={key} value={key}>
              {key}
            </SelectItem>
          ))}
          <SelectItem value="custom">{t("camera.controls.custom")}</SelectItem>
        </SelectContent>
      </Select>

      {settings.charsetKey === "custom" && (
        <div className="space-y-1.5">
          <Label htmlFor="vhs-custom-chars" className="font-mono text-[0.6875rem] text-[var(--vhs-fg-dim)]">
            {t("camera.controls.customChars")}
          </Label>
          <Input
            id="vhs-custom-chars"
            type="text"
            value={settings.customChars}
            onChange={(e) => update({ customChars: e.target.value })}
            placeholder="@#S%?*+;:."
            className="font-mono"
            maxLength={32}
          />
          <p className="text-[0.625rem] leading-relaxed text-[var(--vhs-fg-dim)]">
            {t("camera.controls.customHint")}
          </p>
        </div>
      )}
    </section>
  );
}
