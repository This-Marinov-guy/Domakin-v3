import Head from "next/head";
import React from "react";

const SEO = () => {
  return (
    <Head>
      <title>Domakin</title>
      <meta
        name="keywords"
        content="Real estate, Property sale, Property buy"
      />
      <meta
        name="description"
        content="Homy is a beautiful website template designed for Real Estate Agency."
      />
      <meta property="og:site_name" content="Homy" />
      <meta property="og:url" content="https://creativegigstf.com" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="Homy - Real Estate React Next js Template"
      />
      <meta name="og:image" content="images/assets/ogg.png" />
      {/* For IE  */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      {/* For Resposive Device */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {/* For Window Tab Color */}
      {/* Chrome, Firefox OS and Opera */}
      <meta name="theme-color" content="#0D1A1C" />
      {/* Windows Phone */}
      <meta name="msapplication-navbutton-color" content="#0D1A1C" />
      {/* iOS Safari */}
      <meta name="apple-mobile-web-app-status-bar-style" content="#0D1A1C" />
      <link rel="icon" href="/favicon.png" sizes="any" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap"
      />
    </Head>
  );
};

export default SEO;
