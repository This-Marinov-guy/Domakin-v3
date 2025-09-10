import { GetServerSideProps, GetStaticProps, GetStaticPaths } from "next";
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

const BlogDetails = ({
  serverBlogPost,
  serverBlogPosts,
  blogId,
}: BlogDetailsProps) => {
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

  return (
    <>
      <Head>
        <title>{`Domakin - ${postTitle}`}</title>
        <meta
          name="description"
          content={
            post.excerpt ||
            (typeof postContent === "string"
              ? postContent.substring(0, 160)
              : "") ||
            t("blog.description")
          }
        />
        <meta property="og:title" content={`Domakin - ${postTitle}`} />
        <meta
          property="og:description"
          content={
            post.excerpt ||
            (typeof postContent === "string"
              ? postContent.substring(0, 160)
              : "") ||
            t("blog.description")
          }
        />
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

// Add getStaticPaths for production builds
export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  try {
    const paths: Array<{ params: { id: string }; locale?: string }> = [];

    // Generate paths for each locale
    const supportedLocales = locales || ["en"];

    for (const locale of supportedLocales) {
      try {
        const blogPosts = await fetchBlogPosts(locale);

        if (Array.isArray(blogPosts)) {
          const localePaths = blogPosts
            .map((post: any) => ({
              params: {
                id: (post.id || post.wordpress_id || post.slug)?.toString(),
              },
              locale,
            }))
            .filter((path) => path.params.id); // Filter out any undefined IDs

          paths.push(...localePaths);
        }
      } catch (error) {
        console.error(`Error fetching blog posts for locale ${locale}:`, error);
      }
    }

    return {
      paths,
      fallback: "blocking", // Enable ISR for new posts
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};

// Switch to getStaticProps for better performance
export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const { params, locale } = context;
    const id = params?.id;
    const lang = locale || "en";

    // Make sure we have a valid ID parameter
    if (!id) {
      return { notFound: true };
    }

    // Extract the actual ID from the parameter
    let actualId: string;

    if (Array.isArray(id)) {
      actualId = id[0];
    } else {
      actualId = (id as string).split("/")[0];
    }

    actualId = actualId.trim();

    // Fetch blog posts and specific post in parallel
    const [blogPosts, postResult] = await Promise.all([
      fetchBlogPosts(lang).catch(() => []),
      fetchBlogPostById(actualId, lang).catch(() => ({
        found: false,
        post: null,
      })),
    ]);

    // If post found directly via the API, use it
    if (postResult.found && postResult.post) {
      return {
        props: {
          serverBlogPost: postResult.post,
          serverBlogPosts: Array.isArray(blogPosts) ? blogPosts : [],
          blogId: actualId,
        },
        revalidate: 3600, // Revalidate every hour
      };
    }

    // If post not found through direct API, try to find it in the fetched posts
    if (Array.isArray(blogPosts) && blogPosts.length > 0) {
      const fallbackPost = blogPosts.find((p: any) => {
        if (!p || !p.id) return false;

        const postId = p.id?.toString() || "";
        const targetId = actualId.toString();
        const slug = p.slug || "";
        const wordpressId = p.wordpress_id?.toString() || "";

        return (
          postId === targetId || slug === targetId || wordpressId === targetId
        );
      });

      if (fallbackPost) {
        return {
          props: {
            serverBlogPost: fallbackPost,
            serverBlogPosts: blogPosts,
            blogId: actualId,
          },
          revalidate: 3600,
        };
      }
    }

    // If post not found by any method, return 404
    return { notFound: true };
  } catch (error: any) {
    console.error("Error in getStaticProps:", error);
    return { notFound: true };
  }
};

export default BlogDetails;
