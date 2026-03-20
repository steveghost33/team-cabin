import SectionTitle from './SectionTitle';
import { C, MUSIC_LINKS } from '../data/constants';

export default function Music() {
  return (
    <section id="music" style={{ padding: '5rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
      <SectionTitle>FIND OUR MUSIC</SectionTitle>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.8rem',
      }}>
        {MUSIC_LINKS.map((m) => (
          <a key={m.name} href={m.url} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: '0.8rem',
            padding: '1rem 1.2rem', textDecoration: 'none',
            border: `3px solid ${m.color}`,
            background: '#1C3D12',
            boxShadow: '4px 4px 0 #000',
            transition: 'transform 0.08s, box-shadow 0.08s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translate(-3px,-3px)'; e.currentTarget.style.boxShadow='6px 6px 0 #000'; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='4px 4px 0 #000'; }}
          >
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{m.icon}</span>
            <div>
              <div style={{ fontFamily: '"Press Start 2P"', fontSize: '0.42rem', color: m.color, marginBottom: '0.25rem' }}>{m.name}</div>
              <div style={{ fontFamily: '"VT323"', fontSize: '1.2rem', color: '#F5F0DC' }}>Listen →</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}