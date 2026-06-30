import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import type { WordPressPost } from "@/lib/wordpress";
import Head from "next/head";

const SITE_URL = "https://www.domakin.nl";

type WordPressBlogPostViewProps = {
  post: WordPressPost;
};

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const WordPressBlogPostView = ({ post }: WordPressBlogPostViewProps) => {
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  const title = stripHtml(post.title.rendered);
  const description = stripHtml(post.excerpt?.rendered ?? post.content?.rendered ?? "").slice(0, 155);
  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const publishedAt = post.date ? new Date(post.date).toISOString() : undefined;
  const modifiedAt = post.modified ? new Date(post.modified).toISOString() : publishedAt;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonical}#article`,
    mainEntityOfPage: canonical,
    headline: title,
    description,
    image: featuredImage ? [featuredImage] : undefined,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    author: {
      "@type": "Organization",
      name: "Domakin",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Domakin",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/assets/img/logo-2.png`,
      },
    },
  };

  return (
    <>
      <Head>
        <title>{`${title} | Domakin`}</title>
        {description && <meta name="description" content={description} />}
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        {description && <meta property="og:description" content={description} />}
        <meta property="og:url" content={canonical} />
        {featuredImage && <meta property="og:image" content={featuredImage} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      </Head>
      <HeaderOne />
      <BreadcrumbThree title={title} headingTag="div" />

      <article className="container mx-auto py-8 prose lg:prose-lg">
        <h1 className="mb-4">{title}</h1>

        {featuredImage && (
          <img
            src={featuredImage}
            alt={title}
            className="w-full max-h-96 object-cover mb-6 rounded"
          />
        )}

        <div dangerouslySetInnerHTML={{ __html: post.content?.rendered ?? "" }} />
      </article>

      <FooterFour />
    </>
  );
};

export default WordPressBlogPostView;
