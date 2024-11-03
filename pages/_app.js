import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta property="og:image" content="/a-okay-monkey-1.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="800" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
