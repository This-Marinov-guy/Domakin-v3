import FooterFour from "@/layouts/footers/FooterFour"
import HeroBanner from "./HeroBanner"
import FeedbackOne from "./FeedbackOne"
import Property from "./Property"
import BLockFeatureOne from "./BLockFeatureOne"
import FancyBannerOne from "./FancyBannerOne"
import BLockFeatureTwo from "./BLockFeatureTwo"
import FeedbackTwo from "./FeedbackTwo"
import Blog from "./Blog"
import FAQ from "./FAQ"
import FancyBannerTwo from "./FancyBannerTwo"
import HeaderOne from "@/layouts/headers/HeaderOne"

const HomeTwo = () => {
  return (
    <>
      <HeaderOne style_1={false} style_2={false} />
      <HeroBanner />
      <FeedbackOne />
      <Property />
      <BLockFeatureOne />
      <FancyBannerOne />
      <BLockFeatureTwo />
      <FeedbackTwo />
      <Blog style={false} />
      <FAQ />
      <FancyBannerTwo/>
      {/* <FooterFour style={true} /> */}
    </>
  )
}

export default HomeTwo
