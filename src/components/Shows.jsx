import SectionTitle from './SectionTitle';
import { C, SHOWS } from '../data/constants';

export default function Shows() {
  return (
    <div id="shows" style={{
      background: '#152e0e',
      borderTop: `3px solid rgba(226,168,32,0.25)`,
      borderBottom: `3px solid rgba(226,168,32,0.25)`,
    }}>
      <div style={{ padding: '5rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <SectionTitle>UPCOMING SHOWS</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {SHOWS.map((s, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '72px 1fr auto',
              alignItems: 'center', gap: '1.2rem', padding: '1rem 1.2rem',
              border: `3px solid ${s.feat ? C.gold : 'rgba(226,168,32,0.2)'}`,
              background: s.feat ? 'rgba(226,168,32,0.07)' : C.green,
              boxShadow: '4px 4px 0 #000',
              transition: 'transform 0.08s, box-shadow 0.08s',
              position: 'relative', overflow: 'hidden',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform='translate(-3px,-3px)'; e.currentTarget.style.boxShadow='6px 6px 0 #000'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='4px 4px 0 #000'; }}
            >
              {s.feat && <div style={{ position:'absolute', left:0, top:0, bottom:0, width:5, background:C.gold }} />}
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontFamily:'"Press Start 2P"', fontSize:'0.4rem', color:'#e74c3c', display:'block', marginBottom:'0.2rem' }}>{s.mo}</span>
                <span style={{ fontFamily:'"Press Start 2P"', fontSize:'1rem', color:C.gold, display:'block' }}>{s.d}</span>
              </div>
              <div>
                <span style={{ fontFamily:'"VT323"', fontSize:'1.6rem', color:C.cream, display:'block' }}>{s.v}</span>
                <span style={{ fontFamily:'"Press Start 2P"', fontSize:'0.3rem', color:C.goldL }}>📍 {s.loc} — {s.t}</span>
              </div>
              <a href={s.ticketUrl} style={{
                fontFamily:'"Press Start 2P"', fontSize:'0.34rem',
                color: C.green, background: s.feat ? C.gold : C.goldL,
                padding:'0.5rem 0.65rem', textDecoration:'none',
                boxShadow:'3px 3px 0 #000', whiteSpace:'nowrap',
              }}>TICKETS →</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
