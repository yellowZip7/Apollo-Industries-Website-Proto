export interface Project {
  name: string;
  summary: string;
  kind: string;
  url: string;
  /** Short address shown in the browser frame and on the button. */
  host: string;
  /** Screenshot shown in the Home page showcase. */
  image: string;
  imageAlt: string;
  /** Points taken from the product's own site. Check they are still accurate. */
  facts: string[];
}

// Add more projects here. Once there are three or more, a dedicated Work page makes sense.
export const projects: Project[] = [
  {
    name: 'Apollo Light',
    summary:
      'A QR-powered attendance system for schools. Scans are instant, records sync live, and the data is always up to date.',
    kind: 'Product',
    url: 'https://apolight.cc',
    host: 'apolight.cc',
    image: '/images/apollo-light.webp',
    imageAlt:
      'The Apollo Light website: the headline "Presence captured at the speed of light" beside a grid of colored squares that looks like a QR code',
    facts: ['Instant scans', 'Reliable', 'Live sync', 'In service for 1 year'],
  },
];
