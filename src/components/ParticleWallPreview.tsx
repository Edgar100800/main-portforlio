import { useEffect, useRef } from 'react';

// The original JellyfishPointsWallpaper formula from live-wallpaper's Canvas
// preview, with time-based motion and a visibility-aware render loop.
export function ParticleWallPreview() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !context) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let frame: number | null = null;
    let previous = 0;
    let time = 2.6;

    function draw() {
      if (!canvas || !context) return;
      const scale = Math.min(1.5, devicePixelRatio || 1);
      const width = Math.min(960, Math.round(canvas.clientWidth * scale));
      const height = Math.round(width * 10 / 16);
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      context.globalAlpha = 1;
      context.fillStyle = '#08080c';
      context.fillRect(0, 0, width, height);
      context.fillStyle = '#e9e4ff';
      context.globalAlpha = .45;
      for (let i = 9999; i--;) {
        const y = i / 345;
        const base = y < 11 ? 6 + Math.sin((y | 0) ^ 8) * 6 : y / 5 + Math.cos(y / 2);
        const k = base * Math.cos(i - time / 4);
        const e = y / 7 - 13;
        const d = Math.sqrt(k * k + e * e) + Math.sin(e / 4 + time) / 2;
        const c = d / 2 + 1 - time / 2;
        const q = y * k / d * (3 + Math.sin(d * 2 + y / 2 - time * 4));
        context.fillRect((q + 60 * Math.cos(c) + 200) * width / 400, (q * Math.sin(c) + d * 29 - 170) * height / 400, 1, 1);
      }
    }

    function animate(now: number) {
      if (previous) time += Math.min((now - previous) / 1000, .05) * Math.PI / 2;
      previous = now;
      draw();
      frame = requestAnimationFrame(animate);
    }

    function sync() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      previous = 0;
      if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(animate);
      else if (visible) draw();
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(canvas);
    const resizeObserver = new ResizeObserver(() => { if (visible) draw(); });
    resizeObserver.observe(canvas);
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return <canvas ref={ref} className="particlewall-preview" aria-hidden="true" />;
}
