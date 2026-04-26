import SectionTitle from '../common/SectionTitle';
import PizzaGame from './PizzaGame';
import '../../styles/components/GameSection.css';

export default function GameSection() {
  return (
    <section id="game" className="game-section" aria-label="Pizza Quest game">
      <div className="game-section__inner">
        <SectionTitle>🍕 TC PIZZA QUEST</SectionTitle>
        <PizzaGame />
      </div>
    </section>
  );
}
