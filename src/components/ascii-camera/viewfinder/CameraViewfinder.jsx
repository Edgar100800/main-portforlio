import { useEffect, useRef } from "react";
import { FONT_SIZE, LINE_HEIGHT } from "../core/constants";
import { drawAsciiFrame } from "../core/render";
import { HudOverlay } from "./HudOverlay";
import { RetroEffects } from "./RetroEffects";
import { StatusOverlay } from "./StatusOverlay";

/**
 * Renders ASCII frames onto a canvas and layers the VHS chrome:
 * HUD overlay, scanlines/vignette/grain, status overlay.
 * Subscribes to the frame stream so nothing goes through React
 * state at 30fps.
 */
export function CameraViewfinder({
  subscribe,
  onMeasure,
  charW,
  colorMode,
  uniformColor,
  colorByIndex,
  codeFromIndex,
  status,
  onRetry,
  grid,
  locale,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const drawOptsRef = useRef(null);

  useEffect(() => {
    drawOptsRef.current = {
      colorMode,
      uniformColor,
      colorByIndex,
      codeFromIndex,
      bg: "#000",
      charW,
      lineH: LINE_HEIGHT,
    };
  }, [colorMode, uniformColor, colorByIndex, codeFromIndex, charW]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      onMeasure(Math.floor(rect.width), Math.floor(rect.height));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [onMeasure]);

  useEffect(() => {
    if (!subscribe) return undefined;
    const draw = (frame) => {
      const canvas = canvasRef.current;
      const opts = drawOptsRef.current;
      if (!canvas || !opts) return;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const widthPx = frame.cols * opts.charW;
      const heightPx = frame.rows * opts.lineH;
      const backingW = Math.round(widthPx * dpr);
      const backingH = Math.round(heightPx * dpr);

      if (canvas.width !== backingW || canvas.height !== backingH) {
        canvas.width = backingW;
        canvas.height = backingH;
        canvas.style.width = `${widthPx}px`;
        canvas.style.height = `${heightPx}px`;
      }

      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT_SIZE}px monospace`;
      drawAsciiFrame(ctx, frame, opts);
    };
    return subscribe(draw);
  }, [subscribe]);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden bg-black"
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="ASCII camera preview"
        className="block"
      />

      <RetroEffects />
      <HudOverlay status={status} grid={grid} locale={locale} />

      {status !== "ready" && <StatusOverlay status={status} onRetry={onRetry} />}
    </div>
  );
}
