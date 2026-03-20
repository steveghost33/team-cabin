import { C } from '../data/constants';

export default function SectionTitle({ children, color }) {
  const c = color || C.gold;
  return (
    <div style={{
      fontFamily: '"Press Start 2P"',
      fontSize: 'clamp(0.6rem, 2vw, 1rem)',
      color: c,
      textAlign: 'center',
      marginBottom: '2.5rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem',
      letterSpacing: '0.1em',
      textShadow: '3px 3px 0 #000',
    }}>
      <div style={{ flex:1, height:4, background:`repeating-linear-gradient(90deg,${c} 0,${c} 8px,transparent 8px,transparent 16px)` }} />
      {children}
      <div style={{ flex:1, height:4, background:`repeating-linear-gradient(90deg,${c} 0,${c} 8px,transparent 8px,transparent 16px)` }} />
    </div>
  );
}