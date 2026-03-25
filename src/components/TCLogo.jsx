// ─────────────────────────────────────
//  TCLogo.jsx
//  The Team Cabin TC circle logo.
//  Pass `size` prop to scale it.
//  e.g. <TCLogo size={120} />
// ─────────────────────────────────────

const G    = '#1C3D12';   // letter color
const GOLD = '#E2A820';   // circle fill

export default function TCLogo({ size = 120 }) {
  const S = 8; // shadow offset in px

  // T letter — crossbar + stem as one path
  // Layout math (200×200 viewBox, circle r=94 at center 100,100):
  //   TC block = 148px wide → startX=26  (centered: (200-148)/2 = 26)
  //   Height   = 94px tall  → startY=53  (centered: (200-94)/2  = 53)
  const tPath = `
    M30,53 L92,53 Q96,53 96,57 L96,69 Q96,73 92,73 L78,73
    L78,143 Q78,147 74,147 L52,147 Q48,147 48,143 L48,73
    L30,73 Q26,73 26,69 L26,57 Q26,53 30,53 Z`;

  // C letter — open bracket shape
  const cPath = `
    M104,53 L170,53 Q174,53 174,57 L174,69 Q174,73 170,73
    L122,73 L122,127 L170,127 Q174,127 174,131 L174,143
    Q174,147 170,147 L104,147 Q100,147 100,143
    L100,57 Q100,53 104,53 Z`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Diagonal hatch lines for the drop-shadow layer */}
        <pattern
          id="tcH"
          patternUnits="userSpaceOnUse"
          width="7"
          height="7"
          patternTransform="rotate(-45 0 0)"
        >
          <line x1="0" y1="0" x2="0" y2="7" stroke={G} strokeWidth="2.2" />
        </pattern>

        {/* Clip hatch to T shadow shape (shifted +S,+S) */}
        <clipPath id="tSh">
          <path transform={`translate(${S},${S})`} d={tPath} />
        </clipPath>

        {/* Clip hatch to C shadow shape (shifted +S,+S) */}
        <clipPath id="cSh">
          <path transform={`translate(${S},${S})`} d={cPath} />
        </clipPath>
      </defs>

      {/* Gold circle */}
      <circle cx="100" cy="100" r="94" fill={GOLD} />

      {/* T drop-shadow (hatch layer behind solid letter) */}
      <g clipPath="url(#tSh)">
        <rect x="0" y="0" width="200" height="200" fill={GOLD} />
        <rect x="0" y="0" width="200" height="200" fill="url(#tcH)" />
      </g>

      {/* C drop-shadow */}
      <g clipPath="url(#cSh)">
        <rect x="0" y="0" width="200" height="200" fill={GOLD} />
        <rect x="0" y="0" width="200" height="200" fill="url(#tcH)" />
      </g>

      {/* Solid T letter */}
      <path d={tPath} fill={G} />

      {/* Solid C letter — drawn on top so it overlaps T's right edge */}
      <path d={cPath} fill={G} />
    </svg>
  );
}
