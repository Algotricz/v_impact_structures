import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/SiteCursor.css';

const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  'summary',
  '[role="button"]',
  '[tabindex]:not([tabindex="-1"])',
  '[data-cursor="interactive"]',
].join(', ');

const BASE_SIZE = 42;
const ACTION_PADDING_X = 18;
const ACTION_PADDING_Y = 14;

/**
 * @param {HTMLElement} element Interactive element currently under the pointer.
 * @returns {{ x: number, y: number, width: number, height: number, radius: string }} Cursor outline dimensions.
 */
function getActionOutline(element) {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  const width = Math.max(rect.width + ACTION_PADDING_X * 2, 44);
  const height = Math.max(rect.height + ACTION_PADDING_Y * 2, 44);
  const radius = style.borderRadius && style.borderRadius !== '0px' ? style.borderRadius : `${height / 2}px`;

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    width,
    height,
    radius,
  };
}

/** Site-wide custom pointer that replaces the native cursor on fine pointer devices. */
function SiteCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useLayoutEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    const canUseCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!ring || !dot || !canUseCursor) {
      if (ring && dot) gsap.set([ring, dot], { display: 'none' });
      return undefined;
    }

    document.body.classList.add('has-site-cursor');

    let isVisible = false;
    let activeTarget = null;
    let lastPointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const moveRingX = gsap.quickTo(ring, 'x', { duration: 0.36, ease: 'power4.out' });
    const moveRingY = gsap.quickTo(ring, 'y', { duration: 0.36, ease: 'power4.out' });
    const resizeRingW = gsap.quickTo(ring, 'width', { duration: 0.3, ease: 'power4.out' });
    const resizeRingH = gsap.quickTo(ring, 'height', { duration: 0.3, ease: 'power4.out' });
    const moveDotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power2.out' });
    const moveDotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power2.out' });

    gsap.set([ring, dot], { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 1 });
    gsap.set(ring, { width: BASE_SIZE, height: BASE_SIZE, borderRadius: '50%' });

    const showCursor = () => {
      if (isVisible) return;
      isVisible = true;
      gsap.to([ring, dot], { autoAlpha: 1, duration: 0.22, ease: 'power2.out' });
    };

    const hideCursor = () => {
      isVisible = false;
      gsap.to([ring, dot], { autoAlpha: 0, duration: 0.2, ease: 'power2.out' });
    };

    const moveRingToPointer = () => {
      moveRingX(lastPointer.x);
      moveRingY(lastPointer.y);
    };

    const updateActionOutline = () => {
      if (!activeTarget) return;
      const outline = getActionOutline(activeTarget);
      moveRingX(outline.x);
      moveRingY(outline.y);
      resizeRingW(outline.width);
      resizeRingH(outline.height);
      gsap.to(ring, { borderRadius: outline.radius, duration: 0.3, ease: 'power4.out' });
    };

    const handlePointerMove = (event) => {
      showCursor();
      lastPointer = { x: event.clientX, y: event.clientY };
      if (activeTarget) updateActionOutline();
      else moveRingToPointer();
      moveDotX(event.clientX);
      moveDotY(event.clientY);
    };

    const handlePointerOver = (event) => {
      const target = event.target.closest(INTERACTIVE_SELECTOR);
      if (!target || target === activeTarget) return;
      activeTarget = target;
      ring.classList.add('is-action');
      updateActionOutline();
      gsap.to(dot, { scale: 0.72, duration: 0.24, ease: 'power4.out' });
    };

    const handlePointerOut = (event) => {
      const target = event.target.closest(INTERACTIVE_SELECTOR);
      if (!target || target.contains(event.relatedTarget)) return;
      activeTarget = null;
      ring.classList.remove('is-action');
      moveRingToPointer();
      resizeRingW(BASE_SIZE);
      resizeRingH(BASE_SIZE);
      gsap.to(ring, { borderRadius: '50%', duration: 0.28, ease: 'power4.out' });
      gsap.to(dot, { scale: 1, duration: 0.24, ease: 'power4.out' });
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('scroll', updateActionOutline, { passive: true });
    window.addEventListener('resize', updateActionOutline);
    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('pointerout', handlePointerOut);
    document.addEventListener('pointerleave', hideCursor);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', updateActionOutline);
      window.removeEventListener('resize', updateActionOutline);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
      document.removeEventListener('pointerleave', hideCursor);
      document.body.classList.remove('has-site-cursor');
    };
  }, []);

  return (
    <>
      <div className="site-cursor" ref={ringRef} aria-hidden="true" />
      <div className="site-cursor__dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}

export default SiteCursor;
