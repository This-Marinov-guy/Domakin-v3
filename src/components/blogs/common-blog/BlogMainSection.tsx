import { useState } from "react";
import Link from "next/link";
// import { useStore } from "@/stores"; // uncomment + adjust if you want MobX

type WPPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string }[];
  };
};

export default function BlogMainSection({ initialPosts }: { initialPosts: WPPost[] }) {
  // start with server-rendered posts
  const [renderPosts, setRenderPosts] = useState(initialPosts);

  // OPTIONAL: hydrate with MobX store if you have one
  /*
  const {
    blogStore: { posts: storePosts },
  } = useStore();

  useEffect(() => {
    if (Array.isArray(storePosts) && storePosts.length > 0) {
      setRenderPosts(storePosts);
    }
  }, [storePosts]);
  */

  if (!renderPosts || renderPosts.length === 0) {
    return <p>No posts available.</p>;
  }

  return (
    <section className="blog-main-section container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {renderPosts.map((post) => {
          const featuredImage =
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;

          return (
            <article
              key={post.id ?? post.slug}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {featuredImage && (
                <Link href={`/blog/${post.slug}`}>
                  <img
                    src={featuredImage}
                    alt={post.title.rendered}
                    className="w-full h-48 object-cover"
                  />
                </Link>
              )}
              <div className="p-4">
                <Link href={`/blog/${post.slug}`}>
                  <h2
                    className="text-xl font-semibold mb-2 hover:underline"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                </Link>
                {post.excerpt?.rendered && (
                  <div
                    className="text-gray-600 text-sm"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
