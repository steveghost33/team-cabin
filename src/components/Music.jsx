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
            display: 'flex', alignItems: 'center', gap: '0.9rem',
            padding: '1rem 1.2rem', textDecoration: 'none',
            border: `3px solid ${m.color}`,
            background: C.green,
            boxShadow: '4px 4px 0 #000',
            transition: 'transform 0.08s, box-shadow 0.08s',
            position: 'relative', overflow: 'hidden',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translate(-3px,-3px)'; e.currentTarget.style.boxShadow='6px 6px 0 #000'; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='4px 4px 0 #000'; }}
          >
            {/* left color bar */}
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:4, background:m.color }} />
            <span style={{ fontSize: '1.5rem', flexShrink: 0, marginLeft: 4 }}>{m.icon}</span>
            <div>
              <div style={{ fontFamily: '"Press Start 2P"', fontSize: '0.42rem', color: m.color, marginBottom: '0.25rem' }}>{m.name}</div>
              <div style={{ fontFamily: '"VT323"', fontSize: '1.2rem', color: C.cream }}>Listen →</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
