import React, { Fragment, Suspense } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Provider } from "react-redux";
import store from "@/redux/store";
import SEO from "./seo";

import "../styles/index.scss";
import PageLoader from "@/components/ui/loading/PageLoader";

const MyApp = ({ Component, pageProps }: any) => {
  const recaptchaRef = React.createRef();

  const onChange = () => {
    // on captcha change
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <SEO />
      {/* <Script src="/js/plugins.js" strategy="beforeInteractive" /> */}
      <Provider store={store}>
        <Component {...pageProps} recaptchaRef={recaptchaRef} />
        {/* <ReCAPTCHA
          size="invisible"
          badge="bottomleft"
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}
          onChange={onChange}
        /> */}
      </Provider>
    </Suspense>
  );
};

export default MyApp;
