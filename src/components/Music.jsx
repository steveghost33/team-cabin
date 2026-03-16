// ─────────────────────────────────────
//  Music.jsx
//  Streaming platform links grid.
//  Edit links in src/data/constants.js
// ─────────────────────────────────────
import SectionTitle from './SectionTitle';
import { C, MUSIC_LINKS } from '../data/constants';

export default function Music() {
  return (
    <section id="music" style={{ padding: '5rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
      <SectionTitle>FIND OUR MUSIC</SectionTitle>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.1rem',
        }}
      >
        {MUSIC_LINKS.map((m) => (
          <a
            key={m.name}
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.2rem 1.4rem',
              textDecoration: 'none',
              border: `3px solid ${m.color}`,
              background: m.bg,
              transition: 'transform 0.08s, box-shadow 0.08s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-3px,-3px)';
              e.currentTarget.style.boxShadow = `6px 6px 0 ${m.color}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <span style={{ fontSize: '1.7rem', flexShrink: 0 }}>{m.icon}</span>
            <div>
              <div
                style={{
                  fontFamily: '"Press Start 2P"',
                  fontSize: '0.48rem',
                  color: m.color,
                  marginBottom: '0.3rem',
                }}
              >
                {m.name}
              </div>
              <div style={{ fontFamily: '"VT323"', fontSize: '1.3rem', color: C.cream }}>
                Listen Now →
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
