import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FancyBanner from "@/components/common/FancyBanner";
import useTranslation from "next-translate/useTranslation";
import BlogMainSection from "@/components/blogs/common-blog/BlogMainSection";
import { GetServerSideProps } from "next";
import { fetchBlogPosts } from "@/services/api";
import { useStore } from "@/stores/storeContext";
import { useEffect, useState } from "react";

interface BlogProps {
  serverBlogPosts: any[];
}

const Blog = ({ serverBlogPosts }: BlogProps) => {
  const { t } = useTranslation("translations");
  const { blogStore } = useStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration properly
  useEffect(() => {
    // Ensure we're on the client side
    setIsHydrated(true);

    // Initialize store with server-side data immediately
    if (serverBlogPosts && serverBlogPosts.length > 0) {
      // Force set the SSR data and ensure loading is false
      blogStore.setSSRBlogPosts(serverBlogPosts as []);
      blogStore.loading = false;
    } else {
      // If no server posts, ensure loading is false
      blogStore.loading = false;
    }

    // Cleanup function to prevent state conflicts
    return () => {
      blogStore.loading = false;
    };
  }, [serverBlogPosts, blogStore]);

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return (
      <>
        <HeaderOne />
        <BreadcrumbThree
          title={t("blog.title")}
          link_title={t("blog.title")}
          background={8}
          style={false}
        />
        {/* Show a loading state that matches server-side render */}
        <div className="container mt-80 mb-150">
          <div className="row">
            <div className="col-12">
              <div className="text-center py-5">
                <p>Loading...</p>
              </div>
            </div>
          </div>
        </div>
        <FancyBanner />
        <FooterFour />
      </>
    );
  }

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

    // Fetch blog posts with error handling
    const blogPosts = await fetchBlogPosts(lang);

    return {
      props: {
        serverBlogPosts: Array.isArray(blogPosts) ? blogPosts : [],
      },
    };
  } catch (error) {
    // Return empty array instead of failing
    return {
      props: {
        serverBlogPosts: [],
      },
    };
  }
};

export default Blog;
