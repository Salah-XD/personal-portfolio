import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import keystatic from '@keystatic/astro';
import markdoc from '@astrojs/markdoc';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://salahxd.vercel.app',
  output: 'static',
  adapter: vercel(),
  integrations: [react(), tailwind(), markdoc(), keystatic()],
  security: {
    allowedDomains: [
      { hostname: '**.vercel.app', protocol: 'https' },
    ],
  },
});
