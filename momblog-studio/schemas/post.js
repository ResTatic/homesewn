export default {
  name: 'post',
  title: 'Artikel',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required().error('Pflichtfeld'),
      codegen: { required: true },
    },
    {
      name: 'slug',
      title: 'Link-Name',
      type: 'slug',
      description: 'Titel eingeben, dann einfach auf "Generate" clicken ;)',
      validation: (Rule) => Rule.required().error('Pflichtfeld'),
      codegen: { required: true },
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'mainImage',
      title: 'Titelbild',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'categories',
      title: 'Kategorien',
      type: 'array',
      validation: (Rule) => Rule.unique().error('doppelte Kategorie'),
      of: [{ type: 'reference', to: { type: 'category' } }],
    },
    {
      name: 'publishedAt',
      title: 'Datum',
      type: 'date',
      options: {
        dateFormat: 'D.M. YYYY',
      },
    },
    {
      name: 'body',
      title: 'Inhalt',
      type: 'blockContent',
    },
  ],

  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
    },
  },
}
