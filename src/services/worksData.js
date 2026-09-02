/**
 * @typedef {Object} WorkProject
 * @property {string} title Display name for the work item.
 * @property {string} location Short location label shown under the title.
 * @property {string} image Large background image used by the works carousel.
 */

/**
 * Static Kanyakumari-focused works data for the `/wrks` carousel.
 *
 * @type {WorkProject[]}
 */
const worksProjects = [
  { title: 'Cape View Residence', location: 'Kanyakumari, Tamil Nadu', image: 'https://assets.codepen.io/3090751/forty-one-oaks3.jpg' },
  { title: 'Sunrise Bay Villas', location: 'Kanyakumari Beach Road', image: 'https://assets.codepen.io/3090751/sentinel-ridge.jpg' },
  { title: 'Suchindram Courtyard', location: 'Suchindram, Kanyakumari', image: 'https://assets.codepen.io/3090751/white-sands.jpg' },
  { title: 'Nagercoil Garden House', location: 'Nagercoil, Kanyakumari', image: 'https://assets.codepen.io/3090751/dawnridge2.jpg' },
  { title: 'Muttom Coast Retreat', location: 'Muttom, Kanyakumari', image: 'https://assets.codepen.io/3090751/12-moons.jpg' },
  { title: 'Maruthuvazh Malai Home', location: 'Agastheeswaram, Kanyakumari', image: 'https://assets.codepen.io/3090751/foothills.jpg' },
  { title: 'Padmanabhapuram Estate', location: 'Padmanabhapuram, Kanyakumari', image: 'https://assets.codepen.io/3090751/zinfandel.jpg' },
  { title: 'Thengapattanam House', location: 'Thengapattanam, Kanyakumari', image: 'https://assets.codepen.io/3090751/pinon-ranch.jpg' },
  { title: 'Western Ghats Edge', location: 'Aralvaimozhi, Kanyakumari', image: 'https://assets.codepen.io/3090751/grasslands.jpg' },
];

export default worksProjects;
