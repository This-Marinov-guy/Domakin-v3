// src/pages/blog/index.tsx
import dynamic from "next/dynamic";
import BlogMainSection from "@/components/blogs/common-blog/BlogMainSection";
import { fetchWordPressPosts, type WordPressPost } from "@/lib/wordpress";

const HeaderOne = dynamic(() => import("@/layouts/headers/HeaderOne"), { ssr: false });
const FooterFour = dynamic(() => import("@/layouts/footers/FooterFour"), { ssr: false });
const BreadcrumbThree = dynamic(
  () => import("@/components/common/breadcrumb/BreadcrumbThree"),
  { ssr: false }
);

export default function BlogPage({ initialPosts }: { initialPosts: WordPressPost[] }) {
  return (
    <>
      <HeaderOne />
      <BreadcrumbThree title="Blog" />
      <BlogMainSection initialPosts={initialPosts} />
      <FooterFour />
    </>
  );
}

export async function getStaticProps() {
  try {
    const posts = await fetchWordPressPosts("?_embed=1");

    return {
      props: { initialPosts: posts },
      revalidate: 600, // refresh every 10 min
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      props: { initialPosts: [] },
      revalidate: 600,
    };
  }
}
