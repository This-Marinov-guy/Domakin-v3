import React, { useEffect, useState } from "react";
import NiceSelect from "@/ui/NiceSelect";
import { capitalizeFirstLetter } from "@/utils/helpers";
import useTranslation from "next-translate/useTranslation";
import RangesSelect from "@/ui/RangesSelect";
import SearchQuery from "@/components/ui/inputs/SearchQuery";

const FilterTwo = ({ properties, setFilterProperties, query, setQuery }: any) => {
  const min = 200;
  const max = 2000;

  const { t } = useTranslation("translations");

  const initValue = {
    text: t("filter.all"),
    value: 'all',
  }

  const statusCodeMapping: Record<string, string> =
    t("statusCodeMapping", {}, { returnObjects: true }) ?? {};
  const statusKeys: any = Object.keys(statusCodeMapping);

  const locationsList = Object.keys(
    t("locations", {}, { returnObjects: true }) ?? {}
  ).map((key) => key.toLowerCase());
  const locations = ['all', ...locationsList];

  const [priceFilter, setPriceFilter] = useState([min, max]);
  const [cityFilter, setCityFilter] = useState(locations);
  const [availFilter, setAvailFilter] = useState(['all']);

  useEffect(() => {
    let data = properties;

    data = data.filter(
      (item: any) =>
        item.price >= priceFilter[0] && item.price <= priceFilter[1]
    );

    setFilterProperties(data);
  }, [priceFilter]);

  useEffect(() => {
    let data = properties;

    if (!cityFilter.includes('all')) {
      data = data.filter((item: any) =>
        cityFilter.includes(item?.city?.toLowerCase())
      );
    }

    setFilterProperties(data);
  }, [cityFilter]);

  useEffect(() => {
    let data = properties;

    if (!availFilter.includes('all')) {
      data = data.filter((item: any) => {
        return availFilter.map(Number).includes(Number(item.statusCode));
      });
    }

    setFilterProperties(data);
  }, [availFilter]);

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="row gx-0 align-items-center">
          <div className="col-xl-3 col-lg-4">
            <div className="input-box-one border-left">
              <div className="label">{t("filter.property_location")}</div>
              <NiceSelect
                className="nice-select"
                options={locations.map((location) => {
                  return {
                    value: location,
                    text: location === 'all' ? t('filter.all') : capitalizeFirstLetter(location),
                  };
                })}
                defaultCurrent={0}
                onChange={(e) => {
                  const city = e.target.value.toLowerCase();
                  if (city === 'all') {
                    setCityFilter(locations);
                  } else {
                    setCityFilter([city]);
                  }
                }}
                name=""
                placeholder=""
              />
            </div>
          </div>
          <div className="col-xl-3 col-lg-4">
            <div className="input-box-one border-left">
              <div className="label">{t("filter.availability")}</div>
              <NiceSelect
                className="nice-select"
                options={[
                  { value: 'all', text: t('filter.all') },
                  ...statusKeys.map((key: string, index: number) => ({
                    value: index + 1,
                    text: statusCodeMapping[key],
                  })),
                ]}
                defaultCurrent={0}
                onChange={(e) => {
                  const value = e.target.value;

                  console.log(value);
                  
                  if (value === 'all') {
                    setAvailFilter(['all']);
                  } else {
                    setAvailFilter([value]);
                  }
                }}
                name=""
                placeholder=""
              />
            </div>
          </div>
          <div className="col-xl-3 col-lg-4">
            <div className="input-box-one border-left border-lg-0">
              <div className="label">{t("filter.filter_by_price")}</div>
              <RangesSelect
                values={priceFilter}
                onChange={setPriceFilter}
                min={min}
                max={max}
                symbol="€"
              />
            </div>
          </div>
          <div className="col-xl-3">
            <div className="input-box-one lg-mt-20">
              <div className="d-flex align-items-center">
                {/* <Link
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#advanceFilterModal"
                  className="search-modal-btn sm tran3s text-uppercase fw-500 d-inline-flex align-items-center me-3"
                >
                  <i className="fa-light fa-sliders-up"></i>
                </Link> */}
                <SearchQuery query={query} setQuery={setQuery} />
              </div>
            </div>
          </div>
        </div>
      </form>
      {/* <ListingDropdownModal
            handleSearchChange={handleSearchChange}
            handleBedroomChange={handleBedroomChange}
            handleBathroomChange={handleBathroomChange}
            handlePriceChange={handlePriceChange}
            maxPrice={maxPrice}
            priceValue={priceValue}
            handleResetFilter={handleResetFilter}
            selectedAmenities={selectedAmenities}
            handleAmenityChange={handleAmenityChange}
            handleLocationChange={handleLocationChange}
            handleStatusChange={handleStatusChange}
         /> */}
    </>
  );
};

export default FilterTwo;
