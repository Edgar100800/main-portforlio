import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SparklesTextProps {
  children: ReactNode;
  className?: string;
  /** Number of stars around the text. */
  sparklesCount?: number;
  colors?: string[];
}

const STAR_PATH =
  "M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z";

/**
 * Twinkling stars around text. Positions are deterministic (golden-angle spread) so the
 * server and client render the same markup, and the twinkle runs in CSS, not React state.
 */
export function SparklesText({
  children,
  className,
  sparklesCount = 10,
  colors = ["#fde047", "#67e8f9", "#ffffff"],
}: SparklesTextProps) {
  const stars = Array.from({ length: sparklesCount }, (_, i) => {
    const t = (i * 0.618034) % 1;
    return {
      x: `${(4 + t * 92).toFixed(1)}%`,
      // Alternate above and below the glyphs so stars frame the word instead of covering it.
      y: `${i % 2 ? 100 + ((i * 7) % 12) : -14 + ((i * 11) % 12)}%`,
      // Sized in em so the stars scale with the heading from mobile to desktop.
      size: `${(0.24 + ((i * 5) % 9) * 0.025).toFixed(3)}em`,
      color: colors[i % colors.length],
      delay: `${((i * 0.73) % 3).toFixed(2)}s`,
      duration: `${(2.4 + ((i * 0.37) % 1.6)).toFixed(2)}s`,
    };
  });

  return (
    <span className={cn("sparkles-text relative inline-block", className)}>
      {stars.map((star, i) => (
        <svg
          key={i}
          className="sparkle pointer-events-none absolute"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            "--sparkle-delay": star.delay,
            "--sparkle-duration": star.duration,
          } as CSSProperties}
          viewBox="0 0 21 21"
          aria-hidden="true"
        >
          <path d={STAR_PATH} fill={star.color} />
        </svg>
      ))}
      {children}
    </span>
  );
}
