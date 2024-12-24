import React from "react";
import Clarity from "@/components/functional/tracking/Clarity";
import GoogleAnalytics from "@/components/functional/tracking/GoogleAnalytics";

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
