import BLockFeatureTwo from "../home-five/BLockFeatureTwo"
import Property from "../home-four/PropertyOne"
import Category from "./Category"
import HeroBanner from "./HeroBanner"
import PropertyOne from "./PropertyOne"
import HomeSixBLockFeatureTwo from "./BLockFeatureTwo"
import BLockFeatureThree from "./BLockFeatureThree"
import Feedback from "./Feedback"
import Brand from "./Brand"
import Blog from "../home-four/Blog"
import FancyBanner from "./FancyBanner"
import FooterFour from "@/layouts/footers/FooterFour"
import HeaderOne from "@/layouts/headers/HeaderOne"

const HomeSix = () => {
   return (
      <>
         <HeaderOne />
         <HeroBanner />
         <BLockFeatureTwo style={true} />
         <PropertyOne />
         <Property style_1={false} style_2={true} />
         <HomeSixBLockFeatureTwo />
         <BLockFeatureThree />
         <Feedback />
         <Brand />
         <Blog />
         <FancyBanner />
         <FooterFour />
      </>
   )
}

export default HomeSix
