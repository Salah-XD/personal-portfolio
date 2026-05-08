import { config, fields, collection, singleton } from '@keystatic/core';

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
          options: {
            image: {
              directory: 'public/images/blog',
              publicPath: '/images/blog/',
            },
          },
        }),
      },
    }),
  },
  singletons: {
    now: singleton({
      label: 'Now (current focus)',
      path: 'src/content/site/now',
      format: 'json',
      schema: {
        lastUpdated: fields.date({
          label: 'Last updated',
          validation: { isRequired: true },
        }),
        mood: fields.text({
          label: 'Mood',
          description: 'Single short phrase, e.g. "shipping mode"',
          validation: { isRequired: true },
        }),
        focus: fields.array(fields.text({ label: 'Item' }), {
          label: 'Focus',
          description: "What you're focused on right now (each item one short line).",
          itemLabel: (props) => props.value || 'New item',
        }),
        learning: fields.array(fields.text({ label: 'Item' }), {
          label: 'Learning',
          description: "What you're currently learning.",
          itemLabel: (props) => props.value || 'New item',
        }),
        notWorkingOn: fields.array(fields.text({ label: 'Item' }), {
          label: 'Not working on',
          description: "Explicit non-goals — things you've decided to skip.",
          itemLabel: (props) => props.value || 'New item',
        }),
      },
    }),
    uses: singleton({
      label: 'Uses (gear & tools)',
      path: 'src/content/site/uses',
      format: 'json',
      schema: {
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: 'Heading', validation: { isRequired: true } }),
            prompt: fields.text({
              label: 'Terminal prompt',
              description: 'Shown above the section, e.g. "apt list --installed | grep editor"',
              validation: { isRequired: true },
            }),
            items: fields.array(
              fields.object({
                name: fields.text({ label: 'Name', validation: { isRequired: true } }),
                detail: fields.text({ label: 'Detail' }),
                url: fields.url({ label: 'URL' }),
              }),
              {
                label: 'Items',
                itemLabel: (props) => props.fields.name.value || 'New item',
              }
            ),
          }),
          {
            label: 'Sections',
            itemLabel: (props) => props.fields.heading.value || 'New section',
          }
        ),
      },
    }),
  },
});
