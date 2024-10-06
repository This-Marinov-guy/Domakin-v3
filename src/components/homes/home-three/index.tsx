import HeroBanner from "./HeroBanner"
import Category from "./Category"
import BLockFeatureOne from "./BLockFeatureOne"
import PropertyOne from "./PropertyOne"
import BLockFeatureTwo from "./BLockFeatureTwo"
import FancyBannerOne from "./FancyBannerOne"
import Brand from "./Brand"
import FancyBannerTwo from "./FancyBannerTwo"
import FooterFour from "@/layouts/footers/FooterFour"
import PropertyTwo from "./PropertyTwo"
import Feedback from "./Feedback"
import HeaderOne from "@/layouts/headers/HeaderOne"

const HomeThree = () => {
  return (
    <>
      <HeaderOne style_1={true} style_2={false} />
      <HeroBanner />
      <Category style={false} />
      <BLockFeatureOne />
      <PropertyOne />
      <PropertyTwo style={false} />
      <BLockFeatureTwo />
      <FancyBannerOne />
      <Feedback style={false} />
      <Brand />
      <FancyBannerTwo />
      <FooterFour />
    </>
  )
}

export default HomeThree
