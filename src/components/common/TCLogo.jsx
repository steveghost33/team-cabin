const RED = '#D1241F';
const INK = '#0F0D0C';
const CREAM = '#F7F4EC';

// The letters are traced from the painted "TEAM CABIN" logo itself — the T of
// TEAM and the C of CABIN — so the monogram carries the exact hand-drawn
// letterforms (slanted bar, tapering stem, fat open C) rather than a lookalike.
// Coordinates are normalised into the 200x200 viewBox below.
const T_PATH =
  'M100.54,68.55L101.97,68.55L101.97,71.41L102.32,71.77L102.68,95.71L90.17,94.28L88.39,93.57L83.03,93.57L81.60,94.64L80.53,96.43L80.53,99.29L80.17,99.64L80.53,100.36L80.53,102.14L80.17,102.50L80.53,103.22L80.53,110.36L80.88,110.72L80.88,115.37L80.53,115.72L80.88,117.15L80.88,125.37L80.53,125.73L80.88,128.23L80.17,130.02L78.38,130.73L69.81,131.09L69.45,131.45L63.02,131.45L62.66,130.73L63.02,120.73L63.37,120.37L63.37,115.72L63.73,115.37L63.73,108.93L64.09,108.58L64.09,103.57L64.45,103.22L64.09,101.79L64.45,100.71L64.09,100.00L64.45,99.29L64.09,98.93L64.45,96.07L63.37,93.21L61.23,91.78L58.01,91.78L55.87,92.50L45.51,93.57L45.15,93.93L40.86,93.93L40.50,94.28L35.50,94.28L34.79,93.93L34.07,92.85L33.00,76.77L33.36,76.42L37.29,76.42L37.65,76.06L40.50,76.06L43.72,75.34L49.08,75.34L52.30,74.63L54.08,74.99L54.44,74.63L57.66,74.63L60.87,73.91L68.73,73.56L69.09,73.20L71.59,73.20L71.95,72.84L77.67,72.49L82.67,71.41L87.31,71.06L93.75,69.63L95.89,69.63L97.68,68.91L100.18,68.91Z';

const C_PATH =
  'M151.28,62.48L151.99,62.84L153.06,62.48L159.50,62.84L163.07,64.27L164.14,64.27L166.64,66.41L166.64,68.20L165.57,70.34L155.21,84.99L149.13,81.42L146.63,80.35L143.06,79.63L136.98,80.35L131.62,83.21L126.98,87.85L123.05,94.28L120.90,101.43L121.26,108.22L122.33,111.08L125.91,115.72L129.84,118.22L135.20,120.01L139.84,120.01L140.91,120.37L141.27,120.01L145.92,119.65L150.92,117.87L154.49,116.08L156.28,114.65L157.35,114.65L161.28,116.79L166.29,121.80L167.00,123.23L167.00,124.30L165.93,126.44L163.07,129.30L159.14,132.16L150.92,136.09L144.13,137.52L143.06,137.16L138.06,137.16L134.48,136.45L126.26,133.23L120.55,129.30L116.26,125.01L114.47,122.51L111.97,117.87L110.18,112.51L109.83,101.79L110.18,101.43L110.18,98.93L110.90,97.14L110.90,95.71L113.04,89.28L115.90,83.92L119.12,79.27L126.26,72.13L132.70,67.84L141.27,64.27L147.70,62.84L150.92,62.84Z';

export default function TCLogo({ size = 120 }) {
  // Hand-drawn sticker badge: a wobbly red blob with a heavy ink outline and
  // the logo's own cream letters on top.
  const blobPath = `
    M32,30 Q100,19 171,31 Q186,44 184,100 Q186,154 169,168
    Q100,180 31,167 Q15,153 17,99 Q15,44 32,30 Z`;

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

        {/* Outline first, fill over it, so the ink sits outside the letter —
            the same way the painted logo is outlined. */}
        <g fill="none" stroke={INK} strokeWidth="11" strokeLinejoin="round">
          <path d={T_PATH} />
          <path d={C_PATH} />
        </g>
        <g fill={CREAM}>
          <path d={T_PATH} />
          <path d={C_PATH} />
        </g>
      </g>
    </svg>
  );
}
