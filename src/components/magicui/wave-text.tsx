import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface WaveTextProps {
  text: string;
  className?: string;
}

/** Letters ride a travelling sine wave, so the line ripples like an S. */
export function WaveText({ text, className }: WaveTextProps) {
  return (
    <span className={cn("wave-text", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((letter, i) => (
          <span key={i} className="wave-text-char" style={{ "--wave-i": i } as CSSProperties}>
            {letter === " " ? " " : letter}
          </span>
        ))}
      </span>
    </span>
  );
}
