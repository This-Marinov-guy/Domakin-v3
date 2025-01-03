import React from "react";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FancyBanner from "@/components/common/FancyBanner";
import RentingForm from "@/components/forms/RentingForm";
import ListingDetailsOneArea from "@/components/ListingDetails/listing-details-1/ListingDetailsOneArea";
import PageLoader from "@/components/ui/loading/PageLoader";
import { useStore } from "@/stores/storeContext";
import useTranslation from "next-translate/useTranslation";
import { useParams } from "next/navigation";
import { observer } from "mobx-react-lite";
import RelatedProperties from "@/components/ListingDetails/listing-details-1/RelatedProperties";

const PropertyDetailsOne = () => {
  const {
    propertyStore: { propertiesLoading },
  } = useStore();

  const { t } = useTranslation("translations");

  const { slug } = useParams();

  const forRentList: any[] = t("FOR_RENT", {}, { returnObjects: true }) ?? [];
  
  const property = forRentList.find((p: any) => p.id == slug);

  const relatedProperties = forRentList
    .filter((p) => p.city == property.city && p.id != property.id)
    .slice(0, 3);

  if (propertiesLoading || !property.id) {
    return <PageLoader />;
  }

  return (
    <>
      <HeaderOne />
      <ListingDetailsOneArea property={property} />
      <RentingForm />
      <RelatedProperties properties={relatedProperties} />
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default observer(PropertyDetailsOne);
