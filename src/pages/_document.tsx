import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="application-name" content="Multimeter speaker" />
        <meta
          name="description"
          content="Speaker for bluetooth DMMs like Aneng-9002, BSIDE ZT-300AB, ZOYI ZT-300AB, BABATools AD-900"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#F7CB47" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />

        <link rel="shortcut icon" href="/icon.png" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Multimeter speaker" />
        <meta
          property="og:description"
          content="Speaker for bluetooth DMMs like Aneng-9002, BSIDE ZT-300AB, ZOYI ZT-300AB, BABATools AD-900"
        />
        <meta property="og:site_name" content="Multimeter speaker" />
        <meta
          property="og:url"
          content="https://bluetooth-speaker.netlify.app/"
        />
        <meta
          property="og:image"
          content="https://bluetooth-speaker.netlify.app/icon.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
