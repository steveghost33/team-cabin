// Characters.jsx — pixel-art SVG band members
// viewBox 0 0 32 47  (width×1.47 = height)

// ── STEVE — plaid flannel, beard, glasses ──────────────────
export function CharLeft({ size = 64, animate = true, delay = '0s' }) {
  return (
    <svg width={size} height={Math.round(size * 1.47)} viewBox="0 0 32 47"
      style={{ imageRendering:'pixelated', display:'block',
        animation: animate ? `bob 1.3s ease-in-out ${delay} infinite` : 'none' }}>
      {/* shoes */}
      <rect x="6"  y="43" width="8" height="3" fill="#111" />
      <rect x="18" y="43" width="8" height="3" fill="#111" />
      {/* black pants */}
      <rect x="7"  y="30" width="7" height="13" fill="#1c1c2c" />
      <rect x="18" y="30" width="7" height="13" fill="#1c1c2c" />
      {/* plaid body */}
      <rect x="5"  y="16" width="22" height="15" fill="#848688" />
      <rect x="5"  y="19" width="22" height="2"  fill="#5a5c5e" opacity="0.5" />
      <rect x="5"  y="24" width="22" height="2"  fill="#5a5c5e" opacity="0.5" />
      <rect x="5"  y="29" width="22" height="1"  fill="#5a5c5e" opacity="0.5" />
      <rect x="9"  y="16" width="2"  height="15" fill="#5a5c5e" opacity="0.45" />
      <rect x="15" y="16" width="2"  height="15" fill="#5a5c5e" opacity="0.45" />
      <rect x="21" y="16" width="2"  height="15" fill="#5a5c5e" opacity="0.45" />
      {/* inner shirt */}
      <rect x="13" y="16" width="6"  height="4"  fill="#4a6030" />
      {/* arms */}
      <rect x="1"  y="16" width="5"  height="11" fill="#848688" />
      <rect x="26" y="16" width="5"  height="11" fill="#848688" />
      {/* hands */}
      <rect x="1"  y="26" width="5"  height="3"  fill="#e0c090" />
      <rect x="26" y="26" width="5"  height="3"  fill="#e0c090" />
      {/* neck */}
      <rect x="13" y="12" width="6"  height="5"  fill="#e0c090" />
      {/* head */}
      <rect x="8"  y="2"  width="16" height="14" fill="#e0c090" />
      {/* hair */}
      <rect x="8"  y="2"  width="16" height="3"  fill="#8a7045" opacity="0.35" />
      {/* beard */}
      <rect x="8"  y="13" width="16" height="3"  fill="#8a7045" />
      <rect x="9"  y="11" width="3"  height="3"  fill="#8a7045" />
      <rect x="20" y="11" width="3"  height="3"  fill="#8a7045" />
      {/* eyes */}
      <rect x="11" y="8"  width="3"  height="3"  fill="#1a1a1a" />
      <rect x="18" y="8"  width="3"  height="3"  fill="#1a1a1a" />
      {/* glasses */}
      <rect x="10" y="7"  width="5"  height="5"  fill="none" stroke="#7a6535" strokeWidth="0.9" />
      <rect x="17" y="7"  width="5"  height="5"  fill="none" stroke="#7a6535" strokeWidth="0.9" />
      <rect x="15" y="9"  width="2"  height="1"  fill="#7a6535" />
    </svg>
  );
}

// ── MIKE — plain grey hoodie (NO logo), mustard yellow hat, dark gray shoes ──
export function CharMid({ size = 64, animate = true, delay = '0.25s' }) {
  return (
    <svg width={size} height={Math.round(size * 1.47)} viewBox="0 0 32 47"
      style={{ imageRendering:'pixelated', display:'block',
        animation: animate ? `bob 1.3s ease-in-out ${delay} infinite` : 'none' }}>
      {/* DARK GRAY shoes — same both feet, no white stripe */}
      <rect x="6"  y="43" width="8" height="3" fill="#3a3a3a" />
      <rect x="18" y="43" width="8" height="3" fill="#3a3a3a" />
      {/* maroon pants */}
      <rect x="7"  y="30" width="7" height="13" fill="#7B2D3A" />
      <rect x="18" y="30" width="7" height="13" fill="#7B2D3A" />
      {/* PLAIN grey hoodie — NO logo, NO graphic, just solid grey */}
      <rect x="4"  y="15" width="24" height="16" fill="#9a9a9a" />
      {/* pocket — plain, no markings */}
      <rect x="9"  y="24" width="14" height="6"  fill="#888" />
      {/* center seam only */}
      <rect x="15" y="15" width="1"  height="16" fill="#838383" />
      {/* arms */}
      <rect x="0"  y="15" width="5"  height="13" fill="#9a9a9a" />
      <rect x="27" y="15" width="5"  height="13" fill="#9a9a9a" />
      {/* hands */}
      <rect x="0"  y="27" width="5"  height="3"  fill="#c49a6c" />
      <rect x="27" y="27" width="5"  height="3"  fill="#c49a6c" />
      {/* neck */}
      <rect x="13" y="11" width="6"  height="5"  fill="#c49a6c" />
      {/* head */}
      <rect x="8"  y="2"  width="16" height="13" fill="#c49a6c" />
      {/* beard — dark */}
      <rect x="8"  y="12" width="16" height="4"  fill="#2a1a0a" />
      <rect x="9"  y="10" width="3"  height="3"  fill="#2a1a0a" />
      <rect x="20" y="10" width="3"  height="3"  fill="#2a1a0a" />
      {/* eyes */}
      <rect x="11" y="7"  width="3"  height="3"  fill="#111" />
      <rect x="18" y="7"  width="3"  height="3"  fill="#111" />
      {/* MUSTARD YELLOW fitted snapback hat */}
      {/* brim */}
      <rect x="4"  y="3"  width="24" height="2"  fill="#c8a020" />
      <rect x="4"  y="4"  width="24" height="1"  fill="#a07810" />
      {/* crown */}
      <rect x="6"  y="-2" width="20" height="6"  fill="#c8a020" />
      <rect x="8"  y="-2" width="16" height="4"  fill="#d4b030" />
      {/* sides hug head */}
      <rect x="5"  y="0"  width="3"  height="4"  fill="#c8a020" />
      <rect x="24" y="0"  width="3"  height="4"  fill="#c8a020" />
      {/* underside stripe */}
      <rect x="5"  y="3"  width="22" height="1"  fill="#a07810" />
      {/* top button */}
      <rect x="14" y="-2" width="4"  height="1"  fill="#b89018" />
    </svg>
  );
}

// ── KYLE — green zip fleece, short hair, glasses ─────────────
export function CharRight({ size = 64, animate = true, delay = '0.5s' }) {
  return (
    <svg width={size} height={Math.round(size * 1.47)} viewBox="0 0 32 47"
      style={{ imageRendering:'pixelated', display:'block',
        animation: animate ? `bob 1.3s ease-in-out ${delay} infinite` : 'none' }}>
      {/* brown hiking shoes */}
      <rect x="5"  y="43" width="9" height="3" fill="#5D4037" />
      <rect x="18" y="43" width="9" height="3" fill="#5D4037" />
      {/* dark pants */}
      <rect x="7"  y="30" width="7" height="13" fill="#283040" />
      <rect x="18" y="30" width="7" height="13" fill="#283040" />
      {/* green zip fleece */}
      <rect x="5"  y="15" width="22" height="16" fill="#3D5A2A" />
      <rect x="15" y="15" width="2"  height="16" fill="#2D4A1E" />
      {/* collar */}
      <rect x="11" y="14" width="10" height="3"  fill="#2D4A1E" />
      {/* Patagonia patch */}
      <rect x="6"  y="17" width="6"  height="4"  fill="#4A6B30" opacity="0.9" />
      <rect x="7"  y="18" width="4"  height="2"  fill="#D4A017" opacity="0.5" />
      {/* arms */}
      <rect x="1"  y="15" width="5"  height="14" fill="#3D5A2A" />
      <rect x="26" y="15" width="5"  height="14" fill="#3D5A2A" />
      {/* hands */}
      <rect x="1"  y="28" width="5"  height="3"  fill="#E0C090" />
      <rect x="26" y="28" width="5"  height="3"  fill="#E0C090" />
      {/* neck */}
      <rect x="13" y="11" width="6"  height="5"  fill="#E0C090" />
      {/* head */}
      <rect x="8"  y="2"  width="16" height="13" fill="#E0C090" />
      {/* SHORT hair — just top strip + small sideburns */}
      <rect x="8"  y="2"  width="16" height="3"  fill="#6B4C2A" />
      <rect x="8"  y="4"  width="2"  height="5"  fill="#6B4C2A" />
      <rect x="22" y="4"  width="2"  height="5"  fill="#6B4C2A" />
      {/* eyes */}
      <rect x="11" y="8"  width="3"  height="3"  fill="#1a1a1a" />
      <rect x="18" y="8"  width="3"  height="3"  fill="#1a1a1a" />
      {/* glasses */}
      <rect x="10" y="7"  width="5"  height="5"  fill="none" stroke="#6B4C2A" strokeWidth="0.9" />
      <rect x="17" y="7"  width="5"  height="5"  fill="none" stroke="#6B4C2A" strokeWidth="0.9" />
      <rect x="15" y="9"  width="2"  height="1"  fill="#6B4C2A" />
    </svg>
  );
}
