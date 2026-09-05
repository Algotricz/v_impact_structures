import '../styles/ClosingArc.css';

/**
 * Final homepage arc that repeats the scroll-driven space-to-live-in reveal
 * over the apartments hero image.
 */
function ClosingArc() {
  return (
    <section className="closing-arc" aria-label="Tamil Nadu homes by V Impact Structures">
      <div className="closing-arc__stamp" aria-hidden="true">
        <span className="closing-arc__stamp-word closing-arc__stamp-word--top">Tamil Nadu</span>
        <span className="closing-arc__stamp-word closing-arc__stamp-word--left">Kanyakumari</span>
        <span className="closing-arc__stamp-word closing-arc__stamp-word--right">Homes</span>
        <i><b /></i>
      </div>

      <div className="closing-arc__scroll" aria-hidden="true">
        <i />
        <b>64</b>
        <span>Scroll</span>
        <i />
      </div>

      <div className="closing-arc__disc">
        <div className="closing-arc__content">
          <p>V Impact Structures</p>
          <h2>
            <span>Coastal</span>
            <span>homes</span>
            <span>to</span>
            <em>settle in</em>
          </h2>
        </div>
      </div>
    </section>
  );
}

export default ClosingArc;
