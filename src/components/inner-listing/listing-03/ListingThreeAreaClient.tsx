"use client";

import FilterTwo from "@/components/search-dropdown/inner-dropdown/FilterTwo";
import ReactPaginate from "react-paginate";
import useTranslation from "next-translate/useTranslation";
import { GRID, LIST } from "@/utils/defines";
import { useCallback, useEffect, useRef, useState } from "react";
import { LOCAL_STORAGE_PROPERTY_VIEW } from "@/utils/localstorage";
import PropertyCardGrid from "@/components/ui/cards/properties/PropertyCardGrid";
import PropertyCardList from "@/components/ui/cards/properties/PropertyCardList";
import NiceSelect from "@/ui/NiceSelect";
import {
  SORT_NEWEST,
  SORT_OLDEST,
  SORT_PRICE_LOW,
  SORT_PRICE_HIGH,
} from "@/utils/enum";
import { useStore } from "@/stores/storeContext";
import { useRouter, useSearchParams } from "next/navigation";
import { observer } from "mobx-react-lite";

interface ListingThreeAreaClientProps {
  style?: boolean;
  properties: any[];
  initialQuery?: string;
  initialSort?: string;
  initialPage?: number;
  initialCity?: string;
  initialPrice?: string;
  initialAvail?: string;
}

const ListingThreeAreaClient = ({
  style,
  properties,
  initialQuery = "",
  initialSort = SORT_NEWEST,
  initialPage = 0,
  initialCity = "all",
  initialPrice = "200-2000",
  initialAvail = "all",
}: ListingThreeAreaClientProps) => {
  const { t, lang } = useTranslation("translations");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listStyle, setListStyle] = useState(GRID);
  const [isMounted, setIsMounted] = useState(false);

  const {
    propertyStore: { propertiesListFilters, setPropertiesListFilters },
  } = useStore();

  // Initialize from localStorage only on client
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedStyle = localStorage.getItem(LOCAL_STORAGE_PROPERTY_VIEW);
      if (savedStyle && (savedStyle === GRID || savedStyle === LIST)) {
        setListStyle(savedStyle);
      }
    } catch (error) {
      // localStorage might not be available
      console.warn("Failed to read from localStorage:", error);
    }
  }, []);

  const toggleView = () => {
    const newView = listStyle === GRID ? LIST : GRID;
    setListStyle(newView);
    localStorage.setItem(LOCAL_STORAGE_PROPERTY_VIEW, newView);
  };

  // Initialize state with defaults first (to prevent hydration mismatch)
  const [query, setQuery] = useState(initialQuery);
  const [sortIndex, setSortIndex] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [cityFilter, setCityFilter] = useState(initialCity);
  const [priceFilter, setPriceFilter] = useState(initialPrice);
  const [availFilter, setAvailFilter] = useState(initialAvail);

  // Update state from URL params and store when mounted
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      // Get values from URL params first, then store, then defaults
      const urlQuery = searchParams?.get("query");
      const urlSort = searchParams?.get("sort");
      const urlPage = searchParams?.get("page");
      const urlCity = searchParams?.get("city");
      const urlPrice = searchParams?.get("price");
      const urlAvail = searchParams?.get("avail");

      const finalQuery = urlQuery ?? propertiesListFilters.query ?? initialQuery;
      const finalSort = urlSort ?? propertiesListFilters.sort ?? initialSort;
      const finalPage = urlPage ? Number(urlPage) : (propertiesListFilters.page ?? initialPage);
      const finalCity = urlCity ?? propertiesListFilters.city ?? initialCity;
      const finalPrice = urlPrice ?? propertiesListFilters.price ?? initialPrice;
      const finalAvail = urlAvail ?? propertiesListFilters.avail ?? initialAvail;

      // Only update if values are different
      if (finalQuery !== query) setQuery(finalQuery);
      if (finalSort !== sortIndex) setSortIndex(finalSort);
      if (finalPage !== currentPage) setCurrentPage(finalPage);
      if (finalCity !== cityFilter) setCityFilter(finalCity);
      if (finalPrice !== priceFilter) setPriceFilter(finalPrice);
      if (finalAvail !== availFilter) setAvailFilter(finalAvail);
    } catch (error) {
      console.warn("Failed to read URL params:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]); // Only run once when mounted

  const pageLimit = 6;
  const startRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Track previous filter values (initialize with current state)
  const prevFilters = useRef({
    query,
    city: cityFilter,
    price: priceFilter,
    avail: availFilter,
    sort: sortIndex,
    page: currentPage,
  });

  // Single effect to handle URL updates and page reset on filter change
  useEffect(() => {
    if (!isMounted || !searchParams) return;

    // Handle initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      
      const hasURLParams = searchParams.toString().length > 0;
      const hasStoreFilters = propertiesListFilters.query || 
                             propertiesListFilters.city !== "all" ||
                             propertiesListFilters.price !== "200-2000" ||
                             propertiesListFilters.avail !== "all" ||
                             propertiesListFilters.sort !== SORT_NEWEST ||
                             propertiesListFilters.page > 0;
      
      // If no URL params but we have store filters, sync URL with store
      if (!hasURLParams && hasStoreFilters) {
        const params = new URLSearchParams();
        
        if (query && query.trim() !== "") {
          params.set("query", query);
        }
        if (cityFilter !== "all") {
          params.set("city", cityFilter);
        }
        if (priceFilter !== "200-2000") {
          params.set("price", priceFilter);
        }
        if (availFilter !== "all") {
          params.set("avail", availFilter);
        }
        if (sortIndex !== SORT_NEWEST) {
          params.set("sort", sortIndex);
        }
        if (currentPage > 0) {
          params.set("page", String(currentPage));
        }
        
        const queryString = params.toString();
        if (queryString) {
          router.replace(`?${queryString}`, { scroll: false });
        }
      }
      
      prevFilters.current = {
        query,
        city: cityFilter,
        price: priceFilter,
        avail: availFilter,
        sort: sortIndex,
        page: currentPage,
      };
      setPropertiesListFilters({
        query,
        city: cityFilter,
        price: priceFilter,
        avail: availFilter,
        sort: sortIndex,
        page: currentPage,
      });
      return;
    }

    // Check if filters actually changed
    const filtersChanged =
      prevFilters.current.query !== query ||
      prevFilters.current.city !== cityFilter ||
      prevFilters.current.price !== priceFilter ||
      prevFilters.current.avail !== availFilter ||
      prevFilters.current.sort !== sortIndex;

    let nextPage = currentPage;
    if (filtersChanged) {
      nextPage = 0;
      if (currentPage !== 0) {
        setCurrentPage(0);
        return; // Let the state update trigger this effect again
      }
    }

    // Build new params - only include non-default values
    const params = new URLSearchParams();
    
    // Only add params that differ from defaults or are explicitly set
    if (query && query.trim() !== "") {
      params.set("query", query);
    }
    if (cityFilter !== "all") {
      params.set("city", cityFilter);
    }
    if (priceFilter !== "200-2000") {
      params.set("price", priceFilter);
    }
    if (availFilter !== "all") {
      params.set("avail", availFilter);
    }
    if (sortIndex !== SORT_NEWEST) {
      params.set("sort", sortIndex);
    }
    if (nextPage > 0) {
      params.set("page", String(nextPage));
    }

    // Build the new URL query string
    const newQueryString = params.toString();
    const currentQueryString = searchParams?.toString() || "";

    // Only update URL if it actually changed and we have params, or if we're removing all params
    const shouldUpdateURL = newQueryString !== currentQueryString;
    
    if (shouldUpdateURL) {
      const newURL = newQueryString ? `?${newQueryString}` : window.location.pathname;
      router.replace(newURL, { scroll: false });
    }

    // Update previous filters
    prevFilters.current = {
      query,
      city: cityFilter,
      price: priceFilter,
      avail: availFilter,
      sort: sortIndex,
      page: nextPage,
    };

    setPropertiesListFilters({
      query,
      city: cityFilter,
      price: priceFilter,
      avail: availFilter,
      sort: sortIndex,
      page: nextPage,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, cityFilter, priceFilter, availFilter, sortIndex, currentPage, isMounted]);

  // Filtering and sorting logic
  const keys = ["title", "location", "city"];
  const [minPrice, maxPrice] = priceFilter.split("-").map(Number);
  const queryLower = query.toLowerCase();
  const filtered = properties.filter(
    (item: any) =>
      (!queryLower || keys.some((key) => item[key]?.toLowerCase().includes(queryLower))) &&
      (cityFilter === "all" || item.city?.toLowerCase() === cityFilter) &&
      item.price >= minPrice &&
      item.price <= maxPrice &&
      (availFilter === "all" || String(item.statusCode) === String(availFilter))
  );
  const sorted = (() => {
    switch (sortIndex) {
      case SORT_NEWEST:
        return [...filtered].sort((a: any, b: any) => b.id - a.id);
      case SORT_OLDEST:
        return [...filtered].sort((a: any, b: any) => a.id - b.id);
      case SORT_PRICE_LOW:
        return [...filtered].sort((a: any, b: any) => a.price - b.price);
      case SORT_PRICE_HIGH:
        return [...filtered].sort((a: any, b: any) => b.price - a.price);
      default:
        return filtered;
    }
  })();
  const start = currentPage * pageLimit;
  const end = start + pageLimit;
  const paginatedProperties = sorted.slice(start, end);
  const pageCount = Math.ceil(filtered.length / pageLimit);

  const handlePageClick = (event: any) => {
    setCurrentPage(event.selected);
    startRef.current?.scrollIntoView();
  };

  // Show minimal structure until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div
        className={`property-listing-six pb-170 xl-pb-120 ${
          style ? "pt-80 xl-pt-60" : "pt-80 md-pt-40 mt-80 xl-mt-60 bg-pink-two"
        }`}
        style={{ minHeight: '800px' }}
      >
        <div className="container"></div>
      </div>
    );
  }

  return (
    <div
      className={`property-listing-six pb-170 xl-pb-120 ${
        style ? "pt-80 xl-pt-60" : "pt-80 md-pt-40 mt-80 xl-mt-60 bg-pink-two"
      }`}
      style={{ minHeight: '800px' }}
    >
      <div className="container">
        {!style && (
          <div className="search-wrapper-one layout-one bg position-relative mb-75 md-mb-50">
            <div className="bg-wrapper border-layout">
              <FilterTwo
                properties={properties}
                query={query}
                setQuery={setQuery}
                cityFilter={cityFilter}
                setCityFilter={setCityFilter}
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
                availFilter={availFilter}
                setAvailFilter={setAvailFilter}
              />
            </div>
          </div>
        )}

        <div className="listing-header-filter d-sm-flex justify-content-between align-items-center mb-40 lg-mb-30">
          <div
            dangerouslySetInnerHTML={{
              __html: t("filter.showing", {
                start: paginatedProperties.length ? start + 1 : 0,
                end: start + paginatedProperties.length,
                total: filtered.length,
              }),
            }}
          />
          <div className="d-flex align-items-center xs-mt-20">
            <div className="short-filter d-flex align-items-center">
              <div className="fs-16 me-2">{t("filter.sort")}:</div>
              <NiceSelect
                className="nice-select"
                options={[
                  { value: SORT_NEWEST, text: t("filter.newest") },
                  { value: SORT_OLDEST, text: t("filter.oldest") },
                  { value: SORT_PRICE_LOW, text: t("filter.price_low_high") },
                  { value: SORT_PRICE_HIGH, text: t("filter.price_high_low") },
                ]}
                defaultCurrent={[
                  SORT_NEWEST,
                  SORT_OLDEST,
                  SORT_PRICE_LOW,
                  SORT_PRICE_HIGH,
                ].indexOf(sortIndex)}
                onChange={(e) => {
                  setSortIndex(e.target.value);
                }}
                name=""
                placeholder=""
              />
            </div>
            <button
              onClick={toggleView}
              className="tran3s layout-change rounded-circle ms-auto ms-sm-3"
              data-bs-toggle="tooltip"
              title="Switch To List View"
            >
              {listStyle === LIST ? (
                <i className="fa-regular fa-bars"></i>
              ) : (
                <i className="fa-regular fa-grid"></i>
              )}
            </button>
          </div>
        </div>

        <div className="row gx-xxl-5" ref={startRef} style={{ minHeight: paginatedProperties?.length > 0 ? '600px' : '200px' }}>
          {paginatedProperties?.length > 0 ? (
            paginatedProperties.map((property: any, index: number) =>
              listStyle === LIST ? (
                <PropertyCardList key={index} property={property} />
              ) : (
                <PropertyCardGrid key={index} property={property} />
              )
            )
          ) : (
            <h6 className="text-center d-flex flex-column">
              <i className="fa-solid fa-people-robbery mb-10 fs-1"></i>
              {t("property.no_properties_for_the_criteria")}
            </h6>
          )}
        </div>

        <div className="pt-50 md-pt-20 text-center">
          <ReactPaginate
            breakLabel="..."
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
            className="pagination-two d-inline-flex align-items-center justify-content-center style-none"
            previousLabel={<i className="fa-regular fa-chevron-left"></i>}
            nextLabel={<i className="fa-regular fa-chevron-right"></i>}
            forcePage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default observer(ListingThreeAreaClient);
