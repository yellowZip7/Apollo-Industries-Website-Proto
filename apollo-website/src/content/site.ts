// Company details used across the site.
// TODO: replace every placeholder below with Apollo's real details.

export const site = {
  name: 'Apollo Industries',
  email: 'hello@your-domain.com',
  phone: '+00 000 000 0000',
  phoneHref: '+000000000000', // digits only, with country code
  location: 'Your office address, City',
  hours: 'Monday to Friday, 9:00 am to 6:00 pm',
  responseTime: 'We reply within one business day.',
} as const;

export interface NavItem {
  label: string;
  to: string;
}

export const navItems: NavItem[] = [
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
];
