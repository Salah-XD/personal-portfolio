import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import keystatic from '@keystatic/astro';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://salahxd.vercel.app',
  output: 'static',
  adapter: vercel(),
  integrations: [
    react(),
    tailwind(),
    markdoc(),
    sitemap({
      filter: (page) => !page.includes('/keystatic') && !page.includes('/og/'),
    }),
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
});
