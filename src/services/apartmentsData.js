/**
 * @typedef {Object} Apartment
 * @property {string} id Public apartment number used in URLs and headings.
 * @property {string} name Display name for cards and detail pages.
 * @property {string} block Building or block reference.
 * @property {string} floor Floor label shown to buyers.
 * @property {string} typology Home typology used by filters.
 * @property {string} completion Expected completion date.
 * @property {string} bedrooms Bedroom count as a string for filters.
 * @property {string} bathrooms Bathroom count as a string.
 * @property {number} interior Interior area in square meters.
 * @property {number} terrace Terrace area in square meters.
 * @property {number} garden Garden area in square meters.
 * @property {string} planImage Main blueprint image URL.
 * @property {string} lowerPlanImage Secondary blueprint image URL.
 * @property {string[]} gallery Image URLs used by the detail storytelling page.
 * @property {string} summary Short buyer-facing description.
 * @property {string[]} benefits Amenity and specification labels.
 */

export const apartmentGallery = [
  '/Assets/balcony.png',
  '/Assets/hero.webp',
  '/Assets/apartments%20.png',
];

/** @type {Apartment[]} */
export const apartments = [
  {
    id: '032',
    name: 'Residence 032',
    block: 'Block B3',
    floor: 'Ground floor',
    typology: 'Ground floor + basement',
    completion: '4Q 2026',
    bedrooms: '3',
    bathrooms: '2',
    interior: 134,
    terrace: 44,
    garden: 21,
    planImage: '/Assets/bueprint/1.webp',
    lowerPlanImage: '/Assets/bueprint/2.webp',
    gallery: apartmentGallery,
    summary: 'Three bedrooms, open-plan living, and a shaded terrace planned for relaxed family life on the Kanyakumari coast.',
    benefits: ['Pool access', 'Covered parking', 'Cross ventilation', 'Water storage', 'Vastu-aware plan', 'Anti-skid tiles', 'Premium CP fittings', 'Solar-ready power'],
  },
  {
    id: '031',
    name: 'Residence 031',
    block: 'Block B3',
    floor: 'Ground floor',
    typology: 'Ground floor + basement',
    completion: '4Q 2026',
    bedrooms: '3',
    bathrooms: '2',
    interior: 134,
    terrace: 44,
    garden: 18,
    planImage: '/Assets/bueprint/1.webp',
    lowerPlanImage: '/Assets/bueprint/2.webp',
    gallery: apartmentGallery,
    summary: 'A calm garden residence with a wide living room, private bedroom wing, and an outdoor room for evenings after the sea breeze settles in.',
    benefits: ['Pool access', 'Covered parking', 'Cross ventilation', 'Water storage', 'Vastu-aware plan', 'Anti-skid tiles'],
  },
  {
    id: '034',
    name: 'Residence 034',
    block: 'Block B3',
    floor: 'Ground floor',
    typology: 'Ground floor + basement',
    completion: '4Q 2026',
    bedrooms: '3',
    bathrooms: '2',
    interior: 134,
    terrace: 45,
    garden: 24,
    planImage: '/Assets/bueprint/2.webp',
    lowerPlanImage: '/Assets/bueprint/1.webp',
    gallery: apartmentGallery,
    summary: 'A larger terrace residence planned around morning light, shaded dining, and easy movement into the landscaped community.',
    benefits: ['Pool access', 'Covered parking', 'Cross ventilation', 'Water storage', 'Solar-ready power', 'Premium CP fittings'],
  },
  {
    id: '021',
    name: 'Residence 021',
    block: 'Block B2',
    floor: 'First floor',
    typology: 'Ground floor',
    completion: '4Q 2026',
    bedrooms: '2',
    bathrooms: '2',
    interior: 112,
    terrace: 29,
    garden: 0,
    planImage: '/Assets/bueprint/2.webp',
    lowerPlanImage: '/Assets/bueprint/1.webp',
    gallery: apartmentGallery,
    summary: 'A bright two-bedroom home with open-plan living and a balcony framed for quiet Kanyakumari mornings.',
    benefits: ['Pool access', 'Covered parking', 'Cross ventilation', 'Water storage', 'Anti-skid tiles', 'Vastu-aware plan'],
  },
  {
    id: '041',
    name: 'Residence 041',
    block: 'Block B4',
    floor: 'Penthouse',
    typology: 'Penthouse duplex',
    completion: '4Q 2026',
    bedrooms: '3',
    bathrooms: '3',
    interior: 152,
    terrace: 61,
    garden: 0,
    planImage: '/Assets/bueprint/1.webp',
    lowerPlanImage: '/Assets/bueprint/2.webp',
    gallery: apartmentGallery,
    summary: 'A duplex penthouse with an upper terrace, private sleeping level, and long views across the landscaped pool court.',
    benefits: ['Pool access', 'Covered parking', 'Sea-breeze terrace', 'Solar-ready power', 'Premium CP fittings', 'Water storage'],
  },
  {
    id: '042',
    name: 'Residence 042',
    block: 'Block B4',
    floor: 'Penthouse',
    typology: 'Penthouse duplex',
    completion: '4Q 2026',
    bedrooms: '3',
    bathrooms: '3',
    interior: 158,
    terrace: 66,
    garden: 0,
    planImage: '/Assets/bueprint/2.webp',
    lowerPlanImage: '/Assets/bueprint/1.webp',
    gallery: apartmentGallery,
    summary: 'The largest sample penthouse, arranged for sea-facing entertaining and quieter rooms set deeper into the plan.',
    benefits: ['Pool access', 'Covered parking', 'Sea-breeze terrace', 'Cross ventilation', 'Solar-ready power', 'Anti-skid tiles'],
  },
];

/**
 * @param {string} id Apartment number from the route.
 * @returns {Apartment | undefined} Matching apartment, if available.
 */
export const getApartmentById = (id) => apartments.find((apartment) => apartment.id === id);

/**
 * @param {string} id Apartment number to exclude from recommendations.
 * @param {number} limit Maximum number of recommendations to return.
 * @returns {Apartment[]} Similar static apartment options.
 */
export const getSimilarApartments = (id, limit = 4) => apartments
  .filter((apartment) => apartment.id !== id)
  .slice(0, limit);
