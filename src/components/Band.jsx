// ─────────────────────────────────────
//  Band.jsx
//  The Band section — member cards with
//  pixel art, name, role, bio, pizza pref.
//  Edit member data in src/data/constants.js
// ─────────────────────────────────────
import SectionTitle from './SectionTitle';
import { CharLeft, CharMid, CharRight } from './Characters';
import { C, MEMBERS } from '../data/constants';

const CHARS = [CharLeft, CharMid, CharRight];

export default function Band() {
  return (
    <section id="band" style={{ padding: '5rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
      <SectionTitle>THE BAND</SectionTitle>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(255px, 1fr))',
          gap: '1.8rem',
        }}
      >
        {MEMBERS.map((m, i) => {
          const Char = CHARS[m.charId];
          return (
            <div
              key={i}
              style={{
                border: `3px solid rgba(212,160,23,0.25)`,
                padding: '2rem',
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.9rem',
                transition: 'transform 0.08s, box-shadow 0.08s, border-color 0.08s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-3px,-3px)';
                e.currentTarget.style.boxShadow = `6px 6px 0 ${C.goldD}`;
                e.currentTarget.style.borderColor = C.gold;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.borderColor = 'rgba(212,160,23,0.25)';
              }}
            >
              <Char size={88} animate delay={`${i * 0.3}s`} />
              <div
                style={{
                  fontFamily: '"Press Start 2P"',
                  fontSize: '0.5rem',
                  color: C.gold,
                  textAlign: 'center',
                }}
              >
                {m.name}
              </div>
              <div
                style={{ fontFamily: '"VT323"', fontSize: '1.35rem', color: C.goldL, textAlign: 'center' }}
              >
                {m.role}
              </div>
              <p
                style={{
                  fontFamily: '"VT323"',
                  fontSize: '1.15rem',
                  color: 'rgba(245,240,220,0.65)',
                  textAlign: 'center',
                  lineHeight: 1.4,
                }}
              >
                {m.bio}
              </p>
              <div
                style={{
                  fontFamily: '"Press Start 2P"',
                  fontSize: '0.32rem',
                  color: C.greenL,
                  textAlign: 'center',
                }}
              >
                🍕 {m.pizza}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
