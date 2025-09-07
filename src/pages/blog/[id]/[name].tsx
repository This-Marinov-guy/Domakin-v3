import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterFour from "@/layouts/footers/FooterFour";
import BreadcrumbNav from "@/components/common/breadcrumb/BreadcrumbNav";
import FancyBanner from "@/components/common/FancyBanner";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setPost(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  return (
    <>
      <HeaderOne />
      {loading && <p>Loading...</p>}
      {!loading && post && (
        <div className="wordpress-embedded-container">
          <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          <BreadcrumbNav link_title="Blog" />
          <article dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        </div>
      )}
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default BlogPost;
