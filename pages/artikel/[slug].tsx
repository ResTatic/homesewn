import { PortableText } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import groq from 'groq'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next'
import Image from 'next/image'
import sanityClient from '../../lib/sanityClient'
import type {
  Post as PostType,
  SanityImageAsset,
  SanityReference,
} from '../../momblog-studio/types/sanitySchemaTypes' // eslint-disable-line import/no-relative-packages
import styles from '../../styles/Artikel.module.scss'

interface SanityImage {
  asset: SanityReference<SanityImageAsset>
}

interface Props {
  post: Omit<PostType, 'categories'> & {
    categories?: [
      {
        id: string
        title: string
      }
    ]
  }
}

function getMainImageComp(sanityImage: SanityImage) {
  const imgUrl = imageUrlBuilder(sanityClient)
    .image(sanityImage)
    .size(1000, 400)
    .auto('format')
    .url()
  return <Image src={imgUrl} loading="lazy" layout="responsive" width={1000} height={400} />
}

function getBodyImageComp(sanityImage: SanityImage) {
  const imgUrl = imageUrlBuilder(sanityClient)
    .image(sanityImage)
    .size(500, 500)
    .auto('format')
    .url()
  return <Image src={imgUrl} loading="lazy" layout="intrinsic" width={500} height={500} />
}

const ptComponents = {
  types: {
    image: ({ value }: { value?: SanityImage }) => {
      if (!value?.asset?._ref) {
        return null
      }
      return getBodyImageComp(value)
    },
  },
}

const Post: NextPage<Props> = ({ post: { title, mainImage, body, categories } }) => (
  <article>
    {mainImage && getMainImageComp(mainImage)}
    <div className={styles.main}>
      {categories && categories.length > 0 && (
        <ul className={styles.categories}>
          {categories.map((cat) => (
            <li key={cat.id} className={styles.category}>
              {cat.title}
            </li>
          ))}
        </ul>
      )}
      <h1 className={styles.title}>{title}</h1>
      {body && (
        <section className={styles.body}>
          <PortableText value={body} components={ptComponents} />
        </section>
      )}
    </div>
  </article>
)

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const slug = (context.params?.slug as string) ?? ''
  const post = await sanityClient.fetch<PostType>(
    groq`*[_type == "post" && slug.current == $slug][0]
      {...,"categories": categories[]->{"id": _id, title}}`,
    { slug }
  )
  return {
    props: {
      post,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await sanityClient.fetch<string[]>(
    groq`*[_type == "post" && defined(slug.current)][].slug.current`
  )

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  }
}

export default Post
