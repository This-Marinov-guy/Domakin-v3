import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree"
import FooterFour from "@/layouts/footers/FooterFour"
import HeaderOne from "@/layouts/headers/HeaderOne"
import BlogOneArea from "./BlogOneArea"
import FancyBanner from "@/components/common/FancyBanner"

const BlogOne = () => {
   return (
      <>
         <HeaderOne />
         <BreadcrumbThree title="Blog Grid" link="#" link_title="Pages" sub_title="Blog" style={false} />
         <BlogOneArea />
         <FancyBanner />
         <FooterFour />
      </>
   )
}

export default BlogOne;
