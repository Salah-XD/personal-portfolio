import { useEffect, useRef, useState } from 'react';

import {
  Terminal,
  Rocket,
  GitBranch,
  FileText,
  Users,
  Calendar,
  Activity,
  Hash,
  ArrowRight,
} from 'lucide-react';

import ThemeToggle from './ThemeToggle';
import SearchPalette from './SearchPalette';
import MobileNav from './MobileNav';
import SmoothScroll, { smoothScrollTo } from './SmoothScroll';
import NewsletterForm from './NewsletterForm';
import AsciiBanner from './AsciiBanner';
import Sparkline from './Sparkline';
import TerminalStatusBar from './TerminalStatusBar';
import SfxToggle from './SfxToggle';
import GlitchText from './GlitchText';
import StatusPanel from './StatusPanel';
import { useEntranceAnimations } from '../lib/useEntranceAnimations';
import { applyTilt } from '../lib/tilt';
import { runUrlCommand } from '../lib/urlCommand';
import { setCrt } from './CrtOverlay';
import { projects, author, qsat, type Project } from '../config/portfolio';

const statusColor: Record<Project['status'], string> = {
  live: 'text-emerald-700 dark:text-emerald-400',
  development: 'text-amber-700 dark:text-amber-400',
  archived: 'text-slate-500 dark:text-slate-400',
};

const fullText = 'Mohd Salahudeen — software engineer & Entrepreneur.';

interface Stats {
  postCount: number;
  publicRepos: number | null;
  githubFollowers: number | null;
  yearsCoding: number;
  buildTime: string;
  commitSha: string;
  postsTrend: number[];
}

// Decorative trend seeded from a target value — visual flair, not analytics.
function decorativeTrend(target: number, points = 12): number[] {
  if (target <= 0) return Array(points).fill(0);
  const start = target * 0.6;
  return Array.from({ length: points }, (_, i) => {
    const t = i / (points - 1);
    const base = start + (target - start) * t;
    const jitter = Math.sin(i * 1.7 + target) * (target * 0.04);
    return Math.max(0, base + jitter);
  });
}

interface LatestPost {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
}

interface StatusSnapshot {
  mood: string;
  focus: string;
  learning: string;
  daysAgo: number;
}

interface PortfolioProps {
  stats?: Stats;
  latestPosts?: LatestPost[];
  status?: StatusSnapshot;
}

function Portfolio({ stats, latestPosts, status }: PortfolioProps) {
  const [currentPath, setCurrentPath] = useState('~');
  const [showCursor, setShowCursor] = useState(true);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursorTimer = setInterval(() => setShowCursor((p) => !p), 500);
    return () => clearInterval(cursorTimer);
  }, []);

  useEntranceAnimations(rootRef);

  // Apply 3D tilt to project cards (skipped on touch / reduced-motion).
  useEffect(() => {
    if (!rootRef.current) return;
    const cards = rootRef.current.querySelectorAll<HTMLElement>('[data-tilt]');
    const cleanups = Array.from(cards).map((el) => applyTilt(el));
    return () => cleanups.forEach((fn) => fn());
  }, []);

  // ?cmd= URL params
  useEffect(() => {
    runUrlCommand({
      scrollTo: (id) => {
        const el = document.getElementById(id);
        if (el) smoothScrollTo(el);
      },
      openSearch: () => {
        const trigger = document.querySelector<HTMLButtonElement>('[aria-label="Open command palette"]');
        trigger?.click();
      },
      openHelp: () => window.dispatchEvent(new CustomEvent('keyboard-help-open')),
      setCrt,
    });
  }, []);

  const scrollToSection = (sectionId: string, path: string) => {
    setCurrentPath(path);
    const target = document.getElementById(sectionId);
    if (target) smoothScrollTo(target);
  };

  const navItems = [
    { label: './about', href: '/about' },
    { label: './projects', onClick: () => scrollToSection('projects', '~/projects') },
    { label: './blog', href: '/blog' },
    { label: './press', href: '/press' },
  ];

  // Mobile drawer + footer "directory" surface — desktop top nav stays lean.
  const extraLinks = [
    { label: './now', href: '/now' },
    { label: './uses', href: '/uses' },
  ];

  // Rendered as JSON output under the `cat social_links.json` prompt in the contact section.
  const socialLinks = [
    { key: 'email', value: author.email, href: `mailto:${author.email}` },
    { key: 'github', value: 'github.com/Salah-XD', href: author.github },
    { key: 'linkedin', value: 'linkedin.com/in/thisis-salah', href: author.linkedin },
    { key: 'status', value: 'open to interesting problems & good conversations' },
  ];

  return (
    <SmoothScroll>
    <div ref={rootRef} className="min-h-screen transition-colors duration-300">
      {/* Header */}
      <header
        data-nav-sticky
        className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/80 transition-[transform,colors,background-color] duration-300 will-change-transform"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 font-mono min-w-0">
            <Terminal className="w-5 h-5 shrink-0" />
            <span className="text-slate-600 dark:text-emerald-400 truncate">
              salahxd@dev:{currentPath}$
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 font-mono text-sm">
            {navItems.map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="hover:text-slate-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-slate-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <SearchPalette />
            <SfxToggle />
            <ThemeToggle />
            <MobileNav items={[...navItems, ...extraLinks]} />
          </div>
        </div>
      </header>

      <main>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto" data-anim="hero">
          <div className="font-mono text-sm mb-8 text-slate-600 dark:text-emerald-400">
            guest@dev:~$ whoami
          </div>

          <AsciiBanner />

          <h1 className="font-mono text-2xl md:text-4xl lg:text-5xl mb-8 leading-relaxed break-words">
            {fullText}
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
          </h1>

          <p className="font-mono text-base md:text-lg leading-relaxed max-w-2xl text-slate-600 dark:text-slate-300">
            I write the code and run the company — from GIS platforms to student satellites.
          </p>
        </div>
      </section>

      {/* Ventures — QSat (the company I founded) */}
      <section id="ventures" className="py-12 px-4" aria-labelledby="ventures-heading">
        <div className="max-w-4xl mx-auto">
          <div className="font-mono text-sm mb-3 text-slate-600 dark:text-emerald-400">
            <GlitchText>salahxd@dev:~/ventures$ ls -la</GlitchText>
          </div>

          <div
            data-anim="card"
            className="rounded-lg border border-slate-200 dark:border-emerald-500/40 bg-slate-50 dark:bg-emerald-500/5 p-5 sm:p-6"
          >
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <Rocket className="w-5 h-5 text-slate-700 dark:text-emerald-400 shrink-0" />
              <h2 id="ventures-heading" className="font-mono text-xl sm:text-2xl">{qsat.name}</h2>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                {qsat.role}
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-300 mb-4 max-w-2xl text-sm leading-relaxed">
              {qsat.tagline}
            </p>

            <ul className="space-y-1.5 mb-5 font-mono text-xs sm:text-sm">
              {qsat.highlights.map((h) => (
                <li key={h.label} className="flex gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true">›</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    <span className="text-slate-900 dark:text-slate-100 font-semibold">{h.label}</span>
                    <span className="text-slate-400 dark:text-slate-500"> — </span>
                    {h.detail}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 font-mono text-xs sm:text-sm">
              <a
                href={qsat.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800 text-white dark:bg-emerald-500 dark:text-slate-900 hover:opacity-90 transition-opacity"
              >
                Visit {qsat.name}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="/press"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Press &amp; launch coverage
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="font-mono text-sm mb-8 text-slate-600 dark:text-emerald-400">
            <GlitchText>salahxd@dev:~/blog$ ls -t | head -3</GlitchText>
          </div>

          <div className="flex items-center justify-between mb-8 gap-4">
            <h2 className="font-mono text-xl sm:text-2xl">Latest Posts</h2>
            <a
              href="/blog"
              className="flex items-center space-x-2 font-mono text-sm hover:text-slate-700 dark:hover:text-emerald-400 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-6">
            {latestPosts && latestPosts.length > 0 ? (
              latestPosts.map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  data-anim="blog-card"
                  className="block p-6 border rounded-lg transition-all duration-300 hover-card border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600"
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <time className="font-mono text-sm text-slate-600 dark:text-emerald-400">
                      {post.date}
                    </time>
                  </div>
                  <h3 className="font-mono text-lg sm:text-xl mb-3 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {post.excerpt}
                  </p>
                </a>
              ))
            ) : (
              <div
                data-anim="blog-card"
                className="p-6 border border-dashed rounded-lg border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/30"
              >
                <p className="font-mono text-sm text-slate-600 dark:text-emerald-400 mb-2">
                  salahxd@dev:~/blog$ ls -t
                </p>
                <p className="font-mono text-sm text-slate-500 dark:text-slate-400">
                  No posts yet — first one is in the pipeline. Subscribe below to get it the moment it drops.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4" aria-labelledby="projects-heading">
        <div className="max-w-4xl mx-auto">
          <h2 id="projects-heading" className="sr-only">Projects</h2>
          <div className="font-mono text-sm mb-8 text-slate-600 dark:text-emerald-400">
            <GlitchText>salahxd@dev:~/projects$ git log --oneline</GlitchText>
          </div>

          <div className="space-y-4">
            {projects.map((project) => {
              const Wrapper = project.url ? 'a' : 'div';
              const wrapperProps = project.url
                ? { href: project.url, target: '_blank', rel: 'noreferrer' }
                : {};
              return (
              <Wrapper
                key={project.name}
                data-anim="project"
                data-tilt
                {...wrapperProps}
                className="flex items-center justify-between p-4 border-l-4 border-l-slate-400 dark:border-l-emerald-500 bg-white/60 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/50 transition-all duration-300 hover-translate"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 sm:gap-4 mb-2">
                    <GitBranch className="w-4 h-4 text-slate-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-mono text-base sm:text-lg break-all">{project.name}</span>
                    <span className={`font-mono text-xs sm:text-sm px-2 py-1 rounded ${statusColor[project.status]}`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 mb-2 sm:ml-8">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:ml-8">
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <span className="font-mono text-sm text-slate-500 dark:text-emerald-400">
                      {project.impact}
                    </span>
                  </div>
                </div>
              </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section id="metrics" className="py-20 px-4" aria-labelledby="metrics-heading">
        <div className="max-w-4xl mx-auto">
          <h2 id="metrics-heading" className="sr-only">By the numbers</h2>
          <div className="font-mono text-sm mb-8 text-slate-600 dark:text-emerald-400">
            <GlitchText>salahxd@dev:~/metrics$ iostat -x 1</GlitchText>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                Icon: FileText,
                label: 'Posts Published',
                value: stats ? String(stats.postCount) : '—',
                trend: stats?.postsTrend,
              },
              {
                Icon: Hash,
                label: 'Public Repos',
                value: stats?.publicRepos != null ? String(stats.publicRepos) : '—',
                trend: stats?.publicRepos != null ? decorativeTrend(stats.publicRepos) : undefined,
              },
              {
                Icon: Users,
                label: 'GitHub Followers',
                value: stats?.githubFollowers != null ? String(stats.githubFollowers) : '—',
                trend: stats?.githubFollowers != null ? decorativeTrend(stats.githubFollowers) : undefined,
              },
              {
                Icon: Calendar,
                label: 'Years Coding',
                value: stats ? String(stats.yearsCoding) : '—',
                trend: stats ? decorativeTrend(stats.yearsCoding) : undefined,
              },
            ].map(({ Icon, label, value, trend }) => {
              const numeric = /^\d+$/.test(value);
              return (
                <div
                  key={label}
                  data-anim="metric"
                  className="text-center p-4 sm:p-6 border rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30"
                >
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-2 text-slate-600 dark:text-emerald-400" />
                  {numeric ? (
                    <div className="font-mono text-xl sm:text-2xl mb-1 tabular-nums" data-count={value}>{value}</div>
                  ) : (
                    <div className="font-mono text-xl sm:text-2xl mb-1">{value}</div>
                  )}
                  {trend && trend.length >= 2 && (
                    <Sparkline values={trend} className="mx-auto mb-1 opacity-80" />
                  )}
                  <div className="font-mono text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* System Monitor Style Display */}
          <div className="mt-12 p-6 border rounded-lg font-mono text-sm border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30">
            <div className="mb-4 text-slate-700 dark:text-emerald-400">
              salahxd@dev:~$ neofetch
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Currently', value: 'Building QSat' },
                { label: 'Source', value: 'github.com/Salah-XD' },
                { label: 'Stack', value: 'Astro · React · TypeScript' },
              ].map(({ label, value }) => (
                <div key={label} className="min-w-0">
                  <div className="text-slate-600 dark:text-slate-300">{label}</div>
                  <div className="flex items-center space-x-2 min-w-0">
                    <Activity className="w-4 h-4 text-slate-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Status Panel — pulls top-line snapshot from /now (Keystatic singleton) */}
      {status && (
        <section id="status" className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="font-mono text-sm mb-6 text-slate-600 dark:text-emerald-400">
              <GlitchText>salahxd@dev:~$ ./status --short</GlitchText>
            </div>
            <StatusPanel
              mood={status.mood}
              focus={status.focus}
              learning={status.learning}
              daysAgo={status.daysAgo}
            />
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4" aria-labelledby="contact-heading">
        <div className="max-w-4xl mx-auto">
          <h2 id="contact-heading" className="sr-only">Contact</h2>
          <div className="font-mono text-sm mb-4 text-slate-600 dark:text-emerald-400">
            <GlitchText>salahxd@dev:~/contact$ cat social_links.json</GlitchText>
          </div>

          <div className="font-mono text-sm sm:text-base rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 p-5 sm:p-6 overflow-x-auto leading-relaxed">
            <div className="text-slate-400 dark:text-slate-500">{'{'}</div>
            {socialLinks.map((field, i) => (
              <div key={field.key} className="pl-4 sm:pl-6 whitespace-nowrap">
                <span className="text-sky-700 dark:text-sky-400">"{field.key}"</span>
                <span className="text-slate-400 dark:text-slate-500">: </span>
                {field.href ? (
                  <a
                    href={field.href}
                    target={field.href.startsWith('http') ? '_blank' : undefined}
                    rel={field.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="text-emerald-700 dark:text-emerald-400 underline decoration-dotted underline-offset-4 hover:decoration-solid"
                  >
                    "{field.value}"
                  </a>
                ) : (
                  <span className="text-amber-700 dark:text-amber-400">"{field.value}"</span>
                )}
                <span className="text-slate-400 dark:text-slate-500">
                  {i < socialLinks.length - 1 ? ',' : ''}
                </span>
              </div>
            ))}
            <div className="text-slate-400 dark:text-slate-500">{'}'}</div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="py-16 px-4 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-2xl mx-auto">
          <NewsletterForm variant="card" source="home" />
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="border-t py-8 border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <p className="font-mono text-xs sm:text-sm text-slate-600 dark:text-emerald-400 break-words">
            salahxd@dev:~$ ls /
          </p>
          <p className="font-mono text-xs sm:text-sm flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a href="/" className="text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-emerald-400">./</a>
            <a href="/about" className="text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-emerald-400">./about</a>
            <a href="/now" className="text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-emerald-400">./now</a>
            <a href="/uses" className="text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-emerald-400">./uses</a>
            <a href="/press" className="text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-emerald-400">./press</a>
            <a href="/blog" className="text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-emerald-400">./blog</a>
            <a href="/rss.xml" className="text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-emerald-400">./rss.xml</a>
          </p>
          <p className="font-mono text-xs sm:text-sm text-slate-600 dark:text-emerald-400 break-words pt-2">
            salahxd@dev:~$ cat ~/.signature
          </p>
          <p className="font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 break-words">
            Mohd Salahudeen · software engineer &amp; founder of QSat
          </p>
          {stats && (
            <TerminalStatusBar buildTime={stats.buildTime} commitSha={stats.commitSha} />
          )}
        </div>
      </footer>
    </div>
    </SmoothScroll>
  );
}

export default Portfolio;
