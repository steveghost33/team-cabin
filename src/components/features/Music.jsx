import { useState } from 'react';
import SectionTitle from '../common/SectionTitle';
import { MUSIC_LINKS } from '../../config/constants';
import '../../styles/components/Music.css';

function MusicLink({ name, icon, color, bg, url, label }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="music__link"
      style={{ '--link-color': color, '--link-bg': bg }}
      aria-label={`${label || 'Listen Now'} on ${name}`}
    >
      <span className="music__link-icon" aria-hidden="true">{icon}</span>
      <div>
        <div className="music__link-name">{name}</div>
        <div className="music__link-label">{label || 'Listen Now →'}</div>
      </div>
    </a>
  );
}

export default function Music() {
  const [open, setOpen] = useState(false);

  return (
    <section id="music" className="music" aria-label="Music">
      <SectionTitle>FIND OUR MUSIC</SectionTitle>

      <div className="music__trigger-wrap">
        <button
          className={`music__trigger ${open ? 'music__trigger--open' : 'music__trigger--closed'}`}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="music-platform-list"
        >
          <span className="music__trigger-icon" aria-hidden="true">♫</span>
          {open ? 'CLOSE' : 'LISTEN ON ALL PLATFORMS'}
          <span
            className={`music__trigger-arrow ${open ? 'music__trigger-arrow--open' : ''}`}
            aria-hidden="true"
          >
            ▶
          </span>
        </button>
      </div>

      <div className="music__embed-wrap">
        <iframe
          className="music__embed"
          src="https://bandcamp.com/EmbeddedPlayer/album=3306975666/size=large/bgcol=333333/linkcol=ffffff/artwork=small/transparent=true/"
          seamless
          title="Tall Bike by Team Cabin"
        />
      </div>

      {open && (
        <div id="music-platform-list" className="music__grid">
          {MUSIC_LINKS.map((link) => (
            <MusicLink key={link.name} {...link} />
          ))}
        </div>
      )}
    </section>
  );
}
