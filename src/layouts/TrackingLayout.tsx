import Clarity from "@/components/functional/tracking/Clarity";
import GoogleAnalytics from "@/components/functional/tracking/GoogleAnalytics";
import CookiesModal from "@/components/ui/modals/CookiesModal";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const TrackingLayout = ({ children }: any) => {
  useEffect(() => {    
    toast(<CookiesModal/>, {
      position: "bottom-right",
      autoClose: false,
      hideProgressBar: false,
      closeButton: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  }, []);

  return (
    <>
      {children}
      <GoogleAnalytics />
      <Clarity />
    </>
  );
};

export default TrackingLayout;
