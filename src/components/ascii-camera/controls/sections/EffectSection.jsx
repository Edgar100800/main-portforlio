import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import {
  EFFECT_MODES,
  MAX_COLOR_LEVELS,
  MIN_COLOR_LEVELS,
} from "../../core/constants";
import { SectionTitle } from "../SectionTitle";

const EFFECTS = [
  { value: EFFECT_MODES.ascii, key: "ascii" },
  { value: EFFECT_MODES.pixel, key: "pixel" },
];

/**
 * Output effect: ASCII glyph ramp or pixel mosaic. The color-levels
 * slider only applies to pixel mode.
 */
export function EffectSection({ settings, update }) {
  const { t } = useTranslation();
  const isPixel = settings.effect === EFFECT_MODES.pixel;

  return (
    <section className="space-y-3">
      <SectionTitle>{t("camera.controls.effect")}</SectionTitle>

      <RadioGroup
        value={settings.effect}
        onValueChange={(effect) => update({ effect })}
        className="gap-2.5"
        aria-label={t("camera.controls.effect")}
      >
        {EFFECTS.map((fx) => (
          <div key={fx.value} className="flex items-center gap-2.5">
            <RadioGroupItem value={fx.value} id={`vhs-effect-${fx.key}`} />
            <Label
              htmlFor={`vhs-effect-${fx.key}`}
              className="font-mono text-xs font-normal text-[var(--vhs-fg)]"
            >
              {t(`camera.controls.effectOptions.${fx.key}`)}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {isPixel && (
        <div className="space-y-1.5 pl-1">
          <Label
            htmlFor="vhs-color-levels"
            className="flex justify-between font-mono text-[0.6875rem] text-[var(--vhs-fg-dim)]"
          >
            <span>{t("camera.controls.colorLevels")}</span>
            <span className="text-[var(--vhs-phosphor)]">
              {settings.colorLevels}
            </span>
          </Label>
          <Slider
            id="vhs-color-levels"
            min={MIN_COLOR_LEVELS}
            max={MAX_COLOR_LEVELS}
            step={1}
            value={[settings.colorLevels]}
            onValueChange={(v) => update({ colorLevels: v[0] })}
          />
        </div>
      )}
    </section>
  );
}
