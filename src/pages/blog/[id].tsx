import { GetServerSideProps } from "next";
import { fetchBlogPostById, fetchBlogPosts } from "@/services/api";
import { useStore } from "@/stores/storeContext";
import { useEffect } from "react";
import BreadcrumbNav from "@/components/common/breadcrumb/BreadcrumbNav";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FancyBanner from "@/components/common/FancyBanner";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";

interface BlogDetailsProps {
  serverBlogPost: any;
  serverBlogPosts: any[];
  blogId: string;
}

const BlogDetails = ({ serverBlogPost, serverBlogPosts, blogId }: BlogDetailsProps) => {
  const { t } = useTranslation("translations");
  const { blogStore } = useStore();

  // Initialize store with server-side data
  useEffect(() => {
    if (serverBlogPosts && serverBlogPosts.length > 0) {
      blogStore.setBlogPosts(serverBlogPosts as []);
    }
    
    if (serverBlogPost) {
      blogStore.setSSRCurrentPost(serverBlogPost);
    }
  }, [serverBlogPosts, serverBlogPost]);

  const post = serverBlogPost || {};
  
  // Handle both direct title and WordPress API title.rendered format
  const postTitle = post.title?.rendered || post.title || t("blog.details");
  
  // Handle both direct content and WordPress API content.rendered format
  const postContent = post.content?.rendered || post.content || '';

  return (
    <>
      <Head>
        <title>{`Domakin - ${postTitle}`}</title>
        <meta name="description" content={post.excerpt || (typeof postContent === 'string' ? postContent.substring(0, 160) : '') || t("blog.description")} />
        <meta property="og:title" content={`Domakin - ${postTitle}`} />
        <meta property="og:description" content={post.excerpt || (typeof postContent === 'string' ? postContent.substring(0, 160) : '') || t("blog.description")} />
        {post.image && <meta property="og:image" content={post.image} />}
      </Head>
      <HeaderOne />
      <div className="container mt-80 mb-150">
        <div className="row">
          <div className="col-12">
            {post ? (
              <div className="wordpress-embedded-container">
                <h1 className="mb-4">{postTitle}</h1>
                <BreadcrumbNav link_title={t("blog.title")} />
                
                {/* Display featured image if available */}
                {post.image && (
                  <div className="featured-image my-4">
                    <img 
                      src={post.image} 
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
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { id } = context.params || {};
    const lang = context.locale || "en";
    
    // Make sure we have a valid ID parameter
    if (!id) {
      console.log("No ID parameter provided");
      return { notFound: true };
    }
    
    // Extract the actual ID from the parameter (which might be in format "123/post-title")
    // Handle both string and array formats that Next.js might provide
    let actualId;
    
    if (Array.isArray(id)) {
      // If it's an array (catch-all route), take the first segment
      actualId = id[0];
    } else {
      // If it's a string, split by "/" and take the first segment
      actualId = (id as string).split('/')[0];
    }
    
    // Ensure the ID is trimmed of any extra whitespace
    actualId = actualId.trim();
    
    console.log("Fetching blog post with ID:", actualId);
    
    // First fetch all blog posts for both related content and fallback
    const blogPosts = await fetchBlogPosts(lang);
    
    // Then fetch the specific blog post
    const { post, found } = await fetchBlogPostById(actualId, lang);
    
    // If post not found through direct API, try to find it in the fetched posts
    if (!found && blogPosts.length > 0) {
      console.log("Post not found via direct API, searching in all posts...");
      const fallbackPost = blogPosts.find((p: any) => 
        p.id?.toString() === actualId.toString() || 
        p.slug === actualId
      );
      
      if (fallbackPost) {
        console.log("Found post in all posts collection:", fallbackPost.title || "No title");
        return {
          props: {
            serverBlogPost: fallbackPost,
            serverBlogPosts: blogPosts,
            blogId: actualId || null,
          }
        };
      }
    }

    // If post still not found, return 404
    if (!found) {
      console.log("Post not found for ID:", actualId);
      return { notFound: true };
    }
    
    console.log("Post found:", post ? post.title : "No title");

    return {
      props: {
        serverBlogPost: post,
        serverBlogPosts: blogPosts,
        blogId: actualId || null,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return { notFound: true };
  }
};

export default BlogDetails;