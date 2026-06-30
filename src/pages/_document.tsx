import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Ahrefs site verification */}
        <meta
          name="ahrefs-site-verification"
          content="5bb9c9b954a6dcbe124f256875661b8543d910643c63a6209a7064ec74b56183"
        />

        {/* Google tag (gtag.js) */}
        {process.env.NEXT_PUBLIC_GTM_ENABLE === "1" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GTM_ID}');
              `}
            </Script>
          </>
        )}

        {/* Ahrefs Analytics */}
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="0GB4Vkq+KdR17/QhsU/78Q"
          async
        />

        {/* Datafast Analytics */}
        <script
          defer
          data-website-id="dfid_Aw0DgTAlDjJ5ZzvzHnKKh"
          data-domain="domakin.nl"
          src="https://datafa.st/js/script.js"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
