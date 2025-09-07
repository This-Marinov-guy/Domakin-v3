// pages/blog/[id]/[name].tsx
import BreadcrumbNav from "@/components/common/breadcrumb/BreadcrumbNav";
import FancyBanner from "@/components/common/FancyBanner";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import Head from "next/head";
import { GetServerSideProps } from "next";

type WpPost = {
  id: number;
  slug: string;
  date: string;
  link: string;                  // original WP URL
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  yoast_head_json?: { description?: string; title?: string };
};

type Props = {
  post: WpPost | null;
  error?: string | null;
  canonicalUrl?: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { id } = ctx.params as { id: string };

  try {
    const WP_BASE = "https://domakin0.wordpress.com";
    // Fetch the post by numeric id; restrict fields to what we need
    const res = await fetch(
      `${WP_BASE}/wp-json/wp/v2/posts/${id}?_fields=id,slug,date,link,title,content,excerpt,yoast_head_json`,
      { headers: { Accept: "application/json" } }
    );

    if (!res.ok) return { props: { post: null, error: `WP fetch failed: ${res.status}` } };

    const post: WpPost = await res.json();

    const proto =
      (ctx.req.headers["x-forwarded-proto"] as string) ||
      (process.env.NODE_ENV === "development" ? "http" : "https");
    const host = ctx.req.headers.host;
    const canonicalUrl = `${proto}://${host}${ctx.resolvedUrl}`;

    return { props: { post, canonicalUrl, error: null } };
  } catch (e: any) {
    return { props: { post: null, error: e?.message || "Unknown error" } };
  }
};

const stripHtml = (s?: string) => (s ? s.replace(/<[^>]*>?/gm, "") : "");

const BlogPost = ({ post, error, canonicalUrl }: Props) => {
  if (error) {
    return (
      <>
        <HeaderOne />
        <main className="container mx-auto px-4 py-16">
          <h1 className="text-2xl font-semibold mb-4">Couldn’t load post</h1>
          <p className="mb-4">{error}</p>
          <p>
            Go back to the <a className="underline" href="/blog">blog</a>.
          </p>
        </main>
        <FancyBanner />
        <FooterFour />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <HeaderOne />
        <main className="container mx-auto px-4 py-16">
          <h1 className="text-2xl font-semibold mb-4">Post not found</h1>
          <p>
            Try returning to the <a className="underline" href="/blog">blog</a>.
          </p>
        </main>
        <FancyBanner />
        <FooterFour />
      </>
    );
  }

  const plainTitle = stripHtml(post.title.rendered) || "Blog post";
  const metaDescription =
    post.yoast_head_json?.description || stripHtml(post.excerpt?.rendered || "") || undefined;

  // Optional: set canonical to YOUR site (to consolidate) or to WordPress (to avoid duplicate content).
  // If you prefer to keep WordPress as canonical, replace `canonicalUrl` with `post.link` below.
  const canonical = canonicalUrl;

  return (
    <>
      <Head>
        <title>{plainTitle}</title>
        {metaDescription ? <meta name="description" content={metaDescription} /> : null}
        {canonical ? <link rel="canonical" href={canonical} /> : null}
        <meta property="og:title" content={plainTitle} />
        {metaDescription ? <meta property="og:description" content={metaDescription} /> : null}
      </Head>

      <HeaderOne />

      <div className="wordpress-embedded-container container mx-auto px-4 py-10">
        <h1 className="mb--20" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        <BreadcrumbNav link_title="Blog" />

        <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />

        <p className="mt-10 text-sm opacity-70">
          Originally published on{" "}
          <a className="underline" href={post.link} rel="noopener noreferrer" target="_blank">
            WordPress
          </a>
          .
        </p>
      </div>

      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default BlogPost;
