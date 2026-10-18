// Pixel-art studio: a team lead sketches a UI on a whiteboard while Claude builds it.
// Every cycle the lead steps back, turns to check on Claude and approves, then erases.
// One SVG unit is one pixel; crispEdges keeps the blocks sharp at any size.

const CODE_LINES = [
  { x: 41, w: 7, c: '#fde047' },
  { x: 43, w: 10, c: '#67e8f9' },
  { x: 43, w: 6, c: '#e0e7ff' },
  { x: 45, w: 9, c: '#86efac' },
  { x: 43, w: 5, c: '#67e8f9' },
  { x: 41, w: 4, c: '#fde047' },
];

export function ClaudeAtWork({ className = '' }: { className?: string }) {
  // The block repeats once so the scroll loops without a seam.
  const lines = [...CODE_LINES, ...CODE_LINES];

  return (
    <svg className={`claude-at-work ${className}`} viewBox="0 0 100 40" shapeRendering="crispEdges" aria-hidden="true">
      <defs>
        <clipPath id="claude-screen">
          <rect x="40" y="8" width="18" height="13" />
        </clipPath>
      </defs>

      {/* Thinking spark above the head */}
      <g className="claude-spark" fill="#fde047">
        <rect x="13" y="3" width="1" height="5" />
        <rect x="11" y="5" width="5" height="1" />
        <rect x="12" y="4" width="3" height="3" opacity="0.55" />
      </g>

      {/* Coffee with rising steam */}
      <g className="claude-steam" fill="#e0e7ff">
        <rect x="2" y="21" width="1" height="1" />
        <rect x="3" y="19" width="1" height="1" />
        <rect x="2" y="17" width="1" height="1" />
      </g>
      <rect x="1" y="24" width="4" height="5" fill="#f8fafc" />
      <rect x="5" y="25" width="1" height="2" fill="#f8fafc" />
      <rect x="2" y="25" width="2" height="1" fill="#7c2d12" />

      {/* Monitor */}
      <rect x="38" y="6" width="22" height="17" fill="#1e1b4b" />
      <rect x="40" y="8" width="18" height="13" fill="#0b1026" />
      <g clipPath="url(#claude-screen)">
        <g className="claude-code">
          {lines.map((line, i) => (
            <rect key={i} x={line.x} y={9 + i * 2} width={line.w} height="1" fill={line.c} />
          ))}
        </g>
      </g>
      <rect className="claude-cursor" x="55" y="19" width="2" height="1" fill="#fde047" />
      <rect x="47" y="23" width="4" height="4" fill="#312e81" />
      <rect x="44" y="27" width="10" height="2" fill="#312e81" />

      {/* Keyboard */}
      <rect x="26" y="27" width="13" height="2" fill="#a5b4fc" />
      <g fill="#e0e7ff">
        <rect x="27" y="27" width="1" height="1" />
        <rect x="29" y="27" width="1" height="1" />
        <rect x="31" y="27" width="1" height="1" />
        <rect x="33" y="27" width="1" height="1" />
        <rect x="35" y="27" width="1" height="1" />
        <rect x="37" y="27" width="1" height="1" />
      </g>

      {/* Claude */}
      <g className="claude-body">
        <rect x="8" y="12" width="16" height="13" fill="#d97757" />
        <rect x="8" y="12" width="16" height="1" fill="#e8977c" />
        <rect x="6" y="17" width="2" height="3" fill="#d97757" />
        <g className="claude-eyes" fill="#1c1917">
          <rect x="16" y="15" width="2" height="3" />
          <rect x="20" y="15" width="2" height="3" />
        </g>
        <rect className="claude-arm claude-arm-a" x="24" y="22" width="5" height="2" fill="#d97757" />
        <rect className="claude-arm claude-arm-b" x="24" y="24" width="8" height="2" fill="#c4674a" />
        <g fill="#c4674a">
          <rect x="9" y="25" width="2" height="4" />
          <rect x="12" y="25" width="2" height="4" />
          <rect x="18" y="25" width="2" height="4" />
          <rect x="21" y="25" width="2" height="4" />
        </g>
      </g>

      {/* Desk */}
      <rect x="0" y="29" width="64" height="2" fill="#4338ca" />
      <rect x="0" y="29" width="64" height="1" fill="#6366f1" />
      <rect x="2" y="31" width="2" height="9" fill="#312e81" />
      <rect x="60" y="31" width="2" height="9" fill="#312e81" />

      {/* Whiteboard on a stand, right of the desk */}
      <g transform="translate(76 0)">
        <rect x="2" y="5" width="20" height="17" fill="#94a3b8" />
        <rect x="3" y="6" width="18" height="15" fill="#f8fafc" />
        <rect x="3" y="21" width="18" height="1" fill="#64748b" />
        <rect x="5" y="22" width="1" height="17" fill="#475569" />
        <rect x="18" y="22" width="1" height="17" fill="#475569" />
        <rect x="3" y="39" width="5" height="1" fill="#475569" />
        <rect x="16" y="39" width="5" height="1" fill="#475569" />

        {/* The design being sketched: a screen wireframe */}
        <g fill="#2563eb">
          <rect x="5" y="8" width="13" height="1" />
          <rect x="5" y="19" width="13" height="1" />
          <rect x="5" y="8" width="1" height="12" />
          <rect x="17" y="8" width="1" height="12" />
        </g>
        <rect x="6" y="9" width="11" height="2" fill="#93c5fd" />
        <g fill="#334155">
          <rect x="7" y="12" width="6" height="1" />
          <rect x="7" y="14" width="8" height="1" />
          <rect x="7" y="16" width="5" height="1" />
        </g>
        <rect x="13" y="16" width="3" height="2" fill="#ef4444" />
        {/* Blank board that recedes downward, so the sketch appears top to bottom */}
        <rect className="lead-board-cover" x="4" y="7" width="16" height="13" fill="#f8fafc" />
      </g>

      {/* Team lead, mirrored so they face the board and turn left toward Claude */}
      <g transform="translate(100 0) scale(-1 1)">
        <rect x="26" y="17" width="2" height="1" fill="#e8b28a" />
        <rect x="24" y="18" width="6" height="9" fill="#0ea5e9" />
        <rect x="24" y="18" width="6" height="1" fill="#0284c7" />
        <rect x="25" y="27" width="4" height="6" fill="#1e293b" />
        <rect x="25" y="33" width="2" height="6" fill="#1e293b" />
        <rect x="28" y="33" width="2" height="6" fill="#1e293b" />
        <rect x="24" y="39" width="3" height="1" fill="#0f172a" />
        <rect x="28" y="39" width="3" height="1" fill="#0f172a" />
        <g className="lead-facing-board">
          <rect x="24" y="11" width="6" height="2" fill="#3f2a1d" />
          <rect x="28" y="13" width="2" height="3" fill="#3f2a1d" />
          <rect x="24" y="13" width="4" height="4" fill="#e8b28a" />
          <rect x="23" y="15" width="1" height="1" fill="#e8b28a" />
          <rect x="25" y="14" width="1" height="1" fill="#1c1917" />
        </g>
        <g className="lead-facing-claude">
          <rect x="24" y="11" width="6" height="2" fill="#3f2a1d" />
          <rect x="24" y="13" width="2" height="3" fill="#3f2a1d" />
          <rect x="26" y="13" width="4" height="4" fill="#e8b28a" />
          <rect x="30" y="15" width="1" height="1" fill="#e8b28a" />
          <rect x="28" y="14" width="1" height="1" fill="#1c1917" />
        </g>
        {/* Drawing arm with a red marker, scribbling */}
        <g className="lead-arm-draw">
          <g className="lead-scribble">
            <rect x="20" y="18" width="4" height="2" fill="#0ea5e9" />
            <rect x="19" y="17" width="2" height="2" fill="#e8b28a" />
            <rect x="18" y="16" width="1" height="2" fill="#ef4444" />
          </g>
        </g>
        {/* Arm at rest while reviewing */}
        <g className="lead-arm-rest">
          <rect x="23" y="19" width="1" height="6" fill="#0284c7" />
          <rect x="23" y="25" width="1" height="1" fill="#e8b28a" />
        </g>
      </g>
      {/* Approval bubble aimed at Claude */}
      <g className="lead-bubble">
        <rect x="62" y="2" width="7" height="6" fill="#f8fafc" />
        <rect x="67" y="8" width="1" height="1" fill="#f8fafc" />
        <g fill="#16a34a">
          <rect x="63" y="5" width="1" height="1" />
          <rect x="64" y="6" width="1" height="1" />
          <rect x="65" y="5" width="1" height="1" />
          <rect x="66" y="4" width="1" height="1" />
          <rect x="67" y="3" width="1" height="1" />
        </g>
      </g>
    </svg>
  );
}
