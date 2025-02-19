import Link from "next/link";
import Image from "next/image";
import React from "react";
import useTranslation from "next-translate/useTranslation";

const BlogCardBig = (props: any) => {
  const { post } = props;
  const {t} = useTranslation("translations"); 

  const link = `/blog/${post.id}/${post.title}`;

  return (
    <article
      key={post.id}
      className="blog-meta-three mb-70 lg-mb-40 wow fadeInUp"
    >
      {post.thumbnail && (
        <figure
          className={`post-img position-relative m0 `}
          style={{ backgroundImage: `url(${post.thumbnail})` }}
        >
          {/* <Link
            href="/blog_details"
            className="stretched-link fw-500 date tran3s"
          >
            {item.date}
          </Link> */}
        </figure>
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
