import BreadcrumbNav from "@/components/common/breadcrumb/BreadcrumbNav";
import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import FancyBanner from "@/components/common/FancyBanner";
import PageLoader from "@/components/ui/loading/PageLoader";
import { useServer } from "@/hooks/useServer";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import useTranslation from "next-translate/useTranslation";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const BlogPost = () => {
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useTranslation("translations");

  const { id } = useParams();
  const { sendRequest } = useServer();

  useEffect(() => {
    sendRequest(`/blog/post/${id}`)
      .then((response) => {
        if (response.status) {
          setPost(response.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        // do nothing
      });
  }, [id]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <style>{post.styles}</style>
      <HeaderOne />
      <div className="wordpress-embedded-container">
        <h1
          className="mb--20"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <BreadcrumbNav link_title={t("blog.title")} />
        <div
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}
        />
      </div>
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default BlogPost;
