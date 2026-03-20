import SectionTitle from './SectionTitle';
import PizzaGame from './PizzaGame';
import { C } from '../data/constants';

export default function GameSection() {
  return (
    <div id="game" style={{ background: '#152e0e', borderTop: `4px solid ${C.gold}` }}>
      <div style={{ padding: '4rem 1rem', maxWidth: 840, margin: '0 auto' }}>
        <SectionTitle color={C.gold}>🍕 DETROIT PIZZA QUEST</SectionTitle>
        <p style={{
          fontFamily: '"Press Start 2P"', fontSize: '0.4rem',
          color: 'rgba(226,168,32,0.5)', textAlign: 'center',
          marginBottom: '1.5rem', lineHeight: 2,
        }}>
          3 LEVELS · 3 BOSSES · YPSILANTI / DETROIT / MEXICANTOWN
        </p>
        <PizzaGame />
      </div>
    </div>
  );
}
