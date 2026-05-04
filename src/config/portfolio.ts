// Edit this file to make the portfolio reflect your real work.
// All copy below is placeholder. Replace it with real projects, real skills,
// and accurate impact statements before sharing the site widely.

export interface Author {
  name: string;
  handle: string;
  role: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  twitter?: string;
  bio: string[]; // each item is one paragraph
  currentlyBuilding: { name: string; url: string; description: string };
}

export const author: Author = {
  name: 'MD Salah',
  handle: 'Salah-XD',
  role: 'Developer · Designer · Engineer',
  location: 'India',
  email: 'thisissalah.dev@gmail.com',
  github: 'https://github.com/Salah-XD',
  linkedin: 'https://www.linkedin.com/in/thisis-salah/',
  bio: [
    "I build software products end to end — from the first sketch to the deploy pipeline. I care about systems that are simple to reason about, interfaces that get out of the way, and shipping things people actually use.",
    "Most of my work lately has been at the intersection of frontend craft and small-team engineering: making fast static sites, designing component libraries, and keeping the deploy story boring.",
    "I write here about the technical stuff I run into, the design choices behind products I admire, and the occasional founder-y note. Subscribe via the newsletter or RSS if any of that sounds useful.",
  ],
  currentlyBuilding: {
    name: 'QSAT',
    url: 'https://qsat.diy',
    description: 'a personal product I am working on right now',
  },
};

export interface Project {
  name: string;
  description: string;
  tech: string[];
  status: 'live' | 'development' | 'archived';
  impact: string;
  url?: string;
}

export const projects: Project[] = [
  {
    name: 'qsat',
    description: 'Personal product I am currently building.',
    tech: ['Astro', 'React', 'TypeScript'],
    status: 'development',
    impact: 'In progress',
    url: 'https://qsat.diy',
  },
  {
    name: 'personal-portfolio',
    description: 'This site — built with Astro 5, React, Keystatic, deployed on Vercel.',
    tech: ['Astro', 'React', 'Tailwind', 'Vercel'],
    status: 'live',
    impact: 'Source on GitHub',
    url: 'https://github.com/Salah-XD/personal-portfolio',
  },
  // Add more real projects here. Keep the fields truthful — empty is better than
  // invented impact metrics.
];

export interface Skill {
  name: string;
  level: number; // 1-100, your honest self-assessment
  category: 'languages' | 'frontend' | 'backend' | 'architecture' | 'design' | 'business';
}

export const skills: Skill[] = [
  { name: 'JavaScript / TypeScript', level: 90, category: 'languages' },
  { name: 'React', level: 88, category: 'frontend' },
  { name: 'Node.js', level: 80, category: 'backend' },
  { name: 'System Design', level: 75, category: 'architecture' },
  { name: 'UI / UX Design', level: 80, category: 'design' },
  // Adjust to your honest level. Keep this short — 4-8 entries reads better.
];
