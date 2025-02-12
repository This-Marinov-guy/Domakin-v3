import { ENV_PROD } from "@/utils/defines";
import Script from "next/script";

const GoogleAnalytics = () => {
  if (!ENV_PROD || process.env.NEXT_PUBLIC_GA_ENABLE != '1') {
    return null;
  }

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js? 
      id=${process.env.NEXT_PUBLIC_GA_ID}`}
      ></Script>
      <Script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `,
        }}
      ></Script>
    </>
  );
};

export default GoogleAnalytics;
