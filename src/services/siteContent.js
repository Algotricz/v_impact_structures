/**
 * Shared client and studio details used across the static frontend.
 * @typedef {Object} SiteContent
 * @property {string} clientName Public brand name for the real estate client.
 * @property {string} studioName Company responsible for the website experience.
 * @property {string} city Local project city.
 * @property {string} region Local project region/state.
 * @property {string} country Local project country.
 * @property {string} phoneDisplay Buyer-facing phone number.
 * @property {string} phoneHref Click-to-call URL.
 * @property {string} coastalLabel Short region label used in editorial copy.
 * @property {string} enquiryLine Reusable buyer-facing enquiry copy.
 */
const siteContent = {
  clientName: 'V Impact Structures',
  studioName: 'Algotrics',
  city: 'Kanyakumari',
  region: 'Tamil Nadu',
  country: 'India',
  phoneDisplay: '+91 98765 43210',
  phoneHref: 'tel:+919876543210',
  coastalLabel: 'Tamil Nadu southern coast',
  enquiryLine: 'For site visits, floor plans and availability in Kanyakumari, call +91 98765 43210.',
};

export default siteContent;
