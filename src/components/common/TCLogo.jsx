const RED = '#D1241F';
const INK = '#0F0D0C';
const CREAM = '#F7F4EC';

export default function TCLogo({ size = 120 }) {
  // Hand-drawn sticker badge: a wobbly red blob with a heavy ink outline and
  // chunky cream letters, matching the painted "TEAM CABIN" band logo.
  //
  // Layout math (200×200 viewBox):
  //   TC block = 148px wide → startX=26  (centered: (200-148)/2 = 26)
  //   Height   = 94px tall  → startY=53  (centered: (200-94)/2  = 53)
  const blobPath = `
    M32,30 Q100,19 171,31 Q186,44 184,100 Q186,154 169,168
    Q100,180 31,167 Q15,153 17,99 Q15,44 32,30 Z`;

  const tPath = `
    M30,53 L92,53 Q96,53 96,57 L96,69 Q96,73 92,73 L78,73
    L78,143 Q78,147 74,147 L52,147 Q48,147 48,143 L48,73
    L30,73 Q26,73 26,69 L26,57 Q26,53 30,53 Z`;

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
      aria-label="Team Cabin TC logo"
      role="img"
    >
      {/* Scaled down slightly so the die-cut ring stays inside the viewBox. */}
      <g transform="translate(100,100) scale(0.9) translate(-100,-100)">
        {/* die-cut sticker edge — keeps the badge readable on the red bars */}
        <path
          d={blobPath}
          fill="none"
          stroke={CREAM}
          strokeWidth="24"
          strokeLinejoin="round"
        />

        {/* red sticker blob */}
        <path
          d={blobPath}
          fill={RED}
          stroke={INK}
          strokeWidth="9"
          strokeLinejoin="round"
        />

        {/* cream letters, outlined like the painted logo */}
        <g transform="rotate(-2 100 100)" strokeLinejoin="round">
          <path d={tPath} fill={CREAM} stroke={INK} strokeWidth="7" />
          <path d={cPath} fill={CREAM} stroke={INK} strokeWidth="7" />
        </g>
      </g>
    </svg>
  );
}
