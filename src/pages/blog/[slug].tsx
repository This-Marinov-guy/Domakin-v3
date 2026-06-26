import WordPressBlogPostView from "@/components/blogs/common-blog/WordPressBlogPostView";
import {
  fetchAllWordPressPostSummaries,
  fetchWordPressPostBySlug,
  type WordPressPost,
} from "@/lib/wordpress";

export default function BlogSlugPage({ post }: { post: WordPressPost }) {
  if (!post) return <p>Post not found.</p>;

  return <WordPressBlogPostView post={post} />;
}

export async function getStaticPaths() {
  const posts = await fetchAllWordPressPostSummaries();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  try {
    const post = await fetchWordPressPostBySlug(params.slug);
    if (!post) return { notFound: true };

    return {
      props: { post },
      revalidate: 600,
    };
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return { notFound: true };
  }
}
