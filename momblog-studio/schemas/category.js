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
