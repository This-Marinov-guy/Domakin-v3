import React from "react";
import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FancyBanner from "@/components/common/FancyBanner";
import StepDescriptionOne from "@/components/common/StepDescriptionOne";
import useTranslation from "next-translate/useTranslation";
import AddListingForm from "@/components/forms/AddListingForm";
import ListingThreeArea from "@/components/inner-listing/listing-03/ListingThreeArea";

const PropertiesPage = () => {
  const { t } = useTranslation("translations");

  const details = {
    title: t("renting.find_the_perfect_place_for_you"),
    description: [t("renting.platform_description")],
    steps: [
      {
        icon: "fa-solid fa-magnifying-glass-location",
        text: t("renting.step_1"),
      },
      {
        icon: "fa-solid fa-user",
        text: t("renting.step_2"),
      },
      {
        icon: "fa-regular fa-clock",
        text: t("renting.step_3"),
      },
      {
        icon: "fa-regular fa-handshake",
        text: t("renting.step_4"),
      },
    ],
  };

  return (
    <>
      <HeaderOne />
      <BreadcrumbThree
        title={t("renting.renting_accommodations")}
        link_title={t("renting.renting")}
        style={false}
      />
      <StepDescriptionOne details={details} />
      <ListingThreeArea />
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default PropertiesPage;