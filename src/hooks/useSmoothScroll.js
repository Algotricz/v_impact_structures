import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

let pluginsRegistered = false;

/** Registers GSAP plugins needed by the smooth-scroll bridge once per app session. */
function registerSmoothScrollPlugins() {
  if (pluginsRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  pluginsRegistered = true;
}

/**
 * Enables Lenis smooth scrolling and keeps ScrollTrigger synchronized.
 * @param {{ enabled?: boolean, duration?: number, touchMultiplier?: number }} options Smooth-scroll setup options.
 */
function useSmoothScroll({ enabled = true, duration = 1.2, touchMultiplier = 2 } = {}) {
  useEffect(() => {
    registerSmoothScrollPlugins();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!enabled || prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      duration,
      easing: (time) => Math.min(1, 1.001 - 2 ** (-10 * time)),
      smoothWheel: true,
      touchMultiplier,
    });
    lenis.scrollTo(0, { immediate: true });

    const updateLenis = (time) => lenis.raf(time * 1000);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, [duration, enabled, touchMultiplier]);
}

export default useSmoothScroll;
