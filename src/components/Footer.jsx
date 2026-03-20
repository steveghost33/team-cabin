import TCLogo from './TCLogo';
import { SOCIAL_LINKS } from '../data/constants';

export default function Footer() {
  return (
    <footer style={{
      background: '#1C3D12',
      borderTop: `3px solid rgba(226,168,32,0.25)`,
      padding: '3rem 2rem', textAlign: 'center',
    }}>
      <div style={{ marginBottom: '1.5rem' }}><TCLogo size={100} /></div>
      <div style={{ display:'flex', justifyContent:'center', gap:'0.5rem', flexWrap:'wrap', marginBottom:'2rem', maxWidth:700, margin:'0 auto 2rem' }}>
        {SOCIAL_LINKS.map((l) => (
          <a key={l.label} href={l.url} style={{
            fontFamily:'"Press Start 2P"', fontSize:'0.35rem',
            color:'#c8b830', textDecoration:'none',
            border:`2px solid rgba(226,168,32,0.25)`,
            background:'#152e0e', padding:'5px 8px', boxShadow:'2px 2px 0 #000',
            transition:'transform 0.08s, color 0.08s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translate(-2px,-2px)'; e.currentTarget.style.color='#E2A820'; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.color='#c8b830'; }}
          >{l.label}</a>
        ))}
      </div>
      <div style={{ height:2, background:`repeating-linear-gradient(90deg,#E2A820 0,#E2A820 6px,transparent 6px,transparent 12px)`, marginBottom:'1.5rem', maxWidth:400, margin:'0 auto 1.5rem', opacity:0.4 }} />
      <p style={{ fontFamily:'"Press Start 2P"', fontSize:'0.3rem', color:'rgba(226,168,32,0.3)', marginBottom:'0.4rem' }}>
        © 2026 TEAM CABIN · DETROIT, MI · ALL RIGHTS RESERVED
      </p>
      <p style={{ fontFamily:'"VT323"', fontSize:'1rem', color:'rgba(226,168,32,0.25)' }}>
        No pizza was harmed in the making of this website 🍕
      </p>
    </footer>
  );
}