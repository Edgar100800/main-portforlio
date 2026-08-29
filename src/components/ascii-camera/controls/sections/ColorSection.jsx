import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { COLOR_MODES } from "../../core/constants";
import { SectionTitle } from "../SectionTitle";

const MODES = [
  { value: COLOR_MODES.uniform, key: "uniform" },
  { value: COLOR_MODES.perChar, key: "perChar" },
  { value: COLOR_MODES.video, key: "video" },
];

function ColorSwatch({ id, value, onChange, label }) {
  return (
    <input
      id={id}
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="size-8 cursor-pointer appearance-none rounded border border-[var(--vhs-border-strong)] bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-none"
    />
  );
}

export function ColorSection({ settings, update, chars }) {
  const { t } = useTranslation();

  return (
    <section className="space-y-3">
      <SectionTitle>{t("camera.controls.colors")}</SectionTitle>

      <RadioGroup
        value={settings.colorMode}
        onValueChange={(colorMode) => update({ colorMode })}
        className="gap-2.5"
        aria-label={t("camera.controls.colors")}
      >
        {MODES.map((mode) => (
          <div key={mode.value} className="flex items-center gap-2.5">
            <RadioGroupItem value={mode.value} id={`vhs-mode-${mode.key}`} />
            <Label
              htmlFor={`vhs-mode-${mode.key}`}
              className="font-mono text-xs font-normal text-[var(--vhs-fg)]"
            >
              {t(`camera.controls.colorMode.${mode.key}`)}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {settings.colorMode === "uniform" && (
        <div className="flex items-center gap-2.5 pl-1">
          <Label htmlFor="vhs-uniform-color" className="font-mono text-xs text-[var(--vhs-fg-dim)]">
            {t("camera.controls.uniformColor")}
          </Label>
          <ColorSwatch
            id="vhs-uniform-color"
            value={settings.uniformColor}
            onChange={(uniformColor) => update({ uniformColor })}
            label={t("camera.controls.uniformColor")}
          />
        </div>
      )}

      {settings.colorMode === "perChar" && (
        <div className="space-y-2 pl-1">
          <p className="font-mono text-[0.6875rem] text-[var(--vhs-fg-dim)]">
            {t("camera.controls.charColors")}
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {chars.map((c) => (
              <div key={c} className="flex items-center gap-2">
                <span className="w-4 text-center font-mono text-sm text-[var(--vhs-phosphor)]">
                  {c}
                </span>
                <ColorSwatch
                  id={`vhs-char-${c.charCodeAt(0)}`}
                  value={settings.charColorMap[c] || "#8affc1"}
                  onChange={(color) =>
                    update({
                      charColorMap: { ...settings.charColorMap, [c]: color },
                    })
                  }
                  label={`${t("camera.controls.charColors")}: ${c}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
