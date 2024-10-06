import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FooterFour from "@/layouts/footers/FooterFour"
import ProjectArea from "./ProjectArea"
import FancyBanner from "@/components/common/FancyBanner"

const ProjectFour = () => {
   return (
      <>
         <HeaderOne />
         <BreadcrumbThree title="Our Projects" link="#" link_title="Pages" sub_title="Projects" style={false} />
         <ProjectArea />
         <FancyBanner />
         <FooterFour />
      </>
   )
}

export default ProjectFour;
