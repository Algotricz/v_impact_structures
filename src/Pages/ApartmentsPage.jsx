import { useMemo, useState } from 'react';
import '../styles/ApartmentsPage.css';

const apartments = [
  { image: '/Assets/bueprint/1.webp', name: 'Residence 01', typology: 'Ground floor + basement', bedrooms: '3', details: '3 bed / 2 bath', size: '1,840 sq ft', area: 1840 },
  { image: '/Assets/bueprint/2.webp', name: 'Residence 02', typology: 'Ground floor', bedrooms: '2', details: '2 bed / 2 bath', size: '1,365 sq ft', area: 1365 },
  { image: '/Assets/bueprint/1.webp', name: 'Residence 03', typology: 'Penthouse duplex', bedrooms: '3', details: '3 bed / 3 bath', size: '2,045 sq ft', area: 2045 },
];

/** Standalone apartment-selection page with static blueprint filters. */
function ApartmentsPage() {
  const [typology, setTypology] = useState('All');
  const [bedrooms, setBedrooms] = useState('All');
  const [sort, setSort] = useState('Relevant');
  const filteredApartments = useMemo(() => apartments
    .filter((apartment) => typology === 'All' || apartment.typology === typology)
    .filter((apartment) => bedrooms === 'All' || apartment.bedrooms === bedrooms)
    .sort((a, b) => sort === 'Largest' ? b.area - a.area : sort === 'Smallest' ? a.area - b.area : 0), [typology, bedrooms, sort]);

  const resetFilters = () => { setTypology('All'); setBedrooms('All'); setSort('Relevant'); };

  return (
    <main className="apartments-page">
      <header className="apartments-page__header">
        <a className="apartments-page__brand" href="/" aria-label="Return to V Impact Structures home"><span>V</span><span>Impact</span><span>Structures</span></a>
        <a className="apartments-page__contact" href="mailto:hello@vimpactstructures.com">Enquire now</a>
      </header>

      <section className="apartments-page__intro">
        <p>V Impact Structures / Collection 01</p>
        <h1>Apartments</h1>
        <span>{String(filteredApartments.length).padStart(2, '0')} residences</span>
      </section>

      <section className="apartment-filters" aria-label="Filter apartments">
        <label><span>Typology</span><select value={typology} onChange={(event) => setTypology(event.target.value)}><option>All</option><option>Ground floor + basement</option><option>Ground floor</option><option>Penthouse duplex</option></select></label>
        <label><span>Bedrooms</span><select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}><option>All</option><option value="2">2 bed</option><option value="3">3 bed</option></select></label>
        <label><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option>Relevant</option><option>Largest</option><option>Smallest</option></select></label>
        <button type="button" onClick={resetFilters}>Reset</button>
      </section>

      <section className="apartments-grid" aria-label="Available apartment plans">
        {filteredApartments.map((apartment) => (
          <article className="apartment-plan" key={apartment.name}>
            <p className="apartment-plan__eyebrow">{apartment.typology}</p>
            <h2>{apartment.name}</h2>
            <img src={apartment.image} alt={`${apartment.name} floor plan`} />
            <p className="apartment-plan__details">{apartment.details}</p>
            <p className="apartment-plan__size">{apartment.size}</p>
            <a href="mailto:hello@vimpactstructures.com?subject=Apartment%20enquiry">Request details</a>
          </article>
        ))}
        {!filteredApartments.length && <p className="apartments-grid__empty">No apartment matches these filters.</p>}
      </section>
    </main>
  );
}

export default ApartmentsPage;
