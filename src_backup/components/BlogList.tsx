import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Search, Tag } from 'lucide-react';

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

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Scalable Systems: Lessons from the Trenches',
    slug: 'building-scalable-systems',
    date: '2024-01-15',
    excerpt: 'Key insights on architecture decisions that make or break startups. From monoliths to microservices, database choices, and scaling challenges.',
    readTime: '8 min read',
    tags: ['Architecture', 'Scaling', 'Backend'],
    category: 'Engineering'
  },
  {
    id: '2',
    title: 'The Art of Minimal Design in Tech Products',
    slug: 'minimal-design-tech-products',
    date: '2024-01-08',
    excerpt: 'Why less is more when it comes to user experience and product design. Exploring the principles that make interfaces truly intuitive.',
    readTime: '5 min read',
    tags: ['Design', 'UX', 'Minimalism'],
    category: 'Design'
  },
  {
    id: '3',
    title: 'From Idea to MVP: A Founder\'s Journey',
    slug: 'idea-to-mvp-journey',
    date: '2024-01-01',
    excerpt: 'The complete process of taking a concept from whiteboard to market. Real stories, hard lessons, and practical frameworks.',
    readTime: '12 min read',
    tags: ['Startup', 'MVP', 'Product'],
    category: 'Business'
  },
  {
    id: '4',
    title: 'Modern React Patterns for 2024',
    slug: 'modern-react-patterns-2024',
    date: '2023-12-20',
    excerpt: 'Latest React patterns, hooks, and best practices that every developer should know. From custom hooks to performance optimization.',
    readTime: '10 min read',
    tags: ['React', 'JavaScript', 'Frontend'],
    category: 'Development'
  },
  {
    id: '5',
    title: 'The Psychology of Developer Tools',
    slug: 'psychology-developer-tools',
    date: '2023-12-10',
    excerpt: 'How the tools we use shape our thinking and productivity. An exploration of developer experience and cognitive load.',
    readTime: '7 min read',
    tags: ['DX', 'Tools', 'Psychology'],
    category: 'Productivity'
  },
  {
    id: '6',
    title: 'Building in Public: Lessons Learned',
    slug: 'building-in-public-lessons',
    date: '2023-11-25',
    excerpt: 'What I learned from sharing my startup journey publicly. The good, the bad, and the unexpected benefits.',
    readTime: '6 min read',
    tags: ['Transparency', 'Community', 'Startup'],
    category: 'Business'
  }
];

const categories = ['All', 'Engineering', 'Design', 'Business', 'Development', 'Productivity'];

function BlogList() {
  const [isDark, setIsDark] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-900 text-slate-100' 
        : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Header */}
      <header className={`border-b ${
        isDark ? 'border-slate-700' : 'border-slate-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/"
              className={`flex items-center space-x-2 font-mono text-sm hover:${isDark ? 'text-emerald-400' : 'text-slate-600'} transition-colors`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>cd ..</span>
            </Link>
            
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg transition-colors hover:${
                isDark ? 'bg-slate-800' : 'bg-slate-200'
              }`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
          
          <div className={`font-mono text-sm mb-4 ${isDark ? 'text-emerald-400' : 'text-slate-500'}`}>
            salah@portfolio:~/blog$ ls -la
          </div>
          
          <h1 className="font-mono text-3xl md:text-4xl mb-4">Blog</h1>
          <p className={`font-mono ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Thoughts on technology, design, and building products
          </p>
        </div>
      </header>

      {/* Filters */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Search */}
          <div className="relative mb-6">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border font-mono text-sm transition-colors ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-emerald-500' 
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-slate-400'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
            />
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`font-mono text-sm px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? isDark 
                      ? 'bg-emerald-500 text-slate-900' 
                      : 'bg-slate-800 text-white'
                    : isDark 
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`font-mono text-sm mb-6 ${isDark ? 'text-emerald-400' : 'text-slate-500'}`}>
            Found {filteredPosts.length} posts
          </div>
          
          <div className="space-y-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className={`p-6 border rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                  isDark 
                    ? 'border-slate-700 bg-slate-800/50 hover:border-slate-600' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <time className={`font-mono text-sm ${isDark ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {post.date}
                    </time>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    <span className={`font-mono text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {post.readTime}
                    </span>
                  </div>
                  
                  <span className={`font-mono text-xs px-2 py-1 rounded ${
                    isDark 
                      ? 'bg-slate-700 text-slate-300' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {post.category}
                  </span>
                </div>
                
                <Link to={`/blog/${post.slug}`}>
                  <h2 className={`font-mono text-xl md:text-2xl mb-3 hover:${isDark ? 'text-emerald-400' : 'text-slate-600'} transition-colors`}>
                    {post.title}
                  </h2>
                </Link>
                
                <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed mb-4`}>
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tag className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    <div className="flex space-x-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`font-mono text-xs px-2 py-1 rounded ${
                            isDark 
                              ? 'bg-slate-700 text-slate-300' 
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Link
                    to={`/blog/${post.slug}`}
                    className={`font-mono text-sm hover:${isDark ? 'text-emerald-400' : 'text-slate-600'} transition-colors`}
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className={`font-mono text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                No posts found matching your criteria
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default BlogList;