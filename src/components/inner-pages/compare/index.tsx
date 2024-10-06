import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FooterFour from "@/layouts/footers/FooterFour"
import CompareArea from "./CompareArea"
import FancyBanner from "@/components/common/FancyBanner"

const Compare = () => {
   return (
      <>
         <HeaderOne />
         <BreadcrumbThree title="Compare" link="#" link_title="Pages" sub_title="Compare" style={false} />
         <CompareArea />
         <FancyBanner />
         <FooterFour />
      </>
   )
}

export default Compare
