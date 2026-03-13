import React, { Fragment, Suspense, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import SEO from "./seo";
import { useRouter } from "next/router";

import "../styles/index.scss";
import "rc-time-picker/assets/index.css";
import "react-loading-skeleton/dist/skeleton.css";
import PageLoader from "@/components/ui/loading/PageLoader";
import MainLayout from "@/layouts/MainLayout";
import useTranslation from "next-translate/useTranslation";

const MyApp = ({ Component, pageProps }: any) => {
  const recaptchaRef = React.createRef();
  const router = useRouter();
  const { lang } = useTranslation();
  
  // Normalize locale based on path prefix without logging
  useEffect(() => {
    if (router.asPath.startsWith('/bg') && router.locale !== 'bg') {
      const newPath = router.asPath.replace('/bg', '');
      router.push(newPath, newPath, { locale: 'bg', shallow: true });
    } else if (router.asPath.startsWith('/gr') && router.locale !== 'gr') {
      const newPath = router.asPath.replace('/gr', '');
      router.push(newPath, newPath, { locale: 'gr', shallow: true });
    }
  }, [router.asPath]);

  const onChange = () => {
    // on captcha change
  };  

  return (
    <Suspense fallback={<PageLoader />}>
      <SEO />
      <MainLayout>
        <Component {...pageProps} recaptchaRef={recaptchaRef} />
        {process.env.NEXT_PUBLIC_RECAPTCHA_ENABLE == '1' && <div className="rc-anchor">
          <ReCAPTCHA
            size="invisible"
            badge="bottomleft"
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}
            onChange={onChange}
          />
        </div>}
      </MainLayout>
    </Suspense>
  );
};

export default MyApp;
