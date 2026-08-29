import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useAsciiStream } from "@/hooks/useAsciiStream";
import {
  CHARSETS,
  DEFAULT_COLS,
  DEFAULT_COLOR_LEVELS,
  FONT_SIZE,
  LINE_HEIGHT,
  parseCustomChars,
  parseRatio,
  buildLut,
  quantizeStep,
} from "../core/constants";
import { frameToPhotoCanvas } from "../core/render";

const DEFAULT_CHARS = CHARSETS.classic;
const DEFAULT_COLOR = "#8affc1";
const MOBILE_QUERY = "(max-width: 767px)";

function defaultColorMap() {
  const map = {};
  for (const c of DEFAULT_CHARS) map[c] = DEFAULT_COLOR;
  return map;
}

const INITIAL_SETTINGS = {
  effect: "ascii",
  colorLevels: DEFAULT_COLOR_LEVELS,
  aspectMode: "auto",
  cols: DEFAULT_COLS,
  contrast: 1,
  gamma: 1,
  invert: false,
  mirror: false,
  charsetKey: "classic",
  customChars: "",
  colorMode: "uniform",
  uniformColor: DEFAULT_COLOR,
  charColorMap: defaultColorMap(),
};

/**
 * Owns all ASCII-camera state and logic. Returns a render-free API for
 * the UI components. The 30fps frame flow stays out of React state via
 * frameRef + subscribeFrame.
 */
export function useAsciiCamera() {
  const videoRef = useRef(null);
  const frameRef = useRef(null);
  const frameListenersRef = useRef(new Set());
  const gridSizeRef = useRef({ cols: 0, rows: 0 });
  const settingsRef = useRef(null);
  const userTouchedMirrorRef = useRef(false);

  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const update = useCallback(
    (patch) => setSettings((s) => ({ ...s, ...patch })),
    []
  );

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [charW, setCharW] = useState(FONT_SIZE * 0.6);
  const [ratio, setRatio] = useState(16 / 9);
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });
  const [status, setStatus] = useState("starting");
  const [retryToken, setRetryToken] = useState(0);
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  const {
    videoDevices,
    selectedDeviceId,
    selectDevice,
    switchCamera,
    canSwitchCamera,
    refreshAfterPermission,
  } = useCamera();

  // ---- Derived charset / LUT / colors ----
  const chars = useMemo(
    () =>
      settings.charsetKey === "custom"
        ? parseCustomChars(settings.customChars)
        : CHARSETS[settings.charsetKey] || CHARSETS.classic,
    [settings.charsetKey, settings.customChars]
  );

  const lut = useMemo(
    () =>
      buildLut({
        chars,
        contrast: settings.contrast,
        gamma: settings.gamma,
        invert: settings.invert,
      }),
    [chars, settings.contrast, settings.gamma, settings.invert]
  );

  const codeFromIndex = useMemo(() => chars.map((c) => c.charCodeAt(0)), [chars]);

  const colorByIndex = useMemo(
    () => chars.map((c) => settings.charColorMap[c] || DEFAULT_COLOR),
    [chars, settings.charColorMap]
  );

  // Live settings snapshot for the render loop (no re-renders per frame)
  useEffect(() => {
    settingsRef.current = {
      lut,
      colorMode: settings.colorMode,
      uniformColor: settings.uniformColor,
      colorByIndex,
      codeFromIndex,
      mirror: settings.mirror,
      effect: settings.effect,
      quantStep: quantizeStep(settings.colorLevels),
    };
  }, [lut, settings.colorMode, settings.uniformColor, colorByIndex, codeFromIndex, settings.mirror, settings.effect, settings.colorLevels]);

  // ---- Character width measurement ----
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${FONT_SIZE}px monospace`;
    setCharW(ctx.measureText("M").width || FONT_SIZE * 0.6);
  }, []);

  // ---- Aspect ratio ----
  useEffect(() => {
    if (settings.aspectMode !== "auto") {
      setRatio(parseRatio(settings.aspectMode));
      return undefined;
    }
    const resolve = () => {
      const r = window.innerWidth / Math.max(1, window.innerHeight);
      setRatio(Math.min(2, Math.max(0.5, r)));
    };
    resolve();
    window.addEventListener("resize", resolve);
    return () => window.removeEventListener("resize", resolve);
  }, [settings.aspectMode]);

  // ---- Breakpoint (mobile layout) ----
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return undefined;
    const mql = window.matchMedia(MOBILE_QUERY);
    const apply = () => setIsMobileLayout(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  // ---- Grid sizing (fits the canvas into the container, no overflow) ----
  useEffect(() => {
    if (!containerSize.width || !containerSize.height || !charW) return;
    const margin = 16;
    const availW = Math.max(0, containerSize.width - margin);
    const availH = Math.max(0, containerSize.height - margin);
    if (!availW || !availH) return;

    const cellAspect = charW / LINE_HEIGHT;
    let cols = Math.min(settings.cols, Math.floor(availW / charW));
    let rows = Math.round((cols * cellAspect) / ratio);
    const maxRows = Math.max(10, Math.floor(availH / LINE_HEIGHT));
    if (rows > maxRows) {
      rows = maxRows;
      cols = Math.round((rows * ratio) / cellAspect);
    }
    cols = Math.max(10, Math.min(cols, settings.cols));
    rows = Math.max(10, Math.min(rows, maxRows));

    gridSizeRef.current = { cols, rows };
    setGrid((prev) =>
      prev.cols === cols && prev.rows === rows ? prev : { cols, rows }
    );
  }, [containerSize, settings.cols, ratio, charW]);

  const setMirror = useCallback(
    (checked) => {
      userTouchedMirrorRef.current = true;
      update({ mirror: checked });
    },
    [update]
  );

  // ---- Frame plumbing (no state per frame) ----
  const emitFrame = useCallback((frame) => {
    frameRef.current = frame;
    for (const cb of frameListenersRef.current) cb(frame);
  }, []);

  const subscribeFrame = useCallback((cb) => {
    frameListenersRef.current.add(cb);
    return () => frameListenersRef.current.delete(cb);
  }, []);

  const handleMeasure = useCallback((width, height) => {
    setContainerSize((prev) =>
      prev.width === width && prev.height === height
        ? prev
        : { width, height }
    );
  }, []);

  useAsciiStream({
    videoRef,
    selectedDeviceId,
    retryToken,
    gridSizeRef,
    settingsRef,
    onFrame: emitFrame,
    onStatus: setStatus,
    onPermissionGranted: refreshAfterPermission,
    onMirrorSuggestion: (isFront) => {
      if (!userTouchedMirrorRef.current) update({ mirror: isFront });
    },
  });

  // ---- Actions ----
  const randomColor = useCallback(() => {
    const randHex = () =>
      `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")}`;
    if (settings.colorMode === "uniform") {
      update({ uniformColor: randHex() });
      return;
    }
    const map = {};
    for (const c of chars) map[c] = randHex();
    update({
      colorMode: "perChar",
      charColorMap: { ...settings.charColorMap, ...map },
    });
  }, [settings.colorMode, settings.charColorMap, chars, update]);

  const rainbowColors = useCallback(() => {
    const map = {};
    chars.forEach((c, i) => {
      const hue = Math.round((i / chars.length) * 360);
      map[c] = `hsl(${hue}, 100%, 65%)`;
    });
    update({
      colorMode: "perChar",
      charColorMap: { ...settings.charColorMap, ...map },
    });
  }, [chars, settings.charColorMap, update]);

  const takePhoto = useCallback(async () => {
    const frame = frameRef.current;
    if (!frame) return;
    try {
      const canvas = frameToPhotoCanvas(frame, {
        effect: settings.effect,
        colorMode: settings.colorMode,
        uniformColor: settings.uniformColor,
        colorByIndex,
        codeFromIndex,
        bg: "#000",
      });
      const blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png")
      );
      if (blob && navigator.share && isMobileLayout) {
        const file = new File([blob], "ascii-photo.png", { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "ASCII Photo",
            text: "Check out this ASCII art!",
          });
          return;
        }
      }
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = "ascii-photo.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      if (error?.name === "AbortError") return; // user cancelled share
      console.error("Error taking photo:", error);
    }
  }, [settings.effect, settings.colorMode, settings.uniformColor, colorByIndex, codeFromIndex, isMobileLayout]);

  const retry = useCallback(() => setRetryToken((t) => t + 1), []);

  return {
    // state
    settings,
    update,
    status,
    retry,
    isMobileLayout,
    grid,
    charW,
    // devices
    videoDevices,
    selectedDeviceId,
    selectDevice,
    switchCamera,
    canSwitchCamera,
    // frame plumbing
    videoRef,
    subscribeFrame,
    handleMeasure,
    // derived for viewfinder
    colorByIndex,
    codeFromIndex,
    // actions
    setMirror,
    takePhoto,
    randomColor,
    rainbowColors,
    // derived for sections
    chars,
  };
}
