import SectionTitle from '../common/SectionTitle';
import PizzaGame from './PizzaGame';
import '../../styles/components/GameSection.css';

export default function GameSection() {
  return (
    <section id="game" className="game-section" aria-label="Pizza Quest game">
      <div className="game-section__inner">
        <SectionTitle>🍕 DETROIT PIZZA QUEST</SectionTitle>
        <p className="game-section__description">
          Guide the guys through <strong>3 Michigan Cities</strong> hunting for the perfect slice.<br />
          <strong>JUMP ON</strong> meter maids, muscle dudes, bikers &amp; rats to defeat them.<br />
          Collect <strong>16 pizza slices</strong> to trigger the boss fight on each level.<br />
          Beat the <strong className="danger">Landlord → Record Exec → Rat King</strong> to win.
        </p>
        <PizzaGame />
      </div>
    </section>
  );
}
