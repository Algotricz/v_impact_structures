import { useMemo, useRef, useState } from 'react';
import '../styles/ApartmentDetailPage.css';
import EraModal from '../components/EraModal';
import useEraPageAnimations from '../hooks/useEraPageAnimations';
import useSmoothScroll from '../hooks/useSmoothScroll';
import { getApartmentById, getSimilarApartments } from '../services/apartmentsData';
import siteContent from '../services/siteContent';

/**
 * @param {{ apartmentId: string, onNavigate?: (event: React.MouseEvent<HTMLAnchorElement>, path: string) => void }} props
 * Animated apartment detail page opened from a blueprint card.
 */
function ApartmentDetailPage({ apartmentId, onNavigate }) {
  const pageRef = useRef(null);
  const progressRef = useRef(null);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const apartment = useMemo(() => getApartmentById(apartmentId) || getApartmentById('032'), [apartmentId]);
  const similarApartments = useMemo(() => getSimilarApartments(apartment.id, 4), [apartment.id]);
  const galleryItems = useMemo(() => [
    { image: apartment.gallery[1], label: 'Shaded family terrace with planting and coastal light', className: 'apartment-detail__story-image--bath' },
    { image: apartment.gallery[0], label: 'Open living space planned for daylight and cross breeze', className: 'apartment-detail__story-image--living' },
    { image: apartment.gallery[2], label: 'Pool and landscape setting for Kanyakumari community living', className: 'apartment-detail__story-image--dining' },
  ], [apartment.gallery]);
  const activeGalleryImage = activeImageIndex === null ? null : galleryItems[activeImageIndex]?.image;

  useSmoothScroll();
  useEraPageAnimations(pageRef, { progressRef, refreshKey: apartment.id });

  const openPreviousImage = () => setActiveImageIndex((current) => (
    current === null ? galleryItems.length - 1 : (current + galleryItems.length - 1) % galleryItems.length
  ));
  const openNextImage = () => setActiveImageIndex((current) => (
    current === null ? 0 : (current + 1) % galleryItems.length
  ));
  const horizontalGalleryItems = [...galleryItems, ...galleryItems, ...galleryItems];
  const handleRequestSubmit = (event) => {
    event.preventDefault();
    setIsRequestOpen(false);
  };

  return (
    <main className="apartment-detail" ref={pageRef}>
      <div className="apartment-detail__curtain" aria-hidden="true" />
      <div className="apartment-detail__progress" ref={progressRef} style={{ '--detail-progress': '0%' }} aria-hidden="true">
        <span>Scroll</span>
        <i><b>00</b></i>
      </div>
      <header className="apartment-detail__header is-top">
        <a className="apartment-detail__brand" href="/" onClick={(event) => onNavigate?.(event, '/')} aria-label="Return to V Impact Structures home">
          <span>V</span><span>Impact</span><span>Structures</span>
        </a>
        <nav className="apartment-detail__nav" aria-label="Apartment navigation">
          <a href="/apartments" onClick={(event) => onNavigate?.(event, '/apartments')} data-hover="Homes"><span>Homes</span></a>
          <a href={siteContent.phoneHref} data-hover="Book a call"><span>Book a call</span></a>
        </nav>
      </header>

      <section className="apartment-detail__hero" aria-label={`${apartment.name} floor plan`}>
        <div className="apartment-detail__title">
          <p data-reveal="paragraph">{siteContent.clientName} / {siteContent.city} / {apartment.block}</p>
          <h1 data-reveal="heading">No. {apartment.id}</h1>
          <span data-reveal="paragraph">{apartment.typology} / Target handover {apartment.completion}</span>
        </div>

        <div className="apartment-detail__plans">
          <figure className="apartment-detail__plan apartment-detail__plan--single" data-plan-layer="upper" data-reveal="blossom">
            <span className="apartment-detail__blossom-petal apartment-detail__blossom-petal--one" aria-hidden="true" />
            <span className="apartment-detail__blossom-petal apartment-detail__blossom-petal--two" aria-hidden="true" />
            <span className="apartment-detail__blossom-petal apartment-detail__blossom-petal--three" aria-hidden="true" />
            <span className="apartment-detail__blossom-petal apartment-detail__blossom-petal--four" aria-hidden="true" />
            <img src={apartment.planImage} alt={`${apartment.name} floor plan`} />
          </figure>
        </div>
        <i className="apartment-detail__hero-line" data-reveal="line" aria-hidden="true" />

        <aside className="apartment-detail__specs" data-reveal="container">
          <p className="apartment-detail__compass">N</p>
          <dl className="apartment-detail__stats">
            <div data-spec-row><dt>Bedrooms</dt><dd>{apartment.bedrooms}</dd></div>
            <div data-spec-row><dt>Interior area</dt><dd>{apartment.interior} m2</dd></div>
            <div data-spec-row><dt>Shaded terrace</dt><dd>{apartment.terrace} m2</dd></div>
            {apartment.garden > 0 && <div data-spec-row><dt>Garden</dt><dd>{apartment.garden} m2</dd></div>}
          </dl>
          <div className="apartment-detail__tabs" data-tabs>
            <div className="apartment-detail__tab-list" role="tablist" aria-label="Apartment content sections">
              <span className="apartment-detail__tab-highlight" data-tab-highlight aria-hidden="true" />
              <button className="is-active" type="button" role="tab" aria-selected="true" data-tab-trigger>Plan</button>
              <button type="button" role="tab" aria-selected="false" data-tab-trigger>Comforts</button>
            </div>
            <div className="apartment-detail__tab-panels">
              <div className="apartment-detail__tab-panel is-active" role="tabpanel" data-tab-panel>
                <p data-reveal="paragraph">{apartment.summary}</p>
              </div>
              <div className="apartment-detail__tab-panel" role="tabpanel" data-tab-panel>
                <p>{apartment.benefits.slice(0, 4).join(' / ')}</p>
              </div>
            </div>
          </div>
          <button className="apartment-detail__request" type="button" onClick={() => setIsRequestOpen(true)}><span>Request site visit</span></button>
        </aside>
        <p className="apartment-detail__scroll-hint"><span>Scroll</span><i /></p>
      </section>

      <section className="apartment-detail__gallery" aria-label="Apartment interiors">
        <div className="apartment-detail__gallery-heading" data-reveal="container">
          <p>{siteContent.city} living</p>
          <h2>Terrace, light and landscape</h2>
        </div>
        <div className="apartment-detail__horizontal-gallery" aria-label="Horizontal scroll gallery" data-horizontal-gallery>
          <div className="apartment-detail__horizontal-strip" data-horizontal-strip>
            {horizontalGalleryItems.map((item, index) => {
              const imageIndex = index % galleryItems.length;

              return (
                <figure className={`apartment-detail__story-image ${item.className}`} key={`${item.label}-${index}`}>
                  <img src={item.image} alt={item.label} />
                  <button className="apartment-detail__gallery-pin" type="button" aria-label={`Open gallery image ${imageIndex + 1}`} onClick={() => setActiveImageIndex(imageIndex)}>
                    <span aria-hidden="true">+</span>
                  </button>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      <div className="apartment-detail__pinned-sequence apartment-detail__pinned-sequence--amenity">
        <div className="apartment-detail__pinned-media">
          <img src="/Assets/apartments%20.png" alt="Pool landscape and residence exterior" />
        </div>
        <section className="apartment-detail__amenity" aria-label="Kanyakumari community amenities">
          <div className="apartment-detail__pinned-content" data-reveal="container">
            <p>{siteContent.city} gated community</p>
            <h2>Private paths connect each home to the pool, planted courts and quiet family spaces.</h2>
            <ul>
              {apartment.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
            </ul>
          </div>
        </section>

        <section className="apartment-detail__similar" aria-label="More Kanyakumari apartment options">
          <div className="apartment-detail__section-heading" data-reveal="container">
            <p>More in Kanyakumari</p>
            <h2>Compare homes planned for shade, breeze and daily family routines</h2>
          </div>
          <div className="apartment-detail__similar-grid">
            {similarApartments.map((option) => (
              <a
                className="apartment-detail__similar-plan"
                href={`/apartments/${option.id}`}
                key={option.id}
                onClick={(event) => onNavigate?.(event, `/apartments/${option.id}`)}
              >
                <span>{option.typology}</span>
                <img src={option.planImage} alt={`${option.name} floor plan`} />
                <b>No. {option.id}</b>
                <small>{option.bedrooms} bed / {option.interior} m2 + {option.terrace} m2 shaded terrace</small>
              </a>
            ))}
          </div>
        </section>
      </div>

      <EraModal isOpen={activeImageIndex !== null} onClose={() => setActiveImageIndex(null)} titleId="apartment-lightbox-title" className="apartment-detail-lightbox">
        <div className="apartment-detail-lightbox__frame">
          <h2 id="apartment-lightbox-title">Kanyakumari home gallery</h2>
          {activeGalleryImage && <img src={activeGalleryImage} alt="Selected apartment gallery view" />}
        </div>
        <div className="apartment-detail-lightbox__controls">
          <p>{String((activeImageIndex ?? 0) + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}</p>
          <button type="button" onClick={openPreviousImage} aria-label="Show previous gallery image">Previous</button>
          <button type="button" onClick={openNextImage} aria-label="Show next gallery image">Next</button>
        </div>
      </EraModal>

      <EraModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} titleId="apartment-request-title" className="apartment-request-modal">
        <p>Private viewing request / {siteContent.city}</p>
        <h2 id="apartment-request-title">{apartment.name}</h2>
        <form onSubmit={handleRequestSubmit}>
          <label><span>Name</span><input type="text" name="name" autoComplete="name" /></label>
          <label><span>Email</span><input type="email" name="email" autoComplete="email" /></label>
          <label><span>Message</span><textarea name="message" defaultValue={`I would like more details about ${apartment.name} by ${siteContent.clientName} in ${siteContent.city}, ${siteContent.region}. Please call me on ${siteContent.phoneDisplay}.`} /></label>
          <button type="submit">Send site visit request</button>
        </form>
      </EraModal>
    </main>
  );
}

export default ApartmentDetailPage;
