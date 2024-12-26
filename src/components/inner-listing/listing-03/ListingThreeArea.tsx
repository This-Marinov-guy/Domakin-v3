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

const ListingThreeArea = ({ style }: any) => {
  const { t, lang } = useTranslation("translations");

  const [listStyle, setListStyle] = useState(GRID);

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

  const forRentList: any[] = t("FOR_RENT", {}, { returnObjects: true }) ?? [];

  const properties = forRentList.filter(
    (p: any) => p.hidden == false || p.hidden === undefined
  );

  const startRef = useRef<HTMLDivElement>(null);

  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const pageLimit = 6;
  const endOffset = offset + pageLimit;

  const [sortIndex, setSortIndex] = useState(SORT_NEWEST);
  const [filterProperties, setFilterProperties] = useState(properties);
  const [paginatedProperties, setPaginatedProperties] = useState(
    properties.slice(offset, endOffset)
  );

  const pageCount = Math.ceil(filterProperties.length / pageLimit);

  const [query, setQuery] = useState("");
  const keys = ["title", "location", "city"];

  const handleSort = (values: any[], sorting: string) => {
    switch (sorting) {
      case SORT_NEWEST:
        return values.sort((a: any, b: any) => b.id - a.id);
      case SORT_OLDEST:
        return values.sort((a: any, b: any) => a.id - b.id);
      case SORT_PRICE_LOW:
        return values.sort((a: any, b: any) => a.price - b.price);
      case SORT_PRICE_HIGH:
        return values.sort((a: any, b: any) => b.price - a.price);
      default:
        return values;
    }
  };

  useEffect(() => {
    const newData = properties.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(query))
    );

    setFilterProperties(newData);
    setOffset(0);
    setCurrentPage(0);
  }, [lang, query]);

  useEffect(() => {
    setPaginatedProperties(
      handleSort(filterProperties.slice(offset, endOffset), sortIndex)
    );
  }, [filterProperties, offset, endOffset, sortIndex]);

  useEffect(() => {
    const newPaginatedProperties = forRentList.filter((item1) =>
      filterProperties.some((item2) => item2.id === item1.id)
    );
    setPaginatedProperties(newPaginatedProperties.slice(offset, endOffset));
  }, [lang]);

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * pageLimit) % filterProperties.length;
    setOffset(newOffset);
    setCurrentPage(event.selected);
    startRef.current!.scrollIntoView();
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
                setFilterProperties={setFilterProperties}
                query={query}
                setQuery={setQuery}
              />
            </div>
          </div>
        )}

        <div className="listing-header-filter d-sm-flex justify-content-between align-items-center mb-40 lg-mb-30">
          <div
            dangerouslySetInnerHTML={{
              __html: t("filter.showing", {
                start: paginatedProperties.length ? offset + 1 : 0,
                end: offset + paginatedProperties.length,
                total: filterProperties.length,
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
                defaultCurrent={0}
                onChange={(e) => {
                  const index = e.target.value;

                  setSortIndex(index);
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
            paginatedProperties.map((property: any) =>
              listStyle === LIST ? (
                <PropertyCardList property={property} />
              ) : (
                <PropertyCardGrid property={property} />
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

export default ListingThreeArea;
