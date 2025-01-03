import React from "react";
import Script from "next/script";
import { ENV_PROD } from "@/utils/defines";

const Clarity = () => {
  if (!ENV_PROD || !process.env.NEXT_PUBLIC_CLARITY_ENABLE) {
    return null;
  } 

  return (
    <Script id="clarity-script" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          t.onload = function() {
            window.clarity && window.clarity("consent");
          };
        })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
      `}
    </Script>
  );
};

export default Clarity;
