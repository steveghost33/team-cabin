import { useState } from 'react';
import TCLogo from './TCLogo';
import { C, SOCIAL_LINKS } from '../data/constants';

// 8-bit pixel SVG icons — drawn on a 16×16 grid using <rect> only
const ICONS = {
  Instagram: () => (
    <svg viewBox="0 0 16 16" width="32" height="32" style={{ imageRendering: 'pixelated' }}>
      {/* outer rounded square */}
      <rect x="2" y="2" width="12" height="12" fill="currentColor" />
      <rect x="3" y="1" width="10" height="1" fill="currentColor" />
      <rect x="3" y="14" width="10" height="1" fill="currentColor" />
      <rect x="1" y="3" width="1" height="10" fill="currentColor" />
      <rect x="14" y="3" width="1" height="10" fill="currentColor" />
      {/* inner cutout */}
      <rect x="3" y="3" width="10" height="10" fill="#030a02" />
      {/* circle ring */}
      <rect x="5" y="4" width="6" height="1" fill="currentColor" />
      <rect x="5" y="11" width="6" height="1" fill="currentColor" />
      <rect x="4" y="5" width="1" height="6" fill="currentColor" />
      <rect x="11" y="5" width="1" height="6" fill="currentColor" />
      {/* circle inner fill cutout */}
      <rect x="5" y="5" width="6" height="6" fill="#030a02" />
      {/* circle center dot */}
      <rect x="6" y="6" width="4" height="4" fill="currentColor" />
      <rect x="7" y="7" width="2" height="2" fill="#030a02" />
      {/* top-right dot */}
      <rect x="11" y="4" width="1" height="1" fill="currentColor" />
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 16 16" width="32" height="32" style={{ imageRendering: 'pixelated' }}>
      {/* f letter */}
      <rect x="6" y="2" width="5" height="1" fill="currentColor" />
      <rect x="5" y="3" width="1" height="2" fill="currentColor" />
      <rect x="6" y="3" width="4" height="1" fill="currentColor" />
      <rect x="5" y="5" width="7" height="2" fill="currentColor" />
      <rect x="5" y="7" width="3" height="7" fill="currentColor" />
    </svg>
  ),
  Threads: () => (
    <svg viewBox="0 0 16 16" width="32" height="32" style={{ imageRendering: 'pixelated' }}>
      {/* @ symbol-ish threads icon */}
      <rect x="5" y="4" width="6" height="1" fill="currentColor" />
      <rect x="4" y="5" width="1" height="4" fill="currentColor" />
      <rect x="11" y="5" width="1" height="2" fill="currentColor" />
      <rect x="5" y="8" width="6" height="1" fill="currentColor" />
      <rect x="6" y="5" width="4" height="3" fill="currentColor" />
      <rect x="7" y="6" width="2" height="1" fill="#030a02" />
      <rect x="6" y="9" width="5" height="1" fill="currentColor" />
      <rect x="11" y="9" width="1" height="2" fill="currentColor" />
      <rect x="5" y="11" width="6" height="1" fill="currentColor" />
      <rect x="4" y="9" width="1" height="2" fill="currentColor" />
      {/* tail */}
      <rect x="8" y="12" width="2" height="2" fill="currentColor" />
    </svg>
  ),
  'Twitter / X': () => (
    <svg viewBox="0 0 16 16" width="32" height="32" style={{ imageRendering: 'pixelated' }}>
      {/* X shape */}
      <rect x="2"  y="2"  width="2" height="2" fill="currentColor" />
      <rect x="4"  y="4"  width="2" height="2" fill="currentColor" />
      <rect x="6"  y="6"  width="4" height="2" fill="currentColor" />
      <rect x="8"  y="4"  width="2" height="2" fill="currentColor" />
      <rect x="10" y="2"  width="2" height="2" fill="currentColor" />
      <rect x="4"  y="8"  width="2" height="2" fill="currentColor" />
      <rect x="2"  y="10" width="2" height="2" fill="currentColor" />
      <rect x="8"  y="8"  width="2" height="2" fill="currentColor" />
      <rect x="10" y="10" width="2" height="2" fill="currentColor" />
      <rect x="12" y="12" width="2" height="2" fill="currentColor" />
    </svg>
  ),
  TikTok: () => (
    <svg viewBox="0 0 16 16" width="32" height="32" style={{ imageRendering: 'pixelated' }}>
      {/* note shape */}
      <rect x="7" y="2"  width="4" height="1" fill="currentColor" />
      <rect x="10" y="2" width="1" height="4" fill="currentColor" />
      <rect x="7" y="3"  width="1" height="7" fill="currentColor" />
      {/* circle bottom */}
      <rect x="5" y="9"  width="4" height="1" fill="currentColor" />
      <rect x="4" y="10" width="1" height="2" fill="currentColor" />
      <rect x="9" y="10" width="1" height="2" fill="currentColor" />
      <rect x="5" y="12" width="4" height="1" fill="currentColor" />
    </svg>
  ),
  YouTube: () => (
    <svg viewBox="0 0 16 16" width="32" height="32" style={{ imageRendering: 'pixelated' }}>
      {/* rounded rect */}
      <rect x="1" y="4"  width="14" height="8" fill="currentColor" />
      <rect x="2" y="3"  width="12" height="1" fill="currentColor" />
      <rect x="2" y="12" width="12" height="1" fill="currentColor" />
      {/* inner cutout */}
      <rect x="2" y="5"  width="12" height="6" fill="#030a02" />
      {/* play triangle */}
      <rect x="6"  y="6"  width="1" height="4" fill="currentColor" />
      <rect x="7"  y="7"  width="1" height="2" fill="currentColor" />
      <rect x="8"  y="7"  width="1" height="2" fill="currentColor" />
      <rect x="9"  y="7"  width="1" height="2" fill="currentColor" />
      <rect x="10" y="8"  width="1" height="1" fill="currentColor" />
    </svg>
  ),
};

function SocialIcon({ label, url }) {
  const [hovered, setHovered] = useState(false);
  const IconComp = ICONS[label];
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        color: hovered ? C.gold : C.goldL,
        textDecoration: 'none',
        transition: 'color 0.15s',
      }}
    >
      {IconComp ? <IconComp /> : null}
      <span style={{ fontFamily: '"VT323"', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
        {label}
      </span>
    </a>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        background: '#030a02',
        borderTop: `3px solid rgba(212,160,23,0.25)`,
        padding: '3rem 2rem',
        textAlign: 'center',
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '1.5rem', filter: `drop-shadow(0 0 12px ${C.goldD})` }}>
        <TCLogo size={120} />
      </div>

      {/* Social icons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
        }}
      >
        {SOCIAL_LINKS.map((l) => (
          <SocialIcon key={l.label} label={l.label} url={l.url} />
        ))}
      </div>

      <p
        style={{
          fontFamily: '"Press Start 2P"',
          fontSize: '0.35rem',
          color: 'rgba(212,160,23,0.28)',
          letterSpacing: '0.08em',
        }}
      >
        © 2026 TEAM CABIN · DETROIT, MI · ALL RIGHTS RESERVED
      </p>
      <p
        style={{
          fontFamily: '"VT323"',
          fontSize: '1rem',
          color: 'rgba(212,160,23,0.28)',
          marginTop: '0.4rem',
        }}
      >
        No pizza was harmed in the making of this website 🍕
      </p>
    </footer>
  );
}
