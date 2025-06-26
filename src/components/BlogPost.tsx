import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag, Share2, Heart, MessageCircle } from 'lucide-react';

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  date: string;
  readTime: string;
  tags: string[];
  category: string;
  content: string;
  author: {
    name: string;
    bio: string;
  };
}

const blogPosts: { [key: string]: BlogPostData } = {
  'building-scalable-systems': {
    id: '1',
    title: 'Building Scalable Systems: Lessons from the Trenches',
    slug: 'building-scalable-systems',
    date: '2024-01-15',
    readTime: '8 min read',
    tags: ['Architecture', 'Scaling', 'Backend'],
    category: 'Engineering',
    author: {
      name: 'MD Salah',
      bio: 'Founder, Developer, Designer & Engineer'
    },
    content: `
# Building Scalable Systems: Lessons from the Trenches

After building and scaling multiple systems from zero to millions of users, I've learned that scalability isn't just about handling more traffic—it's about building systems that can evolve with your business needs.

## The Monolith vs Microservices Debate

When starting out, the temptation is to immediately jump to microservices. **Don't.** Start with a well-structured monolith. Here's why:

### The Monolith Advantage
- **Faster development cycles** in early stages
- **Easier debugging** and monitoring
- **Simpler deployment** and infrastructure
- **Better performance** for smaller workloads

### When to Consider Microservices
Only when you hit these specific pain points:
- Team size exceeds 8-10 developers
- Different parts of your system have vastly different scaling requirements
- You need to use different technologies for different domains

## Database Design Decisions

Your database choices will make or break your scaling efforts. Here are the key principles I follow:

### 1. Choose the Right Tool for the Job
- **PostgreSQL** for complex queries and ACID compliance
- **Redis** for caching and session storage
- **Elasticsearch** for full-text search
- **ClickHouse** for analytics and time-series data

### 2. Design for Read Scalability
Most applications are read-heavy. Optimize accordingly:
- Implement proper indexing strategies
- Use read replicas for scaling reads
- Cache frequently accessed data
- Consider CQRS for complex read patterns

## Performance Optimization Strategies

### 1. Measure First, Optimize Second
Never optimize without data. Use tools like:
- Application Performance Monitoring (APM)
- Database query analyzers
- Load testing tools
- Real user monitoring

### 2. The 80/20 Rule
Focus on the 20% of code that handles 80% of your traffic. Common bottlenecks:
- N+1 query problems
- Unoptimized database queries
- Lack of proper caching
- Synchronous processing of async tasks

## Infrastructure and DevOps

### Container Strategy
- Use Docker for consistent environments
- Implement proper health checks
- Design for horizontal scaling
- Use multi-stage builds for smaller images

### Monitoring and Observability
You can't fix what you can't see:
- Implement structured logging
- Use distributed tracing
- Set up proper alerting
- Monitor business metrics, not just technical ones

## Key Takeaways

1. **Start simple, scale smart** - Don't over-engineer early
2. **Measure everything** - Data-driven decisions beat assumptions
3. **Plan for failure** - Systems will fail, design for resilience
4. **Automate ruthlessly** - Manual processes don't scale
5. **Team communication** - Technical scaling requires organizational scaling

Building scalable systems is as much about people and processes as it is about technology. The best architecture is the one your team can understand, maintain, and evolve.

---

*What's your biggest scaling challenge? I'd love to hear about it in the comments below.*
    `
  },
  'minimal-design-tech-products': {
    id: '2',
    title: 'The Art of Minimal Design in Tech Products',
    slug: 'minimal-design-tech-products',
    date: '2024-01-08',
    readTime: '5 min read',
    tags: ['Design', 'UX', 'Minimalism'],
    category: 'Design',
    author: {
      name: 'MD Salah',
      bio: 'Founder, Developer, Designer & Engineer'
    },
    content: `
# The Art of Minimal Design in Tech Products

In a world of feature-bloated applications and overwhelming interfaces, minimal design isn't just an aesthetic choice—it's a competitive advantage. After designing dozens of products, I've learned that the best interfaces are often the ones users don't notice.

## What Minimal Design Really Means

Minimal design isn't about having fewer elements. It's about having **only the right elements**. Every pixel should serve a purpose.

### The Core Principles

1. **Clarity over cleverness**
2. **Function over form**
3. **User goals over business goals**
4. **Simplicity over complexity**

## The Psychology Behind Minimalism

### Cognitive Load Theory
The human brain can only process so much information at once. Every additional element on your interface increases cognitive load:

- **Intrinsic load**: The mental effort required to understand the task
- **Extraneous load**: The mental effort wasted on irrelevant elements
- **Germane load**: The mental effort used to process and understand information

Minimal design reduces extraneous load, allowing users to focus on what matters.

### The Paradox of Choice
Barry Schwartz's research shows that too many options lead to:
- Decision paralysis
- Decreased satisfaction
- Increased anxiety
- Regret and second-guessing

## Practical Implementation

### 1. The 5-Second Rule
Users should understand your interface's primary purpose within 5 seconds. If they can't, you need to simplify.

### 2. Progressive Disclosure
Don't show everything at once. Reveal information and options progressively:
- Start with the most common use case
- Provide clear paths to advanced features
- Use contextual menus and modals
- Implement smart defaults

### 3. White Space is Your Friend
White space (or negative space) isn't wasted space—it's a powerful design tool:
- Improves readability
- Creates visual hierarchy
- Reduces cognitive load
- Makes interfaces feel premium

## Common Minimal Design Mistakes

### 1. Hiding Too Much
Minimal doesn't mean invisible. Critical functions should always be discoverable.

### 2. Removing Necessary Feedback
Users need to understand what's happening. Don't sacrifice feedback for aesthetics.

### 3. Over-Simplifying Complex Tasks
Some tasks are inherently complex. Don't make them harder by over-simplifying the interface.

## Case Studies in Minimal Design

### Google Search
The ultimate minimal interface:
- Single input field
- Clear primary action
- Everything else is secondary
- Billions of users understand it instantly

### Stripe Dashboard
Complex financial data made simple:
- Clear visual hierarchy
- Progressive disclosure
- Consistent patterns
- Focused on user goals

## Tools and Techniques

### Design Systems
Create consistent, minimal components:
- Limited color palette
- Consistent spacing system
- Typography hierarchy
- Reusable patterns

### User Testing
Validate your minimal designs:
- Task completion rates
- Time to completion
- Error rates
- User satisfaction scores

## The Business Impact

Minimal design isn't just about aesthetics—it drives business results:

- **Increased conversion rates** (less friction)
- **Reduced support costs** (clearer interfaces)
- **Faster development** (fewer components)
- **Better accessibility** (simpler navigation)

## Key Takeaways

1. **Less is more** - But only when "less" serves user needs better
2. **Test ruthlessly** - Your assumptions about simplicity might be wrong
3. **Context matters** - Minimal design looks different for different products
4. **Iterate constantly** - Simplicity is achieved through refinement

The goal isn't to create the most minimal design possible—it's to create the most effective design for your users. Sometimes that means adding elements, sometimes it means removing them.

---

*What's your favorite example of minimal design? Share it in the comments below.*
    `
  },
  'idea-to-mvp-journey': {
    id: '3',
    title: 'From Idea to MVP: A Founder\'s Journey',
    slug: 'idea-to-mvp-journey',
    date: '2024-01-01',
    readTime: '12 min read',
    tags: ['Startup', 'MVP', 'Product'],
    category: 'Business',
    author: {
      name: 'MD Salah',
      bio: 'Founder, Developer, Designer & Engineer'
    },
    content: `
# From Idea to MVP: A Founder's Journey

Building your first MVP is like learning to drive—everyone tells you it's easy until you're behind the wheel. After launching multiple products and helping dozens of founders bring their ideas to life, I've learned that the journey from idea to MVP is less about the destination and more about the lessons learned along the way.

## The Idea Phase: Where Dreams Meet Reality

### The Eureka Moment
It usually starts with a problem you're personally facing. For me, it was the frustration of managing multiple projects across different tools. The "aha" moment came at 2 AM when I was switching between five different apps just to update a client on project status.

### Validating the Problem
Before writing a single line of code, I spent two weeks talking to potential users:
- **50+ conversations** with freelancers and agency owners
- **3 online surveys** with 200+ responses each
- **Competitive analysis** of 15+ existing solutions

**Key insight**: The problem wasn't lack of tools—it was tool fragmentation.

### The Lean Canvas
I mapped out the business model using Ash Maurya's Lean Canvas:
- **Problem**: Tool fragmentation for project management
- **Solution**: Unified dashboard for project updates
- **Unique Value Proposition**: "One dashboard, all your projects"
- **Customer Segments**: Freelancers and small agencies

## Planning: The Foundation of Success

### Setting Clear Goals
Your MVP should answer one specific question. Mine was: "Can we reduce project update time by 80%?"

### The Feature Prioritization Framework
I used the MoSCoW method:
- **Must have**: Project dashboard, client updates
- **Should have**: Time tracking, basic reporting
- **Could have**: Team collaboration, advanced analytics
- **Won't have**: Invoicing, file storage, chat

### Technical Architecture Decisions
Choosing the right tech stack for an MVP is crucial:
- **Frontend**: React (familiar, fast development)
- **Backend**: Node.js + Express (JavaScript everywhere)
- **Database**: PostgreSQL (reliable, scalable)
- **Hosting**: Vercel + Railway (easy deployment)

## Building: Where the Magic Happens

### Week 1-2: Core Infrastructure
- Set up development environment
- Database schema design
- Authentication system
- Basic API endpoints

### Week 3-4: MVP Features
- Project dashboard
- Client update system
- Basic user management
- Responsive design

### Week 5-6: Polish and Testing
- Bug fixes and optimization
- User testing with 10 beta users
- Performance improvements
- Security audit

## The Technical Challenges

### Challenge 1: Real-time Updates
**Problem**: Clients needed instant notifications
**Solution**: WebSocket implementation with fallback to polling
**Lesson**: Start simple, optimize later

### Challenge 2: Data Synchronization
**Problem**: Multiple data sources, single dashboard
**Solution**: Event-driven architecture with message queues
**Lesson**: Design for eventual consistency from day one

### Challenge 3: Mobile Responsiveness
**Problem**: 60% of users accessed on mobile
**Solution**: Mobile-first design approach
**Lesson**: Test on real devices, not just browser dev tools

## User Testing: The Moment of Truth

### Beta Testing Strategy
- **10 power users** for intensive testing
- **50 casual users** for broader feedback
- **Weekly feedback sessions** for 4 weeks
- **Usage analytics** to track behavior

### Key Insights from Testing
1. **Users wanted more customization** than initially planned
2. **Onboarding was too complex** (7 steps → 3 steps)
3. **Mobile experience was critical** (not nice-to-have)
4. **Integration with existing tools** was essential

### Iterating Based on Feedback
- Simplified onboarding flow
- Added Slack and email integrations
- Improved mobile interface
- Added customizable dashboard widgets

## Launch Day: The Anticlimax

### Pre-launch Preparation
- **Landing page** with email capture (2 weeks before)
- **Product Hunt** submission preparation
- **Social media** content calendar
- **Press kit** for potential coverage

### The Launch
- **Product Hunt**: #3 Product of the Day
- **Initial users**: 127 signups in 24 hours
- **Conversion rate**: 23% (trial to paid)
- **User feedback**: 4.2/5 average rating

### Post-launch Reality
The real work begins after launch:
- **Customer support** (50+ emails daily)
- **Bug fixes** (3 critical issues in first week)
- **Feature requests** (200+ in first month)
- **Scaling challenges** (server crashes at 500 concurrent users)

## Lessons Learned

### What Went Right
1. **Problem validation** saved months of development
2. **Simple tech stack** enabled fast iteration
3. **User testing** prevented major UX disasters
4. **Clear MVP scope** kept us focused

### What Went Wrong
1. **Underestimated support needs** (no help documentation)
2. **Scaling issues** (didn't load test properly)
3. **Feature creep** (added 3 unplanned features)
4. **Pricing strategy** (too low initially)

### Key Takeaways

#### 1. Start with the Problem, Not the Solution
Spend more time understanding the problem than building the solution.

#### 2. Build for Learning, Not Perfection
Your MVP should be embarrassing enough that you're ashamed to show it, but functional enough that people will use it.

#### 3. Talk to Users Constantly
User feedback is your compass. Without it, you're navigating blind.

#### 4. Measure Everything
You can't improve what you don't measure. Set up analytics from day one.

#### 5. Prepare for Success
Have a plan for what happens when things go right. Scaling problems are good problems to have.

## The MVP Framework

Based on this experience, I developed a framework for future MVPs:

### Phase 1: Validate (2 weeks)
- Problem interviews
- Competitive analysis
- Market sizing
- Lean canvas

### Phase 2: Plan (1 week)
- Feature prioritization
- Technical architecture
- Timeline and milestones
- Success metrics

### Phase 3: Build (4-6 weeks)
- Core functionality only
- Weekly user testing
- Continuous deployment
- Performance monitoring

### Phase 4: Launch (1 week)
- Soft launch to beta users
- Gather feedback and iterate
- Public launch
- Monitor and support

## Tools and Resources

### Development Tools
- **Design**: Figma for mockups and prototypes
- **Development**: VS Code with essential extensions
- **Version Control**: Git with GitHub
- **Project Management**: Linear for issue tracking

### Analytics and Monitoring
- **User Analytics**: Mixpanel for event tracking
- **Error Monitoring**: Sentry for bug tracking
- **Performance**: Vercel Analytics
- **User Feedback**: Hotjar for session recordings

### Marketing and Launch
- **Landing Page**: Framer for quick, beautiful pages
- **Email Marketing**: ConvertKit for user communication
- **Social Media**: Buffer for content scheduling
- **Launch**: Product Hunt and Hacker News

## Final Thoughts

Building an MVP is not about creating a smaller version of your dream product—it's about learning as quickly and cheaply as possible whether your dream product should exist at all.

The journey from idea to MVP taught me that success isn't measured by the features you build, but by the problems you solve and the users you serve.

Your first MVP will probably fail. That's not just okay—it's expected. The goal is to fail fast, learn faster, and iterate until you find product-market fit.

---

*What's your biggest challenge in building your MVP? I'd love to help you work through it. Drop me a line in the comments or reach out directly.*
    `
  }
};

function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [isDark, setIsDark] = useState(true);
  const [liked, setLiked] = useState(false);
  
  const post = slug ? blogPosts[slug] : null;

  if (!post) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className="text-center">
          <h1 className="font-mono text-2xl mb-4">404 - Post Not Found</h1>
          <Link 
            to="/blog"
            className={`font-mono hover:${isDark ? 'text-emerald-400' : 'text-slate-600'} transition-colors`}
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="font-mono text-3xl md:text-4xl mb-6 mt-8 first:mt-0">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="font-mono text-2xl md:text-3xl mb-4 mt-8">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="font-mono text-xl md:text-2xl mb-3 mt-6">{line.slice(4)}</h3>;
        }
        
        // Bold text
        if (line.includes('**')) {
          const parts = line.split('**');
          return (
            <p key={index} className={`mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {parts.map((part, i) => 
                i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
              )}
            </p>
          );
        }
        
        // Lists
        if (line.startsWith('- ')) {
          return (
            <li key={index} className={`mb-2 ml-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {line.slice(2)}
            </li>
          );
        }
        
        // Code blocks (simple detection)
        if (line.startsWith('```')) {
          return null; // Skip for now
        }
        
        // Horizontal rule
        if (line === '---') {
          return <hr key={index} className={`my-8 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`} />;
        }
        
        // Empty lines
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        // Regular paragraphs
        if (line.trim() && !line.startsWith('#') && !line.startsWith('-')) {
          return (
            <p key={index} className={`mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {line}
            </p>
          );
        }
        
        return null;
      })
      .filter(Boolean);
  };

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
          <div className="flex items-center justify-between">
            <Link 
              to="/blog"
              className={`flex items-center space-x-2 font-mono text-sm hover:${isDark ? 'text-emerald-400' : 'text-slate-600'} transition-colors`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
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
        </div>
      </header>

      {/* Article */}
      <article className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center space-x-4 mb-6">
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
            
            <h1 className="font-mono text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
              {post.title}
            </h1>
            
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
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center space-x-1 transition-colors ${
                    liked 
                      ? 'text-red-500' 
                      : isDark ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  <span className="font-mono text-sm">42</span>
                </button>
                
                <button className={`flex items-center space-x-1 ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-600'} transition-colors`}>
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-mono text-sm">8</span>
                </button>
                
                <button className={`${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-600'} transition-colors`}>
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {formatContent(post.content)}
          </div>

          {/* Author Bio */}
          <div className={`mt-16 p-6 border rounded-lg ${
            isDark 
              ? 'border-slate-700 bg-slate-800/50' 
              : 'border-slate-200 bg-white'
          }`}>
            <div className="flex items-start space-x-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center font-mono text-xl ${
                isDark ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-white'
              }`}>
                MS
              </div>
              <div>
                <h3 className="font-mono text-xl mb-2">{post.author.name}</h3>
                <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                  {post.author.bio}
                </p>
                <div className="flex space-x-4">
                  <Link 
                    to="/"
                    className={`font-mono text-sm hover:${isDark ? 'text-emerald-400' : 'text-slate-600'} transition-colors`}
                  >
                    Portfolio →
                  </Link>
                  <a 
                    href="https://twitter.com/mdsalah"
                    className={`font-mono text-sm hover:${isDark ? 'text-emerald-400' : 'text-slate-600'} transition-colors`}
                  >
                    Twitter →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default BlogPost;