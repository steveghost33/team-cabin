const G    = '#1C3D12';
const GOLD = '#E2A820';

export default function TCLogo({ size = 120 }) {
  const S = 8;
  const tPath = `M30,53 L92,53 Q96,53 96,57 L96,69 Q96,73 92,73 L78,73 L78,143 Q78,147 74,147 L52,147 Q48,147 48,143 L48,73 L30,73 Q26,73 26,69 L26,57 Q26,53 30,53 Z`;
  const cPath = `M104,53 L170,53 Q174,53 174,57 L174,69 Q174,73 170,73 L122,73 L122,127 L170,127 Q174,127 174,131 L174,143 Q174,147 170,147 L104,147 Q100,147 100,143 L100,57 Q100,53 104,53 Z`;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="tcH" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(-45 0 0)">
          <line x1="0" y1="0" x2="0" y2="7" stroke={G} strokeWidth="2.2" />
        </pattern>
        <clipPath id="tSh"><path transform={`translate(${S},${S})`} d={tPath} /></clipPath>
        <clipPath id="cSh"><path transform={`translate(${S},${S})`} d={cPath} /></clipPath>
      </defs>
      <circle cx="100" cy="100" r="94" fill={GOLD} />
      <g clipPath="url(#tSh)"><rect x="0" y="0" width="200" height="200" fill={GOLD} /><rect x="0" y="0" width="200" height="200" fill="url(#tcH)" /></g>
      <g clipPath="url(#cSh)"><rect x="0" y="0" width="200" height="200" fill={GOLD} /><rect x="0" y="0" width="200" height="200" fill="url(#tcH)" /></g>
      <path d={tPath} fill={G} />
      <path d={cPath} fill={G} />
    </svg>
  );
}
