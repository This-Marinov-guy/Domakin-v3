"use client";

import FilterTwo from "@/components/search-dropdown/inner-dropdown/FilterTwo";
import ReactPaginate from "react-paginate";
import useTranslation from "next-translate/useTranslation";
import { GRID, LIST } from "@/utils/defines";
import { useEffect, useRef, useState } from "react";
import { LOCAL_STORAGE_PROPERTY_VIEW } from "@/utils/localstorage";
import PropertyCardGrid from "@/components/ui/cards/properties/PropertyCardGrid";
import PropertyCardList from "@/components/ui/cards/properties/PropertyCardList";

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

  const [filterProperties, setFilterProperties] = useState(properties);
  const [paginatedProperties, setPaginatedProperties] = useState(
    properties.slice(offset, endOffset)
  );

  const pageCount = Math.ceil(filterProperties.length / pageLimit);
  const [query, setQuery] = useState("");
  const keys = ["title", "location", "city"];

  useEffect(() => {
    const newData = properties.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(query))
    );

    //reset current page as results will be minimal
    setFilterProperties(newData);
    setOffset(0);
    setCurrentPage(0);
  }, [lang, query]);

  useEffect(() => {
    setPaginatedProperties(filterProperties.slice(offset, endOffset));
  }, [filterProperties, offset, endOffset]);

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
                setQuery={setQuery}
              />
            </div>
          </div>
        )}

        <div className="listing-header-filter d-sm-flex justify-content-between align-items-center mb-40 lg-mb-30">
          <div
            dangerouslySetInnerHTML={{
              __html: t("filter.showing", {
                start: offset + 1,
                end: offset + paginatedProperties.length,
                total: filterProperties.length,
              }),
            }}
          />
          <div className="d-flex align-items-center xs-mt-20">
            <div className="short-filter d-flex align-items-center">
              <div className="fs-16 me-2">{t('filter.sort')}:</div>
              {/* <NiceSelect
                className="nice-select"
                options={[
                  { value: "newest", text: "Newest" },
                  { value: "best_seller", text: "Best Seller" },
                  { value: "best_match", text: "Best Match" },
                  { value: "price_low", text: "Price Low" },
                  { value: "price_high", text: "Price High" },
                ]}
                defaultCurrent={0}
                properties={properties}
                setFilterProperties={setFilterProperties}
                name=""
                placeholder=""
              /> */}
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
          {paginatedProperties.map((property: any) =>
            listStyle === LIST ? (
              <PropertyCardList property={property} />
            ) : (
              <PropertyCardGrid property={property} />
            )
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
