import type { IconName } from '../components/Icon';

export interface ServiceGroup {
  heading: string;
  /** Optional icon shown beside the group heading. */
  icon?: IconName;
  intro?: string;
  items: string[];
}

export interface Service {
  id: 'software';
  icon: IconName;
  name: string;
  /** One-line summary used as the statement on the Services page. */
  summary: string;
  /** Short description used on the Home page and Services page. */
  description: string;
  /** Small tags shown on the Home page. */
  tags: string[];
  /** Fuller lists shown on the Services page. */
  groups: ServiceGroup[];
  /** Contact form topic and button label. */
  topic: 'project';
  cta: string;
}

// TODO: check every line below against what Apollo actually offers.

export const software: Service = {
  id: 'software',
  icon: 'software',
  name: 'Software development',
  summary: 'Custom software built around the way you actually work.',
  description:
    'Websites, web apps, internal tools and automations. We start small, show you progress often, and build only what you need.',
  tags: ['Web apps', 'Internal tools', 'Automations'],
  topic: 'project',
  cta: 'Ask about software',
  groups: [
    {
      heading: 'What we build',
      items: [
        'Websites and online stores',
        'Web apps for your team or your customers',
        'Internal tools, dashboards and reports',
        'Automations that save repeat work',
        'Improvements to software you already use',
      ],
    },
    {
      heading: 'A good fit if',
      items: [
        'You have a process stuck in spreadsheets, email or paper',
        'Off-the-shelf software almost does the job, but not quite',
        'You want someone to take an idea from rough sketch to working product',
        'Your project is small. We are happy to take on smaller jobs',
      ],
    },
  ],
};

export const services: Service[] = [software];
