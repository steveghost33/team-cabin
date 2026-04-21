// Characters.jsx — 8-bit Super Mario Bros style band members
// viewBox 0 0 32 47
// No opacity, no SVG stroke — pure pixel rects, NES palette, chunky boots, big heads

// ── STEVE — red flannel, blue jeans, pixel glasses, beard ──────────────────
export function CharLeft({ size = 64, animate = true, delay = '0s' }) {
  return (
    <svg width={size} height={Math.round(size * 1.47)} viewBox="0 0 32 47"
      style={{ imageRendering:'pixelated', display:'block',
        animation: animate ? `bob 1.3s ease-in-out ${delay} infinite` : 'none' }}>
      {/* chunky boots */}
      <rect x="3"  y="40" width="12" height="7" fill="#3D1C00" />
      <rect x="17" y="40" width="12" height="7" fill="#3D1C00" />
      <rect x="3"  y="40" width="12" height="2" fill="#5C3010" />
      <rect x="17" y="40" width="12" height="2" fill="#5C3010" />
      {/* blue jeans */}
      <rect x="6"  y="27" width="8"  height="13" fill="#0038EC" />
      <rect x="18" y="27" width="8"  height="13" fill="#0038EC" />
      <rect x="13" y="27" width="1"  height="13" fill="#0020B0" />
      {/* belt */}
      <rect x="5"  y="26" width="22" height="2"  fill="#503000" />
      <rect x="14" y="26" width="4"  height="2"  fill="#D4A020" />
      {/* red flannel body */}
      <rect x="5"  y="16" width="22" height="11" fill="#CC2200" />
      {/* plaid — solid dark lines, no opacity */}
      <rect x="5"  y="20" width="22" height="1"  fill="#881100" />
      <rect x="5"  y="24" width="22" height="1"  fill="#881100" />
      <rect x="10" y="16" width="1"  height="11" fill="#881100" />
      <rect x="16" y="16" width="1"  height="11" fill="#881100" />
      <rect x="22" y="16" width="1"  height="11" fill="#881100" />
      {/* inner shirt visible at collar */}
      <rect x="13" y="16" width="6"  height="3"  fill="#3A5020" />
      {/* arms */}
      <rect x="0"  y="16" width="5"  height="10" fill="#CC2200" />
      <rect x="27" y="16" width="5"  height="10" fill="#CC2200" />
      {/* hands */}
      <rect x="0"  y="25" width="5"  height="4"  fill="#F4B47C" />
      <rect x="27" y="25" width="5"  height="4"  fill="#F4B47C" />
      {/* neck */}
      <rect x="13" y="12" width="6"  height="5"  fill="#F4B47C" />
      {/* head — wider + taller for big Mario-style head */}
      <rect x="7"  y="1"  width="18" height="14" fill="#F4B47C" />
      {/* hair — dark brown top block */}
      <rect x="7"  y="1"  width="18" height="4"  fill="#7C5108" />
      {/* sideburns */}
      <rect x="7"  y="4"  width="2"  height="5"  fill="#7C5108" />
      <rect x="23" y="4"  width="2"  height="5"  fill="#7C5108" />
      {/* beard — bold lower face */}
      <rect x="7"  y="11" width="18" height="4"  fill="#7C5108" />
      {/* eyes — big NES squares */}
      <rect x="11" y="7"  width="3"  height="3"  fill="#000" />
      <rect x="18" y="7"  width="3"  height="3"  fill="#000" />
      {/* pixel-art glasses — rects only, no stroke */}
      <rect x="10" y="6"  width="5"  height="1"  fill="#7C5108" />
      <rect x="10" y="10" width="5"  height="1"  fill="#7C5108" />
      <rect x="10" y="6"  width="1"  height="5"  fill="#7C5108" />
      <rect x="14" y="6"  width="1"  height="5"  fill="#7C5108" />
      <rect x="17" y="6"  width="5"  height="1"  fill="#7C5108" />
      <rect x="17" y="10" width="5"  height="1"  fill="#7C5108" />
      <rect x="17" y="6"  width="1"  height="5"  fill="#7C5108" />
      <rect x="21" y="6"  width="1"  height="5"  fill="#7C5108" />
      <rect x="15" y="8"  width="2"  height="1"  fill="#7C5108" />
    </svg>
  );
}

// ── MIKE — grey hoodie, mustard snapback, maroon pants, dark boots ──
export function CharMid({ size = 64, animate = true, delay = '0.25s' }) {
  return (
    <svg width={size} height={Math.round(size * 1.47)} viewBox="0 0 32 47"
      style={{ imageRendering:'pixelated', display:'block',
        animation: animate ? `bob 1.3s ease-in-out ${delay} infinite` : 'none' }}>
      {/* chunky dark boots */}
      <rect x="3"  y="40" width="12" height="7" fill="#2a2a2a" />
      <rect x="17" y="40" width="12" height="7" fill="#2a2a2a" />
      <rect x="3"  y="40" width="12" height="2" fill="#444" />
      <rect x="17" y="40" width="12" height="2" fill="#444" />
      {/* maroon pants */}
      <rect x="6"  y="27" width="8"  height="13" fill="#8B1A2A" />
      <rect x="18" y="27" width="8"  height="13" fill="#8B1A2A" />
      <rect x="13" y="27" width="1"  height="13" fill="#5A0A18" />
      {/* grey hoodie body */}
      <rect x="4"  y="16" width="24" height="12" fill="#9a9a9a" />
      {/* center zip seam */}
      <rect x="15" y="16" width="2"  height="12" fill="#787878" />
      {/* front pocket */}
      <rect x="8"  y="22" width="16" height="5"  fill="#888" />
      <rect x="8"  y="22" width="16" height="1"  fill="#707070" />
      {/* hood opening at neck */}
      <rect x="12" y="16" width="8"  height="3"  fill="#787878" />
      {/* arms */}
      <rect x="0"  y="16" width="4"  height="10" fill="#9a9a9a" />
      <rect x="28" y="16" width="4"  height="10" fill="#9a9a9a" />
      {/* hands */}
      <rect x="0"  y="25" width="4"  height="4"  fill="#C49A6C" />
      <rect x="28" y="25" width="4"  height="4"  fill="#C49A6C" />
      {/* neck */}
      <rect x="13" y="12" width="6"  height="5"  fill="#C49A6C" />
      {/* head — big */}
      <rect x="7"  y="2"  width="18" height="13" fill="#C49A6C" />
      {/* dark beard — bold NES style */}
      <rect x="7"  y="10" width="18" height="5"  fill="#2a1a0a" />
      <rect x="7"  y="7"  width="3"  height="4"  fill="#2a1a0a" />
      <rect x="22" y="7"  width="3"  height="4"  fill="#2a1a0a" />
      {/* eyes */}
      <rect x="11" y="6"  width="3"  height="3"  fill="#111" />
      <rect x="18" y="6"  width="3"  height="3"  fill="#111" />
      {/* mustard snapback hat — bold 8-bit blocks */}
      {/* brim — wide flat block */}
      <rect x="3"  y="3"  width="26" height="3"  fill="#B88018" />
      {/* crown — tall solid block */}
      <rect x="6"  y="-4" width="20" height="8"  fill="#D4A020" />
      {/* crown highlight row */}
      <rect x="7"  y="-4" width="18" height="2"  fill="#E8B830" />
      {/* underside of brim */}
      <rect x="4"  y="5"  width="24" height="1"  fill="#906010" />
      {/* top button */}
      <rect x="14" y="-4" width="4"  height="1"  fill="#906010" />
    </svg>
  );
}

// ── KYLE — green zip fleece, dark pants, brown boots, pixel glasses ─────────────
export function CharRight({ size = 64, animate = true, delay = '0.5s' }) {
  return (
    <svg width={size} height={Math.round(size * 1.47)} viewBox="0 0 32 47"
      style={{ imageRendering:'pixelated', display:'block',
        animation: animate ? `bob 1.3s ease-in-out ${delay} infinite` : 'none' }}>
      {/* chunky brown boots */}
      <rect x="3"  y="40" width="12" height="7" fill="#5D4037" />
      <rect x="17" y="40" width="12" height="7" fill="#5D4037" />
      <rect x="3"  y="40" width="12" height="2" fill="#7D5545" />
      <rect x="17" y="40" width="12" height="2" fill="#7D5545" />
      {/* dark navy pants */}
      <rect x="6"  y="27" width="8"  height="13" fill="#283040" />
      <rect x="18" y="27" width="8"  height="13" fill="#283040" />
      <rect x="13" y="27" width="1"  height="13" fill="#181F2A" />
      {/* green zip fleece body */}
      <rect x="5"  y="16" width="22" height="12" fill="#3D5A2A" />
      {/* zip seam */}
      <rect x="15" y="16" width="2"  height="12" fill="#2D4A1E" />
      {/* collar */}
      <rect x="11" y="15" width="10" height="3"  fill="#2D4A1E" />
      {/* chest patch area */}
      <rect x="6"  y="18" width="7"  height="5"  fill="#4A6B30" />
      <rect x="7"  y="19" width="5"  height="3"  fill="#D4A017" />
      {/* arms */}
      <rect x="1"  y="16" width="4"  height="11" fill="#3D5A2A" />
      <rect x="27" y="16" width="4"  height="11" fill="#3D5A2A" />
      {/* hands */}
      <rect x="1"  y="26" width="4"  height="4"  fill="#F0C080" />
      <rect x="27" y="26" width="4"  height="4"  fill="#F0C080" />
      {/* neck */}
      <rect x="13" y="12" width="6"  height="5"  fill="#F0C080" />
      {/* head — wide Mario-style */}
      <rect x="7"  y="1"  width="18" height="14" fill="#F0C080" />
      {/* short hair — top block + sideburns */}
      <rect x="7"  y="1"  width="18" height="4"  fill="#6B4C2A" />
      <rect x="7"  y="4"  width="3"  height="4"  fill="#6B4C2A" />
      <rect x="22" y="4"  width="3"  height="4"  fill="#6B4C2A" />
      {/* eyes */}
      <rect x="11" y="7"  width="3"  height="3"  fill="#1a1a1a" />
      <rect x="18" y="7"  width="3"  height="3"  fill="#1a1a1a" />
      {/* pixel-art glasses — rects only, no stroke */}
      <rect x="10" y="6"  width="5"  height="1"  fill="#6B4C2A" />
      <rect x="10" y="10" width="5"  height="1"  fill="#6B4C2A" />
      <rect x="10" y="6"  width="1"  height="5"  fill="#6B4C2A" />
      <rect x="14" y="6"  width="1"  height="5"  fill="#6B4C2A" />
      <rect x="17" y="6"  width="5"  height="1"  fill="#6B4C2A" />
      <rect x="17" y="10" width="5"  height="1"  fill="#6B4C2A" />
      <rect x="17" y="6"  width="1"  height="5"  fill="#6B4C2A" />
      <rect x="21" y="6"  width="1"  height="5"  fill="#6B4C2A" />
      <rect x="15" y="8"  width="2"  height="1"  fill="#6B4C2A" />
    </svg>
  );
}
