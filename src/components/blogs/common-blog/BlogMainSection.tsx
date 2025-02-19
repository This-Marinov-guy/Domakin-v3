import React from "react";
import inner_blog_data from "@/data/inner-data/BlogData";
import BlogSidebar from "../common-blog/BlogSidebar";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReactPaginate from "react-paginate";

import paginateIcon from "@/assets/images/icon/icon_46.svg";
import useTranslation from "next-translate/useTranslation";
import { useStore } from "@/stores/storeContext";
import BlogCardSmall from "./BlogCardSmall";
import { observer } from "mobx-react-lite";
import BlogCardBig from "./BlogCardBig";

const BlogMainSection = () => {
  const { t } = useTranslation("translations");
  const {
    blogStore: { posts },
  } = useStore();

  const itemsPerPage = 6;
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = posts.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(posts.length / itemsPerPage);
  // click to request another page.
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % posts.length;
    setItemOffset(newOffset);
  };

  const hasPosts = posts?.length > 0;
  const [mainPost, ...otherPosts] = posts;

  if (!hasPosts) {
    return (
      <h4 className="text-center mt-130 xl-mt-100 mb-150 xl-mb-100">
        {t("blog.no_posts_description")}
      </h4>
    );
  }

  return (
    <div className="blog-section-three mt-40 mb-40">
      <div className="container container-large">
        <div className="row">
          <h4 className="text-center mb-40">{t("blog.description")}</h4>
        </div>
        <div className="row">
          <BlogCardBig post={mainPost} />
        </div>
        <div className="row">
          <div className="col-12">
            <div className="row gx-xxl-5">
              {otherPosts.map((post, index) => (
                <BlogCardSmall key={index} post={post} />
              ))}
            </div>

            {/* <ReactPaginate
              breakLabel="..."
              nextLabel={<Image src={paginateIcon} alt="" className="ms-2" />}
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              pageCount={pageCount}
              previousLabel={
                <Image src={paginateIcon} alt="" className="ms-2" />
              }
              renderOnZeroPageCount={null}
              className="pagination-one square d-flex align-items-center style-none pt-30"
            /> */}
          </div>
          {/* <BlogSidebar /> */}
        </div>
      </div>
    </div>
  );
};

export default observer(BlogMainSection);
