import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BatteryFull } from "lucide-react";

function useTimestamp(locale) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function formatDate(date, locale) {
  try {
    return date
      .toLocaleDateString(locale, { month: "short", day: "2-digit", year: "numeric" })
      .toUpperCase();
  } catch {
    return "";
  }
}

function formatTime(date, locale) {
  try {
    return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return date.toTimeString().slice(0, 8);
  }
}

/**
 * VHS camcorder HUD: REC/STANDBY indicator, timestamp, resolution,
 * battery. Presentational only — one state (clock tick per second).
 */
export function HudOverlay({ status, grid, locale }) {
  const { t } = useTranslation();
  const now = useTimestamp(locale);
  const isRec = status === "ready";

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[7] select-none">
      {/* top row */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
        {isRec ? (
          <span className="vhs-hud-text vhs-hud-text--accent flex items-center gap-2 text-xs">
            <span className="vhs-rec-dot" />
            {t("camera.hud.rec")}
          </span>
        ) : (
          <span className="vhs-hud-text text-xs opacity-70">{t("camera.hud.standby")}</span>
        )}
        <span className="vhs-hud-text hidden text-[0.625rem] opacity-80 sm:inline">
          {formatDate(now, locale)} · {formatTime(now, locale)}
        </span>
      </div>

      {/* bottom row */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
        {grid.cols > 0 && (
          <span className="vhs-hud-text text-[0.625rem] opacity-80">
            {t("camera.hud.resolution", { cols: grid.cols, rows: grid.rows })}
          </span>
        )}
        <span className="vhs-hud-text flex items-center gap-1 text-[0.625rem] opacity-80">
          {t("camera.hud.battery")}
          <BatteryFull size={14} className="text-[var(--vhs-phosphor)]" aria-hidden="true" />
        </span>
      </div>

      {/* corner brackets */}
      <span className="vhs-corner vhs-corner--tl" />
      <span className="vhs-corner vhs-corner--tr" />
      <span className="vhs-corner vhs-corner--bl" />
      <span className="vhs-corner vhs-corner--br" />
    </div>
  );
}
