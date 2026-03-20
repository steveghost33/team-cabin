import TCLogo from './TCLogo';
import { C } from '../data/constants';

const navLinks = [
  { id: 'home',  l: 'Home' },
  { id: 'music', l: 'Music' },
  { id: 'shows', l: 'Shows' },
  { id: 'band',  l: 'The Band' },
  { id: 'game',  l: '🍕 Game' },
];

export default function Nav({ scrollTo }) {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 500,
      background: '#1C3D12',
      borderBottom: `4px solid #E2A820`,
      boxShadow: `0 4px 0 #000`,
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 58,
      }}>
        <div onClick={() => scrollTo('home')} style={{ cursor: 'pointer' }}>
          <TCLogo size={44} />
        </div>
        <div style={{ display: 'flex', gap: '0.1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {navLinks.map((n) => (
            <button key={n.id} onClick={() => scrollTo(n.id)} style={{
              background: 'none', border: 'none',
              color: '#F5F0DC',
              fontFamily: '"Press Start 2P"', fontSize: '0.55rem',
              letterSpacing: '0.05em', padding: '0.5rem 0.65rem', cursor: 'pointer',
            }}
              onMouseEnter={e => { e.target.style.color = '#E2A820'; }}
              onMouseLeave={e => { e.target.style.color = '#F5F0DC'; }}
            >{n.l}</button>
          ))}
        </div>
      </div>
    </nav>
  );
}