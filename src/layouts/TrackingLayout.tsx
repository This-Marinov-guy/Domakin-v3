import Clarity from "@/components/functional/tracking/Clarity";
import GoogleAnalytics from "@/components/functional/tracking/GoogleAnalytics";
import React from "react";

const TrackingLayout = ({ children }: any) => {
  return (
    <>
      {children}
      <GoogleAnalytics />
      <Clarity />
    </>
  );
};

export default TrackingLayout;
