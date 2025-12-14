import React from "react";
import Image from "next/image";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";

import paginateIcon from "@/assets/images/icon/icon_46.svg";
import useTranslation from "next-translate/useTranslation";
import BlogCardSmall from "./BlogCardSmall";
import BlogCardBig from "./BlogCardBig";

interface BlogMainSectionProps {
  posts: any[];
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
}

const BlogMainSection = ({ posts = [], currentPage = 1, totalPages = 1, itemsPerPage = 6 }: BlogMainSectionProps) => {
  const { t } = useTranslation("translations");
  const router = useRouter();

  // Calculate pagination based on current page from URL
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPosts = posts.slice(startIndex, endIndex);
  const pageCount = totalPages;

  // Handle page click - update URL query parameter
  const handlePageClick = (event: any) => {
    const selectedPage = event.selected + 1; // react-paginate is 0-indexed
    const query = { ...router.query, page: selectedPage.toString() };
    
    // Remove page query if it's page 1 for cleaner URLs
    if (selectedPage === 1) {
      delete query.page;
    }
    
    router.push({
      pathname: router.pathname,
      query,
    }, undefined, { scroll: false });
  };

  const hasPosts = posts?.length > 0;
  const hasPaginatedPosts = paginatedPosts?.length > 0;
  
  // For paginated display: first post is main, rest are small
  const [mainPost, ...otherPosts] = paginatedPosts || [];

  if (!hasPosts) {
    return (
      <div className="blog-section-three mt-40 mb-40">
        <div className="container container-large">
          <h4 className="text-center mt-130 xl-mt-100 mb-150 xl-mb-100">
            {t("blog.no_posts_description")}
          </h4>
        </div>
      </div>
    );
  }

  if (!hasPaginatedPosts) {
    return (
      <div className="blog-section-three mt-40 mb-40">
        <div className="container container-large">
          <h4 className="text-center mt-130 xl-mt-100 mb-150 xl-mb-100">
            {t("blog.no_posts_description")}
          </h4>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-section-three mt-40 mb-40" style={{ minHeight: '600px' }}>
      <div className="container container-large">
        <div className="row">
          <h4 className="text-center mb-40">{t("blog.description")}</h4>
        </div>
        <div className="row" style={{ minHeight: mainPost ? 'auto' : '0' }}>
          {mainPost ? (
            <BlogCardBig post={mainPost} />
          ) : (
            <div style={{ height: '0', visibility: 'hidden' }} aria-hidden="true">
              <BlogCardBig post={{ thumbnail: '', title: '', slug: '', description: '' }} />
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-12">
            <div className="row gx-xxl-5" style={{ minHeight: otherPosts.length > 0 ? '400px' : '0' }}>
              {otherPosts.map((post, index) => (
                <BlogCardSmall key={index} post={post} />
              ))}
            </div>

            {pageCount > 1 && (
              <ReactPaginate
                breakLabel="..."
                nextLabel={<Image src={paginateIcon} alt="" className="ms-2" />}
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                forcePage={currentPage - 1} // react-paginate is 0-indexed
                previousLabel={
                  <Image src={paginateIcon} alt="" className="ms-2" />
                }
                renderOnZeroPageCount={null}
                className="pagination-one square d-flex align-items-center style-none pt-30"
              />
            )}
          </div>
          {/* <BlogSidebar /> */}
        </div>
      </div>
    </div>
  );
};

export default BlogMainSection;
