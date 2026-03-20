import TCLogo from './TCLogo';
import { C, SOCIAL_LINKS } from '../data/constants';

export default function Footer() {
  return (
    <footer style={{
      background: '#080808',
      borderTop: `3px solid rgba(212,160,23,0.2)`,
      padding: '3rem 2rem', textAlign: 'center',
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <TCLogo size={100} />
      </div>
      <div style={{
        display: 'flex', justifyContent: 'center',
        gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem',
        maxWidth: 700, margin: '0 auto 2rem',
      }}>
        {SOCIAL_LINKS.map((l) => (
          <a key={l.label} href={l.url} style={{
            fontFamily: '"Press Start 2P"', fontSize: '0.35rem',
            color: C.goldL, textDecoration: 'none',
            border: `2px solid rgba(212,160,23,0.25)`,
            background: '#111',
            padding: '5px 8px',
            boxShadow: '2px 2px 0 #000',
            transition: 'transform 0.08s, color 0.08s, border-color 0.08s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translate(-2px,-2px)';
              e.currentTarget.style.color = C.gold;
              e.currentTarget.style.borderColor = C.gold;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.color = C.goldL;
              e.currentTarget.style.borderColor = 'rgba(212,160,23,0.25)';
            }}
          >{l.label}</a>
        ))}
      </div>
      <div style={{ height: 2, background: `repeating-linear-gradient(90deg,${C.goldD} 0,${C.goldD} 6px,transparent 6px,transparent 12px)`, marginBottom: '1.5rem', maxWidth: 400, margin: '0 auto 1.5rem' }} />
      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.3rem', color: 'rgba(212,160,23,0.25)', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
        © 2026 TEAM CABIN · DETROIT, MI · ALL RIGHTS RESERVED
      </p>
      <p style={{ fontFamily: '"VT323"', fontSize: '1rem', color: 'rgba(212,160,23,0.2)' }}>
        No pizza was harmed in the making of this website 🍕
      </p>
    </footer>
  );
}