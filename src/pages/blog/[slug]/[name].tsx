import WordPressBlogPostView from "@/components/blogs/common-blog/WordPressBlogPostView";
import {
  fetchAllWordPressPostSummaries,
  fetchWordPressPostById,
  type WordPressPost,
} from "@/lib/wordpress";

export default function BlogPostPage({ post }: { post: WordPressPost }) {
  if (!post) return <p>Post not found.</p>;

  return <WordPressBlogPostView post={post} />;
}

export async function getStaticPaths() {
  const posts = await fetchAllWordPressPostSummaries();
  const paths = posts.map((post) => ({
    params: { slug: post.id.toString(), name: post.slug },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  try {
    const post = await fetchWordPressPostById(params.slug);
    if (!post) return { notFound: true };

    return {
      props: { post },
      revalidate: 600, // re-check every 10 minutes
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return { notFound: true };
  }
}
