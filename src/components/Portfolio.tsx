import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Moon,
  Sun,
  Terminal,
  Code,
  Palette,
  Briefcase,
  Mail,
  Github,
  Linkedin,
  Twitter,
  GitBranch,
  Star,
  Users,
  Zap,
  Activity,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

interface Project {
  name: string;
  description: string;
  tech: string[];
  status: "live" | "development" | "archived";
  impact: string;
}

const projects: Project[] = [
  {
    name: "nexus-ai",
    description: "AI-powered analytics platform for enterprise decision making",
    tech: ["React", "Node.js", "TensorFlow", "PostgreSQL"],
    status: "live",
    impact: "10k+ users",
  },
  {
    name: "minimal-cms",
    description: "Headless CMS built for developers who value simplicity",
    tech: ["TypeScript", "GraphQL", "Docker", "Redis"],
    status: "development",
    impact: "Beta testing",
  },
  {
    name: "design-system",
    description: "Component library used across multiple products",
    tech: ["React", "Storybook", "Tailwind", "Figma"],
    status: "live",
    impact: "5 teams using",
  },
  {
    name: "startup-toolkit",
    description: "Open-source collection of founder resources and templates",
    tech: ["Next.js", "MDX", "Vercel", "GitHub"],
    status: "archived",
    impact: "2k+ stars",
  },
];

const skills = [
  { name: "JavaScript/TypeScript", level: 95, category: "languages" },
  { name: "React/Next.js", level: 92, category: "frontend" },
  { name: "Node.js/Python", level: 88, category: "backend" },
  { name: "System Design", level: 85, category: "architecture" },
  { name: "UI/UX Design", level: 90, category: "design" },
  { name: "Product Strategy", level: 87, category: "business" },
];

function Portfolio() {
  const [isDark, setIsDark] = useState(true);
  const [currentPath, setCurrentPath] = useState("~");
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [activeSkillCategory, setActiveSkillCategory] = useState("all");

  const fullText =
    "Hello, I'm MD Salah - developer, designer & engineer";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const scrollToSection = (sectionId: string, path: string) => {
    setCurrentPath(path);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return isDark ? "text-emerald-400" : "text-emerald-600";
      case "development":
        return isDark ? "text-amber-400" : "text-amber-600";
      case "archived":
        return isDark ? "text-slate-400" : "text-slate-500";
      default:
        return isDark ? "text-emerald-400" : "text-emerald-600";
    }
  };

  const filteredSkills =
    activeSkillCategory === "all"
      ? skills
      : skills.filter((skill) => skill.category === activeSkillCategory);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 backdrop-blur-sm border-b transition-colors duration-300 ${
          isDark
            ? "bg-slate-900/80 border-slate-700"
            : "bg-slate-50/80 border-slate-200"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-mono">
            <Terminal className="w-5 h-5" />
            <span
              className={`${isDark ? "text-emerald-400" : "text-slate-600"}`}
            >
              salah@portfolio:{currentPath}$
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 font-mono text-sm">
            <button
              onClick={() => scrollToSection("about", "~/about")}
              className={`hover:${
                isDark ? "text-emerald-400" : "text-slate-600"
              } transition-colors`}
            >
              ./about
            </button>
            <button
              onClick={() => scrollToSection("projects", "~/projects")}
              className={`hover:${
                isDark ? "text-emerald-400" : "text-slate-600"
              } transition-colors`}
            >
              ./projects
            </button>
            <button
              onClick={() => scrollToSection("skills", "~/skills")}
              className={`hover:${
                isDark ? "text-emerald-400" : "text-slate-600"
              } transition-colors`}
            >
              ./skills
            </button>
            <button
              onClick={() => scrollToSection("metrics", "~/metrics")}
              className={`hover:${
                isDark ? "text-emerald-400" : "text-slate-600"
              } transition-colors`}
            >
              ./metrics
            </button>
            <Link
              to="/blog"
              className={`hover:${
                isDark ? "text-emerald-400" : "text-slate-600"
              } transition-colors`}
            >
              ./blog
            </Link>
            <button
              onClick={() => scrollToSection("contact", "~/contact")}
              className={`hover:${
                isDark ? "text-emerald-400" : "text-slate-600"
              } transition-colors`}
            >
              ./contact
            </button>
          </nav>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors hover:${
              isDark ? "bg-slate-800" : "bg-slate-200"
            }`}
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className={`font-mono text-sm mb-8 ${
              isDark ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            guest@portfolio:~$ whoami
          </div>

          <h1 className="font-mono text-2xl md:text-4xl lg:text-5xl mb-8 leading-relaxed">
            {displayText}
            <span
              className={`${
                showCursor ? "opacity-100" : "opacity-0"
              } transition-opacity`}
            >
              |
            </span>
          </h1>

          <p
            className={`font-mono text-lg leading-relaxed max-w-2xl ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Building digital experiences that matter. I create, code, design,
            and lead with a focus on simplicity and impact.
          </p>

          <div
            className={`mt-8 font-mono text-sm ${
              isDark ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            guest@portfolio:~$ cat status.txt
            <br />
            <span
              className={`${
                isDark ? "text-slate-300" : "text-slate-700"
              } text-xl`}
            >
              Currently engineering{" "}
              <a
                className="text-slate-400 font-semibold underline-offset-1 underline hover:text-slate-300"
                href="https://qsat.diy"
              >
                QSAT
              </a>
            </span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className={`font-mono text-sm mb-8 ${
              isDark ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            salah@portfolio:~/about$ ls -la
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div
                className={`p-6 border rounded-lg transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <Briefcase
                  className={`w-8 h-8 mb-4 ${
                    isDark ? "text-emerald-400" : "text-slate-600"
                  }`}
                />
                <h3 className="font-mono text-xl mb-2">Founder</h3>
                <p
                  className={`${isDark ? "text-slate-300" : "text-slate-600"}`}
                >
                  Building companies from 0 to 1. Strategic vision meets
                  execution.
                </p>
              </div>

              <div
                className={`p-6 border rounded-lg transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <Code
                  className={`w-8 h-8 mb-4 ${
                    isDark ? "text-emerald-400" : "text-slate-600"
                  }`}
                />
                <h3 className="font-mono text-xl mb-2">Developer</h3>
                <p
                  className={`${isDark ? "text-slate-300" : "text-slate-600"}`}
                >
                  Full-stack engineering with focus on scalable architecture.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div
                className={`p-6 border rounded-lg transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <Palette
                  className={`w-8 h-8 mb-4 ${
                    isDark ? "text-emerald-400" : "text-slate-600"
                  }`}
                />
                <h3 className="font-mono text-xl mb-2">Designer</h3>
                <p
                  className={`${isDark ? "text-slate-300" : "text-slate-600"}`}
                >
                  Crafting intuitive experiences through thoughtful design.
                </p>
              </div>

              <div
                className={`p-6 border rounded-lg transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <Terminal
                  className={`w-8 h-8 mb-4 ${
                    isDark ? "text-emerald-400" : "text-slate-600"
                  }`}
                />
                <h3 className="font-mono text-xl mb-2">Engineer</h3>
                <p
                  className={`${isDark ? "text-slate-300" : "text-slate-600"}`}
                >
                  Systems thinking applied to complex technical challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className={`font-mono text-sm mb-8 ${
              isDark ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            salah@portfolio:~/projects$ git log --oneline
          </div>

          <div className="space-y-4">
            {projects.map((project, index) => (
              <div
                key={project.name}
                className={`flex items-center justify-between p-4 border-l-4 transition-all duration-300 hover:translate-x-2 ${
                  isDark
                    ? "border-l-emerald-500 bg-slate-800/30 hover:bg-slate-800/50"
                    : "border-l-slate-400 bg-white/50 hover:bg-white"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <GitBranch
                      className={`w-4 h-4 ${
                        isDark ? "text-emerald-400" : "text-slate-600"
                      }`}
                    />
                    <span className="font-mono text-lg">{project.name}</span>
                    <span
                      className={`font-mono text-sm px-2 py-1 rounded ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p
                    className={`${
                      isDark ? "text-slate-300" : "text-slate-600"
                    } mb-2 ml-8`}
                  >
                    {project.description}
                  </p>

                  <div className="flex items-center space-x-4 ml-8">
                    <div className="flex space-x-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className={`font-mono text-xs px-2 py-1 rounded ${
                            isDark
                              ? "bg-slate-700 text-slate-300"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <span
                      className={`font-mono text-sm ${
                        isDark ? "text-emerald-400" : "text-slate-500"
                      }`}
                    >
                      {project.impact}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className={`font-mono text-sm mb-8 ${
              isDark ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            salah@portfolio:~/skills$ top -o cpu
          </div>

          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                "all",
                "languages",
                "frontend",
                "backend",
                "architecture",
                "design",
                "business",
              ].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveSkillCategory(category)}
                  className={`font-mono text-sm px-3 py-1 rounded transition-colors ${
                    activeSkillCategory === category
                      ? isDark
                        ? "bg-emerald-500 text-slate-900"
                        : "bg-slate-800 text-white"
                      : isDark
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredSkills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono">{skill.name}</span>
                    <span
                      className={`font-mono text-sm ${
                        isDark ? "text-emerald-400" : "text-slate-600"
                      }`}
                    >
                      {skill.level}%
                    </span>
                  </div>
                  <div
                    className={`w-full h-2 rounded-full ${
                      isDark ? "bg-slate-800" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isDark ? "bg-emerald-500" : "bg-slate-800"
                      }`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section id="metrics" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className={`font-mono text-sm mb-8 ${
              isDark ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            salah@portfolio:~/metrics$ iostat -x 1
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div
              className={`text-center p-6 border rounded-lg ${
                isDark
                  ? "border-slate-700 bg-slate-800/30"
                  : "border-slate-200 bg-white"
              }`}
            >
              <Users
                className={`w-8 h-8 mx-auto mb-2 ${
                  isDark ? "text-emerald-400" : "text-slate-600"
                }`}
              />
              <div className="font-mono text-2xl mb-1">50k+</div>
              <div
                className={`font-mono text-sm ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Users Impacted
              </div>
            </div>

            <div
              className={`text-center p-6 border rounded-lg ${
                isDark
                  ? "border-slate-700 bg-slate-800/30"
                  : "border-slate-200 bg-white"
              }`}
            >
              <Star
                className={`w-8 h-8 mx-auto mb-2 ${
                  isDark ? "text-emerald-400" : "text-slate-600"
                }`}
              />
              <div className="font-mono text-2xl mb-1">15+</div>
              <div
                className={`font-mono text-sm ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Projects Shipped
              </div>
            </div>

            <div
              className={`text-center p-6 border rounded-lg ${
                isDark
                  ? "border-slate-700 bg-slate-800/30"
                  : "border-slate-200 bg-white"
              }`}
            >
              <Zap
                className={`w-8 h-8 mx-auto mb-2 ${
                  isDark ? "text-emerald-400" : "text-slate-600"
                }`}
              />
              <div className="font-mono text-2xl mb-1">99.9%</div>
              <div
                className={`font-mono text-sm ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Uptime
              </div>
            </div>

            <div
              className={`text-center p-6 border rounded-lg ${
                isDark
                  ? "border-slate-700 bg-slate-800/30"
                  : "border-slate-200 bg-white"
              }`}
            >
              <TrendingUp
                className={`w-8 h-8 mx-auto mb-2 ${
                  isDark ? "text-emerald-400" : "text-slate-600"
                }`}
              />
              <div className="font-mono text-2xl mb-1">5</div>
              <div
                className={`font-mono text-sm ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Years Experience
              </div>
            </div>
          </div>

          {/* System Monitor Style Display */}
          <div
            className={`mt-12 p-6 border rounded-lg font-mono text-sm ${
              isDark
                ? "border-slate-700 bg-slate-800/30"
                : "border-slate-200 bg-white"
            }`}
          >
            <div
              className={`mb-4 ${
                isDark ? "text-emerald-400" : "text-slate-700"
              }`}
            >
              System Status: OPERATIONAL
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div
                  className={`${isDark ? "text-slate-300" : "text-slate-600"}`}
                >
                  CPU Usage
                </div>
                <div className="flex items-center space-x-2">
                  <Activity
                    className={`w-4 h-4 ${
                      isDark ? "text-emerald-400" : "text-slate-600"
                    }`}
                  />
                  <span>85% (Optimal)</span>
                </div>
              </div>
              <div>
                <div
                  className={`${isDark ? "text-slate-300" : "text-slate-600"}`}
                >
                  Memory
                </div>
                <div className="flex items-center space-x-2">
                  <Activity
                    className={`w-4 h-4 ${
                      isDark ? "text-emerald-400" : "text-slate-600"
                    }`}
                  />
                  <span>12GB / 16GB</span>
                </div>
              </div>
              <div>
                <div
                  className={`${isDark ? "text-slate-300" : "text-slate-600"}`}
                >
                  Network
                </div>
                <div className="flex items-center space-x-2">
                  <Activity
                    className={`w-4 h-4 ${
                      isDark ? "text-emerald-400" : "text-slate-600"
                    }`}
                  />
                  <span>1.2GB/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className={`font-mono text-sm mb-8 ${
              isDark ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            salah@portfolio:~/blog$ ls -t | head -3
          </div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="font-mono text-2xl">Latest Posts</h2>
            <Link
              to="/blog"
              className={`flex items-center space-x-2 font-mono text-sm hover:${
                isDark ? "text-emerald-400" : "text-slate-600"
              } transition-colors`}
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-6">
            {[
              {
                title: "Building Scalable Systems: Lessons from the Trenches",
                date: "2024-01-15",
                excerpt:
                  "Key insights on architecture decisions that make or break startups...",
                slug: "building-scalable-systems",
              },
              {
                title: "The Art of Minimal Design in Tech Products",
                date: "2024-01-08",
                excerpt:
                  "Why less is more when it comes to user experience and product design...",
                slug: "minimal-design-tech-products",
              },
              {
                title: "From Idea to MVP: A Founder's Journey",
                date: "2024-01-01",
                excerpt:
                  "The complete process of taking a concept from whiteboard to market...",
                slug: "idea-to-mvp-journey",
              },
            ].map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className={`block p-6 border rounded-lg transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <time
                    className={`font-mono text-sm ${
                      isDark ? "text-emerald-400" : "text-slate-500"
                    }`}
                  >
                    {post.date}
                  </time>
                </div>

                <h3
                  className={`font-mono text-xl mb-3 hover:${
                    isDark ? "text-emerald-400" : "text-slate-600"
                  } transition-colors`}
                >
                  {post.title}
                </h3>

                <p
                  className={`${
                    isDark ? "text-slate-300" : "text-slate-600"
                  } leading-relaxed`}
                >
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className={`font-mono text-sm mb-8 ${
              isDark ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            salah@portfolio:~/contact$ cat social_links.json
          </div>

          <div className="text-center">
            <h2 className="font-mono text-2xl md:text-3xl mb-8">
              Let's Connect
            </h2>

            <p
              className={`font-mono text-lg mb-12 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Always open to discussing new opportunities and interesting
              projects.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="mailto:hello@mdsalah.dev"
                className={`flex items-center space-x-2 p-4 border rounded-lg transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "border-slate-700 hover:border-slate-600 hover:bg-slate-800/50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Mail className="w-5 h-5" />
                <span className="font-mono">Email</span>
              </a>

              <a
                href="https://github.com/mdsalah"
                className={`flex items-center space-x-2 p-4 border rounded-lg transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "border-slate-700 hover:border-slate-600 hover:bg-slate-800/50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Github className="w-5 h-5" />
                <span className="font-mono">GitHub</span>
              </a>

              <a
                href="https://linkedin.com/in/mdsalah"
                className={`flex items-center space-x-2 p-4 border rounded-lg transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "border-slate-700 hover:border-slate-600 hover:bg-slate-800/50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Linkedin className="w-5 h-5" />
                <span className="font-mono">LinkedIn</span>
              </a>

              <a
                href="https://twitter.com/mdsalah"
                className={`flex items-center space-x-2 p-4 border rounded-lg transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "border-slate-700 hover:border-slate-600 hover:bg-slate-800/50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Twitter className="w-5 h-5" />
                <span className="font-mono">Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`border-t py-8 ${
          isDark ? "border-slate-700" : "border-slate-200"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p
            className={`font-mono text-sm ${
              isDark ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            salah@portfolio:~$ echo "Built with passion and precision by MD
            Salah"
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Portfolio;
