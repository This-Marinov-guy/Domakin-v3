import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FancyBanner from "@/components/common/FancyBanner";
import useTranslation from "next-translate/useTranslation";
import BlogMainSection from "@/components/blogs/common-blog/BlogMainSection";
import { GetServerSideProps } from "next";
import { fetchBlogPosts } from "@/services/api";
import { useStore } from "@/stores/storeContext";
import Head from "next/head";
import { useEffect, useState } from "react";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

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

  // Generate JSON-LD structured data for blog listing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Domakin - ${t("blog.title")}`,
    description: t("blog.description"),
    url: "https://www.domakin.nl/blog",
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "Domakin",
      logo: {
        "@type": "ImageObject",
        url: "https://www.domakin.nl/assets/img/logo.png",
      },
    },
    blogPost: serverBlogPosts
      .filter(post => post.slug) // Only include posts with slugs
      .slice(0, 10)
      .map((post: any) => ({
        "@type": "BlogPosting",
        headline: post.title?.rendered || post.title,
        description: post.excerpt?.rendered || post.excerpt || post.description,
        url: `https://www.domakin.nl/blog/${post.slug}`,
        datePublished: post.date,
        dateModified: post.modified || post.date,
        author: {
          "@type": "Person",
          name: post.author?.name || "Domakin Team",
        },
        image: post.image || post.thumbnail,
      })),
  };

  // Breadcrumb data for structured data
  const breadcrumbItems = [
    { name: "Home", url: "https://www.domakin.nl" },
    { name: t("blog.title"), url: "https://www.domakin.nl/blog" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Head>
        <title>{`${t("blog.title")} | Domakin - Student Housing Blog`}</title>
        <meta name="description" content={t("blog.description")} />
        <meta name="keywords" content="student housing, blog, accommodation, rental tips, student life, housing advice" />
        <link rel="canonical" href="https://www.domakin.nl/blog" />
        <link rel="alternate" type="application/rss+xml" title="Domakin Blog RSS Feed" href="https://www.domakin.nl/api/blog/rss.xml" />
        
        {/* Open Graph meta tags */}
        <meta property="og:title" content={`${t("blog.title")} | Domakin`} />
        <meta property="og:description" content={t("blog.description")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.domakin.nl/blog" />
        <meta property="og:site_name" content="Domakin" />
        <meta property="og:image" content="https://www.domakin.nl/assets/img/blog/blog-og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t("blog.title")} | Domakin`} />
        <meta name="twitter:description" content={t("blog.description")} />
        <meta name="twitter:image" content="https://www.domakin.nl/assets/img/blog/blog-og-image.jpg" />
        
        {/* Article meta tags */}
        <meta property="article:section" content="Student Housing" />
        <meta property="article:tag" content="student housing" />
        <meta property="article:tag" content="rental tips" />
        <meta property="article:tag" content="accommodation" />
        
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
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
