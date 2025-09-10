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
    // When the blog page mounts, ensure we're using SSR data and not loading
    if (serverBlogPosts && serverBlogPosts.length > 0) {
      // Set loading to false and update posts in a single operation
      blogStore.setSSRBlogPosts(serverBlogPosts as []);
    } else {
      // If no server posts, ensure loading is false to prevent redirect loops
      blogStore.loading = false;
    }

    // Cleanup function to prevent state conflicts when navigating away
    return () => {
      // Reset the loading state when component unmounts to prevent conflicts
      blogStore.loading = false;
    };
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
  try {
    const lang = context.locale || "en";
    console.log(`[Blog Index] Fetching blog posts with language: ${lang}`);
    
    // Fetch blog posts with a reasonable timeout
    const blogPosts = await fetchBlogPosts(lang);
    
    console.log(`[Blog Index] Fetch complete. Found ${blogPosts?.length || 0} posts.`);
    if (blogPosts && blogPosts.length > 0) {
      console.log(`[Blog Index] First post title: ${blogPosts[0].title || 'No title'}`);
    } else {
      console.log('[Blog Index] No posts found or empty response');
    }
    
    return {
      props: {
        serverBlogPosts: Array.isArray(blogPosts) ? blogPosts : [],
      },
    };
  } catch (error) {
    console.error('[Blog Index] Error fetching blog posts:', error);
    
    // Return empty array instead of test posts
    return {
      props: {
        serverBlogPosts: [],
      },
    };
  }
};

export default Blog;
