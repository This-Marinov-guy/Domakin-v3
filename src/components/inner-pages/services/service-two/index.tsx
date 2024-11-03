import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree"
import Brand from "@/components/homes/home-five/Brand"
import FooterFour from "@/layouts/footers/FooterFour"
import HeaderOne from "@/layouts/headers/HeaderOne"
import BLockFeatureOne from "./BLockFeatureOne"
import BlockFeatureThree from "../service-one/ServicesList"
import BLockFeatureTwo from "./BLockFeatureTwo"
import FancyBanner from "@/components/common/FancyBanner"
import BLockFeatureThree from "./BLockFeatureThree"

const ServiceTwo = () => {
   return (
      <>
         <HeaderOne />
         <BreadcrumbThree title="Our Services" link="#" link_title="Pages" sub_title="Services" style={false} />
         <BLockFeatureOne />
         <Brand />
         <BLockFeatureThree />
         <BlockFeatureThree style={true} />
         <BLockFeatureTwo />
         <FancyBanner />
         <FooterFour />
      </>
   )
}

export default ServiceTwo
