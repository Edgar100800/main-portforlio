import { useEffect, useRef } from "react";
import { FONT_SIZE, LINE_HEIGHT } from "./constants";
import { drawAsciiFrame } from "./render";

/**
 * Renders ASCII frames onto a canvas. Subscribes to the frame stream so
 * nothing goes through React state at 30fps.
 */
export function AsciiCanvas({
  subscribe,
  onMeasure,
  charW,
  colorMode,
  uniformColor,
  colorByIndex,
  codeFromIndex,
  bg = "#000",
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
      bg,
      charW,
      lineH: LINE_HEIGHT,
    };
  }, [colorMode, uniformColor, colorByIndex, codeFromIndex, bg, charW]);

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
      style={{
        backgroundColor: "#000",
        flex: 1,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="ASCII camera preview"
        style={{ display: "block" }}
      />
    </div>
  );
}
