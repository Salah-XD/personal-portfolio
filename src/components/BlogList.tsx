import { useRef, useState } from 'react';
import { ArrowLeft, Calendar, Clock, Search, Tag } from 'lucide-react';

import ThemeToggle from './ThemeToggle';
import SearchPalette from './SearchPalette';
import SfxToggle from './SfxToggle';
import SmoothScroll from './SmoothScroll';
import NewsletterForm from './NewsletterForm';
import { useEntranceAnimations } from '../lib/useEntranceAnimations';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  readTime: string;
  tags: string[];
  category: string;
}

interface BlogListProps {
  initialPosts: BlogPost[];
}

const categories = ['All', 'Engineering', 'Design', 'Business', 'Development', 'Productivity'];

function BlogList({ initialPosts }: BlogListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEntranceAnimations(rootRef);

  const filteredPosts = initialPosts.filter((post) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some((tag) => tag.toLowerCase().includes(q));

    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SmoothScroll>
    <div ref={rootRef} className="min-h-screen transition-colors duration-300">
      {/* Header */}
      <header
        data-nav-sticky
        className="sticky top-0 z-50 backdrop-blur-md bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 transition-transform duration-300 will-change-transform"
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6 gap-3">
            <a
              href="/"
              className="flex items-center space-x-2 font-mono text-sm hover:text-slate-700 dark:hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>cd ..</span>
            </a>

            <div className="flex items-center gap-2">
              <SearchPalette />
              <SfxToggle />
              <ThemeToggle />
            </div>
          </div>

          <div className="font-mono text-sm mb-4 text-slate-600 dark:text-emerald-400">
            salah@portfolio:~/blog$ ls -la
          </div>

          <h1 className="font-mono text-2xl sm:text-3xl md:text-4xl mb-4">Blog</h1>
          <p className="font-mono text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Thoughts on technology, design, and building products
          </p>
        </div>
      </header>

      {/* Filters */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border font-mono text-sm transition-colors bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`font-mono text-sm px-3 py-2 sm:px-4 rounded-lg transition-colors ${
                    active
                      ? 'bg-slate-800 text-white dark:bg-emerald-500 dark:text-slate-900'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="font-mono text-sm mb-6 text-slate-600 dark:text-emerald-400">
            Found {filteredPosts.length} posts
          </div>

          <div className="space-y-6 sm:space-y-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                data-anim="blog-card"
                className="p-5 sm:p-6 border rounded-lg transition-all duration-300 hover-card border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-500 dark:text-emerald-400" />
                    <time className="font-mono text-sm text-slate-500 dark:text-emerald-400">
                      {post.date}
                    </time>
                  </div>

                  {post.readTime && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
                        {post.readTime}
                      </span>
                    </div>
                  )}

                  <span className="font-mono text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {post.category}
                  </span>
                </div>

                <a href={`/blog/${post.slug}`} className="group">
                  <h2 className="font-mono text-lg sm:text-xl md:text-2xl mb-3 group-hover:text-slate-700 dark:group-hover:text-emerald-400 transition-colors break-words">
                    {post.title}
                  </h2>
                </a>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Tag className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={`/blog/${post.slug}`}
                    className="font-mono text-sm hover:text-slate-700 dark:hover:text-emerald-400 transition-colors"
                  >
                    Read more →
                  </a>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="font-mono text-base sm:text-lg text-slate-500 dark:text-slate-400">
                No posts found matching your criteria
              </p>
            </div>
          )}

          <div className="mt-16">
            <NewsletterForm variant="card" source="blog-index" />
          </div>
        </div>
      </section>
    </div>
    </SmoothScroll>
  );
}

export default BlogList;
