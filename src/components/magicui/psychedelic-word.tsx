import { Children, type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PsychedelicWordProps {
  children?: ReactNode;
  className?: string;
}

// Static colours for reduced motion; the animated rainbow uses the same stops.
const COLORS = ["#f472b6", "#fb923c", "#fde047", "#a3e635", "#67e8f9", "#c084fc"];

/**
 * Letters fly apart and snap back together to spell the word, melting as they go.
 * Scatter offsets are derived from the index so server and client markup match.
 */
export function PsychedelicWord({ children, className }: PsychedelicWordProps) {
  const text = Children.toArray(children)
    .filter((child) => typeof child === "string")
    .join("");

  return (
    <span className={cn("psy-word", className)}>
      <span className="sr-only">{text}</span>
      <span className="psy-word-letters" aria-hidden="true">
        {Array.from(text).map((letter, i) => (
          <span
            key={i}
            className="psy-letter"
            style={{
              "--psy-dx": `${(((i * 37) % 13) - 6) * 0.09}em`,
              "--psy-dy": `${(((i * 53) % 11) - 5) * 0.14}em`,
              "--psy-rot": `${(((i * 71) % 9) - 4) * 22}deg`,
              "--psy-scale": 0.5 + ((i * 3) % 5) * 0.1,
              "--psy-delay": `${i * 70}ms`,
              "--psy-hue-delay": `${i * -0.27}s`,
              "--psy-color": COLORS[i % COLORS.length],
            } as CSSProperties}
          >
            {letter}
          </span>
        ))}
      </span>
    </span>
  );
}
