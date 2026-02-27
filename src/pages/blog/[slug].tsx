import { GetServerSideProps } from "next";
import { fetchBlogPostBySlug, fetchBlogPosts } from "@/services/api";
import { useStore } from "@/stores/storeContext";
import { useEffect } from "react";
import BreadcrumbNav from "@/components/common/breadcrumb/BreadcrumbNav";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FancyBanner from "@/components/common/FancyBanner";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import RelatedPosts from "@/components/blogs/common-blog/RelatedPosts";
import BlogPostMeta from "@/components/blogs/common-blog/BlogPostMeta";

interface BlogPostProps {
  serverBlogPost: any;
  serverBlogPosts: any[];
  slug: string;
}

const BlogPost = ({
  serverBlogPost,
  serverBlogPosts,
  slug,
}: BlogPostProps) => {
  const { t } = useTranslation("translations");
  const { blogStore } = useStore();

  // Initialize store with server-side data only once on component mount
  useEffect(() => {
    if (serverBlogPosts && serverBlogPosts.length > 0) {
      blogStore.setSSRBlogPosts(serverBlogPosts as []);
    }

    if (serverBlogPost) {
      blogStore.setSSRCurrentPost(serverBlogPost);
    }
  }, []);

  // Always use the server-provided post directly to avoid client/server mismatch
  const post = serverBlogPost;

  // Handle both direct title and WordPress API title.rendered format
  const postTitle = post?.title?.rendered || post?.title || t("blog.details");

  // Handle both direct content and WordPress API content.rendered format
  const postContent = post?.content?.rendered || post?.content || "";
  
  // Extract excerpt or create one from content
  const postExcerpt = post?.excerpt?.rendered || post?.excerpt || 
    (typeof postContent === "string" ? postContent.replace(/<[^>]*>/g, '').substring(0, 160) : "") ||
    t("blog.description");

  // Clean the excerpt for meta tags
  const cleanExcerpt = postExcerpt.replace(/<[^>]*>/g, '').substring(0, 160);
  
  // Use the slug from the API response
  const seoSlug = post?.slug || slug;

  // Determine the best image to use (image or thumbnail as fallback)
  const postImage = post?.image || post?.thumbnail;
  const defaultImage = "https://www.domakin.nl/assets/img/logo.png";

  // Generate JSON-LD structured data for the blog post
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: postTitle,
    description: cleanExcerpt,
    image: postImage || defaultImage,
    datePublished: post?.date,
    dateModified: post?.modified || post?.date,
    author: {
      "@type": "Person",
      name: post?.author?.name || "Domakin Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Domakin",
      logo: {
        "@type": "ImageObject",
        url: "https://www.domakin.nl/assets/img/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.domakin.nl/blog/${seoSlug}`,
    },
    url: `https://www.domakin.nl/blog/${seoSlug}`,
    articleSection: post?.category || "Student Housing",
    keywords: [
      "student housing",
      "accommodation",
      "rental tips",
      ...(post?.tags || [])
    ].join(", "),
  };

  // Breadcrumb data for structured data
  const breadcrumbItems = [
    { name: "Home", url: "https://www.domakin.nl" },
    { name: t("blog.title"), url: "https://www.domakin.nl/blog" },
    { name: postTitle, url: `https://www.domakin.nl/blog/${seoSlug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Head>
        <title>{`${postTitle} | Domakin Blog`}</title>
        <meta name="description" content={cleanExcerpt} />
        <meta name="keywords" content={`${postTitle}, student housing, accommodation, rental tips, ${post?.category || ''}`} />
        <link rel="canonical" href={`https://www.domakin.nl/blog/${seoSlug}`} />
        
        {/* Open Graph meta tags */}
        <meta property="og:title" content={`${postTitle} | Domakin`} />
        <meta property="og:description" content={cleanExcerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.domakin.nl/blog/${seoSlug}`} />
        <meta property="og:site_name" content="Domakin" />
        {postImage && <meta property="og:image" content={postImage} />}
        {postImage && <meta property="og:image:width" content="1200" />}
        {postImage && <meta property="og:image:height" content="630" />}
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${postTitle} | Domakin`} />
        <meta name="twitter:description" content={cleanExcerpt} />
        {postImage && <meta name="twitter:image" content={postImage} />}
        
        {/* Article meta tags */}
        <meta property="article:published_time" content={post?.date} />
        {post?.modified && <meta property="article:modified_time" content={post.modified} />}
        <meta property="article:section" content={post?.category || "Student Housing"} />
        <meta property="article:author" content={post?.author?.name || "Domakin Team"} />
        {post?.tags && post.tags.map((tag: string, index: number) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <HeaderOne />
      <div className="container mt-40 mb-40">
        <div className="row">
          <div className="col-12">
            {post ? (
              <div className="wordpress-embedded-container">
                <h2 className="mb-4">{postTitle}</h2>
                <BreadcrumbNav link_title={t("blog.title")} />
                
                {/* Blog Post Meta Information */}
                <BlogPostMeta post={post} />

                {/* Display featured image if available */}
                {postImage && (
                  <div className="featured-image my-4">
                    <img
                      src={postImage}
                      alt={postTitle}
                      className="img-fluid rounded"
                    />
                  </div>
                )}

                {/* Render content with HTML preserved */}
                <article
                  className="blog-content mt-4"
                  dangerouslySetInnerHTML={{ __html: postContent }}
                />
              </div>
            ) : (
              <div className="text-center py-5">
                <p>{t("blog.post_not_found")}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr/>
      
      {/* Related Posts Section */}
      <RelatedPosts 
        currentPostId={post?.id}
        allPosts={serverBlogPosts}
        currentPostCategory={post?.category}
        limit={3}
      />
      
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { slug } = context.params || {};
    const lang = context.locale || "en";
    
    // Make sure we have a valid slug parameter
    if (!slug) {
      return { notFound: true };
    }

    // Extract the actual slug from the parameter
    let actualSlug: string;

    if (Array.isArray(slug)) {
      actualSlug = slug[0];
    } else {
      actualSlug = (slug as string).split("/")[0];
    }

    actualSlug = actualSlug.trim();

    // Fetch the specific post by slug using the new API
    const postResult = await fetchBlogPostBySlug(actualSlug, lang);
    
    let foundPost = null;
    if (postResult.found && postResult.post) {
      foundPost = postResult.post;
    }

    // Also fetch all blog posts for related posts functionality
    const blogPosts = await fetchBlogPosts(lang);

    // If post found, return it
    if (foundPost) {
      return {
        props: {
          serverBlogPost: foundPost,
          serverBlogPosts: Array.isArray(blogPosts) ? blogPosts : [],
          slug: foundPost.slug || actualSlug,
        },
      };
    }

    // If post not found by any method, return 404
    return { notFound: true };
  } catch (error: any) {
    console.error('Error in blog post getServerSideProps:', error);
    return { notFound: true };
  }
};

export default BlogPost;
