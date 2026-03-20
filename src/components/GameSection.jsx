import SectionTitle from './SectionTitle';
import PizzaGame from './PizzaGame';

export default function GameSection() {
  return (
    <div id="game" style={{ background: '#152e0e', borderTop: `4px solid #E2A820` }}>
      <div style={{ padding: '4rem 1rem', maxWidth: 840, margin: '0 auto' }}>
        <SectionTitle color="#E2A820">🍕 DETROIT PIZZA QUEST</SectionTitle>
        <p style={{
          fontFamily: '"Press Start 2P"', fontSize: '0.42rem',
          color: 'rgba(226,168,32,0.55)', textAlign: 'center',
          marginBottom: '0.8rem', lineHeight: 2,
        }}>
          3 LEVELS · 3 BOSSES · YPSILANTI / DETROIT / MEXICANTOWN
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:'0.6rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
          {[
            { key:'WASD/ARROWS', label:'MOVE', color:'#E2A820' },
            { key:'SPACE', label:'JUMP', color:'#e74c3c' },
            { key:'Z / ATK', label:'ATTACK', color:'#8e44ad' },
            { key:'PICK UP', label:'WEAPONS', color:'#3498db' },
          ].map(b=>(
            <div key={b.label} style={{
              border:`2px solid ${b.color}`, background:'#1C3D12',
              boxShadow:'2px 2px 0 #000', padding:'5px 10px',
              display:'flex', flexDirection:'column', alignItems:'center', gap:3, minWidth:80,
            }}>
              <span style={{ fontFamily:'"VT323"', fontSize:'1rem', color:b.color }}>{b.key}</span>
              <span style={{ fontFamily:'"Press Start 2P"', fontSize:'0.28rem', color:'#F5F0DC' }}>{b.label}</span>
            </div>
          ))}
        </div>
        <PizzaGame />
      </div>
    </div>
  );
}