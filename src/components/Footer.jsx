// ─────────────────────────────────────
//  Footer.jsx
//  Site footer with logo and social links.
//  Edit social links in src/data/constants.js
// ─────────────────────────────────────
import TCLogo from './TCLogo';
import { C, SOCIAL_LINKS } from '../data/constants';

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

      {/* Social links */}
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
          <a
            key={l.label}
            href={l.url}
            style={{ fontFamily: '"VT323"', fontSize: '1.25rem', color: C.goldL, textDecoration: 'none' }}
            onMouseEnter={(e) => (e.target.style.color = C.gold)}
            onMouseLeave={(e) => (e.target.style.color = C.goldL)}
          >
            {l.label}
          </a>
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
