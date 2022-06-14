import { PortableText } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import groq from 'groq'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { GiSewingNeedle } from 'react-icons/gi'
import { Footer } from '../../components/Footer'
import { cdnClient, liveClient } from '../../lib/sanityClient'
import type {
  Post as PostType,
  SanityImageAsset,
  SanityReference,
} from '../../homesewn-studio/types/sanitySchemaTypes' // eslint-disable-line import/no-relative-packages
import styles from '../../styles/Artikel.module.scss'

interface SanityImage {
  asset: SanityReference<SanityImageAsset>
}

interface Props {
  post: Omit<PostType, 'categories'> & {
    categories?: [
      {
        id: string
        slug: string
        title: string
      }
    ]
  }
}

function getImageUrl(sanityImage: SanityImage, width: number, height: number) {
  return imageUrlBuilder(cdnClient).image(sanityImage).size(width, height).auto('format').url()
}

function getBannerImageComp(sanityImage: SanityImage) {
  return (
    <div className={styles.bannerImage}>
      <Image
        src={getImageUrl(sanityImage, 1000, 400)}
        priority
        layout="responsive"
        width={1000}
        height={400}
        className={styles.bannerImage}
      />
    </div>
  )
}

function getBodyImageComp(sanityImage: SanityImage) {
  return (
    <div className={styles.bodyImage}>
      <Image
        src={getImageUrl(sanityImage, 500, 500)}
        loading="lazy"
        layout="intrinsic"
        width={500}
        height={500}
        className={styles.bodyImage}
      />
    </div>
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
      <meta property="og:url" content={`https://homesewn.vercel.app/artikel/${slug.current}`} />
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
    {mainImage && getBannerImageComp(mainImage)}
    <div className={styles.main}>
      <div className={styles.mainContent}>
        {categories && categories.length > 0 && (
          <ul className={styles.categories}>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/${cat.slug}#main`}>
                <li className={styles.category}>{cat.title}</li>
              </Link>
            ))}
          </ul>
        )}
        <h1 className={styles.title}>{title}</h1>
        {body && (
          <section className={styles.body}>
            <PortableText value={body} components={ptComponents} />
            {mainImage && getBodyImageComp(mainImage)}
          </section>
        )}
      </div>
    </div>
    <Footer />
  </article>
)

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const slug = (context.params?.slug as string | undefined) ?? null
  const post = await liveClient.fetch<PostType | null>(
    groq`*[_type == "post" && slug.current == $slug && publishedAt < now()][0]
      {...,"categories": categories[]->{"id": _id, "slug": slug.current, title}}`,
    { slug }
  )

  return post
    ? {
        props: {
          post,
        },
      }
    : {
        notFound: true,
      }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await liveClient.fetch<string[]>(
    groq`*[_type == "post" && publishedAt < now()].slug.current`
  )

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: 'blocking',
  }
}

export default Post
