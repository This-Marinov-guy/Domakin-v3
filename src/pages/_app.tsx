import React, { Suspense } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import SEO from "./seo";

import "../styles/index.scss";
import "rc-time-picker/assets/index.css";
import "react-loading-skeleton/dist/skeleton.css";
import PageLoader from "@/components/ui/loading/PageLoader";
import MainLayout from "@/layouts/MainLayout";

const MyApp = ({ Component, pageProps }: any) => {
  const recaptchaRef = React.createRef();

  const onChange = () => {
    // on captcha change
  };

  return (
    <Suspense fallback={<PageLoader />}>
      {/* SEO can still handle meta tags, titles, etc. 
          Just make sure it does NOT insert <link rel="stylesheet" href="https://fonts.googleapis..."> anymore */}
      <SEO />
      <MainLayout>
        <Component {...pageProps} recaptchaRef={recaptchaRef} />
        {process.env.NEXT_PUBLIC_RECAPTCHA_ENABLE === "1" && (
          <div className="rc-anchor">
            <ReCAPTCHA
              size="invisible"
              badge="bottomleft"
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}
              onChange={onChange}
            />
          </div>
        )}
      </MainLayout>
    </Suspense>
  );
};

export default MyApp;
