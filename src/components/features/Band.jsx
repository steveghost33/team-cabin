import SectionTitle from '../common/SectionTitle';
import { CHARS } from './Characters';
import { MEMBERS } from '../../config/constants';
import '../../styles/components/Band.css';

export default function Band() {
  return (
    <section id="band" className="band" aria-label="The band">
      <SectionTitle>THE BAND</SectionTitle>
      <div className="band__grid">
        {MEMBERS.map((member, i) => {
          const Char = CHARS[member.charId];
          return (
            <article key={member.name} className="band-card">
              <Char size={88} animate delay={`${i * 0.3}s`} />
              <h2 className="band-card__name">{member.name}</h2>
              <p className="band-card__role">{member.role}</p>
              <p className="band-card__bio">{member.bio}</p>
              <p className="band-card__pizza">🍕 {member.pizza}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
