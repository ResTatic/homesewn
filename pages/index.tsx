import imageUrlBuilder from '@sanity/image-url'
import groq from 'groq'
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { GiSewingNeedle } from 'react-icons/gi'
import { Footer } from '../components/Footer'
import { cdnClient, liveClient } from '../lib/sanityClient'
import type {
  Post,
  SanityImageAsset,
  SanityReference,
} from '../homesewn-studio/types/sanitySchemaTypes' // eslint-disable-line import/no-relative-packages
import styles from '../styles/Home.module.scss'

interface SanityImage {
  asset: SanityReference<SanityImageAsset>
}

interface Props {
  posts?: [
    Omit<Post, 'categories'> & {
      categories: string[]
    }
  ]
  category?: string
}

function getCardImageComp(sanityImage: SanityImage) {
  const imgUrl = imageUrlBuilder(cdnClient).image(sanityImage).size(240, 160).auto('format').url()
  return <Image src={imgUrl} loading="lazy" layout="intrinsic" width={240} height={160} />
}

const Home: NextPage<Props> = ({ posts, category }) => (
  <article>
    <Head>
      <title>Homesewn - Nähen, Basteln, Landleben</title>
      <meta property="og:title" content="Homesewn" />
      <meta property="og:type" content="website" />
      <meta property="og:description" content="Alles zum Thema Nähen, Basteln und Landleben." />
      <meta property="og:url" content="https://homesewn.vercel.app" />
      <meta property="og:site_name" content="Homesewn" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>

    <Link href="#main">
      <section className={styles.landing}>
        <div className={styles.logo}>
          <div className={styles.logoMain}>
            <GiSewingNeedle className={styles.logoIcon} />
            Homesewn
          </div>
          <div className={styles.logoSub}>Nähen - Basteln - Landleben</div>
        </div>
      </section>
    </Link>
    <section className={styles.main} id="main">
      <h2>
        {posts && posts.length > 0 ? 'Neueste' : 'Keine'} Artikel
        {category && ` zum Thema ${category}`}
      </h2>
      {posts && posts.length > 0 && (
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
    <Footer />
  </article>
)

export const getStaticProps: GetStaticProps = async () => {
  const posts = await liveClient.fetch<Post[]>(
    groq`*[_type == "post" && publishedAt < now()]
      | order(publishedAt desc)[0...8]
      {..., "categories": categories[]->title}`
  )
  return {
    props: {
      posts,
    },
  }
}

export default Home
