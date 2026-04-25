import SectionTitle from '../common/SectionTitle';
import { SHOWS } from '../../config/constants';
import '../../styles/components/Shows.css';

export default function Shows() {
  return (
    <section id="shows" className="shows" aria-label="Upcoming shows">
      <div className="shows__inner">
        <SectionTitle>UPCOMING SHOWS</SectionTitle>

        <ul className="shows__list" role="list">
          {SHOWS.map((show, i) => (
            <li
              key={i}
              className={`show-card ${show.feat ? 'show-card--featured' : ''}`}
              aria-label={`${show.mo} ${show.d} at ${show.v}`}
            >
              <div className="show-card__date" aria-hidden="true">
                <span className="show-card__month">{show.mo}</span>
                <span className="show-card__day">{show.d}</span>
              </div>
              <div>
                <span className="show-card__venue">{show.v}</span>
                <span className="show-card__details">📍 {show.loc} — {show.t}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
