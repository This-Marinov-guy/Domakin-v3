import PropertyCardGrid from "@/components/ui/cards/properties/PropertyCardGrid";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const RelatedProperties = ({ properties }: any) => {
  const { t } = useTranslation("translations");

  return (
    <div className="listing-details-one theme-details-one bg-pink pt-40 pb-40">
      <div className="container">
        <div className="property-feature-list bg-white shadow4 border-20 p-40 mt-20 mb-60">
          <h4 className="sub-title-one mb-40 lg-mb-20">
            {t("property.related_properties")}
          </h4>
          <div className="row gx-xxl-5">
            {properties?.length > 0 ? (
              properties.map((property: any, index: number) => (
                <PropertyCardGrid key={index} property={property} />
              ))
            ) : (
              <h6 className="text-center d-flex flex-column">
                <i className="fa-solid fa-people-robbery mb-10 fs-1"></i>
                {t("property.no_related_properties_found")}
              </h6>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProperties;
