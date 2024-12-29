import React, { useEffect } from "react";
import TrackingLayout from "./TrackingLayout";
import { ToastContainer } from "react-toastify";
import { animationCreate } from "@/utils/utils";
import ScrollToTop from "@/components/common/ScrollToTop";
import { StoreProvider, useStore } from "@/stores/storeContext";
import ModalsLayout from "./ModalsLayout";
import { useServer } from "@/hooks/useServer";
import useTranslation from "next-translate/useTranslation";

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

const MainLayout = ({ children }: any) => {
  const { sendRequest } = useServer();

  const { t, lang } = useTranslation();

  const {
    commonStore: { toggleFeedbackLoading, setFeedbacks },
    propertyStore: { togglePropertiesLoading, setProperties },
  } = useStore();

  const loadFeedback = async () => {
    toggleFeedbackLoading();

    const responseData = await sendRequest(
      "/feedback/list",
      "GET",
      {
        language: lang,
      },
      {},
      {
        withError: false,
        withLoading: false,
      }
    );

    if (responseData?.status) {
      setFeedbacks(responseData.data);
    }

    toggleFeedbackLoading();
  };

  const loadProperties = async () => {
    // togglePropertiesLoading();

    // const forRentList: any[] = t("FOR_RENT", {}, { returnObjects: true }) ?? [];
    
    // const properties = forRentList.filter(
    //   (p: any) => p.hidden == false || p.hidden === undefined
    // );

    // setProperties(properties);

    // togglePropertiesLoading();
  };

  useEffect(() => {
    // animation
    const timer = setTimeout(() => {
      animationCreate();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadProperties();
    loadFeedback();
  }, []);

  return (
    <StoreProvider>
      <TrackingLayout>
        {children}
        <ModalsLayout />
        <ScrollToTop />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />{" "}
      </TrackingLayout>
    </StoreProvider>
  );
};

export default MainLayout;
