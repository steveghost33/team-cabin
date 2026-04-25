import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import Hero from './components/features/Hero';
import Music from './components/features/Music';
import Shows from './components/features/Shows';
import Band from './components/features/Band';
import GameSection from './components/features/GameSection';

export default function App() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Nav scrollTo={scrollTo} />
      <Hero />
      <Music />
      <Shows />
      <Band />
      <GameSection />
      <Footer />
    </div>
  );
}
