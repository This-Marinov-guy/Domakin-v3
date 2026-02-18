import React, { useEffect, useState } from "react";
import NiceSelect from "@/ui/NiceSelect";
import { capitalizeFirstLetter } from "@/utils/helpers";
import useTranslation from "next-translate/useTranslation";
import RangesSelect from "@/ui/RangesSelect";
import SearchQuery from "@/components/ui/inputs/SearchQuery";

const FilterTwo = ({ properties, query, setQuery, cityFilter, setCityFilter, priceFilter, setPriceFilter, availFilter, setAvailFilter }: any) => {
  const min = 200;
  const max = 2000;

  const { t } = useTranslation("translations");

  const [draftPriceFilter, setDraftPriceFilter] = useState<string>(priceFilter);
  useEffect(() => {
    setDraftPriceFilter(priceFilter);
  }, [priceFilter]);

  // Auto-apply price filter after debounce so the UI updates immediately
  useEffect(() => {
    if (draftPriceFilter === priceFilter) return;
    const timer = setTimeout(() => {
      setPriceFilter(draftPriceFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [draftPriceFilter, priceFilter, setPriceFilter]);

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
                defaultCurrent={Math.max(0, locations.indexOf(cityFilter))}
                onChange={(e) => {
                  setCityFilter(e.target.value.toLowerCase());
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
                  ...statusKeys.map((key: string, i: number) => ({
                    value: String(i + 1),
                    text: statusCodeMapping[key],
                  })),
                ]}
                defaultCurrent={(() => {
                  if (availFilter === 'all') return 0;
                  const idx = statusKeys.findIndex((key: string, i: number) => String(i + 1) === availFilter);
                  return idx >= 0 ? idx + 1 : 0;
                })()}
                onChange={(e) => {
                  setAvailFilter(e.target.value);
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
                values={draftPriceFilter.split('-').map(Number)}
                onChange={(values: number[]) => setDraftPriceFilter(values.join('-'))}
                min={min}
                max={max}
                symbol="€"
              />
            </div>
          </div>
          <div className="col-xl-3">
            <div className="input-box-one lg-mt-20">
              <div className="d-flex align-items-center">
                <SearchQuery query={query} setQuery={setQuery} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default FilterTwo;
