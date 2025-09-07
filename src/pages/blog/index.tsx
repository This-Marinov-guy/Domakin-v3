// pages/blog/index.tsx
import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FancyBanner from "@/components/common/FancyBanner";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { GetServerSideProps } from "next";

type WpPost = {
  id: number;
  slug: string;
  date: string;
  link: string;
  title: { rendered: string };
};

type Props = {
  posts: WpPost[];
  error?: string | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    // ABSOLUTE WordPress REST API URL (your WP works at domakin0.wordpress.com)
    const WP_API = "https://domakin0.wordpress.com/wp-json/wp/v2";

    // Pull latest posts; restrict fields for speed
    const res = await fetch(
      `${WP_API}/posts?per_page=20&_fields=id,slug,date,link,title`,
      { headers: { Accept: "application/json" } }
    );

    if (!res.ok) {
      return { props: { posts: [], error: `WP fetch failed: ${res.status}` } };
    }

    const posts: WpPost[] = await res.json();
    return { props: { posts, error: null } };
  } catch (e: any) {
    return { props: { posts: [], error: e?.message || "Unknown error" } };
  }
};

const stripHtml = (s: string) => s.replace(/<[^>]*>?/gm, "");

const Blog = ({ posts, error }: Props) => {
  const { t } = useTranslation("translations");

  return (
    <>
      <HeaderOne />
      <BreadcrumbThree
        title={t("blog.title")}
        link_title={t("blog.title")}
        background={8}
        style={false}
      />

      <main className="container mx-auto px-4 py-10">
        {error && (
          <div className="mb-8 rounded-xl border p-4 text-red-600">
            Couldn’t load posts: {error}
          </div>
        )}

        <ul className="grid md:grid-cols-2 gap-8">
          {posts.map((p) => {
            // Keep your route shape: /blog/[id]/[name]
            const href = `/blog/${p.id}/${encodeURIComponent(p.slug)}`;
            return (
              <li key={p.id} className="border rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-3">
                  <Link href={href} prefetch={false} title={stripHtml(p.title.rendered)}>
                    <span dangerouslySetInnerHTML={{ __html: p.title.rendered }} />
                  </Link>
                </h2>
                <p className="text-sm opacity-70 mb-3">
                  {new Date(p.date).toLocaleDateString()}
                </p>
                <Link href={href} className="underline" prefetch={false}>
                  Read more
                </Link>
              </li>
            );
          })}
        </ul>

        {!error && posts.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No posts yet.</p>
        )}
      </main>

      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default Blog;
