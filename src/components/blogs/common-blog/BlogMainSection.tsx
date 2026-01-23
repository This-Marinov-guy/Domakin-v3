"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import Form from "react-bootstrap/Form";

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const categoryContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Extract unique categories from posts
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    posts.forEach((post: any) => {
      if (post.category && typeof post.category === 'string' && post.category.trim()) {
        categorySet.add(post.category.trim());
      }
    });
    return Array.from(categorySet).sort();
  }, [posts]);

  // Debounce search term
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      const prevSearch = debouncedSearchTerm;
      setDebouncedSearchTerm(searchTerm);
      // Reset to page 1 when search changes
      if (searchTerm !== prevSearch && searchTerm !== '') {
        router.push({
          pathname: router.pathname,
          query: { ...router.query, page: undefined },
        }, undefined, { scroll: false });
      }
    }, 800);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // Filter posts by category and search term
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((post: any) => 
        post.category && post.category.trim() === selectedCategory
      );
    }

    // Filter by search term (name/title and category)
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter((post: any) => {
        const titleMatch = post.title?.toLowerCase().includes(searchLower) || 
                          post.title?.rendered?.toLowerCase().includes(searchLower);
        const descriptionMatch = post.description?.toLowerCase().includes(searchLower) ||
                                post.excerpt?.toLowerCase().includes(searchLower) ||
                                post.excerpt?.rendered?.toLowerCase().includes(searchLower);
        const categoryMatch = post.category?.toLowerCase().includes(searchLower);
        return titleMatch || descriptionMatch || categoryMatch;
      });
    }

    return filtered;
  }, [posts, selectedCategory, debouncedSearchTerm]);

  // Calculate pagination based on filtered posts
  const pageCount = Math.ceil(filteredPosts.length / itemsPerPage);
  const effectiveCurrentPage = Math.max(1, Math.min(currentPage, pageCount || 1));
  const startIndex = (effectiveCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // Handle category selection
  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
    // Reset to page 1 when category changes
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: undefined },
    }, undefined, { scroll: false });
  };

  // Check scroll position for arrows
  useEffect(() => {
    const checkScroll = () => {
      if (!categoryContainerRef.current) return;
      const container = categoryContainerRef.current;
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    };

    checkScroll();
    const container = categoryContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      }
    };
  }, [categories]);

  // Scroll category container
  const scrollCategories = (direction: 'left' | 'right') => {
    if (!categoryContainerRef.current) return;
    const scrollAmount = 200;
    categoryContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

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

        {/* Search Bar */}
        <div className="row mb-30">
          <div className="col-12">
            <Form.Group>
              <Form.Control
                type="text"
                placeholder={t("blog.search_placeholder") || "Search blogs by name or category..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="blog-search-input"
                style={{
                  padding: '12px 20px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                }}
              />
            </Form.Group>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="row mb-40">
            <div className="col-12">
              <div className="blog-category-filter position-relative">
                {showLeftArrow && (
                  <button
                    type="button"
                    className="blog-category-arrow blog-category-arrow--left"
                    onClick={() => scrollCategories('left')}
                    aria-label="Scroll categories left"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                )}
                <div
                  ref={categoryContainerRef}
                  className="blog-category-container"
                  style={{
                    display: 'flex',
                    gap: '12px',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    scrollBehavior: 'smooth',
                    padding: '0 40px',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  <button
                    type="button"
                    className={`blog-category-btn ${!selectedCategory ? 'blog-category-btn--active' : ''}`}
                    onClick={() => handleCategoryClick(null)}
                  >
                    {t("blog.all_categories") || "All"}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`blog-category-btn ${selectedCategory === category ? 'blog-category-btn--active' : ''}`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                {showRightArrow && (
                  <button
                    type="button"
                    className="blog-category-arrow blog-category-arrow--right"
                    onClick={() => scrollCategories('right')}
                    aria-label="Scroll categories right"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
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
                forcePage={effectiveCurrentPage - 1} // react-paginate is 0-indexed
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
