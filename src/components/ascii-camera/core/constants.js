export const FONT_SIZE = 10;
export const LINE_HEIGHT = 10;
export const PHOTO_FONT_SIZE = 16;
export const PHOTO_LINE_HEIGHT = 16;
export const TARGET_FPS = 30;

export const MIN_COLS = 60;
export const MAX_COLS = 240;
export const DEFAULT_COLS = 120;

export const COLOR_MODES = {
  uniform: "uniform",
  perChar: "perChar",
  video: "video",
};

export const EFFECT_MODES = {
  ascii: "ascii",
  pixel: "pixel",
};

export const MIN_COLOR_LEVELS = 2;
export const MAX_COLOR_LEVELS = 16;
export const DEFAULT_COLOR_LEVELS = 6;

// Per-channel quantization step for the pixel effect. levels = 1 maps
// everything to 0, so clamp to 2 at minimum.
export function quantizeStep(levels) {
  const n = Math.max(2, levels | 0);
  return 255 / (n - 1);
}

export const CHARSETS = {
  classic: ["@", "#", "S", "%", "?", "*", "+", ";", ":", "."],
  blocks: ["█", "▓", "▒", "░", "·", " "],
  binary: ["1", "0", "."],
  minimal: [".", ":", "-", "=", "+", "*", "#", "%", "@"],
};

export const ASPECT_OPTIONS = [
  { key: "auto", label: "Auto" },
  { key: "16:9", label: "16:9" },
  { key: "9:16", label: "9:16" },
  { key: "1:1", label: "1:1" },
];

export function parseRatio(ratioStr) {
  const [w, h] = ratioStr.split(":").map(Number);
  return w / h;
}

// Unique chars, in the order given (dense -> sparse assumed)
export function parseCustomChars(input) {
  const seen = new Set();
  const out = [];
  for (const ch of input) {
    if (!seen.has(ch)) {
      seen.add(ch);
      out.push(ch);
    }
  }
  return out.length ? out : CHARSETS.classic;
}

// Maps raw brightness (0..255) to a ramp index, baking in contrast,
// gamma and invert so the per-pixel loop stays a single lookup.
export function buildLut({ chars, contrast, gamma, invert }) {
  const n = chars.length;
  const lut = new Uint8Array(256);
  const invGamma = 1 / Math.max(0.01, gamma);
  for (let v = 0; v < 256; v++) {
    let t = v / 255;
    t = (t - 0.5) * contrast + 0.5;
    t = Math.min(1, Math.max(0, t));
    t = Math.pow(t, invGamma);
    if (invert) t = 1 - t;
    lut[v] = Math.min(n - 1, Math.floor(t * n));
  }
  return lut;
}
