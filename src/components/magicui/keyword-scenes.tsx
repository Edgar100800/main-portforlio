import type { CSSProperties, ReactNode } from "react";

// Three inline "worlds" for the bio keywords. Each wraps the translated word, so screen
// readers and translations get plain text; the scenery around it is aria-hidden.

interface SceneProps {
  children?: ReactNode;
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
