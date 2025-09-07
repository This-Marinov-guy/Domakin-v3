// pages/blog/index.tsx
import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FancyBanner from "@/components/common/FancyBanner";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { GetServerSideProps } from "next";

type PostListItem = {
  id: string | number;
  title: string;
  slug?: string;
};

type BlogIndexProps = {
  posts: PostListItem[];
  error?: string | null;
};

export const getServerSideProps: GetServerSideProps<BlogIndexProps> = async (ctx) => {
  try {
    // IMPORTANT: Node's fetch requires an ABSOLUTE URL.
    const proto =
      (ctx.req.headers["x-forwarded-proto"] as string) ||
      (process.env.NODE_ENV === "development" ? "http" : "https");
    const host = ctx.req.headers.host;
    const fallbackBase = `${proto}://${host}`;

    const API_BASE =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      fallbackBase; // last resort

    const res = await fetch(`${API_BASE}/blog/posts`, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return { props: { posts: [], error: `Fetch failed: ${res.status}` } };
    }

    const json = await res.json();
    const posts: PostListItem[] = json?.data ?? [];

    return { props: { posts, error: null } };
  } catch (e: any) {
    return { props: { posts: [], error: e?.message || "Unknown error" } };
  }
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const Blog = ({ posts, error }: BlogIndexProps) => {
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
        {error ? (
          <div className="mb-8 rounded-xl border p-4 text-red-600">
            Couldn’t load posts: {error}
          </div>
        ) : null}

        <ul className="grid md:grid-cols-2 gap-8">
          {posts.map((post) => {
            const safeSlug = post.slug || slugify(post.title || String(post.id));
            const href = `/blog/${post.id}/${safeSlug}`;
            return (
              <li key={post.id} className="border rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-3">
                  <Link href={href}>{post.title}</Link>
                </h2>
                <Link href={href} className="underline">
                  Read more
                </Link>
              </li>
            );
          })}
        </ul>

        {posts.length === 0 && !error && (
          <p className="text-center text-gray-500 mt-10">
            {t("common.no_results") || "No posts yet."}
          </p>
        )}
      </main>

      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default Blog;
