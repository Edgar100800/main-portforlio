import { useEffect, useRef } from "react";

type Blob = {
  color: string;
  x: number;
  y: number;
  radius: number;
  speed: number;
  phase: number;
  drift: number;
};

const blobs: Blob[] = [
  { color: "#7c3aed", x: 0.12, y: 0.18, radius: 0.72, speed: 0.16, phase: 0.4, drift: 0.16 },
  { color: "#2563eb", x: 0.84, y: 0.3, radius: 0.68, speed: 0.12, phase: 2.1, drift: 0.14 },
  { color: "#c026d3", x: 0.58, y: 0.88, radius: 0.62, speed: 0.1, phase: 4.2, drift: 0.18 },
];

export default function AnimatedGradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let width = 0;
    let height = 0;
    let frameId: number | null = null;
    let isVisible = true;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw(0);
    };

    const draw = (time: number) => {
      if (!width || !height) return;

      pointer.x += (pointer.targetX - pointer.x) * 0.015;
      pointer.y += (pointer.targetY - pointer.y) * 0.015;

      context.clearRect(0, 0, width, height);
      context.fillStyle = "#3730a3";
      context.fillRect(0, 0, width, height);

      const scale = Math.max(width, height);
      blobs.forEach((blob) => {
        const angle = time * blob.speed + blob.phase;
        const x = (blob.x + Math.sin(angle) * blob.drift + (pointer.x - 0.5) * 0.035) * width;
        const y = (blob.y + Math.cos(angle * 0.8) * blob.drift + (pointer.y - 0.5) * 0.035) * height;
        const radius = blob.radius * scale;
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);

        gradient.addColorStop(0, `${blob.color}dd`);
        gradient.addColorStop(0.45, `${blob.color}99`);
        gradient.addColorStop(1, `${blob.color}00`);
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
      });
    };

    const animate = (time: number) => {
      if (!isVisible) return;
      draw(time / 1000);
      frameId = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.targetX = event.clientX / window.innerWidth;
      pointer.targetY = event.clientY / window.innerHeight;
    };

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";
      if (!isVisible && frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
      if (isVisible && !reducedMotion && frameId === null) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (reducedMotion && frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      } else if (!reducedMotion && isVisible && frameId === null) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionQuery.addEventListener("change", handleMotionPreference);

    if (!reducedMotion) {
      frameId = window.requestAnimationFrame(animate);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionQuery.removeEventListener("change", handleMotionPreference);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
