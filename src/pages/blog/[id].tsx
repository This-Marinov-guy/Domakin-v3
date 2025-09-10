import { GetServerSideProps } from "next";
import { fetchBlogPosts } from "@/services/api";
import { useStore } from "@/stores/storeContext";
import { useEffect } from "react";
import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FancyBanner from "@/components/common/FancyBanner";
import BlogDetailsArea from "@/components/blogs/blog-details/BlogDetailsArea";
import useTranslation from "next-translate/useTranslation";

interface BlogDetailsProps {
  serverBlogPosts: any[];
  blogId: string;
}

const BlogDetails = ({ serverBlogPosts, blogId }: BlogDetailsProps) => {
  const { t } = useTranslation("translations");
  const { blogStore } = useStore();

  // Initialize store with server-side data
  useEffect(() => {
    if (serverBlogPosts && serverBlogPosts.length > 0) {
      blogStore.setBlogPosts(serverBlogPosts as []);
    }
  }, [serverBlogPosts]);

  return (
    <>
      <HeaderOne />
      <BreadcrumbThree
        title={t("blog.details")}
        link_title={t("blog.details")}
        background={8}
        style={false}
      />
      <BlogDetailsArea />
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  const lang = context.locale || "en";
  const blogPosts = await fetchBlogPosts(lang);

  return {
    props: {
      serverBlogPosts: blogPosts,
      blogId: id || null,
    },
  };
};

export default BlogDetails;
