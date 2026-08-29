import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ASPECT_OPTIONS } from "../../core/constants";
import { SectionTitle } from "../SectionTitle";

function SliderField({ id, label, min, max, step, value, format, onChange }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="flex justify-between font-mono text-[0.6875rem] text-[var(--vhs-fg-dim)]">
        <span>{label}</span>
        <span className="text-[var(--vhs-phosphor)]">{format(value)}</span>
      </Label>
      <Slider id={id} min={min} max={max} step={step} value={[value]} onValueChange={(v) => onChange(v[0])} />
    </div>
  );
}

function SwitchField({ id, label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id} className="font-mono text-xs text-[var(--vhs-fg-dim)]">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function DisplaySection({ settings, update, setMirror }) {
  const { t } = useTranslation();

  return (
    <section className="space-y-4">
      <SectionTitle>{t("camera.controls.display")}</SectionTitle>

      <div className="space-y-2">
        <Label className="font-mono text-[0.6875rem] text-[var(--vhs-fg-dim)]">
          {t("camera.controls.aspect")}
        </Label>
        <div className="grid grid-cols-4 gap-1.5">
          {ASPECT_OPTIONS.map((opt) => {
            const active = settings.aspectMode === opt.key;
            return (
              <Button
                key={opt.key}
                size="sm"
                variant="outline"
                onClick={() => update({ aspectMode: opt.key })}
                aria-pressed={active}
                className={`h-8 px-1 font-mono text-[0.625rem] ${
                  active
                    ? "border-[var(--vhs-phosphor)] bg-[var(--vhs-phosphor)]/10 text-[var(--vhs-phosphor)] shadow-[0_0_10px_rgb(134_255_185/0.25)]"
                    : "border-[var(--vhs-border)] bg-[var(--vhs-bg-elev)] text-[var(--vhs-fg-dim)] hover:border-[var(--vhs-border-strong)] hover:text-[var(--vhs-fg)]"
                }`}
              >
                {t(`camera.controls.aspectOptions.${opt.key}`)}
              </Button>
            );
          })}
        </div>
      </div>

      <SliderField
        id="vhs-cols"
        label={t("camera.controls.resolution")}
        min={60}
        max={240}
        step={4}
        value={settings.cols}
        format={(v) => `${v}col`}
        onChange={(cols) => update({ cols })}
      />

      <SliderField
        id="vhs-contrast"
        label={t("camera.controls.contrast")}
        min={0.5}
        max={2}
        step={0.05}
        value={settings.contrast}
        format={(v) => v.toFixed(2)}
        onChange={(contrast) => update({ contrast })}
      />

      <SliderField
        id="vhs-gamma"
        label={t("camera.controls.gamma")}
        min={0.5}
        max={2}
        step={0.05}
        value={settings.gamma}
        format={(v) => v.toFixed(2)}
        onChange={(gamma) => update({ gamma })}
      />

      <div className="space-y-2.5">
        <SwitchField
          id="vhs-invert"
          label={t("camera.controls.invert")}
          checked={settings.invert}
          onChange={(invert) => update({ invert })}
        />
        <SwitchField
          id="vhs-mirror"
          label={t("camera.controls.mirror")}
          checked={settings.mirror}
          onChange={setMirror}
        />
      </div>

      <Separator className="bg-[var(--vhs-border)]" />
    </section>
  );
}
