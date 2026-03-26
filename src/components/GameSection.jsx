import SectionTitle from './SectionTitle';
import PizzaGame from './PizzaGame';
import { C } from '../data/constants';

export default function GameSection() {
  return (
    <div id="game" style={{ background: '#030a02', borderTop: `4px solid ${C.gold}` }}>
      <div style={{ padding: '4rem 1rem', maxWidth: 820, margin: '0 auto' }}>
        <SectionTitle color={C.gold}>🍕 DETROIT PIZZA QUEST</SectionTitle>
        <p style={{
          fontFamily: '"VT323"',
          fontSize: '1.25rem',
          color: 'rgba(212,160,23,0.55)',
          textAlign: 'center',
          marginBottom: '2rem',
          lineHeight: 1.5,
        }}>
          Guide the guys through <strong style={{ color: C.gold }}>3 Detroit neighborhoods</strong> hunting for the perfect slice.<br />
          <strong style={{ color: C.gold }}>JUMP ON</strong> meter maids, muscle dudes, bikers &amp; rats to defeat them.<br />
          Collect <strong style={{ color: C.gold }}>16 pizza slices</strong> to trigger the boss fight on each level.<br />
          Beat the <strong style={{ color: '#e74c3c' }}>Landlord → Rat King → Record Exec</strong> to win.
        </p>
        <PizzaGame />
      </div>
    </div>
  );
}
