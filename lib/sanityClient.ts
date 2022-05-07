import sanityClient from '@sanity/client'

export default sanityClient({
  apiVersion: '2022-05-05',
  projectId: 'avejjwu6',
  dataset: 'production',
  useCdn: true,
})
