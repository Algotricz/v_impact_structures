import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';
import './styles/App.css';
import ClosingArc from './components/ClosingArc';
import HighlightCard from './components/HighlightCard';
import ApartmentsPage from './Pages/ApartmentsPage';
import Works from './Pages/Works';

const highlights = [
  { title: 'Crafted to endure', description: 'Timeless stone surfaces and flowering terraces give every exterior a lasting sense of character.' },
  { title: 'Light & flow', description: 'Openings, terraces and framed views bring daylight through every level and connect inside to out.' },
  { title: 'Your private sanctuary', description: 'A quiet pool setting creates an inviting place to pause, meet and enjoy the outdoors.' },
];

const residenceCarouselItems = [
  { eyebrow: '01 / Arrival', title: 'Stone arrival', detail: 'A quiet threshold shaped with white volumes and planted edges.', image: '/Assets/hero.webp' },
  { eyebrow: '02 / Balcony', title: 'Private terrace', detail: 'Outdoor rooms sized for shade, sea air and slow mornings.', image: '/Assets/balcony.png' },
  { eyebrow: '03 / Pool', title: 'Courtyard water', detail: 'A calm shared pool wrapped by planting and clean architecture.', image: '/Assets/hero.webp' },
  { eyebrow: '04 / Light', title: 'Coastal glass', detail: 'Large openings hold brightness without losing privacy.', image: '/Assets/balcony.png' },
  { eyebrow: '05 / Garden', title: 'Layered green', detail: 'Landscaping softens every edge and filters each view.', image: '/Assets/hero.webp' },
  { eyebrow: '06 / Living', title: 'Open plan', detail: 'Simple interiors connect naturally to the terrace.', image: '/Assets/balcony.png' },
];

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create('loaderEase', 'M0,0,C0,0,0.13,0.34,0.238,0.442,0.305,0.506,0.322,0.514,0.396,0.54,0.478,0.568,0.468,0.56,0.522,0.584,0.572,0.606,0.61,0.719,0.714,0.826,0.798,0.912,1,1,1,1');

/** Full-bleed residence landing hero with a single-image parallax reveal. */
function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [showPreloader, setShowPreloader] = useState(window.location.pathname === '/');
  const [fixedChrome, setFixedChrome] = useState({ tone: 'dark', visible: false });
  const preloaderRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const scrollProgressRef = useRef(null);
  const horizontalSectionRef = useRef(null);
  const horizontalPinRef = useRef(null);
  const horizontalTrackRef = useRef(null);
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
    if (path !== '/') setShowPreloader(false);
  }, [path]);

  useEffect(() => {
    if (path !== '/') {
      setFixedChrome({ tone: 'dark', visible: false });
      return undefined;
    }

    let frame = 0;
    const getCarouselPlayDistance = () => Math.min(Math.max(window.innerWidth * 2.2, 1800), 3600);
    const getNextChrome = () => {
      const story = document.querySelector('.story');
      const horizontal = horizontalSectionRef.current;
      const track = horizontalTrackRef.current;
      const apartmentsHero = document.querySelector('.apartments-hero');
      const scrollY = window.scrollY;
      const storyTop = story?.offsetTop ?? Number.POSITIVE_INFINITY;
      const horizontalTop = horizontal?.offsetTop ?? Number.POSITIVE_INFINITY;
      const apartmentsTop = apartmentsHero?.offsetTop ?? Number.POSITIVE_INFINITY;

      if (scrollY < storyTop - window.innerHeight * 0.32) {
        return { tone: 'dark', visible: false };
      }

      if (scrollY < horizontalTop - 2) {
        return { tone: 'dark', visible: true };
      }

      if (scrollY >= apartmentsTop - 2) {
        return { tone: 'light', visible: true };
      }

      const horizontalDistance = Math.max((track?.scrollWidth ?? window.innerWidth) - window.innerWidth, 1) + getCarouselPlayDistance();
      const progress = Math.min(Math.max((scrollY - horizontalTop) / horizontalDistance, 0), 1);
      if (progress >= 0.25 && progress < 0.5) return { tone: 'light', visible: true };
      return { tone: 'dark', visible: true };
    };

    const updateChrome = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const nextChrome = getNextChrome();
        setFixedChrome((current) => (
          current.tone === nextChrome.tone && current.visible === nextChrome.visible
            ? current
            : nextChrome
        ));
      });
    };

    updateChrome();
    window.addEventListener('scroll', updateChrome, { passive: true });
    window.addEventListener('resize', updateChrome);
    window.addEventListener('load', updateChrome);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateChrome);
      window.removeEventListener('resize', updateChrome);
      window.removeEventListener('load', updateChrome);
    };
  }, [path]);

  useEffect(() => {
    if (path !== '/') return undefined;

    const progressBar = scrollProgressRef.current;
    const label = progressBar?.querySelector('.scroll-progress__number');
    if (!progressBar || !label) return undefined;

    let frame = 0;
    const updateProgress = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
        const percent = Math.round(progress * 100);

        progressBar.style.setProperty('--progress', `${progress * 100}%`);
        label.textContent = String(percent).padStart(2, '0');
      });
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    window.addEventListener('load', updateProgress);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      window.removeEventListener('load', updateProgress);
    };
  }, [path]);

  useLayoutEffect(() => {
    if (path !== '/') return undefined;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const canUseCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!cursor || !cursorDot || !canUseCursor || prefersReducedMotion) {
      if (cursor) gsap.set(cursor, { display: 'none' });
      return undefined;
    }

    document.body.classList.add('has-custom-cursor');

    let isVisible = false;
    const moveCursorX = gsap.quickTo(cursor, 'x', { duration: 0.42, ease: 'power4.out' });
    const moveCursorY = gsap.quickTo(cursor, 'y', { duration: 0.42, ease: 'power4.out' });
    const moveDotX = gsap.quickTo(cursorDot, 'x', { duration: 0.12, ease: 'power2.out' });
    const moveDotY = gsap.quickTo(cursorDot, 'y', { duration: 0.12, ease: 'power2.out' });

    gsap.set([cursor, cursorDot], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const showCursor = () => {
      if (isVisible) return;
      isVisible = true;
      gsap.to([cursor, cursorDot], { autoAlpha: 1, duration: 0.28, ease: 'power2.out' });
    };
    const hideCursor = () => {
      isVisible = false;
      gsap.to([cursor, cursorDot], { autoAlpha: 0, duration: 0.28, ease: 'power2.out' });
    };
    const handlePointerMove = (event) => {
      showCursor();
      moveCursorX(event.clientX);
      moveCursorY(event.clientY);
      moveDotX(event.clientX);
      moveDotY(event.clientY);
    };
    const handlePointerOver = (event) => {
      if (!event.target.closest('a, button, .hero__marker, .residence-carousel__item')) return;
      gsap.to(cursor, { scale: 1.9, duration: 0.38, ease: 'power4.out' });
      gsap.to(cursorDot, { scale: 0.55, duration: 0.34, ease: 'power4.out' });
    };
    const handlePointerOut = (event) => {
      const target = event.target.closest('a, button, .hero__marker, .residence-carousel__item');
      if (!target || target.contains(event.relatedTarget)) return;
      gsap.to(cursor, { scale: 1, duration: 0.38, ease: 'power4.out' });
      gsap.to(cursorDot, { scale: 1, duration: 0.34, ease: 'power4.out' });
    };

    window.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('pointerout', handlePointerOut);
    document.addEventListener('pointerleave', hideCursor);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
      document.removeEventListener('pointerleave', hideCursor);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [path]);

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
        transitionOffset: 112 - transitionProgress * 87,
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

  useLayoutEffect(() => {
    if (path !== '/' || !showPreloader) return undefined;

    const preloader = preloaderRef.current;
    if (!preloader) return undefined;
    const heroPieces = '.hero__header, .hero__brief, .hero__booking-note, .hero__content, .hero__fact-strip';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(heroPieces, { clearProps: 'opacity,visibility,transform' });
      setShowPreloader(false);
      return undefined;
    }

    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    let hasFinished = false;
    const finishIntro = () => {
      if (hasFinished) return;
      hasFinished = true;
      gsap.set(heroPieces, { autoAlpha: 1, y: 0, clearProps: 'opacity,visibility,transform' });
      gsap.set('.hero__sky', { clearProps: 'transform' });
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
      setShowPreloader(false);
      ScrollTrigger.refresh();
    };

    gsap.set(preloader, { autoAlpha: 1 });
    gsap.set('.hero__sky', { scale: 1.035, transformOrigin: 'center top' });
    gsap.set(heroPieces, { autoAlpha: 0, y: 26 });
    gsap.set('.intro-preloader [data-part="h"], .intro-preloader [data-part="a"], .intro-preloader [data-part="ctn"]', {
      autoAlpha: 0,
      y: 24,
      rotateX: 72,
      transformOrigin: 'center bottom',
    });

    const failSafe = window.setTimeout(finishIntro, 3600);
    const timeline = gsap.timeline({
      defaults: { overwrite: true },
      onComplete: finishIntro,
    });

    timeline
      .to('.intro-preloader [data-part="h"], .intro-preloader [data-part="a"], .intro-preloader [data-part="ctn"]', {
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
        duration: 0.95,
        ease: 'power3.out',
        stagger: 0.08,
      }, 0.08)
      .fromTo('.intro-preloader__line-fill', {
        yPercent: -100,
      }, {
        yPercent: 0,
        duration: 1.15,
        ease: 'loaderEase',
      }, 0.14)
      .to('.intro-preloader__inner', {
        autoAlpha: 0,
        y: -20,
        scale: 0.985,
        duration: 0.72,
        ease: 'power2.inOut',
      }, 1.16)
      .to('.hero__sky', {
        scale: 1,
        duration: 1.05,
        ease: 'power3.out',
        clearProps: 'transform',
      }, 1.16)
      .to(heroPieces, {
        autoAlpha: 1,
        y: 0,
        duration: 0.88,
        ease: 'power3.out',
        stagger: 0.05,
        clearProps: 'opacity,visibility,transform',
      }, 1.28)
      .to(preloader, {
        autoAlpha: 0,
        duration: 0.82,
        ease: 'power2.inOut',
      }, 1.24);

    return () => {
      window.clearTimeout(failSafe);
      timeline.kill();
      gsap.set(heroPieces, { clearProps: 'opacity,visibility,transform' });
      gsap.set('.hero__sky', { clearProps: 'transform' });
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
    };
  }, [path, showPreloader]);

  useLayoutEffect(() => {
    if (path !== '/') return undefined;

    const section = horizontalSectionRef.current;
    const pin = horizontalPinRef.current;
    const track = horizontalTrackRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: 1.18,
      easing: (time) => Math.min(1, 1.001 - 2 ** (-10 * time)),
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1.05,
    });
    const updateLenis = (time) => lenis.raf(time * 1000);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    if (!section || !pin || !track || prefersReducedMotion) {
      return () => {
        gsap.ticker.remove(updateLenis);
        lenis.destroy();
      };
    }

    const desktopQuery = window.matchMedia('(min-width: 701px)');
    const context = gsap.context(() => {
      const getScrollDistance = () => Math.max(track.scrollWidth - window.innerWidth, 1);

      gsap.from('.story__kicker, .story h2, .story__pager, .story__copy, .story__statement', {
        autoAlpha: 0,
        y: 34,
        duration: 0.95,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.story',
          start: 'top 68%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from('.story__image', {
        autoAlpha: 0,
        y: 46,
        scale: 1.08,
        duration: 1.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.story',
          start: 'top 62%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.to('.story__kicker, .story h2, .story__image, .story__pager, .story__copy, .story__statement', {
        xPercent: (index) => [0, -1.2, 1.4, -0.6, 0.8, -0.9][index % 6],
        yPercent: (index) => [-8, 5, -5, 7, -4, 4][index % 6],
        ease: 'sine.inOut',
        scrollTrigger: {
          trigger: '.story',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.15,
        },
      });

      gsap.fromTo('.apartments-hero__image-wrap', {
        scale: 1.18,
        yPercent: 12,
        clipPath: 'inset(20% 0% 0% 0%)',
      }, {
        scale: 1,
        yPercent: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'none',
        scrollTrigger: {
          trigger: '.apartments-hero',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1.1,
        },
      });

      gsap.from('.apartments-hero__copy', {
        autoAlpha: 0,
        y: 34,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.055,
        scrollTrigger: {
          trigger: '.apartments-hero',
          start: 'top 72%',
          toggleActions: 'play none none reverse',
        },
      });

      if (desktopQuery.matches) {
        const getCarouselPlayDistance = () => Math.min(Math.max(window.innerWidth * 2.2, 1800), 3600);
        const scrollRange = {
          trigger: section,
          scrub: 0.9,
          start: 'top top',
          end: () => `+=${getScrollDistance() + getCarouselPlayDistance()}`,
          invalidateOnRefresh: true,
        };

        gsap.set('.concept-section__kicker, .concept-section h2, .concept-section > p, .concept-section__mark', {
          autoAlpha: 1,
          y: 0,
        });
        gsap.set('.coast-map path', { strokeDasharray: 1500, strokeDashoffset: 1500 });
        const carouselItems = gsap.utils.toArray('.residence-carousel__item');
        let carouselRadius = 0;
        let itemAngle = 0;
        if (carouselItems.length) {
          carouselRadius = Math.min(Math.max(window.innerWidth * 0.22, 330), 470);
          itemAngle = 360 / carouselItems.length;

          gsap.set('.residence-carousel__stage', { perspective: 1400 });
          gsap.set('.residence-carousel__ring', {
            transformStyle: 'preserve-3d',
            z: -carouselRadius,
            rotationX: -4,
            rotationY: -18,
          });
          carouselItems.forEach((item, index) => {
            gsap.set(item, {
              autoAlpha: 1,
              rotationY: itemAngle * index,
              z: carouselRadius,
              transformOrigin: `50% 50% ${-carouselRadius}px`,
            });
          });
          carouselItems[0]?.classList.add('is-active');
        }

        const carouselSpinStart = () => getScrollDistance() / (getScrollDistance() + getCarouselPlayDistance());
        const carouselRing = document.querySelector('.residence-carousel__ring');
        const moveTrackX = gsap.quickTo(track, 'x', { duration: 0.26, ease: 'power3.out' });
        const rotateRingY = carouselRing ? gsap.quickTo(carouselRing, 'rotationY', { duration: 0.36, ease: 'power3.out' }) : null;
        const rotateRingX = carouselRing ? gsap.quickTo(carouselRing, 'rotationX', { duration: 0.42, ease: 'power3.out' }) : null;
        const moveRingZ = carouselRing ? gsap.quickTo(carouselRing, 'z', { duration: 0.42, ease: 'power3.out' }) : null;

        ScrollTrigger.create({
          ...scrollRange,
          pin: section,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const spinStart = carouselSpinStart();
            const trackProgress = gsap.utils.clamp(0, 1, self.progress / spinStart);
            moveTrackX(-getScrollDistance() * trackProgress);

            if (carouselItems.length && rotateRingY && rotateRingX && moveRingZ) {
              const playProgress = gsap.utils.clamp(0, 1, (self.progress - spinStart) / (1 - spinStart));
              const wave = Math.sin(playProgress * Math.PI * 2);
              const currentRotation = -18 - playProgress * 2520;
              const frontIndex = Math.round(gsap.utils.wrap(0, 360, -currentRotation) / itemAngle) % carouselItems.length;
              const cardWave = playProgress * Math.PI * 8;

              carouselItems.forEach((item, index) => {
                item.classList.toggle('is-active', index === frontIndex);
              });
              rotateRingY(currentRotation);
              rotateRingX(-4 + wave * 2.5);
              moveRingZ(-carouselRadius + Math.sin(playProgress * Math.PI) * 32);
              gsap.to(carouselItems, {
                yPercent: (index) => Math.sin(cardWave + index * 0.75) * 2 - (index === frontIndex ? 8 : 0),
                scale: (index) => (index === frontIndex ? 1.08 : 0.95),
                duration: 0.34,
                ease: 'power3.out',
                overwrite: true,
              });
            }
          },
        });

        const waveTimeline = gsap.timeline({
          scrollTrigger: {
            ...scrollRange,
            scrub: 1.05,
          },
        });

        waveTimeline
          .to('.concept-section__kicker, .concept-section h2, .concept-section > p, .concept-section__mark, .horizontal-panel__title p, .coast-map, .residence-carousel__copy, .residence-carousel__stage', {
            xPercent: (index) => [2.8, -2.2, 1.4, -1.8, 1.1][index % 5],
            yPercent: (index) => [-5, 4, -3, 5, -4][index % 5],
            duration: 0.42,
            ease: 'sine.inOut',
            stagger: 0.01,
          }, 0)
          .to('.concept-section__kicker, .concept-section h2, .concept-section > p, .concept-section__mark, .horizontal-panel__title p, .coast-map, .residence-carousel__copy, .residence-carousel__stage', {
            xPercent: (index) => [-2, 2.5, -1.5, 2.1, -1.1][index % 5],
            yPercent: (index) => [4, -4, 5, -3, 3][index % 5],
            duration: 0.42,
            ease: 'sine.inOut',
          }, 0.22)
          .to('.concept-section__kicker, .concept-section h2, .concept-section > p, .concept-section__mark, .horizontal-panel__title p, .coast-map, .residence-carousel__copy, .residence-carousel__stage', {
            xPercent: 0,
            yPercent: 0,
            duration: 0.34,
            ease: 'sine.inOut',
          }, 0.44)
          .to('.horizontal-panel__word', {
            yPercent: (index) => [-8, 5, -6][index % 3],
            rotation: (index) => [-2.4, 1.7, -1.2][index % 3],
            duration: 0.42,
            ease: 'sine.inOut',
            stagger: 0.025,
          }, 0.1)
          .to('.horizontal-panel__word', {
            yPercent: (index) => [4, -7, 5][index % 3],
            rotation: (index) => [1.2, -1.8, 2.2][index % 3],
            duration: 0.42,
            ease: 'sine.inOut',
          }, 0.36)
          .to('.horizontal-panel--mile img', {
            xPercent: -2.4,
            yPercent: -3,
            scale: 1.04,
            duration: 0.72,
            ease: 'sine.inOut',
          }, 0.18)
          .to('.coast-copy h2', {
            xPercent: -1.5,
            yPercent: -4,
            duration: 0.4,
            ease: 'sine.inOut',
          }, 0.64)
          .to('.coast-copy h2', {
            xPercent: 1.3,
            yPercent: 3,
            duration: 0.4,
            ease: 'sine.inOut',
          }, 0.82)
          .to('.coast-copy span', {
            rotation: -7,
            xPercent: 3,
            duration: 0.36,
            ease: 'sine.inOut',
          }, 0.67)
          .to('.coast-copy span', {
            rotation: -13,
            xPercent: -2,
            duration: 0.36,
            ease: 'sine.inOut',
          }, 0.87)
          .to('.coast-map__point, .coast-map__mark', {
            yPercent: (index) => [-18, 12, -10, 14, -12, 10, -8][index % 7],
            xPercent: (index) => [6, -5, 4, -6, 5, -4, 3][index % 7],
            duration: 0.42,
            ease: 'sine.inOut',
            stagger: 0.015,
          }, 0.72)
          .to('.coast-map__point, .coast-map__mark', {
            yPercent: 0,
            xPercent: 0,
            duration: 0.34,
            ease: 'sine.inOut',
          }, 1.04);

        const horizontalContent = gsap.timeline({ scrollTrigger: scrollRange });
        horizontalContent
          .to('.concept-section__kicker, .concept-section h2, .concept-section > p, .concept-section__mark', {
            autoAlpha: 0,
            y: -18,
            duration: 0.22,
            ease: 'power2.inOut',
            stagger: 0.01,
          }, 0.24)
          .from('.horizontal-panel--mile img', {
            autoAlpha: 0.35,
            scale: 1.12,
            duration: 0.48,
            ease: 'power3.out',
          }, 0.13)
          .from('.horizontal-panel__word', {
            autoAlpha: 0,
            y: 64,
            duration: 0.38,
            ease: 'power3.out',
            stagger: 0.045,
          }, 0.15)
          .from('.horizontal-panel__title p', {
            autoAlpha: 0,
            x: -34,
            duration: 0.3,
            ease: 'power3.out',
          }, 0.21)
          .to('.horizontal-panel__word', {
            y: -32,
            duration: 0.46,
            ease: 'power1.inOut',
          }, 0.48)
          .from('.coast-copy h2', {
            autoAlpha: 0.08,
            y: 34,
            duration: 0.28,
            ease: 'power3.out',
          }, 0.39)
          .from('.coast-copy span', {
            autoAlpha: 0.08,
            y: 16,
            duration: 0.24,
            ease: 'power3.out',
          }, 0.42)
          .to('.coast-map path', {
            strokeDashoffset: 0,
            duration: 0.36,
            ease: 'power1.inOut',
          }, 0.47)
          .from('.coast-map__point, .coast-map__mark', {
            autoAlpha: 0.15,
            y: 14,
            duration: 0.3,
            ease: 'power3.out',
            stagger: 0.018,
          }, 0.51)
          .from('.residence-carousel__copy p, .residence-carousel__copy h2, .residence-carousel__copy a', {
            autoAlpha: 0,
            y: 34,
            duration: 0.42,
            ease: 'power3.out',
            stagger: 0.04,
          }, 0.68)
          .from('.residence-carousel__card', {
            autoAlpha: 0,
            x: (index) => [-420, 360, -260, 310][index % 4],
            y: (index) => [-240, 190, 260, -160][index % 4],
            z: -900,
            rotationX: (index) => [48, -40, 34, -28][index % 4],
            rotationY: (index) => [-58, 48, -36, 42][index % 4],
            scale: 0.72,
            duration: 0.58,
            ease: 'power4.out',
            stagger: 0.025,
          }, 0.72);
      }
    });

    const refreshScroll = () => ScrollTrigger.refresh();
    window.addEventListener('load', refreshScroll);
    window.addEventListener('resize', refreshScroll);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('load', refreshScroll);
      window.removeEventListener('resize', refreshScroll);
      context.revert();
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
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
      '--hero-scroll-color': scrollState.arcIsOpen ? '#112947' : 'rgba(255,255,255,.88)',
    }}>
      <div className={`fixed-chrome fixed-chrome--${fixedChrome.tone}${fixedChrome.visible ? ' is-visible' : ''}`}>
        <a className="fixed-chrome__cta" href="/apartments" onClick={(event) => navigateTo(event, '/apartments')}>
          <span>Select<br />an apartment</span>
          <b>Book a call<br />Contact</b>
        </a>
      </div>
      <div className="scroll-progress" ref={scrollProgressRef} style={{ '--progress': '0%' }} aria-hidden="true">
        <span className="scroll-progress__word">Scroll</span>
        <div className="scroll-progress__bar">
          <span className="scroll-progress__fill" />
          <span className="scroll-progress__thumb"><b className="scroll-progress__number">00</b></span>
        </div>
      </div>
      <div className="custom-cursor" ref={cursorRef} aria-hidden="true" />
      <div className="custom-cursor__dot" ref={cursorDotRef} aria-hidden="true" />
      {showPreloader && <div className="intro-preloader" ref={preloaderRef} aria-hidden="true">
        <div className="intro-preloader__inner">
          <div className="intro-preloader__top-symbol" data-part="ctn">
            <i><b /></i>
          </div>
          <div className="intro-preloader__main">
            <p className="intro-preloader__side intro-preloader__side--left" data-part="h">V Impact</p>
            <div className="intro-preloader__brand">
              <h2 data-part="h">V Impact<br />Structures</h2>
              <p data-part="a">Residence</p>
            </div>
            <p className="intro-preloader__side intro-preloader__side--right" data-part="h">Kanyakumari</p>
          </div>
          <div className="intro-preloader__bottom">
            <div className="intro-preloader__line" data-part="line">
              <i className="intro-preloader__line-fill" />
            </div>
            <p data-part="ctn">V Impact Structures<br />Built to stay.</p>
          </div>
        </div>
      </div>}
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
            <span className="arc-content__number">12</span>
            <div className="arc-content__words" aria-label="Three reasons to choose ERA">
              <span className="arc-content__word arc-content__word--one">Three</span>
              <span className="arc-content__word arc-content__word--two">Reasons</span>
              <span className="arc-content__word arc-content__word--three">To</span>
              <span className="arc-content__word arc-content__word--four">Choose</span>
              <span className="arc-content__word arc-content__word--five">Era</span>
            </div>
            <div className="arc-content__brand" aria-label="Costa del Sol">
              <span>Costa</span>
              <i aria-hidden="true"><b /></i>
              <span>Del Sol</span>
            </div>
            <i className="arc-content__line" />
          </div>
          <p className="hero__scroll"><span>Scroll</span><i /></p>
        </div>
      </section>
      <section className="story" id="story">
        <p className="story__kicker">V Impact Structures</p>
        <h2>Built to stay</h2>
        <div className="story__image" role="img" aria-label="V Impact Structures residence detail" />
        <div className="story__pager" aria-label="Residence image pagination"><button type="button" aria-label="Previous image">‹</button><b>02</b><i /><b>03</b><button type="button" aria-label="Next image">›</button></div>
        <p className="story__copy">Thoughtful architecture, natural materials and lush landscaping create a residence designed for lasting everyday life.</p>
        <p className="story__statement">Designed as a community,<br />not a complex</p>
      </section>
      <section className="horizontal-story" ref={horizontalSectionRef} aria-label="Coastal location story">
        <div className="horizontal-story__sticky" ref={horizontalPinRef}>
          <div className="horizontal-story__track" ref={horizontalTrackRef}>
            <section className="concept-section horizontal-panel horizontal-panel--concept" aria-label="The concept">
              <p className="concept-section__kicker">The concept</p>
              <h2>V Impact Structures is a boutique gated community of only 03 residences, designed around privacy, wellbeing and timeless coastal living</h2>
              <p>Inspired by the atmosphere of the coast, the project combines contemporary architecture with warm materials, natural landscaping and carefully curated spaces.</p>
              <i className="concept-section__mark" aria-hidden="true"><b /></i>
            </section>
            <section className="horizontal-panel horizontal-panel--mile" aria-label="New golden mile">
              <div className="horizontal-panel__title">
                <h2>
                  <span className="horizontal-panel__word horizontal-panel__word--new">New</span>
                  <span className="horizontal-panel__word horizontal-panel__word--golden">Golden</span>
                  <span className="horizontal-panel__word horizontal-panel__word--mile">Mile</span>
                </h2>
                <p>Spain</p>
              </div>
              <img src="/Assets/balcony.png" alt="Private balcony with shaded seating, greenery and sea view" />
            </section>
            <section className="horizontal-panel horizontal-panel--coast" aria-label="The coast you wanted">
              <div className="coast-copy">
                <h2>The coast you want<br /><span>yours</span><br />this year</h2>
              </div>
              <div className="coast-map" aria-label="Nearby coastal destinations">
                <div className="coast-map__point coast-map__point--one"><b>Gibraltar</b><span>50 min</span><i /></div>
                <div className="coast-map__point coast-map__point--two"><b>Estepona</b><span>10 min</span><i /></div>
                <div className="coast-map__point coast-map__point--three"><b>Kempinski</b><span>5 min</span><i /></div>
                <i className="coast-map__mark" aria-hidden="true"><b /></i>
                <div className="coast-map__point coast-map__point--four"><b>Puerto Banus</b><span>20 min</span><i /></div>
                <div className="coast-map__point coast-map__point--five"><b>Marbella</b><span>25 min</span><i /></div>
                <div className="coast-map__point coast-map__point--six"><b>Malaga Airport</b><span>45 min</span><i /></div>
                <svg viewBox="0 0 1180 170" role="presentation" aria-hidden="true">
                  <path d="M20 128 C150 108 245 79 318 62 C358 53 315 48 306 39 C347 43 441 38 492 43 C532 47 466 67 500 70 C606 62 641 36 660 55 C676 71 604 83 662 79 C790 70 891 76 968 63 C1026 53 994 29 1050 45 C1098 58 1135 60 1160 54" />
                </svg>
              </div>
            </section>
            <section className="horizontal-panel horizontal-panel--carousel" aria-label="Residence details carousel">
              <div className="residence-carousel__copy">
                <p>Details in motion</p>
                <h2>Choose the residence<br />from every angle</h2>
                <a href="/apartments">View available apartments</a>
              </div>
              <div className="residence-carousel__stage" aria-label="Rotating residence highlights">
                <div className="residence-carousel__ring">
                  {residenceCarouselItems.map((item) => (
                    <figure
                      className="residence-carousel__item"
                      key={item.title}
                    >
                      <div className="residence-carousel__card">
                        <img src={item.image} alt="" />
                        <figcaption>
                          <span>{item.eyebrow}</span>
                          <h3>{item.title}</h3>
                          <p>{item.detail}</p>
                        </figcaption>
                      </div>
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
      <section className="apartments-hero" aria-label="Apartments above the coast">
        <div className="apartments-hero__sticky">
          <div className="apartments-hero__image-wrap">
            <img src="/Assets/apartments%20.png" alt="Apartments overlooking the coast and mountains" />
          </div>
          <div className="apartments-hero__top-blend" aria-hidden="true" />
          <div className="apartments-hero__cloud-stack" aria-hidden="true">
            <div className="apartments-hero__cloud-layer apartments-hero__cloud-layer--back">
              <div className="apartments-hero__cloud-track">
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
              </div>
            </div>
            <div className="apartments-hero__cloud-layer apartments-hero__cloud-layer--mid">
              <div className="apartments-hero__cloud-track">
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
              </div>
            </div>
            <div className="apartments-hero__cloud-layer apartments-hero__cloud-layer--front">
              <div className="apartments-hero__cloud-track">
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
                <span className="apartments-hero__cloud"><img src="/Assets/clouds/cloud1.png" alt="" /></span>
              </div>
            </div>
          </div>
          <div className="apartments-hero__copy">
            <p>Residences with horizon</p>
            <h2>A full coastal view<br />opens below</h2>
          </div>
        </div>
      </section>
      <ClosingArc onNavigate={navigateTo} />
    </main>
  );
}

export default App;
