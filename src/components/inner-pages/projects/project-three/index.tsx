import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FooterFour from "@/layouts/footers/FooterFour"
import ProjectArea from "./ProjectArea"
import FancyBannerCommon from "@/components/common/FancyBanner"
import FancyBanner from "../project-one/FancyBanner"

const ProjectThree = () => {
   return (
      <>
         <HeaderOne />
         <BreadcrumbThree title="Our Projects" link="#" link_title="Pages" sub_title="Projects" style={false} />
         <ProjectArea/>
         <FancyBanner />
         <FancyBannerCommon />
         <FooterFour />
      </>
   )
}

export default ProjectThree;
