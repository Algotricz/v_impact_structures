import { useEffect, useMemo, useRef, useState } from 'react';
import worksProjects from '../services/worksData';
import '../styles/Works.css';

/**
 * @typedef {{ title: string, location: string, image: string }} WorkProject
 */

const wrapIndex = (index, total) => (index + total) % total;

/**
 * @param {number} currentIndex Current active project index.
 * @param {number} direction Positive moves forward, negative moves backward.
 * @returns {number} Looped project index for carousel navigation.
 */
function getNextProjectIndex(currentIndex, direction) {
  const lastIndex = worksProjects.length - 1;

  if (direction > 0) return currentIndex === lastIndex ? 0 : currentIndex + 1;
  return currentIndex === 0 ? lastIndex : currentIndex - 1;
}

/**
 * @param {number} activeIndex Selected project index.
 * @param {number} size Diameter used for the circular text track.
 * @returns {{ project: WorkProject, slot: number, x: number, y: number, opacity: number, scale: number }[]}
 */
function getProjectSlots(activeIndex, size) {
  const slotCount = 11;
  const radiusX = size * 0.53;
  const radiusY = size * 0.43;

  return Array.from({ length: slotCount }, (_, slot) => {
    const offset = slot - 5;
    const angle = (-68 + slot * 13.6) * (Math.PI / 180);
    const distance = Math.abs(offset);

    return {
      project: worksProjects[wrapIndex(activeIndex + offset, worksProjects.length)],
      slot,
      x: size / 2 + Math.cos(angle) * radiusX + size * 0.07,
      y: size / 2 + Math.sin(angle) * radiusY,
      opacity: distance > 4 ? 0 : Math.max(1 - distance * 0.16, 0.36),
      scale: distance === 0 ? 1 : 0.92,
    };
  });
}

/** Full-screen recent works carousel inspired by the provided circular slider. */
function Works() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });
  const touchStartY = useRef(null);
  const wheelLock = useRef(false);
  const activeProject = worksProjects[activeIndex];
  const circleSize = Math.min(Math.max(viewport.height * 0.9, 520), viewport.width * 0.92);
  const projectSlots = useMemo(() => getProjectSlots(activeIndex, circleSize), [activeIndex, circleSize]);

  useEffect(() => {
    const updateViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    worksProjects.forEach((project) => { const image = new Image(); image.src = project.image; });
  }, []);

  const changeProject = (direction) => {
    setActiveIndex((current) => getNextProjectIndex(current, direction));
  };

  const showPrevious = () => changeProject(-1);
  const showNext = () => changeProject(1);

  const changeProjectFromGesture = (direction) => {
    if (wheelLock.current) return;
    wheelLock.current = true;
    changeProject(direction);
    window.setTimeout(() => { wheelLock.current = false; }, 750);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    if (Math.abs(event.deltaY) < 18) return;
    if (activeIndex === worksProjects.length - 1 && event.deltaY > 0) {
      window.scrollBy({ top: window.innerHeight, left: 0, behavior: 'smooth' });
      return;
    }
    changeProjectFromGesture(event.deltaY > 0 ? 1 : -1);
  };

  const handleTouchStart = (event) => {
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event) => {
    if (touchStartY.current === null) return;
    const deltaY = touchStartY.current - event.touches[0].clientY;
    if (Math.abs(deltaY) < 34) return;
    changeProjectFromGesture(deltaY > 0 ? 1 : -1);
    touchStartY.current = event.touches[0].clientY;
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'PageDown') changeProjectFromGesture(1);
    if (event.key === 'ArrowUp' || event.key === 'PageUp') changeProjectFromGesture(-1);
  };

  return (
    <main className="works-page">
      <section
        className="works-slider"
        tabIndex="0"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onKeyDown={handleKeyDown}
        aria-label="Recent works"
      >
        <a className="works-back-button" href="/" aria-label="Back to home">
          <span aria-hidden="true" />
        </a>
        <div className="works-page-title"><h1>Works.</h1></div>
        <div className="works-image__container" aria-hidden="true">
          <div className="works-image__inner" style={{ '--image-rotation': `${activeIndex * 180}deg` }}>
            <span className="works-inner works-inner--left" style={{ backgroundImage: `url(${activeProject.image})` }} />
            <span className="works-inner works-inner--right" style={{ backgroundImage: `url(${activeProject.image})` }} />
          </div>
          {worksProjects.map((project, index) => (
            <div
              className={`works-image__bg${index === activeIndex ? ' is-active' : ''}`}
              key={project.title}
              style={{ backgroundImage: `url(${project.image})` }}
            />
          ))}
        </div>

        <div className="works-animation__container" style={{ '--circle-size': `${circleSize}px` }}>
          <a className="works-button__container" href={activeProject.image} target="_blank" rel="noreferrer">
            <span className="works-button__inner"><span>View project <b aria-hidden="true">-&gt;</b></span></span>
          </a>

          <div className="works-circle" aria-hidden="true">
            <div className="works-outer-circle"><div className="works-outer-circle__inner" /></div>
            <div className="works-circle__container">
              <svg className="works-circle__inner" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
                <circle stroke="rgba(16, 18, 20, 0.12)" strokeWidth="0.25" fill="none" cx="50" cy="50" r="49" />
              </svg>
              <div className="works-circle__indicator" />
              <div className="works-circle__button" />
            </div>
          </div>

          <button className="works-arrow works-arrow--up" type="button" onClick={showPrevious} aria-label="Previous work" />
          <button className="works-arrow works-arrow--down" type="button" onClick={showNext} aria-label="Next work" />

          <div className="works-project-list" aria-live="polite">
            {projectSlots.map(({ project, slot, x, y, opacity, scale }) => (
              <article
                className={`works-project${slot === 5 ? ' is-active' : ''}`}
                key={`${project.title}-${slot}`}
                style={{ left: `${x}px`, top: `${y}px`, opacity, transform: `translateY(-50%) scale(${scale})` }}
              >
                <h2>{project.title}</h2>
                <p>{project.location}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Works;
