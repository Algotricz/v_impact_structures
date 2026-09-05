import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import siteContent from '../services/siteContent';
import '../styles/ResidenceDetails.css';

let residenceDetailsPluginsRegistered = false;

/** Registers animation plugins used by the residence detail section once. */
function registerResidenceDetailsPlugins() {
  if (residenceDetailsPluginsRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  residenceDetailsPluginsRegistered = true;
}

/**
 * @param {{ onNavigate?: (event: import('react').MouseEvent<HTMLAnchorElement>, nextPath: string) => void }} props
 * Editorial details section shown after the closing arc reveal.
 */
function ResidenceDetails({ onNavigate }) {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    registerResidenceDetailsPlugins();

    const section = sectionRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const context = gsap.context(() => {
      gsap.from('.residence-details__media--left img, .residence-details__media--right img', {
        autoAlpha: 0,
        scale: 1.08,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: section,
          start: 'top 72%',
          once: true,
        },
      });

      gsap.from('.residence-details__story h2, .residence-details__story p, .residence-details__story a, .residence-details__upgrades > *', {
        autoAlpha: 0,
        y: 58,
        duration: 0.95,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: {
          trigger: '.residence-details__content-scroll',
          start: 'top 62%',
          once: true,
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section className="residence-details" aria-label="Residence details" ref={sectionRef}>
      <div className="residence-details__media-stage" aria-hidden="true">
        <div className="residence-details__media residence-details__media--left">
          <img src="/Assets/hero.webp" alt="" />
        </div>
        <div className="residence-details__media residence-details__media--right">
          <img src="/Assets/balcony.png" alt="" />
        </div>
      </div>

      <div className="residence-details__content-scroll">
        <article className="residence-details__story">
          <h2>Every detail is selected for homes that feel elegant, practical and ready for life in Kanyakumari</h2>
          <p>{siteContent.clientName} combines shaded terraces, cross ventilation, durable finishes and landscaped outdoor spaces for families in {siteContent.city}, {siteContent.region}. {siteContent.enquiryLine}</p>
          <a href="/apartments" onClick={(event) => onNavigate?.(event, '/apartments')}>
            <span>View available<br />homes</span>
          </a>
        </article>

        <div className="residence-details__upgrades">
          <p>Optional upgrades are available:</p>
          <ul>
            <li>Private terrace seating plans</li>
            <li>EV charging point installation</li>
            <li>Solar-ready electrical provision</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ResidenceDetails;
