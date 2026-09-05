import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import siteContent from '../services/siteContent';
import '../styles/Footer.css';

let footerPluginsRegistered = false;

/** Registers animation plugins used by the shared footer once per app session. */
function registerFooterPlugins() {
  if (footerPluginsRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  footerPluginsRegistered = true;
}

/**
 * Shared visual footer with a pinned terrace image and contact section.
 * @param {{ onNavigate?: (event: import('react').MouseEvent<HTMLAnchorElement>, nextPath: string) => void }} props
 */
function Footer({ onNavigate }) {
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    registerFooterPlugins();

    const root = footerRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const context = gsap.context(() => {
      gsap.from('.site-footer__eyebrow', {
        autoAlpha: 0,
        y: 22,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.site-footer__view',
          start: 'top 62%',
          once: true,
        },
      });

      gsap.from('.site-footer__title span', {
        autoAlpha: 0,
        yPercent: 110,
        rotateX: 28,
        transformOrigin: 'center bottom',
        duration: 1.05,
        ease: 'power4.out',
        stagger: 0.09,
        scrollTrigger: {
          trigger: '.site-footer__view',
          start: 'top 58%',
          once: true,
        },
      });

      gsap.from('.site-footer__story > p, .site-footer__story div, .site-footer__actions > *', {
        autoAlpha: 0,
        y: 46,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.site-footer__story',
          start: 'top 78%',
          once: true,
        },
      });

      gsap.from('.site-footer__contact > *', {
        autoAlpha: 0,
        y: 28,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.site-footer__contact',
          start: 'top 84%',
          once: true,
        },
      });

      gsap.from('.site-footer__visit-panel > *', {
        autoAlpha: 0,
        y: 34,
        duration: 0.78,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.site-footer__visit-panel',
          start: 'top 86%',
          once: true,
        },
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div className="site-footer" ref={footerRef}>
      <div className="site-footer__media" aria-hidden="true">
        <img src="/Assets/balcony.png" alt="" />
      </div>

      <section className="site-footer__view" aria-label="Kanyakumari sea view invitation">
        <div className="site-footer__content">
          <p className="site-footer__eyebrow">From shaded private terraces</p>
          <h2 className="site-footer__title"><span>Kanyakumari</span><span>sea views</span></h2>
          <div className="site-footer__story" aria-label="Residence highlights">
            <p>
              Wake to coastal light, step into a shaded terrace, and stay connected to the calm rhythm of Tamil Nadu&apos;s southern edge.
              Each V Impact Structures home is planned for privacy, family time and easy everyday movement in Kanyakumari.
            </p>
            <dl>
              <div>
                <dt>Location</dt>
                <dd>{siteContent.city}, {siteContent.region}</dd>
              </div>
              <div>
                <dt>Client</dt>
                <dd>{siteContent.clientName}</dd>
              </div>
              <div>
                <dt>Design focus</dt>
                <dd>Shade, ventilation and long-lasting finishes</dd>
              </div>
            </dl>
          </div>
          <div className="site-footer__actions">
            <span>{siteContent.enquiryLine}</span>
            <small>Digital experience by {siteContent.studioName}</small>
          </div>
        </div>
        <div className="site-footer__visit-panel" aria-label="Plan a site visit">
          <p>Plan a site visit</p>
          <h3>Speak with V Impact Structures and walk through homes planned for Kanyakumari&apos;s light, breeze and family life.</h3>
          <a href={siteContent.phoneHref}>Call {siteContent.phoneDisplay}</a>
        </div>
      </section>

      <footer className="site-footer__contact" aria-label="Sales office contact">
        <p>Sales office / {siteContent.city}, {siteContent.country}</p>
        <a href={siteContent.phoneHref}>{siteContent.phoneDisplay}</a>
        <span>{siteContent.clientName}. Website by {siteContent.studioName}.</span>
      </footer>
    </div>
  );
}

export default Footer;
