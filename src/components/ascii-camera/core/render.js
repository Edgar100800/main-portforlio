import { PHOTO_FONT_SIZE, PHOTO_LINE_HEIGHT } from "./constants";
// frame = { cols, rows, indices: Uint8Array(cols*rows), colors: Uint8ClampedArray|null (cols*rows*3) }
// opts = { charW, lineH, codeFromIndex, colorMode, uniformColor, colorByIndex, bg }
// ctx.font must be set by the caller before calling this.
export function drawAsciiFrame(ctx, frame, opts) {
  const { cols, rows, indices, colors } = frame;
  const { charW, lineH, codeFromIndex, colorMode, uniformColor, colorByIndex } =
    opts;

  ctx.fillStyle = opts.bg || "#000";
  ctx.fillRect(0, 0, cols * charW, rows * lineH);
  ctx.textBaseline = "top";

  const glyph = (index) =>
    String.fromCharCode(codeFromIndex[index] ?? 32);

  if (colorMode === "uniform") {
    ctx.fillStyle = uniformColor;
    for (let y = 0; y < rows; y++) {
      const off = y * cols;
      let rowStr = "";
      for (let x = 0; x < cols; x++) rowStr += glyph(indices[off + x]);
      ctx.fillText(rowStr, 0, y * lineH);
    }
    return;
  }

  if (colorMode === "perChar" || !colors) {
    for (let y = 0; y < rows; y++) {
      const off = y * cols;
      let x = 0;
      while (x < cols) {
        const index = indices[off + x];
        let x2 = x;
        while (x2 < cols && indices[off + x2] === index) x2++;
        ctx.fillStyle = colorByIndex[index] || uniformColor;
        let runStr = "";
        for (let i = x; i < x2; i++) runStr += glyph(indices[off + i]);
        ctx.fillText(runStr, x * charW, y * lineH);
        x = x2;
      }
    }
    return;
  }

  // video mode: tint each cell with (quantized) source color, boosted so
  // dark pixels stay visible on the black background
  for (let y = 0; y < rows; y++) {
    const off = y * cols;
    let x = 0;
    while (x < cols) {
      const q = (off + x) * 3;
      const r = colors[q];
      const g = colors[q + 1];
      const b = colors[q + 2];
      let x2 = x;
      while (
        x2 < cols &&
        colors[(off + x2) * 3] === r &&
        colors[(off + x2) * 3 + 1] === g &&
        colors[(off + x2) * 3 + 2] === b
      ) {
        x2++;
      }
      ctx.fillStyle = boostedRgb(r, g, b);
      let runStr = "";
      for (let i = x; i < x2; i++) runStr += glyph(indices[off + i]);
      ctx.fillText(runStr, x * charW, y * lineH);
      x = x2;
    }
  }
}

function boostedRgb(r, g, b) {
  const br = Math.min(255, (r * 0.55 + 115) | 0);
  const bg = Math.min(255, (g * 0.55 + 115) | 0);
  const bb = Math.min(255, (b * 0.55 + 115) | 0);
  return `rgb(${br},${bg},${bb})`;
}

// opts = { cellW, cellH, colors (quantized by the stream), bg }
// colors come pre-quantized from the stream loop, so this only merges
// equal-color runs into single fillRect calls.
export function drawPixelFrame(ctx, frame, opts) {
  const { cols, rows, colors } = frame;
  const { cellW, cellH } = opts;

  ctx.fillStyle = opts.bg || "#000";
  ctx.fillRect(0, 0, cols * cellW, rows * cellH);
  if (!colors) return;

  for (let y = 0; y < rows; y++) {
    const off = y * cols;
    let x = 0;
    while (x < cols) {
      const q = (off + x) * 3;
      const r = colors[q];
      const g = colors[q + 1];
      const b = colors[q + 2];
      let x2 = x;
      while (
        x2 < cols &&
        colors[(off + x2) * 3] === r &&
        colors[(off + x2) * 3 + 1] === g &&
        colors[(off + x2) * 3 + 2] === b
      ) {
        x2++;
      }
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x * cellW, y * cellH, (x2 - x) * cellW, cellH);
      x = x2;
    }
  }
}

// Renders the latest frame into an offscreen canvas at photo resolution.
export function frameToPhotoCanvas(frame, opts) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (opts.effect === "pixel") {
    const cellW = PHOTO_FONT_SIZE;
    const cellH = PHOTO_LINE_HEIGHT;
    canvas.width = Math.max(1, cellW * frame.cols);
    canvas.height = Math.max(1, cellH * frame.rows);
    drawPixelFrame(ctx, frame, { ...opts, cellW, cellH });
    return canvas;
  }

  ctx.font = `${PHOTO_FONT_SIZE}px monospace`;
  const charW = ctx.measureText("M").width || PHOTO_FONT_SIZE * 0.6;
  const lineH = PHOTO_LINE_HEIGHT;

  canvas.width = Math.max(1, Math.ceil(charW * frame.cols));
  canvas.height = Math.max(1, lineH * frame.rows);
  ctx.font = `${PHOTO_FONT_SIZE}px monospace`;

  drawAsciiFrame(ctx, frame, { ...opts, charW, lineH });
  return canvas;
}
