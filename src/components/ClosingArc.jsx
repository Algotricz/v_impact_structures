import './ClosingArc.css';

/**
 * @param {{ onNavigate?: (event: import('react').MouseEvent<HTMLAnchorElement>, nextPath: string) => void }} props
 * Final homepage scene that closes the landing flow with an oversized arc and
 * direct apartment-selection call to action.
 */
function ClosingArc({ onNavigate }) {
  return (
    <section className="closing-arc" aria-label="The space to live in">
      <img
        className="closing-arc__image"
        src="/Assets/apartments%20.png"
        alt="V Impact Structures apartments with planted terraces"
      />
      <div className="closing-arc__wash" aria-hidden="true" />

      <div className="closing-arc__stamp" aria-hidden="true">
        <span className="closing-arc__stamp-word closing-arc__stamp-word--top">Residence</span>
        <span className="closing-arc__stamp-word closing-arc__stamp-word--left">V Impact</span>
        <i><b /></i>
      </div>

      <a className="closing-arc__cta" href="/apartments" onClick={(event) => onNavigate?.(event, '/apartments')}>
        <span>Select<br />an apartment</span>
        <b>Book a call<br />Contact</b>
      </a>

      <div className="closing-arc__scroll" aria-hidden="true">
        <i />
        <b>63</b>
        <span>Scroll</span>
        <i />
      </div>

      <div className="closing-arc__disc">
        <div className="closing-arc__content">
          <p>V Impact Structures</p>
          <h2>
            <span>The</span>
            <span>space</span>
            <span>to</span>
            <em>live in</em>
          </h2>
        </div>
      </div>
    </section>
  );
}

export default ClosingArc;
