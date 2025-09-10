import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FancyBanner from "@/components/common/FancyBanner";
import useTranslation from "next-translate/useTranslation";
import BlogMainSection from "@/components/blogs/common-blog/BlogMainSection";
import { GetServerSideProps } from "next";
import { fetchBlogPosts } from "@/services/api";
import { useStore } from "@/stores/storeContext";
import { useEffect } from "react";

interface BlogProps {
  serverBlogPosts: any[];
}

const Blog = ({ serverBlogPosts }: BlogProps) => {
  const { t } = useTranslation("translations");
  const { blogStore } = useStore();

  // Initialize store with server-side data immediately, without loading state
  useEffect(() => {
    if (serverBlogPosts && serverBlogPosts.length > 0) {
      // Set loading to false and update posts in a single operation
      blogStore.setSSRBlogPosts(serverBlogPosts as []);
    }
  }, [serverBlogPosts]);

  return (
    <>
      <HeaderOne />
      <BreadcrumbThree
        title={t("blog.title")}
        link_title={t("blog.title")}
        background={8}
        style={false}
      />
      <BlogMainSection />
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = context.locale || "en";
  const blogPosts = await fetchBlogPosts(lang);

  return {
    props: {
      serverBlogPosts: blogPosts,
    },
  };
};

export default Blog;
