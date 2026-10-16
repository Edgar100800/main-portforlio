import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface LetterRevealProps {
  text: string;
  className?: string;
  /** Milliseconds before the first letter starts. */
  delay?: number;
  /** Milliseconds between letters. */
  stagger?: number;
}

/** Letters rise in one by one. Screen readers get the whole string once. */
export function LetterReveal({ text, className, delay = 120, stagger = 32 }: LetterRevealProps) {
  let index = 0;

  return (
    <span className={cn("letter-reveal", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, w) => (
          <span key={w}>
            {w > 0 && " "}
            {/* Words stay unbreakable so the reveal never splits a name across lines. */}
            <span className="whitespace-nowrap">
              {Array.from(word).map((letter) => (
                <span key={index} className="letter-reveal-char" style={{ "--letter-delay": `${delay + index++ * stagger}ms` } as CSSProperties}>
                  {letter}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
