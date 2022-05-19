import groq from 'groq'
import type { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import Home from '.'
import { liveClient } from '../lib/sanityClient'
import type { Post } from '../momblog-studio/types/sanitySchemaTypes' // eslint-disable-line import/no-relative-packages

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const slug = (context.params?.category as string | undefined) ?? null

  const [categoryTitle, posts] = await Promise.all([
    liveClient.fetch<string | null>(
      groq`*[_type == "category" && slug.current == $slug][0].title`,
      { slug }
    ),
    liveClient.fetch<Post[]>(
      groq`*[_type == "post" && $slug in (categories[]->slug.current) && publishedAt < now()]
      | order(publishedAt desc)[0...8]
      {..., "categories": categories[]->title}`,
      { slug }
    ),
  ])

  return {
    props: {
      posts,
      category: categoryTitle,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await liveClient.fetch<string[]>(groq`*[_type == "category"].slug.current`)

  return {
    paths: slugs.map((slug) => ({ params: { category: slug } })),
    fallback: false,
  }
}

// reusing the index Homepage
// eslint-disable-next-line unicorn/prefer-export-from
export default Home
