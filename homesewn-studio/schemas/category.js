export default {
  name: 'category',
  title: 'Kategorie',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Name',
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
      name: 'description',
      title: 'Beschreibung',
      type: 'text',
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
}
