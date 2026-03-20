// ─────────────────────────────────────
//  Characters.jsx — 8-bit pixel SVG
//  viewBox 0 0 32 32 — fits any box
// ─────────────────────────────────────

// STEVE — plaid flannel, sandy beard, glasses
export function CharLeft({ size = 64, animate = true, delay = '0s' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32"
      style={{ imageRendering:'pixelated', display:'block',
        animation: animate ? `bob 1.3s ease-in-out ${delay} infinite` : 'none' }}>
      {/* shoes */}
      <rect x="5"  y="29" width="8" height="3" fill="#111" />
      <rect x="19" y="29" width="8" height="3" fill="#111" />
      {/* pants */}
      <rect x="6"  y="20" width="7" height="10" fill="#1c1c2c" />
      <rect x="19" y="20" width="7" height="10" fill="#1c1c2c" />
      {/* belt */}
      <rect x="6"  y="19" width="20" height="2" fill="#3a2a10" />
      <rect x="13" y="19" width="6"  height="2" fill="#c8a020" />
      {/* plaid body */}
      <rect x="4"  y="10" width="24" height="10" fill="#848688" />
      <rect x="4"  y="12" width="24" height="1" fill="#5a5c5e" opacity="0.5" />
      <rect x="4"  y="15" width="24" height="1" fill="#5a5c5e" opacity="0.5" />
      <rect x="4"  y="18" width="24" height="1" fill="#5a5c5e" opacity="0.5" />
      <rect x="8"  y="10" width="2"  height="10" fill="#5a5c5e" opacity="0.45" />
      <rect x="14" y="10" width="2"  height="10" fill="#5a5c5e" opacity="0.45" />
      <rect x="20" y="10" width="2"  height="10" fill="#5a5c5e" opacity="0.45" />
      {/* inner shirt */}
      <rect x="13" y="10" width="6"  height="4" fill="#4a6030" />
      {/* arms */}
      <rect x="0"  y="10" width="5" height="8" fill="#848688" />
      <rect x="27" y="10" width="5" height="8" fill="#848688" />
      {/* hands */}
      <rect x="0"  y="17" width="5" height="3" fill="#e0c090" />
      <rect x="27" y="17" width="5" height="3" fill="#e0c090" />
      {/* neck */}
      <rect x="13" y="7"  width="6" height="4" fill="#e0c090" />
      {/* head */}
      <rect x="8"  y="1"  width="16" height="9" fill="#e0c090" />
      {/* sandy short hair */}
      <rect x="8"  y="1"  width="16" height="3" fill="#9a7a45" />
      {/* beard */}
      <rect x="8"  y="7"  width="16" height="4" fill="#9a7a45" />
      <rect x="9"  y="6"  width="3"  height="2" fill="#9a7a45" />
      <rect x="20" y="6"  width="3"  height="2" fill="#9a7a45" />
      {/* eyes */}
      <rect x="11" y="4"  width="3" height="3" fill="#1a1a1a" />
      <rect x="18" y="4"  width="3" height="3" fill="#1a1a1a" />
      <rect x="11" y="4"  width="1" height="1" fill="#fff" opacity="0.5" />
      <rect x="18" y="4"  width="1" height="1" fill="#fff" opacity="0.5" />
      {/* glasses */}
      <rect x="10" y="3"  width="5" height="4" fill="none" stroke="#7a6535" strokeWidth="0.8" />
      <rect x="17" y="3"  width="5" height="4" fill="none" stroke="#7a6535" strokeWidth="0.8" />
      <rect x="15" y="5"  width="2" height="1" fill="#7a6535" />
    </svg>
  );
}

// MIKE — plain grey hoodie NO logo, MUSTARD YELLOW fitted cap, maroon pants, dark shoes
export function CharMid({ size = 64, animate = true, delay = '0.25s' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32"
      style={{ imageRendering:'pixelated', display:'block',
        animation: animate ? `bob 1.3s ease-in-out ${delay} infinite` : 'none' }}>
      {/* dark shoes */}
      <rect x="5"  y="29" width="8" height="3" fill="#1a1a1a" />
      <rect x="19" y="29" width="8" height="3" fill="#1a1a1a" />
      {/* maroon pants */}
      <rect x="6"  y="20" width="7" height="10" fill="#7B2D3A" />
      <rect x="19" y="20" width="7" height="10" fill="#7B2D3A" />
      <rect x="8"  y="20" width="3" height="5"  fill="#9a3a4a" />
      <rect x="21" y="20" width="3" height="5"  fill="#9a3a4a" />
      {/* belt */}
      <rect x="6"  y="19" width="20" height="2" fill="#222" />
      {/* plain grey hoodie — NO graphic */}
      <rect x="4"  y="10" width="24" height="10" fill="#9a9a9a" />
      <rect x="4"  y="10" width="24" height="3"  fill="#b0b0b0" />
      <rect x="4"  y="17" width="24" height="3"  fill="#888" />
      {/* pocket */}
      <rect x="9"  y="15" width="14" height="4" fill="#888" />
      <rect x="9"  y="15" width="14" height="1" fill="#777" />
      {/* center seam */}
      <rect x="15" y="10" width="2"  height="10" fill="#878787" />
      {/* arms */}
      <rect x="0"  y="10" width="5" height="8" fill="#9a9a9a" />
      <rect x="27" y="10" width="5" height="8" fill="#9a9a9a" />
      <rect x="0"  y="16" width="5" height="2" fill="#888" />
      <rect x="27" y="16" width="5" height="2" fill="#888" />
      {/* hands */}
      <rect x="0"  y="17" width="5" height="3" fill="#c49a6c" />
      <rect x="27" y="17" width="5" height="3" fill="#c49a6c" />
      {/* neck */}
      <rect x="13" y="7"  width="6" height="4" fill="#c49a6c" />
      {/* head */}
      <rect x="8"  y="1"  width="16" height="9" fill="#c49a6c" />
      <rect x="10" y="1"  width="12" height="4" fill="#d4aa7c" />
      {/* dark beard */}
      <rect x="8"  y="7"  width="16" height="4" fill="#1a0f05" />
      <rect x="9"  y="6"  width="3"  height="2" fill="#1a0f05" />
      <rect x="20" y="6"  width="3"  height="2" fill="#1a0f05" />
      {/* eyes */}
      <rect x="11" y="4"  width="3" height="3" fill="#111" />
      <rect x="18" y="4"  width="3" height="3" fill="#111" />
      <rect x="11" y="4"  width="1" height="1" fill="#fff" opacity="0.4" />
      <rect x="18" y="4"  width="1" height="1" fill="#fff" opacity="0.4" />

      {/* MUSTARD YELLOW fitted cap — tight to head, small flat brim */}
      {/* crown — hugs head */}
      <rect x="7"  y="-1" width="18" height="5" fill="#c8a020" />
      <rect x="9"  y="-1" width="14" height="3" fill="#d8b030" />
      {/* sides hug head */}
      <rect x="5"  y="0"  width="4"  height="4" fill="#c8a020" />
      <rect x="23" y="0"  width="4"  height="4" fill="#c8a020" />
      {/* underside of crown — darker */}
      <rect x="5"  y="3"  width="22" height="1" fill="#a07810" />
      {/* small flat brim */}
      <rect x="4"  y="3"  width="24" height="2" fill="#c8a020" />
      <rect x="4"  y="4"  width="24" height="1" fill="#a07810" />
      {/* button on top */}
      <rect x="14" y="-1" width="4"  height="1" fill="#b89018" />
      {/* snapback strap detail */}
      <rect x="11" y="3"  width="10" height="1" fill="#b89018" />
    </svg>
  );
}

// KYLE — dark olive zip fleece, SHORT brown hair (tight to head), glasses, dark pants, brown boots
export function CharRight({ size = 64, animate = true, delay = '0.5s' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32"
      style={{ imageRendering:'pixelated', display:'block',
        animation: animate ? `bob 1.3s ease-in-out ${delay} infinite` : 'none' }}>
      {/* brown boots */}
      <rect x="5"  y="29" width="8" height="3" fill="#5a3a20" />
      <rect x="19" y="29" width="8" height="3" fill="#5a3a20" />
      <rect x="5"  y="31" width="8" height="1" fill="#7a5a40" />
      <rect x="19" y="31" width="8" height="1" fill="#7a5a40" />
      {/* dark pants */}
      <rect x="6"  y="20" width="7" height="10" fill="#2a2a3a" />
      <rect x="19" y="20" width="7" height="10" fill="#2a2a3a" />
      <rect x="8"  y="20" width="3" height="5"  fill="#383848" />
      <rect x="21" y="20" width="3" height="5"  fill="#383848" />
      {/* belt */}
      <rect x="6"  y="19" width="20" height="2" fill="#3a3020" />
      {/* dark olive green zip fleece */}
      <rect x="4"  y="10" width="24" height="10" fill="#3a5a28" />
      <rect x="4"  y="10" width="24" height="3"  fill="#4a6a38" />
      <rect x="4"  y="17" width="24" height="3"  fill="#2a4a18" />
      {/* zip line */}
      <rect x="15" y="10" width="2"  height="10" fill="#2a4a18" />
      <rect x="15" y="11" width="2"  height="8"  fill="#888" />
      {/* small chest patch */}
      <rect x="5"  y="12" width="7" height="5" fill="#4a7a30" />
      <rect x="6"  y="13" width="5" height="2" fill="#E2A820" />
      <rect x="6"  y="14" width="5" height="1" fill="#fff" opacity="0.6" />
      {/* collar */}
      <rect x="12" y="9"  width="8" height="3" fill="#2a4a18" />
      {/* arms */}
      <rect x="0"  y="10" width="5" height="8" fill="#3a5a28" />
      <rect x="27" y="10" width="5" height="8" fill="#3a5a28" />
      <rect x="0"  y="16" width="5" height="2" fill="#2a4a18" />
      <rect x="27" y="16" width="5" height="2" fill="#2a4a18" />
      {/* hands */}
      <rect x="0"  y="17" width="5" height="3" fill="#d4a870" />
      <rect x="27" y="17" width="5" height="3" fill="#d4a870" />
      {/* neck */}
      <rect x="13" y="7"  width="6" height="4" fill="#d4a870" />
      {/* head */}
      <rect x="8"  y="1"  width="16" height="10" fill="#d4a870" />
      <rect x="10" y="2"  width="12" height="4" fill="#e4b880" />
      {/* SHORT brown hair — thin strip on top only, tiny sideburns, NO long sides */}
      <rect x="8"  y="1"  width="16" height="3" fill="#6B4020" />
      <rect x="10" y="1"  width="12" height="1" fill="#7B5030" />
      {/* tiny sideburns — 2px only */}
      <rect x="8"  y="3"  width="2"  height="2" fill="#6B4020" />
      <rect x="22" y="3"  width="2"  height="2" fill="#6B4020" />
      {/* light stubble */}
      <rect x="10" y="8"  width="12" height="2" fill="#8a6030" opacity="0.2" />
      {/* eyes */}
      <rect x="11" y="4"  width="3" height="3" fill="#1a1a1a" />
      <rect x="18" y="4"  width="3" height="3" fill="#1a1a1a" />
      <rect x="11" y="4"  width="1" height="1" fill="#fff" opacity="0.35" />
      <rect x="18" y="4"  width="1" height="1" fill="#fff" opacity="0.35" />
      {/* glasses — brown frames */}
      <rect x="10" y="3"  width="5" height="4" fill="none" stroke="#8B6040" strokeWidth="0.8" />
      <rect x="17" y="3"  width="5" height="4" fill="none" stroke="#8B6040" strokeWidth="0.8" />
      <rect x="15" y="5"  width="2" height="1" fill="#8B6040" />
    </svg>
  );
}
