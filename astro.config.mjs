import { defineConfig } from 'astro/config';
import { execSync } from 'node:child_process';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import keystatic from '@keystatic/astro';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import vercel from '@astrojs/vercel';

const buildCommit = (() => {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return 'dev';
  }
})();

// https://astro.build/config
export default defineConfig({
  site: 'https://salahxd.dev',
  output: 'static',
  adapter: vercel(),
  integrations: [
    react(),
    tailwind(),
    markdoc(),
    sitemap({
      filter: (page) =>
        !page.includes('/keystatic') && !page.endsWith('.png') && !page.endsWith('.xml'),
      serialize(item) {
        if (item.url === 'https://salahxd.dev/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/blog/')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        }
        return item;
      },
    }),
    pagefind(),
    keystatic(),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark-default',
      },
      wrap: true,
    },
  },
  security: {
    allowedDomains: [{ hostname: '**.vercel.app', protocol: 'https' }],
  },
  vite: {
    define: {
      __BUILD_COMMIT__: JSON.stringify(buildCommit),
    },
  },
});
