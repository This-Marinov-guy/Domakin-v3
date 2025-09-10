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
      console.log("[Blog Detail] No ID parameter provided");
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
    
    console.log(`[Blog Detail] Fetching blog post with ID: ${actualId}, language: ${lang}`);
    console.log(`[Blog Detail] API Endpoint: ${process.env.NEXT_PUBLIC_SERVER_URL}/api/blog/post/${actualId}`);
    
    // Special case: if the ID is "test-1" or "test-error", return a test post
    if (actualId === "test-1" || actualId === "test-error") {
      console.log("[Blog Detail] Returning test post for ID:", actualId);
      const testPost = {
        id: actualId,
        title: `Test Post Details (${actualId})`,
        content: `<p>This is a test post with ID ${actualId} to verify rendering of individual blog posts.</p>
                 <p>If you see this, it means the blog detail page is working but couldn't fetch real content.</p>`,
        image: "/assets/img/blog/default-thumbnail.jpg",
        created_at: new Date().toISOString(),
        author: "System"
      };
      
      return {
        props: {
          serverBlogPost: testPost,
          serverBlogPosts: [testPost],
          blogId: actualId,
        }
      };
    }
    
    // Add timeout to prevent hanging requests
    const blogPostsPromise = fetchBlogPosts(lang);
    const postPromise = fetchBlogPostById(actualId, lang);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Blog detail fetch timed out')), 10000)
    );
    
    // Race the API calls with timeout
    const [blogPosts, postResult] = await Promise.all([
      Promise.race([blogPostsPromise, timeoutPromise]),
      Promise.race([postPromise, timeoutPromise]),
    ]);
    
    // TypeScript fix - ensure postResult has the correct shape
    const { post, found } = postResult as { post: any, found: boolean };
    
    // Log the results
    console.log(`[Blog Detail] All posts fetch complete. Found ${blogPosts?.length || 0} posts.`);
    console.log(`[Blog Detail] Specific post found: ${found ? "Yes" : "No"}`);
    
    // If post not found through direct API, try to find it in the fetched posts
    if (!found && blogPosts && blogPosts.length > 0) {
      console.log("[Blog Detail] Post not found via direct API, searching in all posts...");
      
      // Check with both string and number comparisons
      const fallbackPost = blogPosts.find((p: any) => {
        const postId = p.id?.toString() || '';
        const targetId = actualId.toString();
        const matches = postId === targetId || p.slug === actualId;
        if (matches) console.log(`[Blog Detail] Found matching post: ${p.title || 'No title'}`);
        return matches;
      });
      
      if (fallbackPost) {
        console.log("[Blog Detail] Found post in all posts collection:", fallbackPost.title || "No title");
        return {
          props: {
            serverBlogPost: fallbackPost,
            serverBlogPosts: blogPosts,
            blogId: actualId || null,
          }
        };
      }
    }

    // If post found directly, use it
    if (found && post) {
      console.log("[Blog Detail] Post found directly:", post.title || "No title");
      return {
        props: {
          serverBlogPost: post,
          serverBlogPosts: blogPosts || [],
          blogId: actualId || null,
        },
      };
    }
    
    // If we still don't have a post, return a fallback post instead of 404
    // This helps diagnose issues in production
    console.log("[Blog Detail] No post found, using fallback post");
    const fallbackPost = {
      id: actualId,
      title: `Fallback Post for ID ${actualId}`,
      content: `<p>This is a fallback post. The actual post with ID ${actualId} was not found.</p>
               <p>This indicates an issue with fetching the post data from the API.</p>`,
      image: "/assets/img/blog/default-thumbnail.jpg",
      created_at: new Date().toISOString(),
      author: "System"
    };
    
    return {
      props: {
        serverBlogPost: fallbackPost,
        serverBlogPosts: blogPosts || [],
        blogId: actualId,
      }
    };
  } catch (error) {
    console.error("[Blog Detail] Error in getServerSideProps:", error);
    
    // Instead of returning 404, return a fallback post
    const { id } = context.params || {};
    const actualId = Array.isArray(id) ? id[0] : id;
    
    const errorPost = {
      id: actualId,
      title: `Error Loading Post ${actualId}`,
      content: `<p>An error occurred while loading this post.</p>
               <p>Please try again later or contact support if the issue persists.</p>`,
      image: "/assets/img/blog/default-thumbnail.jpg",
      created_at: new Date().toISOString(),
      author: "System"
    };
    
    return {
      props: {
        serverBlogPost: errorPost,
        serverBlogPosts: [],
        blogId: actualId || null,
      }
    };
  }
};

export default BlogDetails;