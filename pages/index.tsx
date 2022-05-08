import imageUrlBuilder from '@sanity/image-url'
import groq from 'groq'
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { GiSewingNeedle } from 'react-icons/gi'
import { cdnClient, liveClient } from '../lib/sanityClient'
import type {
  Post as PostType,
  SanityImageAsset,
  SanityReference,
} from '../momblog-studio/types/sanitySchemaTypes' // eslint-disable-line import/no-relative-packages
import styles from '../styles/Home.module.scss'

interface SanityImage {
  asset: SanityReference<SanityImageAsset>
}

interface Props {
  posts: [
    Omit<PostType, 'categories'> & {
      categories?: [
        {
          id: string
          title: string
        }
      ]
    }
  ]
}

function getCardImageComp(sanityImage: SanityImage) {
  const imgUrl = imageUrlBuilder(cdnClient).image(sanityImage).size(240, 160).auto('format').url()
  return <Image src={imgUrl} loading="lazy" layout="intrinsic" width={240} height={160} />
}

const Home: NextPage<Props> = ({ posts }: Props) => (
  <article>
    <Head>
      <title>Homesewn - Nähen, Basteln, Landleben</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <section className={styles.hero}>
      <Link href="/">
        <>
          <div className={styles.logo}>
            <GiSewingNeedle className={styles.logoIcon} />
            <span className={styles.logoName}>Homesewn</span>
          </div>
          <div className={styles.logoSub}>Nähen - Basteln - Landleben</div>
        </>
      </Link>
    </section>
    <section className={styles.main}>
      <h2>Neueste Artikel </h2>
      {posts.length > 0 && (
        <ul className={styles.cards}>
          {posts.map((post) => (
            <Link key={post._id} href={`/artikel/${post.slug.current}`}>
              <li className={styles.card}>
                {post.mainImage && getCardImageComp(post.mainImage)}
                <div className={styles.cardTitle}>{post.title}</div>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </section>
  </article>
)

export const getStaticProps: GetStaticProps = async () => {
  const posts = await liveClient.fetch<PostType[]>(
    groq`*[_type == "post" && publishedAt < now()] | order(publishedAt desc)[0..3]
      {..., "categories": categories[]->{"id": _id, title}}`
  )
  return {
    props: {
      posts,
    },
  }
}

export default Home
