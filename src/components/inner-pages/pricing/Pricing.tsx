import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import React from "react";
import PricingAreaThree from "./pricing-three/PricingAreaThree";
import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne";
import useTranslation from "next-translate/useTranslation";

const Pricing = () => {
  const { t } = useTranslation("translations");
  
  return (
    <>
      <HeaderOne style={true} />
      <BreadcrumbOne
        title={t("pricing.pricing")}
        sub_title={t("pricing.pricing")}
      />
      <PricingAreaThree />
      <FooterFour />
    </>
  );
};

export default Pricing;
