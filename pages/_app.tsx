import '../styles/globals.scss'
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading -- default Next.js base HOC
  return <Component {...pageProps} />
}
