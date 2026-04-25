import SectionTitle from './SectionTitle';
import { C, SHOWS } from '../data/constants';

export default function Shows() {
  return (
    <section
      id="shows"
      style={{
        background: 'rgba(0,0,0,0.45)',
        borderTop: `3px solid rgba(212,160,23,0.2)`,
        borderBottom: `3px solid rgba(212,160,23,0.2)`,
      }}
    >
      <div style={{ padding: '5rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <SectionTitle>UPCOMING SHOWS</SectionTitle>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {SHOWS.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '76px 1fr',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1.4rem 1.8rem',
                border: `3px solid ${s.feat ? C.gold : 'rgba(212,160,23,0.22)'}`,
                background: s.feat ? 'rgba(212,160,23,0.07)' : 'rgba(0,0,0,0.25)',
                transition: 'transform 0.08s, box-shadow 0.08s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translate(-2px,-2px)';
                e.currentTarget.style.boxShadow = `5px 5px 0 ${C.goldD}`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              {/* Date */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.55rem', color: '#e74c3c', display: 'block', marginBottom: '0.25rem' }}>
                  {s.mo}
                </span>
                <span style={{ fontFamily: '"Press Start 2P"', fontSize: '1.2rem', color: C.gold, display: 'block' }}>
                  {s.d}
                </span>
              </div>

              {/* Venue info */}
              <div>
                <span style={{ fontFamily: '"VT323"', fontSize: '2.2rem', color: C.cream, display: 'block', lineHeight: 1.1 }}>
                  {s.v}
                </span>
                <span style={{ fontFamily: '"VT323"', fontSize: '1.5rem', color: C.goldL, display: 'block', marginTop: '0.2rem' }}>
                  📍 {s.loc} — {s.t}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}