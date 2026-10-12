export interface TechGroup {
  group: string;
  items: string[];
}

export const technologies: TechGroup[] = [
  { group: 'Languages', items: ['JavaScript', 'TypeScript', 'Java', 'HTML', 'CSS'] },
  { group: 'Frameworks', items: ['React', 'Node.js', 'Spring Boot', 'Tailwind CSS'] },
  { group: 'Databases', items: ['PostgreSQL', 'MySQL'] },
  { group: 'Tools', items: ['Git', 'GitHub', 'IntelliJ IDEA', 'VS Code'] },
  { group: 'Design', items: ['Figma', 'Canva'] },
];
