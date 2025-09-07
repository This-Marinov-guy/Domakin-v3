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
  title: string;            // expected from your WP API
  slug?: string;            // if available; otherwise we’ll derive from title
};

type BlogIndexProps = {
  posts: PostListItem[];
};

export const getServerSideProps: GetServerSideProps<BlogIndexProps> = async () => {
  // Use the same endpoint your client hook was calling, but fetch it on the server
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    ""; // e.g. https://api.domakin.nl

  const res = await fetch(`${API_BASE}/blog/posts`, {
    headers: { "Accept": "application/json" },
  });

  if (!res.ok) {
    return { props: { posts: [] } };
  }

  const json = await res.json();
  // Expecting something like { status: true, data: [...] }
  const posts: PostListItem[] = json?.data ?? [];

  return { props: { posts } };
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const Blog = ({ posts }: BlogIndexProps) => {
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
        <h1 className="sr-only">{t("blog.title")}</h1>
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

        {posts.length === 0 && (
          <p className="text-center text-gray-500">
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
