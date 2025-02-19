import Link from "next/link";
import React from "react";

const BlogCardSmall = (props: any) => {
  const { post } = props;  

  const link = `/blog/${post.id}/${post.title}`;

  return (
    <div
      key={post.id}
      className="col-lg-4 col-md-6 col-sm-6 wow fadeInUp"
      // data-wow-delay={post.date}
    >
      <div
        className={`location-card-two position-relative z-1 d-flex align-items-center justify-content-center mt-30`}
        style={{
          backgroundImage: `url(${post.thumbnail})`,
        }}
      >
        <div className="content">
          <h5 className="text-white font-garamond">{post.title}</h5>
        </div>
        <Link href={link} className="stretched-link"></Link>
      </div>
    </div>
  );
};

export default BlogCardSmall;
