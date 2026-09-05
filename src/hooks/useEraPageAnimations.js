import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

let pluginsRegistered = false;

/** Registers the GSAP plugins and custom eases used by ERA-inspired page motion. */
function registerEraPlugins() {
  if (pluginsRegistered) return;
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create('eraOut', 'M0,0 C0.25,1 0.5,1 1,1');
  CustomEase.create('eraInOut', 'M0,0 C0.75,0 0.25,1 1,1');
  pluginsRegistered = true;
}

/**
 * Escapes generated split-text content before injecting it as markup.
 * @param {string} value Plain text value.
 * @returns {string} HTML-safe text.
 */
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (match) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[match]));
}

/**
 * Splits an element's readable text into word and character spans for heading reveals.
 * @param {Element} element Element whose text content should be animated.
 * @returns {() => void} Cleanup function that restores original markup.
 */
function splitHeadingText(element) {
  const original = element.innerHTML;
  const text = element.textContent || '';
  const words = text.trim().split(/\s+/).filter(Boolean);

  element.setAttribute('aria-label', text.trim());
  element.innerHTML = words.map((word) => {
    const chars = [...word].map((char) => `<span class="era-char" aria-hidden="true">${escapeHtml(char)}</span>`).join('');
    return `<span class="era-word" aria-hidden="true">${chars}</span>`;
  }).join('<span class="era-space" aria-hidden="true"> </span>');

  return () => {
    element.innerHTML = original;
    element.removeAttribute('aria-label');
  };
}

/**
 * Wraps paragraph text in masked line-like spans for an editorial reveal.
 * @param {Element} element Element whose text content should be masked.
 * @returns {() => void} Cleanup function that restores original markup.
 */
function splitParagraphText(element) {
  const original = element.innerHTML;
  const text = (element.textContent || '').trim();
  if (!text) return () => {};

  element.innerHTML = `<span class="era-line-mask"><span class="era-line-inner">${escapeHtml(text)}</span></span>`;
  return () => {
    element.innerHTML = original;
  };
}

/**
 * Adds a scroll progress custom property and number to an optional progress node.
 * @param {HTMLElement | null} progressElement Progress meter root.
 */
function updateProgress(progressElement) {
  if (!progressElement) return;
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const value = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
  const label = progressElement.querySelector('b');

  progressElement.style.setProperty('--detail-progress', `${value * 100}%`);
  if (label) label.textContent = String(Math.round(value * 100)).padStart(2, '0');
}

/**
 * Animates tab triggers, tab highlight, and panel transitions inside a data-tabs root.
 * @param {HTMLElement} tabsRoot Root element with data-tabs.
 * @param {boolean} reducedMotion Whether transitions should be disabled.
 * @returns {() => void} Cleanup for event listeners.
 */
function setupTabs(tabsRoot, reducedMotion) {
  const triggers = [...tabsRoot.querySelectorAll('[data-tab-trigger]')];
  const panels = [...tabsRoot.querySelectorAll('[data-tab-panel]')];
  const highlight = tabsRoot.querySelector('[data-tab-highlight]');
  if (!triggers.length || !panels.length) return () => {};

  let activeIndex = Math.max(triggers.findIndex((trigger) => trigger.classList.contains('is-active')), 0);

  const moveHighlight = () => {
    const trigger = triggers[activeIndex];
    if (!highlight || !trigger) return;
    gsap.to(highlight, {
      x: trigger.offsetLeft,
      width: trigger.offsetWidth,
      duration: reducedMotion ? 0 : 0.8,
      ease: 'eraOut',
    });
  };

  const showPanel = (nextIndex) => {
    if (nextIndex === activeIndex || !triggers[nextIndex] || !panels[nextIndex]) return;
    const currentPanel = panels[activeIndex];
    const nextPanel = panels[nextIndex];
    const previousIndex = activeIndex;

    triggers[previousIndex].classList.remove('is-active');
    triggers[nextIndex].classList.add('is-active');
    triggers[previousIndex].setAttribute('aria-selected', 'false');
    triggers[nextIndex].setAttribute('aria-selected', 'true');
    nextPanel.classList.add('is-active');
    activeIndex = nextIndex;
    moveHighlight();

    if (reducedMotion) {
      currentPanel.classList.remove('is-active');
      return;
    }

    gsap.killTweensOf([currentPanel, nextPanel, currentPanel.children, nextPanel.children]);
    currentPanel.classList.add('is-leaving');
    gsap.fromTo(currentPanel.children, { y: 0, autoAlpha: 1 }, {
      y: -12,
      autoAlpha: 0,
      duration: 0.3,
      stagger: 0.03,
      ease: 'power2.out',
      onComplete: () => {
        currentPanel.classList.remove('is-active', 'is-leaving');
        gsap.set(currentPanel.children, { clearProps: 'all' });
      },
    });
    gsap.fromTo(nextPanel.children, { y: 20, autoAlpha: 0 }, {
      y: 0,
      autoAlpha: 1,
      duration: 0.65,
      stagger: 0.06,
      ease: 'eraOut',
      delay: 0.1,
    });
  };

  const handlers = triggers.map((trigger, index) => {
    const handler = () => showPanel(index);
    trigger.addEventListener('click', handler);
    return handler;
  });
  window.addEventListener('resize', moveHighlight);
  moveHighlight();

  return () => {
    triggers.forEach((trigger, index) => trigger.removeEventListener('click', handlers[index]));
    window.removeEventListener('resize', moveHighlight);
  };
}

/**
 * Pins gallery wrappers and translates their strips horizontally while the page scrolls.
 * @param {HTMLElement} root Root element containing gallery wrappers.
 * @param {boolean} reducedMotion Whether scroll-driven animation should be disabled.
 * @returns {() => void} Cleanup for matchMedia and refresh listeners.
 */
function setupHorizontalGalleries(root, reducedMotion) {
  if (reducedMotion) return () => {};

  const media = gsap.matchMedia();

  media.add('(min-width: 992px)', () => {
    const cleanupRefresh = [];

    root.querySelectorAll('[data-horizontal-gallery]').forEach((gallery) => {
      const strip = gallery.querySelector('[data-horizontal-strip]');
      if (!strip) return;

      let stripWidth = 0;
      let horizontalLength = 0;
      const refresh = () => {
        stripWidth = strip.scrollWidth;
        horizontalLength = Math.max(stripWidth - window.innerWidth, 0);
      };

      refresh();
      ScrollTrigger.addEventListener('refreshInit', refresh);
      cleanupRefresh.push(() => ScrollTrigger.removeEventListener('refreshInit', refresh));

      gsap.to(strip, {
        x: () => -horizontalLength,
        ease: 'none',
        scrollTrigger: {
          trigger: gallery,
          pin: gallery,
          scrub: true,
          start: 'top top',
          end: () => `+=${stripWidth}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    });

    return () => cleanupRefresh.forEach((cleanup) => cleanup());
  });

  return () => media.revert();
}

/**
 * Applies ERA-inspired animation behavior to nodes marked with data attributes.
 * @param {React.RefObject<HTMLElement>} rootRef Root page ref used to scope animations.
 * @param {{ progressRef?: React.RefObject<HTMLElement>, refreshKey?: string }} options Hook options.
 */
function useEraPageAnimations(rootRef, { progressRef, refreshKey } = {}) {
  useLayoutEffect(() => {
    registerEraPlugins();

    const root = rootRef.current;
    if (!root) return undefined;

    const progressElement = progressRef?.current || null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const restoreMarkup = [];
    const cleanupTabs = [];
    const cleanupHorizontal = [];
    const pendingImages = [];
    let updateHeaderFrame = 0;

    const handleProgress = () => updateProgress(progressElement);
    const handleHeaderState = () => {
      window.cancelAnimationFrame(updateHeaderFrame);
      updateHeaderFrame = window.requestAnimationFrame(() => {
        root.querySelector('.apartment-detail__header')?.classList.toggle('is-top', window.scrollY < 100);
      });
    };
    const refreshScroll = () => ScrollTrigger.refresh();

    root.querySelectorAll('[data-reveal="heading"]').forEach((element) => restoreMarkup.push(splitHeadingText(element)));
    root.querySelectorAll('[data-reveal="paragraph"]').forEach((element) => restoreMarkup.push(splitParagraphText(element)));

    handleProgress();
    handleHeaderState();
    window.addEventListener('scroll', handleProgress, { passive: true });
    window.addEventListener('scroll', handleHeaderState, { passive: true });
    window.addEventListener('resize', handleProgress);
    window.addEventListener('resize', refreshScroll);

    root.querySelectorAll('img').forEach((image) => {
      if (image.complete) return;
      pendingImages.push(image);
      image.addEventListener('load', refreshScroll, { once: true });
    });

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('[data-reveal], [data-parallax]', { clearProps: 'all' });
        root.querySelectorAll('[data-tabs]').forEach((tabsRoot) => cleanupTabs.push(setupTabs(tabsRoot, true)));
        return;
      }

      gsap.timeline({ defaults: { ease: 'eraOut' } })
        .from('.apartment-detail__curtain', {
          scaleY: 1,
          duration: 1.05,
          transformOrigin: 'top',
          ease: 'eraInOut',
        }, 0)
        .from('.apartment-detail__brand span, .apartment-detail__nav a', {
          autoAlpha: 0,
          y: -16,
          duration: 0.72,
          stagger: 0.045,
        }, 0.26)
        .from('[data-reveal="heading"] .era-char', {
          autoAlpha: 0,
          yPercent: 50,
          rotateY: 90,
          transformOrigin: 'center bottom',
          duration: 1.2,
          stagger: 0.045,
        }, 0.34)
        .from('[data-reveal="paragraph"] .era-line-inner', {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.08,
        }, 0.52)
        .fromTo('[data-reveal="blossom"]', {
          clipPath: 'circle(0% at 50% 50%)',
          autoAlpha: 0.96,
          scale: 0.96,
        }, {
          clipPath: 'circle(150% at 50% 50%)',
          autoAlpha: 1,
          scale: 1,
          duration: 1.35,
          ease: 'eraInOut',
        }, 0.48)
        .from('[data-reveal="blossom"] img', {
          scale: 1.22,
          rotate: -1.4,
          duration: 1.35,
          ease: 'eraInOut',
        }, 0.48)
        .from('[data-reveal="blossom"] .apartment-detail__blossom-petal', {
          autoAlpha: 0,
          scale: 0,
          duration: 1.15,
          stagger: 0.055,
          ease: 'eraOut',
        }, 0.5)
        .to('[data-reveal="blossom"] .apartment-detail__blossom-petal', {
          autoAlpha: 0,
          scale: 1.34,
          duration: 0.74,
          stagger: 0.035,
          ease: 'power2.out',
        }, 1.03)
        .from('[data-reveal="container"].apartment-detail__specs > *', {
          autoAlpha: 0,
          y: 42,
          duration: 1.2,
          stagger: 0.08,
        }, 0.78)
        .from('.apartment-detail__scroll-hint', {
          autoAlpha: 0,
          y: -22,
          duration: 0.7,
        }, 1);

      gsap.to('.apartment-detail__title', {
        yPercent: 12,
        autoAlpha: 0.38,
        ease: 'none',
        scrollTrigger: {
          trigger: '.apartment-detail__hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.utils.toArray('[data-reveal="container"]:not(.apartment-detail__specs)').forEach((element) => {
        gsap.from(element.children.length ? element.children : element, {
          autoAlpha: 0,
          y: 42,
          duration: 1.2,
          ease: 'eraOut',
          stagger: 0.1,
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            once: true,
          },
        });
      });

      gsap.utils.toArray('[data-reveal="line"]').forEach((element) => {
        gsap.from(element, {
          clipPath: element.dataset.direction === 'horizontal' ? 'inset(0 100% 0 0)' : 'inset(0 0 100% 0)',
          duration: 1.2,
          ease: 'eraOut',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            once: true,
          },
        });
      });

      gsap.utils.toArray('[data-reveal="image"]').forEach((element) => {
        if (element.closest('.apartment-detail__plans')) return;
        const image = element.querySelector('img');
        if (!image) return;
        gsap.fromTo(element, {
          clipPath: 'polygon(100% 0, 100% 0, 101% 100%, 125% 100%)',
        }, {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: 1.2,
          ease: 'eraInOut',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            once: true,
          },
        });
        gsap.from(image, {
          scale: 1.42,
          xPercent: 18,
          duration: 1.2,
          ease: 'eraInOut',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            once: true,
          },
        });
      });

      gsap.from('.apartment-detail__similar-plan', {
        autoAlpha: 0,
        y: 70,
        scale: 0.96,
        duration: 1,
        ease: 'eraOut',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.apartment-detail__similar-grid',
          start: 'top 80%',
          once: true,
        },
      });

      gsap.from('.apartment-detail__amenity li', {
        autoAlpha: 0,
        y: 18,
        duration: 0.65,
        stagger: 0.055,
        ease: 'eraOut',
        scrollTrigger: {
          trigger: '.apartment-detail__amenity ul',
          start: 'top 80%',
          once: true,
        },
      });

      root.querySelectorAll('[data-tabs]').forEach((tabsRoot) => cleanupTabs.push(setupTabs(tabsRoot, false)));
      cleanupHorizontal.push(setupHorizontalGalleries(root, false));
    }, root);

    ScrollTrigger.refresh();

    return () => {
      window.cancelAnimationFrame(updateHeaderFrame);
      window.removeEventListener('scroll', handleProgress);
      window.removeEventListener('scroll', handleHeaderState);
      window.removeEventListener('resize', handleProgress);
      window.removeEventListener('resize', refreshScroll);
      pendingImages.forEach((image) => image.removeEventListener('load', refreshScroll));
      context.revert();
      cleanupTabs.forEach((cleanup) => cleanup());
      cleanupHorizontal.forEach((cleanup) => cleanup());
      restoreMarkup.forEach((restore) => restore());
    };
  }, [rootRef, progressRef, refreshKey]);
}

export default useEraPageAnimations;
