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
  name: 'Mohd Salahudeen',
  handle: 'Salah-XD',
  role: 'software engineer · founder of QSat & ShineUp',
  location: 'India',
  email: 'thisissalah.dev@gmail.com',
  github: 'https://github.com/Salah-XD',
  linkedin: 'https://www.linkedin.com/in/thisis-salah/',
  bio: [
    "I'm Salah, a developer, entrepreneur, and builder driven by curiosity.",
    "Over the years, I've worked across software engineering, geospatial technologies, space education, and startup development—turning ideas into products that solve real problems. Whether it's building scalable web applications, designing GIS platforms, creating educational CubeSat programs, or launching new ventures, I enjoy working at the intersection of technology and impact.",
    'I believe the best projects are born from asking simple questions: "Can this be done better?" and "What can we learn by building it ourselves?" That mindset has led me to develop products ranging from survey and geospatial platforms to STEM education initiatives that introduce students to space technology and engineering.',
    "When I'm not coding or designing systems, you'll usually find me exploring new technologies, refining business ideas, teaching STEM concepts, or working on projects that combine innovation with practical value.",
    "For me, technology is more than writing code—it's about creating tools, experiences, and opportunities that make a meaningful difference.",
  ],
  currentlyBuilding: {
    name: 'QSat',
    url: 'https://qsat.vercel.app',
    description: 'the space education company I founded — making space tech accessible to every student.',
  },
};

// QSat — the space-education company I founded. Featured on the homepage and linked from the press page.
export const qsat = {
  name: 'QSat',
  role: 'Founder',
  tagline:
    'A space education company I founded — making space tech accessible to every student.',
  url: 'https://qsat.vercel.app',
  instagram: 'https://www.instagram.com/qsat.diy/',
  highlights: [
    {
      label: 'ParkSat',
      detail: 'Student satellite w/ Park College, inaugurated by Nambi Narayanan.',
    },
    {
      label: 'CubeSat Lab Kit',
      detail: "India's first hands-on satellite kit.",
    },
    {
      label: 'AstroKids & AstroRangers',
      detail: 'Space-to-CubeSat learning pathways.',
    },
    {
      label: 'Impact',
      detail: 'Hundreds of students building real hardware.',
    },
  ],
};

// ShineUp — the software, cloud & marketing studio I run. Featured on the
// homepage alongside QSat and linked bidirectionally with shineup.digital.
export const shineup = {
  name: 'ShineUp',
  role: 'Founder & CEO',
  tagline:
    'A software, cloud, and marketing studio. We design, build, host, and grow digital products end to end, so clients get one team instead of four vendors.',
  url: 'https://shineup.digital',
  instagram: 'https://www.instagram.com/shineup.digital/',
  highlights: [
    { label: 'Software', detail: 'Websites, apps, and in-house CRM/ERP.' },
    { label: 'Cloud', detail: 'Managed hosting and VPS, kept running.' },
    { label: 'Marketing', detail: 'Brand and campaigns that get products found.' },
    { label: 'Impact', detail: '50+ projects shipped for 30+ clients.' },
  ],
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
    name: 'archify',
    description:
      'Architecture intelligence + client-side security for any web app, right in the browser — a local-first Chrome MV3 extension.',
    tech: ['TypeScript', 'React', 'Svelte', 'WXT', 'Tailwind'],
    status: 'live',
    impact: 'Chrome extension',
    url: 'https://github.com/Salah-XD/archify',
  },
  {
    name: 'equipt',
    description:
      'Verified AI skills & agents for founders and operators — marketing, sales, ops, finance — scored on the Equipt Standard.',
    tech: ['Astro', 'Claude', 'AI agents', 'TypeScript'],
    status: 'live',
    impact: 'AI agent marketplace',
    url: 'https://github.com/Salah-XD/equipt',
  },
  {
    name: 'appCN',
    description:
      'Mobile components you actually own — a shadcn-philosophy, copy-paste component library for React Native.',
    tech: ['React Native', 'Expo', 'NativeWind', 'TypeScript'],
    status: 'live',
    impact: 'React Native UI kit',
    url: 'https://github.com/Salah-XD/appCN',
  },
  {
    name: 'glasswatch',
    description: 'Outside-in, client-side scan engine — the Glasswatch collector (Apache-2.0).',
    tech: ['TypeScript', 'Node.js'],
    status: 'live',
    impact: 'npm package',
    url: 'https://github.com/Salah-XD/glasswatch',
  },
  {
    name: 'dockshift',
    description: 'A productive dock for developers.',
    tech: ['JavaScript'],
    status: 'live',
    impact: 'Developer tool',
    url: 'https://github.com/Salah-XD/dockshift',
  },
  {
    name: 'personal-portfolio',
    description: 'This site — built with Astro 5, React, Keystatic, deployed on Vercel.',
    tech: ['Astro', 'React', 'Tailwind', 'Vercel'],
    status: 'live',
    impact: 'Source on GitHub',
    url: 'https://github.com/Salah-XD/personal-portfolio',
  },
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
