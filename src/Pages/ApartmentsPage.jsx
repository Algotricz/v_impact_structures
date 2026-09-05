import { useMemo, useState } from 'react';
import '../styles/ApartmentsPage.css';
import { apartments } from '../services/apartmentsData';
import siteContent from '../services/siteContent';

/**
 * @param {{ onNavigate?: (event: React.MouseEvent<HTMLAnchorElement>, path: string) => void }} props
 * Standalone apartment-selection page with static blueprint filters.
 */
function ApartmentsPage({ onNavigate }) {
  const [typology, setTypology] = useState('All');
  const [bedrooms, setBedrooms] = useState('All');
  const [sort, setSort] = useState('Relevant');
  const filteredApartments = useMemo(() => apartments
    .filter((apartment) => typology === 'All' || apartment.typology === typology)
    .filter((apartment) => bedrooms === 'All' || apartment.bedrooms === bedrooms)
    .sort((a, b) => sort === 'Largest' ? b.interior - a.interior : sort === 'Smallest' ? a.interior - b.interior : 0), [typology, bedrooms, sort]);

  const resetFilters = () => { setTypology('All'); setBedrooms('All'); setSort('Relevant'); };

  return (
    <main className="apartments-page">
      <header className="apartments-page__header">
        <a className="apartments-page__brand" href="/" onClick={(event) => onNavigate?.(event, '/')} aria-label="Return to V Impact Structures home"><span>V</span><span>Impact</span><span>Structures</span></a>
        <a className="apartments-page__contact" href={siteContent.phoneHref}>Call for site visit</a>
      </header>

      <section className="apartments-page__intro">
        <p>{siteContent.clientName} / {siteContent.city}, {siteContent.region}</p>
        <h1>Coastal homes</h1>
        <span>{String(filteredApartments.length).padStart(2, '0')} Kanyakumari homes</span>
      </section>

      <section className="apartment-filters" aria-label="Filter apartments">
        <label><span>Home type</span><select value={typology} onChange={(event) => setTypology(event.target.value)}><option>All</option><option>Ground floor + basement</option><option>Ground floor</option><option>Penthouse duplex</option></select></label>
        <label><span>Bedrooms</span><select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}><option>All</option><option value="2">2 bed</option><option value="3">3 bed</option></select></label>
        <label><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option>Relevant</option><option>Largest</option><option>Smallest</option></select></label>
        <button type="button" onClick={resetFilters}>Reset</button>
      </section>

      <section className="apartments-grid" aria-label="Available apartment plans">
        {filteredApartments.map((apartment) => (
          <article className="apartment-plan" key={apartment.name}>
            <p className="apartment-plan__eyebrow">{apartment.typology}</p>
            <h2>No. {apartment.id}</h2>
            <a
              className="apartment-plan__image-link"
              href={`/apartments/${apartment.id}`}
              onClick={(event) => onNavigate?.(event, `/apartments/${apartment.id}`)}
              aria-label={`Open ${apartment.name} detail page`}
            >
              <img src={apartment.planImage} alt={`${apartment.name} floor plan`} />
            </a>
            <p className="apartment-plan__details">{apartment.bedrooms} bed / {apartment.bathrooms} bath / Kanyakumari</p>
            <p className="apartment-plan__size">{apartment.interior} m2 home + {apartment.terrace} m2 shaded terrace</p>
            <a className="apartment-plan__cta" href={`/apartments/${apartment.id}`} onClick={(event) => onNavigate?.(event, `/apartments/${apartment.id}`)}>View floor plan</a>
          </article>
        ))}
        {!filteredApartments.length && <p className="apartments-grid__empty">No Kanyakumari home matches these filters.</p>}
      </section>
    </main>
  );
}

export default ApartmentsPage;
