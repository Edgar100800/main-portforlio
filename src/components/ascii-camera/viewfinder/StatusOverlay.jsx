import { useTranslation } from "react-i18next";
import { AlertTriangle, CameraOff, Loader2, RefreshCw, ShieldAlert, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_META = {
  starting: { icon: Loader2, key: "starting", spin: true },
  denied: { icon: ShieldAlert, key: "denied", retry: true },
  notFound: { icon: CameraOff, key: "notFound", retry: true },
  busy: { icon: VideoOff, key: "busy", retry: true },
  unsupported: { icon: AlertTriangle, key: "unsupported", retry: false },
  error: { icon: AlertTriangle, key: "error", retry: true },
};

/**
 * Maps stream status to a centered retro message. Covers the six
 * non-ready states; hidden when status === "ready".
 */
export function StatusOverlay({ status, onRetry }) {
  const { t } = useTranslation();
  const meta = STATUS_META[status];
  if (!meta) return null;

  const Icon = meta.icon;

  return (
    <div
      className="absolute inset-0 z-[8] flex flex-col items-center justify-center gap-4 bg-black/80 p-6 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--vhs-border-strong)] bg-[var(--vhs-bg-elev)]">
        <Icon
          size={28}
          aria-hidden="true"
          className={`text-[var(--vhs-phosphor)] ${meta.spin ? "animate-spin" : ""}`}
        />
      </div>

      <div className="space-y-1.5">
        <p className="vhs-hud-text text-sm">{t(`camera.status.${meta.key}`)}</p>
        <p className="mx-auto max-w-sm text-xs leading-relaxed text-[var(--vhs-fg-dim)]">
          {t(`camera.status.${meta.key}Body`)}
        </p>
      </div>

      {meta.retry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="border-[var(--vhs-border-strong)] bg-transparent font-mono text-[var(--vhs-fg)] hover:bg-[var(--vhs-bg-elev)] hover:text-[var(--vhs-phosphor)]"
        >
          <RefreshCw aria-hidden="true" />
          {t("camera.status.retry")}
        </Button>
      )}
    </div>
  );
}
