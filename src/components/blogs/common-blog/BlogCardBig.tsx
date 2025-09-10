import Link from "next/link";
import Image from "next/image";
import React from "react";
import useTranslation from "next-translate/useTranslation";

const BlogCardBig = (props: any) => {
  const { post } = props;
  const {t} = useTranslation("translations"); 

  // Use direct ID format to avoid redirect issues
  const link = `/blog/${post.id}`;

  return (
    <article
      key={post.id}
      className="blog-meta-three mb-70 lg-mb-40 wow fadeInUp"
    >
      {post.thumbnail && (
        <Image src={post.thumbnail} alt={post.title} width={1000} height={1000}/>       
      )}
      <div className={`post-data`}>
        {/* <div className="post-info">
          <Link href={link}>{post.info_name}</Link> {post.info_time}{" "}
          min
        </div> */}
        <Link href={link} className="blog-title d-block">
          <h4>{post.title}</h4>
        </Link>
        <p>{post.description}</p>
        <Link href={link} className="btn-eight">
          <span>{t("blog.read_more")}</span>{" "}
          <i className="bi bi-arrow-up-right"></i>
        </Link>
      </div>
    </article>
  );
};

export default BlogCardBig;
