import React from "react";
import Image from "next/image";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";

import paginateIcon from "@/assets/images/icon/icon_46.svg";
import useTranslation from "next-translate/useTranslation";
import { useStore } from "@/stores/storeContext";
import BlogCardSmall from "./BlogCardSmall";
import { observer } from "mobx-react-lite";
import BlogCardBig from "./BlogCardBig";
import BlogLoadingSection from "@/components/ui/loading/BlogLoadingSection";

interface BlogMainSectionProps {
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
}

const BlogMainSection = ({ currentPage = 1, totalPages = 1, itemsPerPage = 6 }: BlogMainSectionProps) => {
  const { t } = useTranslation("translations");
  const router = useRouter();
  const {
    blogStore: { posts, loading },
  } = useStore();

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
    }, undefined, { shallow: false });
    
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasPosts = posts?.length > 0;
  const hasPaginatedPosts = paginatedPosts?.length > 0;
  
  // For paginated display: first post is main, rest are small
  const [mainPost, ...otherPosts] = paginatedPosts || [];

  // Only show loading if we're actually loading AND don't have any data
  // This ensures SSR data displays immediately without a loading state
  if (loading && (!posts || posts.length === 0)) {
    return (
      <>
        <BlogLoadingSection title={t("blog.description")} />
      </>
    );
  }

  if (!hasPosts) {
    return (
      <h4 className="text-center mt-130 xl-mt-100 mb-150 xl-mb-100">
        {t("blog.no_posts_description")}
      </h4>
    );
  }

  if (!hasPaginatedPosts) {
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
        {mainPost && (
          <div className="row">
            <BlogCardBig post={mainPost} />
          </div>
        )}
        <div className="row">
          <div className="col-12">
            <div className="row gx-xxl-5">
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

export default observer(BlogMainSection);
