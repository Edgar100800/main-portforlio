import { Children, useEffect, useState, type CSSProperties, type ReactNode } from "react";

// Inline "worlds" for the bio keywords. Each wraps the translated word, so screen
// readers and translations get plain text; the scenery around it is aria-hidden.

interface SceneProps {
  children?: ReactNode;
}

const textOf = (children: ReactNode) =>
  Children.toArray(children)
    .filter((child) => typeof child === "string")
    .join("");

// IBM punched-card (Hollerith) rows, top to bottom: 12, 11, 0, 1..9.
// A-I = 12 + 1..9, J-R = 11 + 1..9, S-Z = 0 + 2..9, digits punch a single row.
function hollerith(char: string): number[] {
  const c = char.normalize("NFD")[0].toUpperCase();
  if (c >= "0" && c <= "9") return [Number(c) + 2];
  const code = c.charCodeAt(0);
  if (c >= "A" && c <= "I") return [0, code - 65 + 3];
  if (c >= "J" && c <= "R") return [1, code - 74 + 3];
  if (c >= "S" && c <= "Z") return [2, code - 83 + 4];
  return [];
}

const NOISE = "0101010110#%&*+=<>/$";
const noise = () => NOISE[Math.floor(Math.random() * NOISE.length)];

/**
 * Computer Science: a punched card from the first computers. Every few seconds the
 * letters dissolve into bits and symbols, then decode left to right while their
 * Hollerith holes get punched above them. The server renders the decoded word.
 */
export function PunchCardWord({ children }: SceneProps) {
  const text = textOf(children);
  const chars = Array.from(text);
  const [shown, setShown] = useState(chars);
  const [punched, setPunched] = useState(chars.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let frame = 0;

    const run = () => {
      frame = 0;
      timer = window.setInterval(() => {
        // Two frames of pure noise per letter, then the next column decodes.
        const done = Math.max(0, Math.floor((frame - 8) / 2));
        setPunched(done);
        setShown(chars.map((char, i) => (i < done || char === " " ? char : noise())));
        frame += 1;
        if (done >= chars.length) {
          window.clearInterval(timer);
          timer = window.setTimeout(run, 7000);
        }
      }, 55);
    };

    timer = window.setTimeout(run, 900);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(timer);
    };
  }, [text]);

  return (
    <span className="kw-scene kw-card">
      <span className="sr-only">{text}</span>
      <span className="kw-card-body" aria-hidden="true">
        <svg className="kw-card-holes" viewBox={`0 0 ${chars.length} 12`} preserveAspectRatio="none" shapeRendering="crispEdges">
          {chars.slice(0, punched).flatMap((char, x) =>
            hollerith(char).map((row) => <rect key={`${x}-${row}`} x={x + 0.25} y={row} width="0.5" height="0.7" />),
          )}
        </svg>
        {shown.map((char, i) => (
          <span key={i} className={i < punched || char === " " ? undefined : "kw-card-noise"}>
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}

// Fixed glyph columns (no Math.random) so server and client render the same rain.
const RAIN = [
  { glyphs: "ｱ1ｶ0ﾂ", x: 4, delay: -0.4, duration: 2.6 },
  { glyphs: "0ﾐ1ｻ", x: 20, delay: -1.7, duration: 2.1 },
  { glyphs: "ﾈ1ﾊ0ｸ", x: 36, delay: -0.9, duration: 2.9 },
  { glyphs: "1ｵ0ﾘ", x: 52, delay: -2.2, duration: 2.3 },
  { glyphs: "ﾃ0ｺ1ﾔ", x: 68, delay: -1.2, duration: 2.7 },
  { glyphs: "0ﾋ1ｼ", x: 84, delay: -0.2, duration: 2.2 },
];

/** Apps: a monitor running green Matrix rain, with someone at the keyboard building the app. */
export function MatrixWord({ children }: SceneProps) {
  return (
    <span className="kw-desk">
      <span className="kw-scene kw-matrix">
        <span className="kw-matrix-rain" aria-hidden="true">
          {RAIN.map((col, i) => (
            <span
              key={i}
              className="kw-matrix-col"
              style={{ "--col-x": `${col.x}%`, "--col-delay": `${col.delay}s`, "--col-duration": `${col.duration}s` } as CSSProperties}
            >
              {col.glyphs}
            </span>
          ))}
        </span>
        <span className="kw-matrix-text">{children}</span>
      </span>
      <svg className="kw-desk-user" viewBox="0 0 16 15" shapeRendering="crispEdges" aria-hidden="true">
        {/* Keyboard on the desk edge */}
        <rect x="0" y="10" width="5" height="1" fill="#94a3b8" />
        {/* Chair */}
        <rect x="12" y="4" width="2" height="8" fill="#334155" />
        <rect x="6" y="11" width="8" height="1" fill="#334155" />
        <rect x="9" y="12" width="1" height="2" fill="#334155" />
        <rect x="7" y="14" width="5" height="1" fill="#334155" />
        {/* Person in profile, facing the screen */}
        <g fill="#1e1b4b">
          <rect x="5" y="1" width="4" height="1" />
          <rect x="4" y="2" width="6" height="3" />
          <rect x="5" y="5" width="4" height="1" />
          <rect x="6" y="6" width="5" height="4" />
          <rect x="5" y="10" width="6" height="1" />
          <rect x="4" y="11" width="2" height="3" />
        </g>
        {/* Green glow from the monitor on the face */}
        <g fill="#4ade80" opacity="0.8">
          <rect x="4" y="2" width="1" height="3" />
          <rect x="5" y="1" width="2" height="1" />
        </g>
        {/* Arms typing */}
        <rect className="kw-desk-arm kw-desk-arm-a" x="2" y="8" width="5" height="1" fill="#312e81" />
        <rect className="kw-desk-arm kw-desk-arm-b" x="1" y="9" width="6" height="1" fill="#1e1b4b" />
      </svg>
    </span>
  );
}

/** Games: Minecraft-style lettering on a grass block. */
export function CraftWord({ children }: SceneProps) {
  return (
    <span className="kw-scene kw-craft">
      <span className="kw-craft-text">{children}</span>
    </span>
  );
}

/** Videos: the word plays on a cinema screen while a tiny viewer eats popcorn. */
export function CinemaWord({ children }: SceneProps) {
  return (
    <span className="kw-cinema">
      <svg className="kw-cinema-viewer" viewBox="0 0 16 15" shapeRendering="crispEdges" aria-hidden="true">
        {/* Viewer seen from behind, rim-lit by the screen */}
        <g className="kw-cinema-head" fill="#1e1b4b">
          <rect x="6" y="1" width="4" height="1" />
          <rect x="5" y="2" width="6" height="4" />
          <rect x="6" y="6" width="4" height="1" />
          <rect x="7" y="7" width="2" height="1" />
        </g>
        <g fill="#fde68a" opacity="0.75">
          <rect x="6" y="1" width="4" height="1" />
          <rect x="5" y="2" width="1" height="2" />
          <rect x="10" y="2" width="1" height="2" />
        </g>
        <rect x="4" y="8" width="8" height="1" fill="#1e1b4b" />
        <rect x="3" y="9" width="10" height="2" fill="#1e1b4b" />
        {/* Seat back */}
        <rect x="2" y="11" width="12" height="4" fill="#7f1d1d" />
        <rect x="2" y="11" width="12" height="1" fill="#b91c1c" />
        {/* Popcorn, and a hand that keeps reaching for it */}
        <rect x="13" y="7" width="1" height="1" fill="#fef9c3" />
        <rect x="14" y="6" width="1" height="2" fill="#fde047" />
        <rect x="15" y="7" width="1" height="1" fill="#fef9c3" />
        <rect x="13" y="8" width="3" height="5" fill="#f8fafc" />
        <rect x="14" y="8" width="1" height="5" fill="#ef4444" />
        <rect className="kw-cinema-hand" x="12" y="9" width="2" height="1" fill="#1e1b4b" />
      </svg>
      <span className="kw-scene kw-cinema-screen">
        <span className="kw-cinema-text">{children}</span>
      </span>
    </span>
  );
}
