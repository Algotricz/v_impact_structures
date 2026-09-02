import { useEffect, useState } from 'react';
import './App.css';
import HighlightCard from './components/HighlightCard';
import ApartmentsPage from './Pages/ApartmentsPage';

const highlights = [
  { title: 'Crafted to endure', description: 'Timeless stone surfaces and flowering terraces give every exterior a lasting sense of character.' },
  { title: 'Light & flow', description: 'Openings, terraces and framed views bring daylight through every level and connect inside to out.' },
  { title: 'Your private sanctuary', description: 'A quiet pool setting creates an inviting place to pause, meet and enjoy the outdoors.' },
];

/** Full-bleed residence landing hero with a single-image parallax reveal. */
function App() {
  const [scrollState, setScrollState] = useState({
    sceneOffset: 0,
    contentOffset: 0,
    contentOpacity: 1,
    showMarkers: false,
    showApartmentsCta: false,
    transitionOffset: 120,
    arcIsOpen: false,
    arcContentOpacity: 0,
  });
  const [activeHighlight, setActiveHighlight] = useState(null);

  useEffect(() => {
    const updateScene = () => {
      const travel = Math.max(window.innerHeight * 2.3, 1);
      const progress = Math.min(Math.max(window.scrollY / travel, 0), 1);
      const transitionProgress = Math.min(Math.max((progress - 0.89) / 0.11, 0), 1);
      setScrollState({
        sceneOffset: Math.round(-progress * window.innerHeight * 0.72),
        contentOffset: Math.round(-progress * window.innerHeight * 0.28),
        contentOpacity: Math.max(1 - progress * 1.7, 0),
        showMarkers: progress > 0.54 && transitionProgress === 0,
        showApartmentsCta: progress > 0.72 && transitionProgress === 0,
        transitionOffset: 112 - transitionProgress * 142,
        arcIsOpen: transitionProgress > 0,
        arcContentOpacity: Math.min(transitionProgress * 1.8, 1),
      });
    };

    updateScene();
    window.addEventListener('scroll', updateScene, { passive: true });
    window.addEventListener('resize', updateScene);
    return () => {
      window.removeEventListener('scroll', updateScene);
      window.removeEventListener('resize', updateScene);
    };
  }, []);

  if (window.location.pathname === '/apartments') return <ApartmentsPage />;

  return (
    <main className="residence-page" style={{
      '--scene-offset': `${scrollState.sceneOffset}px`,
      '--content-offset': `${scrollState.contentOffset}px`,
      '--content-opacity': scrollState.contentOpacity,
      '--transition-offset': `${scrollState.transitionOffset}vh`,
      '--arc-content-opacity': scrollState.arcContentOpacity,
    }}>
      <section className="hero" aria-label="Era Residence">
        <div className="hero__sticky">
          <div className="hero__sky" />
          <header className="hero__header">
            <nav className="hero__nav" aria-label="Primary navigation">
              <a className="hero__apartment" href="/apartments">Select<br />an apartment</a>
              <a href="#top">Book a call</a>
              <a href="#top">Contact</a>
            </nav>
          </header>
          <div className="hero__content" id="top">
            <h1 className="hero__title"><span>V</span><span>Impact</span></h1>
            <p className="hero__script">Structures</p>
            <div className="hero__tagline" aria-label="A place to return to"><span>A place</span><span>to return to</span></div>
            <p className="hero__switch"><span>By day</span><i /><span>By night</span></p>
          </div>
          {!scrollState.arcIsOpen && <>
            <div className={`hero__markers${scrollState.showMarkers ? ' is-visible' : ''}`} aria-label="Property highlights">
              {highlights.map((highlight, index) => (
                <button
                  key={highlight.title}
                  className={`hero__marker hero__marker--${index + 1}${activeHighlight === highlight ? ' is-active' : ''}`}
                  type="button"
                  onMouseEnter={() => setActiveHighlight(highlight)}
                  onMouseLeave={() => setActiveHighlight(null)}
                  onFocus={() => setActiveHighlight(highlight)}
                  onBlur={() => setActiveHighlight(null)}
                  aria-label={`View ${highlight.title}`}
                ><span>{activeHighlight === highlight ? '×' : ''}</span></button>
              ))}
            </div>
            <HighlightCard highlight={activeHighlight} />
            <a className={`hero__apartments-cta${scrollState.showApartmentsCta ? ' is-visible' : ''}`} href="/apartments">
              <span>View available<br />apartments</span>
            </a>
          </>}
          <div className="hero__transition-disc" aria-hidden="true" />
          <div className="arc-content" aria-hidden={!scrollState.arcIsOpen}>
            <i className="arc-content__line" />
            <p>V Impact Structures<br />designed for generations</p>
            <h2>Built<br />to last</h2>
          </div>
          <p className="hero__scroll"><span>Scroll</span><i /></p>
        </div>
      </section>
      <section className="story" id="story">
        <aside className="story__rail" aria-hidden="true"><i /><b>02</b><span>Scroll</span><em>↓</em></aside>
        <p className="story__kicker">V Impact Structures</p>
        <h2>Built to stay</h2>
        <div className="story__image" role="img" aria-label="V Impact Structures residence detail" />
        <div className="story__pager" aria-label="Residence image pagination"><button type="button" aria-label="Previous image">‹</button><b>02</b><i /><b>03</b><button type="button" aria-label="Next image">›</button></div>
        <p className="story__copy">Thoughtful architecture, natural materials and lush landscaping create a residence designed for lasting everyday life.</p>
        <p className="story__statement">Designed as a community,<br />not a complex</p>
      </section>
    </main>
  );
}

export default App;
