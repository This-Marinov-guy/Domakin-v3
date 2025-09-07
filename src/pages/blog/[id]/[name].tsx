mport BreadcrumbNav from "@/components/common/breadcrumb/BreadcrumbNav";
import FancyBanner from "@/components/common/FancyBanner";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import { GetServerSideProps } from "next";
import Head from "next/head";

type BlogPostData = {
  id: string | number;
  title: string;          // HTML string from WP
  content: string;        // HTML string from WP
  styles?: string;        // optional CSS string from WP
  slug?: string;
  publishedAt?: string;
  description?: string;   // optional meta description
  featuredImageUrl?: string;
};

type BlogPostProps = {
  post: BlogPostData | null;
};

export const getServerSideProps: GetServerSideProps<BlogPostProps> = async (ctx) => {
  const { id } = ctx.params as { id: string };
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    ""; // e.g. https://api.domakin.nl

  const res = await fetch(`${API_BASE}/blog/post/${id}`, {
    headers: { "Accept": "application/json" },
  });

  if (!res.ok) {
    return { props: { post: null } };
  }

  const json = await res.json();
  const post: BlogPostData | null = json?.status ? json?.data : null;

  return { props: { post } };
};

const BlogPost = ({ post }: BlogPostProps) => {
  if (!post) {
    return (
      <>
        <HeaderOne />
        <main className="container mx-auto px-4 py-16">
          <h1 className="text-2xl font-semibold mb-4">Post not found</h1>
          <p>Try returning to the <a className="underline" href="/blog">blog</a>.</p>
        </main>
        <FancyBanner />
        <FooterFour />
      </>
    );
  }

  // Extract plain text title for <title> tag
  const plainTitle = post.title?.replace(/<[^>]*>?/gm, "") || "Blog post";

  // Optional Article JSON-LD for richer crawling
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: plainTitle,
    datePublished: post.publishedAt || undefined,
    image: post.featuredImageUrl ? [post.featuredImageUrl] : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": typeof window === "undefined" ? "" : window.location.href,
    },
  };

  return (
    <>
      {post.styles ? <style dangerouslySetInnerHTML={{ __html: post.styles }} /> : null}

      <Head>
        <title>{plainTitle}</title>
        {post.description ? (
          <meta name="description" content={post.description} />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
        {/* Optional canonical if you have one */}
        {/* <link rel="canonical" href={`https://www.domakin.nl/blog/${post.id}/${post.slug || ""}`} /> */}
      </Head>

      <HeaderOne />

      <div className="wordpress-embedded-container container mx-auto px-4 py-10">
        <h1 className="mb--20" dangerouslySetInnerHTML={{ __html: post.title }} />
        <BreadcrumbNav link_title="Blog" />

        <article
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default BlogPost;
