import Nav         from './components/Nav';
import Hero        from './components/Hero';
import Music       from './components/Music';
import Shows       from './components/Shows';
import Band        from './components/Band';
import GameSection from './components/GameSection';
import Footer      from './components/Footer';

export default function App() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div style={{ minHeight: '100vh' }}>
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
