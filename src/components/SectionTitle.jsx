// ─────────────────────────────────────
//  SectionTitle.jsx
//  The dashed-line section heading used
//  throughout the site.
//
//  Usage:
//    <SectionTitle>FIND OUR MUSIC</SectionTitle>
//    <SectionTitle color="#ff0000">SHOWS</SectionTitle>
// ─────────────────────────────────────
import { C } from './game/constants';

export default function SectionTitle({ children, color }) {
  const c = color || C.gold;
  const dash = `repeating-linear-gradient(90deg, ${c} 0, ${c} 8px, transparent 8px, transparent 16px)`;

  return (
    <div
      style={{
        fontFamily: '"Press Start 2P"',
        fontSize: 'clamp(0.6rem, 2vw, 1rem)',
        color: c,
        textAlign: 'center',
        marginBottom: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        letterSpacing: '0.1em',
      }}
    >
      <div style={{ flex: 1, height: 3, background: dash }} />
      {children}
      <div style={{ flex: 1, height: 3, background: dash }} />
    </div>
  );
}
