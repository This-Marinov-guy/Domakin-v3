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
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
};

type Props = {
  post: WpPost | null;
  canonicalUrl?: string;
  error?: string | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { id } = ctx.params as { id: string };

  try {
    const WP_API = "https://domakin0.wordpress.com/wp-json/wp/v2";

    // Fetch by numeric ID because your route includes it
    const res = await fetch(
      `${WP_API}/posts/${encodeURIComponent(id)}?_fields=id,slug,date,link,title,content,excerpt`,
      { headers: { Accept: "application/json" } }
    );

    if (!res.ok) {
      return { props: { post: null, error: `WP fetch failed: ${res.status}` } };
    }

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

const BlogPost = ({ post, canonicalUrl, error }: Props) => {
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

  return (
    <>
      <Head>
        <title>{plainTitle}</title>
        {post.excerpt?.rendered ? (
          <meta name="description" content={stripHtml(post.excerpt.rendered)} />
        ) : null}
        {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
      </Head>

      <HeaderOne />

      <div className="wordpress-embedded-container container mx-auto px-4 py-10">
        <h1 className="mb--20" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        <BreadcrumbNav link_title="Blog" />
        <article
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
        <p className="mt-10 text-sm opacity-70">
          Originally published on{" "}
          <a className="underline" href={post.link} target="_blank" rel="noopener noreferrer">
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
