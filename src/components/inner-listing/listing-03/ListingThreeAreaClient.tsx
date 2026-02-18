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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const { t } = useTranslation("translations");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [listStyle, setListStyle] = useState(GRID);
  const [isMounted, setIsMounted] = useState(false);

  const {
    propertyStore: { propertiesListFilters, setPropertiesListFilters },
  } = useStore();

  // Derive filter/sort/page from URL (single source of truth)
  const query = searchParams?.get("query") ?? initialQuery;
  const sortIndex = searchParams?.get("sort") ?? initialSort;
  const currentPage = Math.max(
    0,
    parseInt(searchParams?.get("page") ?? String(initialPage), 10) || 0
  );
  const cityFilter = searchParams?.get("city") ?? initialCity;
  const priceFilter = searchParams?.get("price") ?? initialPrice;
  const availFilter = searchParams?.get("avail") ?? initialAvail;

  const pageLimit = 6;
  const startRef = useRef<HTMLDivElement>(null);

  type UrlParams = {
    query: string;
    sort: string;
    page: number;
    city: string;
    price: string;
    avail: string;
  };

  const updateUrlParams = useCallback(
    (updates: Partial<UrlParams>) => {
      const current: UrlParams = {
        query: searchParams?.get("query") ?? initialQuery,
        sort: searchParams?.get("sort") ?? initialSort,
        page: Math.max(
          0,
          parseInt(searchParams?.get("page") ?? String(initialPage), 10) || 0
        ),
        city: searchParams?.get("city") ?? initialCity,
        price: searchParams?.get("price") ?? initialPrice,
        avail: searchParams?.get("avail") ?? initialAvail,
      };
      const next: UrlParams = { ...current, ...updates };
      const filterOrSortKeys: (keyof UrlParams)[] = [
        "query",
        "sort",
        "city",
        "price",
        "avail",
      ];
      const didFilterOrSortChange = filterOrSortKeys.some(
        (k) => updates[k] !== undefined
      );
      if (didFilterOrSortChange) next.page = 0;

      const params = new URLSearchParams();
      if (next.query?.trim()) params.set("query", next.query);
      if (next.city !== "all") params.set("city", next.city);
      if (next.price !== "200-2000") params.set("price", next.price);
      if (next.avail !== "all") params.set("avail", next.avail);
      if (next.sort !== SORT_NEWEST) params.set("sort", next.sort);
      if (next.page > 0) params.set("page", String(next.page));

      const queryString = params.toString();
      router.replace(
        queryString ? `${pathname}?${queryString}` : pathname,
        { scroll: false }
      );
      setPropertiesListFilters(next);
    },
    [
      searchParams,
      router,
      pathname,
      initialQuery,
      initialSort,
      initialPage,
      initialCity,
      initialPrice,
      initialAvail,
      setPropertiesListFilters,
    ]
  );

  // Initialize from localStorage only on client
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedStyle = localStorage.getItem(LOCAL_STORAGE_PROPERTY_VIEW);
      if (savedStyle && (savedStyle === GRID || savedStyle === LIST)) {
        setListStyle(savedStyle);
      }
    } catch (error) {
      console.warn("Failed to read from localStorage:", error);
    }
  }, []);

  // One-time: if URL is empty but store has filters, push store to URL
  const hasSyncedStoreRef = useRef(false);
  useEffect(() => {
    if (!isMounted || !searchParams || hasSyncedStoreRef.current) return;
    const hasURLParams = searchParams.toString().length > 0;
    const hasStoreFilters =
      propertiesListFilters.query ||
      propertiesListFilters.city !== "all" ||
      propertiesListFilters.price !== "200-2000" ||
      propertiesListFilters.avail !== "all" ||
      propertiesListFilters.sort !== SORT_NEWEST ||
      (propertiesListFilters.page ?? 0) > 0;
    if (!hasURLParams && hasStoreFilters) {
      hasSyncedStoreRef.current = true;
      const next: UrlParams = {
        query: propertiesListFilters.query ?? initialQuery,
        sort: propertiesListFilters.sort ?? initialSort,
        page: Math.max(0, propertiesListFilters.page ?? initialPage),
        city: propertiesListFilters.city ?? initialCity,
        price: propertiesListFilters.price ?? initialPrice,
        avail: propertiesListFilters.avail ?? initialAvail,
      };
      const params = new URLSearchParams();
      if (next.query?.trim()) params.set("query", next.query);
      if (next.city !== "all") params.set("city", next.city);
      if (next.price !== "200-2000") params.set("price", next.price);
      if (next.avail !== "all") params.set("avail", next.avail);
      if (next.sort !== SORT_NEWEST) params.set("sort", next.sort);
      if (next.page > 0) params.set("page", String(next.page));
      const queryString = params.toString();
      if (queryString) {
        router.replace(`${pathname}?${queryString}`, { scroll: false });
      }
    }
  }, [
    isMounted,
    searchParams,
    pathname,
    router,
    propertiesListFilters,
    initialQuery,
    initialSort,
    initialPage,
    initialCity,
    initialPrice,
    initialAvail,
  ]);

  const toggleView = () => {
    const newView = listStyle === GRID ? LIST : GRID;
    setListStyle(newView);
    localStorage.setItem(LOCAL_STORAGE_PROPERTY_VIEW, newView);
  };

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
  const pageCount = Math.ceil(sorted.length / pageLimit);

  // If filters reduce results, clamp page so we don't show an empty page
  useEffect(() => {
    if (!isMounted) return;
    const maxPage = Math.max(0, pageCount - 1);
    if (currentPage > maxPage) {
      updateUrlParams({ page: maxPage });
    }
  }, [isMounted, currentPage, pageCount, updateUrlParams]);

  const handlePageClick = (event: { selected: number }) => {
    updateUrlParams({ page: event.selected });
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
                setQuery={(v: string) => updateUrlParams({ query: v })}
                cityFilter={cityFilter}
                setCityFilter={(v: string) => updateUrlParams({ city: v })}
                priceFilter={priceFilter}
                setPriceFilter={(v: string) => updateUrlParams({ price: v })}
                availFilter={availFilter}
                setAvailFilter={(v: string) => updateUrlParams({ avail: v })}
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
                onChange={(e) => updateUrlParams({ sort: e.target.value })}
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
