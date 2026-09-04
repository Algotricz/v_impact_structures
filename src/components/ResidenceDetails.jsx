import './ResidenceDetails.css';

/**
 * @param {{ onNavigate?: (event: import('react').MouseEvent<HTMLAnchorElement>, nextPath: string) => void }} props
 * Editorial details section shown after the closing arc reveal.
 */
function ResidenceDetails({ onNavigate }) {
  return (
    <section className="residence-details" aria-label="Residence details">
      <div className="residence-details__media residence-details__media--left">
        <img src="/Assets/hero.webp" alt="Flowering garden beside the residence" />
      </div>

      <article className="residence-details__story">
        <img src="/Assets/balcony.png" alt="Private terrace with outdoor seating and coastal view" />
        <h2>Every detail was selected to create homes that feel elegant, intuitive and effortless to live in</h2>
        <p>Underfloor heating throughout the property. Climate automation systems. Smart lock access systems. Electrically adjustable aluminium shutters. Schneider Electric DLIFE switches and mechanisms.</p>
        <a href="/apartments" onClick={(event) => onNavigate?.(event, '/apartments')}>
          <span>View available<br />apartments</span>
        </a>
      </article>

      <div className="residence-details__upgrades">
        <p>Optional upgrades are available:</p>
        <ul>
          <li>Private jacuzzi</li>
          <li>EV charging point installation</li>
          <li>Photovoltaic panels</li>
        </ul>
      </div>
    </section>
  );
}

export default ResidenceDetails;
