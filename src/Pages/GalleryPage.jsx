import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import siteContent from '../services/siteContent';
import '../styles/GalleryPage.css';

let galleryPagePluginsRegistered = false;

const imageSources = {
  balcony: '/Assets/balcony.png',
  pool: '/Assets/apartments%20.png',
  coast: '/Assets/hero.webp',
};

const galleryShots = [
  { title: 'Morning terrace light', label: 'Terrace', image: imageSources.balcony, size: 'hero', focus: '58% center' },
  { title: 'Pool court arrival', label: 'Pool', image: imageSources.pool, size: 'tall', focus: 'center bottom' },
  { title: 'Southern coast outlook', label: 'Coast', image: imageSources.coast, size: 'wide', focus: 'center' },
  { title: 'Shaded dining edge', label: 'Shade', image: imageSources.balcony, size: 'small', focus: '34% center' },
  { title: 'Tamil Nadu family courts', label: 'Community', image: imageSources.pool, size: 'small', focus: '44% bottom' },
  { title: 'Kanyakumari skyline calm', label: 'Outlook', image: imageSources.coast, size: 'tall', focus: '60% center' },
  { title: 'Private outdoor room', label: 'Deck', image: imageSources.balcony, size: 'wide', focus: '72% center' },
  { title: 'Landscape water axis', label: 'Garden', image: imageSources.pool, size: 'small', focus: 'center 72%' },
  { title: 'Western Ghats horizon', label: 'Hills', image: imageSources.coast, size: 'small', focus: 'center 45%' },
  { title: 'Balcony planted frame', label: 'Planting', image: imageSources.balcony, size: 'tall', focus: '82% center' },
  { title: 'Resort-style pool edge', label: 'Water', image: imageSources.pool, size: 'hero', focus: 'center bottom' },
  { title: 'Open coastal weather', label: 'Breeze', image: imageSources.coast, size: 'small', focus: 'center' },
  { title: 'Evening family seating', label: 'Family', image: imageSources.balcony, size: 'wide', focus: '50% center' },
  { title: 'Green walkways', label: 'Paths', image: imageSources.pool, size: 'small', focus: '36% bottom' },
  { title: 'Southern Tamil Nadu light', label: 'Light', image: imageSources.coast, size: 'tall', focus: '70% center' },
  { title: 'Quiet terrace corner', label: 'Privacy', image: imageSources.balcony, size: 'small', focus: '20% center' },
  { title: 'Courtyard reflections', label: 'Calm', image: imageSources.pool, size: 'wide', focus: 'center 64%' },
  { title: 'Hill and coast connection', label: 'Place', image: imageSources.coast, size: 'small', focus: '48% center' },
  { title: 'Shaded balcony lounge', label: 'Lounge', image: imageSources.balcony, size: 'tall', focus: '64% center' },
  { title: 'Kanyakumari home setting', label: 'Home', image: imageSources.pool, size: 'wide', focus: '70% bottom' },
];

/** Registers GSAP plugins used by the premium gallery page. */
function registerGalleryPagePlugins() {
  if (galleryPagePluginsRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  galleryPagePluginsRegistered = true;
}

/**
 * Premium full-gallery page with animated site image frames.
 * @param {{ onNavigate?: (event: React.MouseEvent, nextPath: string) => void }} props
 */
function GalleryPage({ onNavigate }) {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    registerGalleryPagePlugins();

    const root = pageRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const context = gsap.context(() => {
      gsap.from('.gallery-page__brand, .gallery-page__nav a', {
        autoAlpha: 0,
        y: -18,
        duration: 0.72,
        ease: 'power3.out',
        stagger: 0.06,
      });

      gsap.from('.gallery-page__hero-copy > *', {
        autoAlpha: 0,
        y: 42,
        duration: 0.95,
        ease: 'power4.out',
        stagger: 0.08,
      });

      gsap.from('.gallery-page__hero-image', {
        autoAlpha: 0,
        scale: 1.08,
        clipPath: 'inset(18% 9% 18% 9%)',
        duration: 1.2,
        ease: 'power4.out',
      });

      gsap.to('.gallery-page__hero-image img', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: '.gallery-page__hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.utils.toArray('.gallery-page__shot').forEach((shot, index) => {
        const image = shot.querySelector('img');
        gsap.from(shot, {
          autoAlpha: 0,
          y: 82,
          rotate: [0, -1.8, 1.4, -1, 1.9][index % 5],
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: shot,
            start: 'top 86%',
            toggleActions: 'play none none reverse',
          },
        });

        gsap.to(image, {
          yPercent: index % 2 === 0 ? -8 : 8,
          ease: 'none',
          scrollTrigger: {
            trigger: shot,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1,
          },
        });
      });

      gsap.from('.gallery-page__closing > *', {
        autoAlpha: 0,
        y: 34,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.gallery-page__closing',
          start: 'top 78%',
        },
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <main className="gallery-page" ref={pageRef}>
      <header className="gallery-page__header">
        <a className="gallery-page__brand" href="/" onClick={(event) => onNavigate?.(event, '/')}>
          <span>V</span>
          <b>Impact<br />Structures</b>
        </a>
        <nav className="gallery-page__nav" aria-label="Gallery navigation">
          <a href="/apartments" onClick={(event) => onNavigate?.(event, '/apartments')}>Apartments</a>
          <a href={siteContent.phoneHref}>Call</a>
        </nav>
      </header>

      <section className="gallery-page__hero" aria-label="V Impact Structures full gallery">
        <div className="gallery-page__hero-copy">
          <p>{siteContent.city} gallery / {galleryShots.length} views</p>
          <h1>Site impressions shaped by coastal light, shade and family living</h1>
          <span>{siteContent.enquiryLine}</span>
        </div>
        <figure className="gallery-page__hero-image">
          <img src={imageSources.balcony} alt="Premium terrace view at V Impact Structures" />
          <figcaption>Private terraces planned for Kanyakumari breeze</figcaption>
        </figure>
      </section>

      <section className="gallery-page__grid" aria-label="Gallery images">
        {galleryShots.map((shot, index) => (
          <figure
            className={`gallery-page__shot gallery-page__shot--${shot.size}`}
            key={`${shot.title}-${index}`}
            style={{ '--focus': shot.focus }}
          >
            <img src={shot.image} alt={shot.title} />
            <figcaption>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <b>{shot.label}</b>
              <em>{shot.title}</em>
            </figcaption>
          </figure>
        ))}
      </section>

      <section className="gallery-page__closing">
        <p>For private walkthroughs in {siteContent.city}, {siteContent.region}</p>
        <h2>Choose the frame, then step into the home.</h2>
        <a href={siteContent.phoneHref}>Call {siteContent.phoneDisplay}</a>
      </section>
    </main>
  );
}

export default GalleryPage;
