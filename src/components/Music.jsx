// Music.jsx — single expandable "Listen Now" button
import { useState } from 'react';
import SectionTitle from './SectionTitle';
import { C, MUSIC_LINKS } from '../data/constants';

export default function Music() {
  const [open, setOpen] = useState(false);

  return (
    <section id="music" style={{ padding: '5rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
      <SectionTitle>FIND OUR MUSIC</SectionTitle>

      {/* Single trigger button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            fontFamily: '"Press Start 2P"',
            fontSize: '0.6rem',
            background: open ? C.greenM : C.gold,
            color: open ? C.cream : C.green,
            border: `3px solid ${C.gold}`,
            padding: '14px 32px',
            cursor: 'pointer',
            boxShadow: '4px 4px 0 #000',
            letterSpacing: '0.06em',
            transition: 'transform 0.08s, box-shadow 0.08s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #000'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 #000'; }}
        >
          <span style={{ fontSize: '1.2rem' }}>♫</span>
          {open ? 'CLOSE' : 'LISTEN ON ALL PLATFORMS'}
          <span style={{
            display: 'inline-block',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            fontSize: '0.8rem',
          }}>▶</span>
        </button>
      </div>

      {/* Bandcamp embed */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <iframe
          style={{ border: 0, width: '400px', height: '241px' }}
          src="https://bandcamp.com/EmbeddedPlayer/album=3306975666/size=large/bgcol=333333/linkcol=ffffff/artwork=small/transparent=true/"
          seamless
          title="Tall Bike by Team Cabin"
        />
      </div>

      {/* Expandable grid */}
      {open && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.1rem',
          animation: 'fadeIn 0.18s ease',
        }}>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
          {MUSIC_LINKS.map((m) => (
            <a
              key={m.name}
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.2rem 1.4rem',
                textDecoration: 'none',
                border: `3px solid ${m.color}`,
                background: m.bg || 'rgba(0,0,0,0.3)',
                transition: 'transform 0.08s, box-shadow 0.08s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-3px,-3px)'; e.currentTarget.style.boxShadow = `6px 6px 0 ${m.color}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <span style={{ fontSize: '1.7rem', flexShrink: 0 }}>{m.icon}</span>
              <div>
                <div style={{ fontFamily: '"Press Start 2P"', fontSize: '0.48rem', color: m.color, marginBottom: '0.3rem' }}>
                  {m.name}
                </div>
                <div style={{ fontFamily: '"VT323"', fontSize: '1.3rem', color: C.cream }}>
                  {m.label || 'Listen Now →'}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
