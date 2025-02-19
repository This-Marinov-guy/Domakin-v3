import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FancyBanner from "@/components/common/FancyBanner";
import useTranslation from "next-translate/useTranslation";
import BlogMainSection from "@/components/blogs/common-blog/BlogMainSection";

const Blog = () => {
  const { t } = useTranslation("translations");

  return (
    <>
      <HeaderOne />
      <BreadcrumbThree
        title={t("blog.title")}
        link_title={t("blog.title")}
        background={8}
        style={false}
      />
      <BlogMainSection/>
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default Blog;
