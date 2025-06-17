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
import PageLoader from "@/components/ui/loading/PageLoader";
import { useRouter, useSearchParams } from "next/navigation";
import { observer } from "mobx-react-lite";

const ListingThreeArea = ({ style, properties }: any) => {
  const { t, lang } = useTranslation("translations");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listStyle, setListStyle] = useState(GRID);

  const {
    propertyStore: { propertiesListFilters, setPropertiesListFilters },
  } = useStore();

  useEffect(() => {
    const savedStyle = localStorage.getItem(LOCAL_STORAGE_PROPERTY_VIEW);
    if (savedStyle) {
      setListStyle(savedStyle);
    }
  }, []);

  const toggleView = () => {
    const newView = listStyle === GRID ? LIST : GRID;

    setListStyle(newView);
    localStorage.setItem(LOCAL_STORAGE_PROPERTY_VIEW, newView);
  };

  // Query params for all filters
  const initialQuery =
    (searchParams.get("query") || propertiesListFilters.query) ?? "";
  const initialSort =
    (searchParams.get("sort") || propertiesListFilters.sort) ?? SORT_NEWEST;
  const initialPage = Number(
    (searchParams.get("page") || propertiesListFilters.page) ?? 0
  );
  const initialCity =
    (searchParams.get("city") || propertiesListFilters.city) ?? "all";
  const initialPrice =
    (searchParams.get("price") || propertiesListFilters.price) ?? "200-2000";
  const initialAvail =
    (searchParams.get("avail") || propertiesListFilters.avail) ?? "all";

  const [query, setQuery] = useState(initialQuery);
  const [sortIndex, setSortIndex] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [cityFilter, setCityFilter] = useState(initialCity);
  const [priceFilter, setPriceFilter] = useState(initialPrice);
  const [availFilter, setAvailFilter] = useState(initialAvail);

  const pageLimit = 6;
  const startRef = useRef<HTMLDivElement>(null);

  // Track previous filter values (initialize with current state)
  const prevFilters = useRef({
    query,
    city: cityFilter,
    price: priceFilter,
    avail: availFilter,
  });

  // Single effect to handle URL updates and page reset on filter change
  useEffect(() => {
    const filtersChanged =
      prevFilters.current.query !== query ||
      prevFilters.current.city !== cityFilter ||
      prevFilters.current.price !== priceFilter ||
      prevFilters.current.avail !== availFilter;

    let nextPage = currentPage;
    if (filtersChanged) {
      nextPage = 0;
      if (currentPage !== 0) {
        setCurrentPage(0);
      }
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("query", query);
    params.set("city", cityFilter);
    params.set("price", priceFilter);
    params.set("avail", availFilter);
    params.set("sort", sortIndex);
    params.set("page", String(nextPage));
    router.replace(`?${params.toString()}`, { scroll: false });

    prevFilters.current = {
      query,
      city: cityFilter,
      price: priceFilter,
      avail: availFilter,
    };

    setPropertiesListFilters({
      query,
      city: cityFilter,
      price: priceFilter,
      avail: availFilter,
      sort: sortIndex,
      page: currentPage,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, cityFilter, priceFilter, availFilter, sortIndex, currentPage]);

  // Filtering and sorting logic
  const keys = ["title", "location", "city"];
  const [minPrice, maxPrice] = priceFilter.split("-").map(Number);
  const filtered = properties.filter(
    (item: any) =>
      keys.some((key) => item[key]?.toLowerCase().includes(query)) &&
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

  return (
    <div
      className={`property-listing-six pb-170 xl-pb-120 ${
        style ? "pt-80 xl-pt-60" : "pt-80 md-pt-40 mt-80 xl-mt-60 bg-pink-two"
      }`}
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

        <div className="row gx-xxl-5" ref={startRef}>
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

export default observer(ListingThreeArea);
