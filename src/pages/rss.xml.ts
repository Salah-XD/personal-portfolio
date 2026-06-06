import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const sorted = posts.sort(
    (a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()
  );

  return rss({
    title: 'MD Salah — Blog',
    description: 'Tech, design, and building products. Notes from MD Salah.',
    site: context.site ?? 'https://salahxd.dev',
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.excerpt || post.data.title,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
      author: `noreply@salahxd.dev (${post.data.author})`,
    })),
    customData: '<language>en-us</language>',
    stylesheet: '/rss-styles.xsl',
  });
}
