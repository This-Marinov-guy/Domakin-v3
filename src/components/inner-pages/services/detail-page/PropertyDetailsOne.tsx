import React from "react";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FancyBanner from "@/components/common/FancyBanner";
import ListingDetailsOne from "@/components/ListingDetails/listing-details-1";
import RentingForm from "@/components/forms/RentingForm";

const PropertyDetailsOne = () => {
  return (
    <>
      <HeaderOne />
      <ListingDetailsOne />
      <RentingForm />
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default PropertyDetailsOne;
