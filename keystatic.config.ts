import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: import.meta.env.DEV 
    ? { kind: 'local' }
    : {
        kind: 'github',
        repo: 'Salah-XD/personal-portfolio',
      },
  collections: {
    blog: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        excerpt: fields.text({ label: 'Excerpt', multiline: true }),
        readTime: fields.text({ label: 'Read Time (e.g., 5 min read)' }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Engineering', value: 'Engineering' },
            { label: 'Design', value: 'Design' },
            { label: 'Business', value: 'Business' },
            { label: 'Development', value: 'Development' },
            { label: 'Productivity', value: 'Productivity' },
          ],
          defaultValue: 'Engineering',
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: props => props.value || 'New tag',
          }
        ),
        author: fields.text({ label: 'Author', defaultValue: 'MD Salah' }),
        authorBio: fields.text({ label: 'Author Bio', defaultValue: 'Founder, Developer, Designer & Engineer' }),
        content: fields.markdoc({
          label: 'Content',
        }),
      },
    }),
  },
});
