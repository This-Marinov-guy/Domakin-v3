import React, { useRef } from "react";
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
import ScreenButton from "@/components/ui/buttons/ScreenButton";

const PropertyDetailsOne = () => {
  const {
    propertyStore: { propertiesLoading, properties },
  } = useStore();

  const { t } = useTranslation("translations");

  const formRef = useRef(null);

  const { slug } = useParams();

  const forRentList: any[] = t("FOR_RENT", {}, { returnObjects: true }) ?? [];
  const allProperties = [...properties, ...forRentList];

  // Extract property ID from slug (format: id-location-title)
  const extractPropertyId = (slug: string): string | null => {
    const parts = slug.split('-');
    const id = parts[0];
    
    if (/^\d+$/.test(id)) {
      return id;
    }
    
    return null;
  };

  const propertyId = extractPropertyId(slug as string);
  const property = propertyId ? allProperties.find((p: any) => p?.id?.toString() === propertyId) : null;

  const relatedProperties = allProperties
    .filter((p) => p.city == property?.city && p.id != property?.id)
    .slice(0, 3);

  if (propertiesLoading || !property?.id) {
    return <PageLoader />;
  }

  return (
    <>
      <HeaderOne />
      {property.statusCode !== 3 && <ScreenButton refElement={formRef} />}
      <ListingDetailsOneArea property={property} slug={propertyId} />
      <RentingForm refElement={formRef} property={property} />
      <RelatedProperties properties={relatedProperties} />
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default observer(PropertyDetailsOne);
