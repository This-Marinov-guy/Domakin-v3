import React from "react";
import { toJS } from "mobx";
import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FancyBanner from "@/components/common/FancyBanner";
import StepDescriptionOne from "@/components/common/StepDescriptionOne";
import useTranslation from "next-translate/useTranslation";
import AddListingForm from "@/components/forms/AddListingForm";
import ListingThreeArea from "@/components/inner-listing/listing-03/ListingThreeArea";
import { useStore } from "@/stores/storeContext";
import PageLoader from "@/components/ui/loading/PageLoader";
import { observer } from "mobx-react-lite";

const PropertiesPage = () => {
  const { t } = useTranslation("translations");

  const { propertyStore } = useStore();

  const details = {
    title: t("renting.find_the_perfect_place_for_you"),
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

  const forRentList: any[] = t("FOR_RENT", {}, { returnObjects: true }) ?? [];
  const allProperties = [...propertyStore.properties, ...forRentList];

  if (propertyStore.propertiesLoading || !allProperties) {
    return <PageLoader />;
  }

  return (
    <>
      <HeaderOne />
      <BreadcrumbThree
        title={t("features.rent_an_apartment")}
        link_title={t("renting.renting")}
        style={false}
      />
      <StepDescriptionOne details={details} />
      <ListingThreeArea properties={allProperties} />
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default observer(PropertiesPage);
