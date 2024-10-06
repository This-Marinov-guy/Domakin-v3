import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree"
import FooterFour from "@/layouts/footers/FooterFour"
import HeaderOne from "@/layouts/headers/HeaderOne"
import PricingTwoArea from "./PricingTwoArea"
import FancyBanner from "@/components/common/FancyBanner"

const PricingTwo = () => {
   return (
      <>
         <HeaderOne />
         <BreadcrumbThree title="Pricing Plan" link="#" link_title="Pages" sub_title="Pricing" style={false} />
         <PricingTwoArea />
         <FancyBanner />
         <FooterFour />
      </>
   )
}

export default PricingTwo
