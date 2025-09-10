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
  const postContent = post?.content?.rendered || post?.content || '';

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
    
    // First, try to fetch all blog posts - this ensures we have a complete list
    // even if the individual post fetch fails
    const blogPostsPromise = fetchBlogPosts(lang);
    
    // Then try to get the specific post by ID
    const postPromise = fetchBlogPostById(actualId, lang);
    
    // Run both requests in parallel
    const [blogPosts, postResult] = await Promise.all([
      blogPostsPromise,
      postPromise
    ]);
    
    // Log the results
    
    
    // If post found directly via the API, use it
    if (postResult.found && postResult.post) {
      return {
        props: {
          serverBlogPost: postResult.post,
          serverBlogPosts: Array.isArray(blogPosts) ? blogPosts : [],
          blogId: actualId,
        },
      };
    }
    
    // If post not found through direct API, try to find it in the fetched posts
    if (Array.isArray(blogPosts) && blogPosts.length > 0) {
      
      // Try multiple matching strategies
      const fallbackPost = blogPosts.find((p: any) => {
        if (!p || !p.id) return false;
        
        const postId = p.id?.toString() || '';
        const targetId = actualId.toString();
        const slug = p.slug || '';
        const wordpressId = p.wordpress_id?.toString() || '';
        
        // Check various ways the post might match
        const exactMatch = postId === targetId;
        const slugMatch = slug === targetId;
        const wpIdMatch = wordpressId === targetId;
        
        const matches = exactMatch || slugMatch || wpIdMatch;
        
        return matches;
      });
      
      if (fallbackPost) {
        return {
          props: {
            serverBlogPost: fallbackPost,
            serverBlogPosts: blogPosts,
            blogId: actualId,
          }
        };
      }
    }

    // If post not found by any method, return 404
    return { notFound: true };
  } catch (error: any) {
    // Return 404 if anything fails
    return { notFound: true };
  }
};

export default BlogDetails;