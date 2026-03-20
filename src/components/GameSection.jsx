import SectionTitle from './SectionTitle';
import PizzaGame from './PizzaGame';
import { C } from '../data/constants';

export default function GameSection() {
  return (
    <div id="game" style={{ background: C.black, borderTop: `4px solid ${C.gold}` }}>
      <div style={{ padding: '4rem 1rem', maxWidth: 840, margin: '0 auto' }}>
        <SectionTitle color={C.gold}>🍕 DETROIT PIZZA QUEST</SectionTitle>

        {/* control reference bar */}
        <div style={{ display:'flex', justifyContent:'center', gap:'0.6rem', flexWrap:'wrap', marginBottom:'1.4rem' }}>
          {[
            { key:'← →', label:'MOVE',   color:C.gold },
            { key:'SPACE', label:'JUMP',  color:'#e74c3c' },
            { key:'Z',     label:'ATTACK',color:'#8e44ad' },
            { key:'WALK',  label:'PICKUP WEAPONS', color:'#3498db' },
          ].map(b=>(
            <div key={b.label} style={{
              border:`2px solid ${b.color}`, background: C.green,
              boxShadow:'2px 2px 0 #000', padding:'5px 10px',
              display:'flex', flexDirection:'column', alignItems:'center', gap:3, minWidth:80,
            }}>
              <span style={{ fontFamily:'"VT323"', fontSize:'1rem', color:b.color }}>{b.key}</span>
              <span style={{ fontFamily:'"Press Start 2P"', fontSize:'0.28rem', color:C.cream }}>{b.label}</span>
            </div>
          ))}
        </div>

        <p style={{
          fontFamily:'"Press Start 2P"', fontSize:'0.4rem',
          color:'rgba(226,168,32,0.5)', textAlign:'center',
          marginBottom:'1.5rem', lineHeight:2,
        }}>
          3 LEVELS · 3 BOSSES · YPSILANTI / DETROIT / MEXICANTOWN
        </p>

        <PizzaGame />
      </div>
    </div>
  );
}
