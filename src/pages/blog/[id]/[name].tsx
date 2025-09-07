// pages/blog/[id]/[name].tsx
import BreadcrumbNav from "@/components/common/breadcrumb/BreadcrumbNav";
import FancyBanner from "@/components/common/FancyBanner";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import Head from "next/head";
import { GetServerSideProps } from "next";

type BlogPostData = {
  id: string | number;
  title: string;          // HTML string from WP
  content: string;        // HTML string from WP
  styles?: string;
  slug?: string;
  publishedAt?: string;
  description?: string;
  featuredImageUrl?: string;
};

type BlogPostProps = {
  post: BlogPostData | null;
  canonicalUrl?: string;
  error?: string | null;
};

export const getServerSideProps: GetServerSideProps<BlogPostProps> = async (ctx) => {
  const { id } = ctx.params as { id: string };

  try {
    const proto =
      (ctx.req.headers["x-forwarded-proto"] as string) ||
      (process.env.NODE_ENV === "development" ? "http" : "https");
    const host = ctx.req.headers.host;
    const fallbackBase = `${proto}://${host}`;

    const API_BASE =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      fallbackBase;

    const res = await fetch(`${API_BASE}/blog/post/${id}`, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return { props: { post: null, error: `Fetch failed: ${res.status}` } };
    }

    const json = await res.json();
    const post: BlogPostData | null = json?.status ? json?.data : null;

    const canonicalUrl = `${fallbackBase}${ctx.resolvedUrl}`;

    return { props: { post, canonicalUrl, error: null } };
  } catch (e: any) {
    return { props: { post: null, error: e?.message || "Unknown error" } };
  }
};

const stripHtml = (s?: string) => (s ? s.replace(/<[^>]*>?/gm, "") : "");

const BlogPost = ({ post, canonicalUrl, error }: BlogPostProps) => {
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

  const plainTitle = stripHtml(post.title) || "Blog post";

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: plainTitle,
    datePublished: post.publishedAt || undefined,
    image: post.featuredImageUrl ? [post.featuredImageUrl] : undefined,
    mainEntityOfPage: canonicalUrl ? { "@type": "WebPage", "@id": canonicalUrl } : undefined,
  };

  return (
    <>
      {post.styles ? <style dangerouslySetInnerHTML={{ __html: post.styles }} /> : null}

      <Head>
        <title>{plainTitle}</title>
        {post.description ? <meta name="description" content={post.description} /> : null}
        {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
      </Head>

      <HeaderOne />

      <div className="wordpress-embedded-container container mx-auto px-4 py-10">
        <h1 className="mb--20" dangerouslySetInnerHTML={{ __html: post.title }} />
        <BreadcrumbNav link_title="Blog" />
        <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default BlogPost;
