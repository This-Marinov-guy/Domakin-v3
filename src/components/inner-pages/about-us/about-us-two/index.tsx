import BreadcrumbTwo from "@/components/common/breadcrumb/BreadcrumbTwo";
import HeaderOne from "@/layouts/headers/HeaderOne";
import BLockFeatureOne from "./BLockFeatureOne";
import BLockFeatureTwo from "./BLockFeatureTwo";
import Feedback from "@/components/homes/home-six/Feedback";
import Brand from "./Brand";
import FancyBanner from "./FancyBanner";
import FooterFour from "@/layouts/footers/FooterFour";

const AboutUsTwo = () => {
   return (
      <>
         <HeaderOne style_1={true} style_2={false} />
         <BreadcrumbTwo title="About Agency" sub_title="About us" />
         <BLockFeatureOne />
         <BLockFeatureTwo />
         <Feedback />
         <Brand />
         <FancyBanner />
         <FooterFour />
      </>
   )
}

export default AboutUsTwo;
