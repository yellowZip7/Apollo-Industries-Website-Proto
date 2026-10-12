export interface TeamMember {
  id: string;
  name: string;
  role: string;
  /** Optional portfolio or personal site. Leave out when there isn't one. */
  portfolio?: string;
  /** Optional photo (for example '/images/team/jane.webp'). Without one, initials are shown. */
  photo?: string;
}

// The founders, shown on the About page in this order (the first card is highlighted) and as a
// small avatar row on the Home page. While this list is empty, both stay hidden.
export const team: TeamMember[] = [
  {
    id: 'raphael-jake-caasi',
    name: 'Raphael Jake Caasi',
    role: 'CEO, Founder',
    portfolio: 'https://rjake.vercel.app/',
  },
  { id: 'lou-gabriel-pereira', name: 'Lou Gabriel Pereira', role: 'Co-founder' },
  { id: 'jay-ii-ponio', name: 'Jay II Ponio', role: 'Co-founder' },
  {
    id: 'seth-yuri-quilla',
    name: 'Seth Yuri Quilla',
    role: 'Co-founder',
    portfolio: 'https://sethyuri.vercel.app/',
  },
  { id: 'vernice-chavez', name: 'Vernice Chavez', role: 'Co-founder' },
  { id: 'julian-jose-calica', name: 'Julian Jose Calica', role: 'Co-founder' },
  { id: 'jhen-molino', name: 'Jhen Molino', role: 'Co-founder' },
  { id: 'nikole-chloe-padilla', name: 'Nikole Chloe Padilla', role: 'Co-founder' },
];

export interface Partner {
  name: string;
  detail?: string;
}

// Certifications and partnerships (Microsoft, AWS, Cisco, and so on).
// While this list is empty, the section stays hidden on the About page.
export const partners: Partner[] = [];
