import { useEffect, useState } from 'react';
import './styles/App.css';
import HighlightCard from './components/HighlightCard';
import ApartmentsPage from './Pages/ApartmentsPage';
import Works from './Pages/Works';

const highlights = [
  { title: 'Crafted to endure', description: 'Timeless stone surfaces and flowering terraces give every exterior a lasting sense of character.' },
  { title: 'Light & flow', description: 'Openings, terraces and framed views bring daylight through every level and connect inside to out.' },
  { title: 'Your private sanctuary', description: 'A quiet pool setting creates an inviting place to pause, meet and enjoy the outdoors.' },
];

/** Full-bleed residence landing hero with a single-image parallax reveal. */
function App() {
  const [path, setPath] = useState(window.location.pathname);
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

  const navigateTo = (event, nextPath) => {
    event.preventDefault();
    window.history.pushState({}, '', nextPath);
    window.scrollTo(0, 0);
    setPath(nextPath);
  };

  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname);
    window.addEventListener('popstate', updatePath);
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  useEffect(() => {
    if (path !== '/') return undefined;

    const updateScene = () => {
      const travel = Math.max(window.innerHeight * 2.3, 1);
      const progress = Math.min(Math.max(window.scrollY / travel, 0), 1);
      const transitionProgress = Math.min(Math.max((progress - 0.64) / 0.36, 0), 1);
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
  }, [path]);

  if (path === '/apartments') return <ApartmentsPage />;
  if (path === '/wrks' || path === '/works') return <Works />;

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
              <a className="hero__apartment" href="/wrks" onClick={(event) => navigateTo(event, '/wrks')}>WRKS</a>
              <a href="#top">Book a call</a>
              <a href="#top">Contact</a>
            </nav>
          </header>
          <aside className="hero__brief" aria-label="Residence overview">
            <p>V Impact Structures / Coastal residences</p>
            <h2>Private homes shaped by light, stone and generous outdoor living.</h2>
            <dl>
              <div><dt>Residences</dt><dd>03</dd></div>
              <div><dt>Typologies</dt><dd>Garden to penthouse</dd></div>
            </dl>
          </aside>
          <aside className="hero__booking-note" aria-label="Booking information">
            <span>Now scheduling private walkthroughs</span>
            <p>Floor plans, availability and consultation times are open for the first collection.</p>
          </aside>
          <div className="hero__content" id="top">
            <h1 className="hero__title"><span>V</span><span>Impact</span></h1>
            <p className="hero__script">Structures</p>
            <div className="hero__tagline" aria-label="A place to return to"><span>A place</span><span>to return to</span></div>
            <p className="hero__switch"><span>By day</span><i /><span>By night</span></p>
          </div>
          <div className="hero__fact-strip" aria-label="Property facts">
            <p><span>Landscape</span><b>Pool courtyard and planted terraces</b></p>
            <p><span>Materiality</span><b>White volumes, stone walls and shaded glass</b></p>
            <p><span>Plan</span><b>Private rooms, open living</b></p>
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
            <div className="arc-content__details">
              <p>Architecture that frames the coast, filters the light and gives every home a generous outdoor edge.</p>
              <dl>
                <div><dt>Homes</dt><dd>03</dd></div>
                <div><dt>Setting</dt><dd>Kanyakumari</dd></div>
                <div><dt>Focus</dt><dd>Light, privacy, craft</dd></div>
              </dl>
              <a href="/apartments">Select an apartment</a>
            </div>
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
