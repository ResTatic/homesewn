import sanityClient from '@sanity/client'

export const liveClient = sanityClient({
  apiVersion: '2022-05-05',
  projectId: 'avejjwu6',
  dataset: 'production',
  useCdn: false,
})

export const cdnClient = sanityClient({
  apiVersion: '2022-05-05',
  projectId: 'avejjwu6',
  dataset: 'production',
  useCdn: true,
})
