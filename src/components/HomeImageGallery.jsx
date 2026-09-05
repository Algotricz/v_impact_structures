import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import siteContent from '../services/siteContent';
import '../styles/HomeImageGallery.css';

let galleryPluginsRegistered = false;

const galleryItems = [
  {
    title: 'Kanyakumari terraces',
    image: '/Assets/balcony.png',
    alt: 'Private terrace with seating, planting and coastal light',
    modifier: 'terrace',
  },
  {
    title: 'Pool court living',
    image: '/Assets/apartments%20.png',
    alt: 'Residence pool court with landscaped paths',
    modifier: 'pool',
  },
  {
    title: 'Southern coast calm',
    image: '/Assets/hero.webp',
    alt: 'Coastal landscape around the residence',
    modifier: 'coast',
  },
  {
    title: 'Shaded outdoor rooms',
    image: '/Assets/balcony.png',
    alt: 'Balcony terrace arranged for shade and family use',
    modifier: 'shade',
  },
  {
    title: 'Tamil Nadu homes',
    image: '/Assets/apartments%20.png',
    alt: 'Contemporary homes around greenery and water',
    modifier: 'homes',
  },
  {
    title: 'Western Ghats outlook',
    image: '/Assets/hero.webp',
    alt: 'Open Kanyakumari landscape with hills and coastal light',
    modifier: 'outlook',
  },
  {
    title: 'Evening family decks',
    image: '/Assets/balcony.png',
    alt: 'Outdoor deck planned for evening family time in Kanyakumari',
    modifier: 'deck',
  },
];

/** Registers GSAP plugins used by the homepage image gallery. */
function registerGalleryPlugins() {
  if (galleryPluginsRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  galleryPluginsRegistered = true;
}

/**
 * Expanding homepage site-image gallery shown before the shared footer.
 * @param {{ onNavigate?: (event: React.MouseEvent, nextPath: string) => void }} props
 */
function HomeImageGallery({ onNavigate }) {
  const galleryRef = useRef(null);

  useLayoutEffect(() => {
    registerGalleryPlugins();

    const root = galleryRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const context = gsap.context(() => {
      gsap.from('.home-gallery__intro > *', {
        autoAlpha: 0,
        y: 34,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: root,
          start: 'top 74%',
          once: true,
        },
      });

      gsap.from('.home-gallery__card', {
        autoAlpha: 0,
        y: 70,
        rotate: (index) => [-3, 2, -1, 3, -2, 1, -1.5][index % 7],
        duration: 1,
        ease: 'power4.out',
        stagger: 0.07,
        scrollTrigger: {
          trigger: '.home-gallery__rail',
          start: 'top 78%',
          once: true,
        },
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section className="home-gallery" ref={galleryRef} aria-label="Kanyakumari residence gallery">
      <div className="home-gallery__intro">
        <p>{siteContent.city} site impressions</p>
        <h2>Homes shaped by shade, breeze and Tamil Nadu coastal light</h2>
      </div>
      <div className="home-gallery__rail">
        {galleryItems.map((item) => (
          <figure className={`home-gallery__card home-gallery__card--${item.modifier}`} key={item.title}>
            <img src={item.image} alt={item.alt} />
            <figcaption>
              <span>{item.title}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="home-gallery__action">
        <a
          className="home-gallery__button"
          href="/gallery"
          onClick={(event) => onNavigate?.(event, '/gallery')}
        >
          <span>Open full gallery</span>
          <i aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export default HomeImageGallery;
