import SectionTitle from '../common/SectionTitle';
import '../../styles/components/Shows.css';

export default function Shows() {
  return (
    <section id="shows" className="shows" aria-label="Upcoming shows">
      <div className="shows__inner">
        <SectionTitle>UPCOMING SHOWS</SectionTitle>

        <p className="shows__tba">More Shows TBA</p>
      </div>
    </section>
  );
}
