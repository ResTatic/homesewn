import { PortableText } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import groq from 'groq'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { GiSewingNeedle } from 'react-icons/gi'
import { cdnClient, liveClient } from '../../lib/sanityClient'
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

function getImageUrl(sanityImage: SanityImage, width: number, height: number) {
  return imageUrlBuilder(cdnClient).image(sanityImage).size(width, height).auto('format').url()
}

function getMainImageComp(sanityImage: SanityImage) {
  return (
    <Image
      src={getImageUrl(sanityImage, 1000, 400)}
      priority
      layout="responsive"
      width={1000}
      height={400}
    />
  )
}

function getBodyImageComp(sanityImage: SanityImage) {
  return (
    <Image
      src={getImageUrl(sanityImage, 500, 500)}
      loading="lazy"
      layout="intrinsic"
      width={500}
      height={500}
    />
  )
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

const Post: NextPage<Props> = ({ post: { title, slug, mainImage, body, categories } }) => (
  <article>
    <Head>
      <title>{`${title} - Homesewn`}</title>
      <meta property="og:title" content={title} />
      <meta property="og:type" content="article" />
      <meta
        property="og:description"
        content="Homesewn - Alles zum Thema Nähen, Basteln und Landleben."
      />
      <meta property="og:url" content={`https://momblog.vercel.app/artikel/${slug.current}`} />
      <meta property="og:site_name" content="Homesewn" />

      {mainImage && <meta property="og:image" content={getImageUrl(mainImage, 500, 500)} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>

    <section className={styles.banner}>
      <Link href="/">
        <span className={styles.logo}>
          <GiSewingNeedle className={styles.logoIcon} />
          <span className={styles.logoName}>Homesewn</span>
        </span>
      </Link>
    </section>
    {mainImage && <div className={styles.mainImage}>{getMainImageComp(mainImage)}</div>}
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
  const post = await liveClient.fetch<PostType | null>(
    groq`*[_type == "post" && slug.current == $slug && publishedAt < now()][0]
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
  const paths = await liveClient.fetch<string[]>(
    groq`*[_type == "post" && defined(slug.current) && publishedAt < now()][].slug.current`
  )

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: false,
  }
}

export default Post
