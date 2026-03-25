// ─────────────────────────────────────
//  Nav.jsx
//  Sticky top navigation bar.
//  Edit nav links in the navLinks array.
// ─────────────────────────────────────
import TCLogo from './TCLogo';
import { C } from '../data/constants';

const navLinks = [
  { id: 'home',  l: 'Home' },
  { id: 'music', l: 'Music' },
  { id: 'shows', l: 'Shows' },
  { id: 'band',  l: 'The Band' },
  { id: 'game',  l: '🍕 Pizza Quest' },
];

export default function Nav({ scrollTo }) {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 500,
        background: 'rgba(10,22,6,0.97)',
        borderBottom: `3px solid ${C.gold}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 60,
        }}
      >
        {/* Logo — click to scroll home */}
        <div onClick={() => scrollTo('home')} style={{ cursor: 'pointer' }}>
          <TCLogo size={48} />
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '0.1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {navLinks.map((n) => (
            <button
              key={n.id}
              onClick={() => scrollTo(n.id)}
              style={{
                background: 'none',
                border: 'none',
                color: C.cream,
                fontFamily: '"Press Start 2P"',
                fontSize: '0.65rem',
                letterSpacing: '0.07em',
                padding: '0.5rem 0.75rem',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.target.style.color = C.gold)}
              onMouseLeave={(e) => (e.target.style.color = C.cream)}
            >
              {n.l}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
