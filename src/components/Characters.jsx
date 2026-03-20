// ─────────────────────────────────────
//  Characters.jsx
//  Pixel-art SVG characters based on
//  the real band photo.
//
//  Props:
//    size    – base size in px (height = size × 1.47)
//    animate – true/false bobbing animation
//    delay   – CSS animation-delay string e.g. '0.25s'
//
//  Usage:
//    <CharLeft  size={80} animate delay="0s" />
//    <CharMid   size={80} animate delay="0.25s" />
//    <CharRight size={80} animate delay="0.5s" />
// ─────────────────────────────────────

// ── STEVE — plaid flannel shirt, beard, glasses ──
export function CharLeft({ size = 64, animate = true, delay = '0s' }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.47)}
      viewBox="0 0 32 47"
      style={{
        imageRendering: 'pixelated',
        display: 'block',
        animation: animate ? `bob 1.3s ease-in-out ${delay} infinite` : 'none',
      }}
    >
      {/* shoes */}
      <rect x="6"  y="43" width="8" height="3" fill="#111" />
      <rect x="18" y="43" width="8" height="3" fill="#111" />
      {/* black pants */}
      <rect x="7"  y="30" width="7" height="13" fill="#1c1c2c" />
      <rect x="18" y="30" width="7" height="13" fill="#1c1c2c" />
      {/* plaid body */}
      <rect x="5" y="16" width="22" height="15" fill="#848688" />
      <rect x="5" y="19" width="22" height="2"  fill="#5a5c5e" opacity="0.5" />
      <rect x="5" y="24" width="22" height="2"  fill="#5a5c5e" opacity="0.5" />
      <rect x="5" y="29" width="22" height="1"  fill="#5a5c5e" opacity="0.5" />
      <rect x="9"  y="16" width="2" height="15" fill="#5a5c5e" opacity="0.45" />
      <rect x="15" y="16" width="2" height="15" fill="#5a5c5e" opacity="0.45" />
      <rect x="21" y="16" width="2" height="15" fill="#5a5c5e" opacity="0.45" />
      {/* inner shirt */}
      <rect x="13" y="16" width="6" height="4" fill="#4a6030" />
      {/* arms */}
      <rect x="1"  y="16" width="5" height="11" fill="#848688" />
      <rect x="26" y="16" width="5" height="11" fill="#848688" />
      {/* hands */}
      <rect x="1"  y="26" width="5" height="3" fill="#e0c090" />
      <rect x="26" y="26" width="5" height="3" fill="#e0c090" />
      {/* neck */}
      <rect x="13" y="12" width="6" height="5" fill="#e0c090" />
      {/* head */}
      <rect x="8"  y="2"  width="16" height="14" fill="#e0c090" />
      <rect x="8"  y="2"  width="16" height="3"  fill="#8a7045" opacity="0.35" />
      {/* beard */}
      <rect x="8"  y="13" width="16" height="3" fill="#8a7045" />
      <rect x="9"  y="11" width="3"  height="3" fill="#8a7045" />
      <rect x="20" y="11" width="3"  height="3" fill="#8a7045" />
      {/* eyes */}
      <rect x="11" y="8" width="3" height="3" fill="#1a1a1a" />
      <rect x="18" y="8" width="3" height="3" fill="#1a1a1a" />
      {/* glasses */}
      <rect x="10" y="7" width="5" height="5" fill="none" stroke="#7a6535" strokeWidth="0.9" />
      <rect x="17" y="7" width="5" height="5" fill="none" stroke="#7a6535" strokeWidth="0.9" />
      <rect x="15" y="9" width="2" height="1" fill="#7a6535" />
    </svg>
  );
}

// ── MIKE — solid grey hoodie no logo, mustard yellow snapback, dark grey shoes, maroon pants ──
export function CharMid({ size = 64, animate = true, delay = '0.25s' }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.47)}
      viewBox="0 0 32 47"
      style={{
        imageRendering: 'pixelated',
        display: 'block',
        animation: animate ? `bob 1.3s ease-in-out ${delay} infinite` : 'none',
      }}
    >
      {/* shoes — dark grey, different from Steve's pure black */}
      <rect x="6"  y="43" width="8" height="3" fill="#2a2a2a" />
      <rect x="18" y="43" width="8" height="3" fill="#2a2a2a" />
      <rect x="5"  y="45" width="10" height="1" fill="#1a1a1a" />
      <rect x="17" y="45" width="10" height="1" fill="#1a1a1a" />
      {/* maroon pants */}
      <rect x="7"  y="30" width="7" height="13" fill="#7B2D3A" />
      <rect x="18" y="30" width="7" height="13" fill="#7B2D3A" />
      {/* solid grey hoodie body — NO graphic, NO logo */}
      <rect x="4"  y="15" width="24" height="16" fill="#9a9a9a" />
      {/* hoodie bottom ribbing */}
      <rect x="8"  y="27" width="16" height="4"  fill="#888" />
      {/* center seam only */}
      <rect x="15" y="15" width="2"  height="16" fill="#888" />
      {/* arms */}
      <rect x="0"  y="15" width="5" height="13" fill="#9a9a9a" />
      <rect x="27" y="15" width="5" height="13" fill="#9a9a9a" />
      {/* sleeve cuffs */}
      <rect x="0"  y="26" width="5" height="2"  fill="#888" />
      <rect x="27" y="26" width="5" height="2"  fill="#888" />
      {/* hands */}
      <rect x="0"  y="27" width="5" height="3" fill="#c49a6c" />
      <rect x="27" y="27" width="5" height="3" fill="#c49a6c" />
      {/* neck */}
      <rect x="13" y="11" width="6" height="5" fill="#c49a6c" />
      {/* head */}
      <rect x="8"  y="2"  width="16" height="13" fill="#c49a6c" />
      {/* beard */}
      <rect x="8"  y="12" width="16" height="4"  fill="#1a0f05" />
      <rect x="9"  y="10" width="3"  height="3"  fill="#1a0f05" />
      <rect x="20" y="10" width="3"  height="3"  fill="#1a0f05" />
      {/* eyes */}
      <rect x="11" y="7" width="3" height="3" fill="#111" />
      <rect x="18" y="7" width="3" height="3" fill="#111" />
      <rect x="11" y="7" width="1" height="1" fill="#fff" opacity="0.5" />
      <rect x="18" y="7" width="1" height="1" fill="#fff" opacity="0.5" />
      {/* MUSTARD YELLOW SNAPBACK — wide flat brim */}
      {/* crown */}
      <rect x="7"  y="0"  width="18" height="7"  fill="#c8a020" />
      {/* crown sides */}
      <rect x="5"  y="1"  width="3"  height="5"  fill="#c8a020" />
      <rect x="24" y="1"  width="3"  height="5"  fill="#c8a020" />
      {/* button on top */}
      <rect x="13" y="0"  width="6"  height="1"  fill="#b89018" />
      {/* wide flat brim — extends past both sides */}
      <rect x="2"  y="6"  width="28" height="3"  fill="#c8a020" />
      {/* brim underside shadow */}
      <rect x="2"  y="8"  width="28" height="1"  fill="#a07810" />
      {/* snapback back strap */}
      <rect x="12" y="6"  width="8"  height="2"  fill="#b89018" />
    </svg>
  );
}

// ── KYLE — green zip fleece, longish hair, glasses ──
export function CharRight({ size = 64, animate = true, delay = '0.5s' }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.47)}
      viewBox="0 0 32 47"
      style={{
        imageRendering: 'pixelated',
        display: 'block',
        animation: animate ? `bob 1.3s ease-in-out ${delay} infinite` : 'none',
      }}
    >
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
      <rect x="11" y="14" width="10" height="3" fill="#2D4A1E" />
      {/* Patagonia patch */}
      <rect x="6"  y="17" width="6" height="4" fill="#4A6B30" opacity="0.9" />
      <rect x="7"  y="18" width="4" height="2" fill="#D4A017" opacity="0.5" />
      {/* arms */}
      <rect x="1"  y="15" width="5" height="14" fill="#3D5A2A" />
      <rect x="26" y="15" width="5" height="14" fill="#3D5A2A" />
      {/* hands */}
      <rect x="1"  y="28" width="5" height="3" fill="#E0C090" />
      <rect x="26" y="28" width="5" height="3" fill="#E0C090" />
      {/* neck */}
      <rect x="13" y="11" width="6" height="5" fill="#E0C090" />
      {/* head */}
      <rect x="8"  y="2"  width="16" height="13" fill="#E0C090" />
      {/* hair */}
      <rect x="8"  y="2"  width="16" height="3" fill="#6B4C2A" />
      <rect x="6"  y="3"  width="3"  height="8" fill="#6B4C2A" />
      <rect x="23" y="3"  width="3"  height="8" fill="#6B4C2A" />
      {/* eyes */}
      <rect x="11" y="8" width="3" height="3" fill="#1a1a1a" />
      <rect x="18" y="8" width="3" height="3" fill="#1a1a1a" />
      {/* glasses */}
      <rect x="10" y="7" width="5" height="5" fill="none" stroke="#6B4C2A" strokeWidth="0.9" />
      <rect x="17" y="7" width="5" height="5" fill="none" stroke="#6B4C2A" strokeWidth="0.9" />
      <rect x="15" y="9" width="2" height="1" fill="#6B4C2A" />
      {/* nose + smile */}
      <rect x="15" y="12" width="2" height="1" fill="#C09060" />
      <rect x="11" y="13" width="10" height="1" fill="#C09060" />
    </svg>
  );
}