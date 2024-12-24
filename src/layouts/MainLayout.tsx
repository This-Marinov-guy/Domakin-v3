import React, { useEffect } from "react";
import TrackingLayout from "./TrackingLayout";
import { ToastContainer } from "react-toastify";
import { animationCreate } from "@/utils/utils";
import ScrollToTop from "@/components/common/ScrollToTop";
import { StoreProvider } from "@/stores/storeContext";
import ModalsLayout from "./ModalsLayout";

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

const MainLayout = ({ children }: any) => {
  useEffect(() => {
    // animation
    const timer = setTimeout(() => {
      animationCreate();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <StoreProvider>
      <TrackingLayout>
        {children}
        <ModalsLayout/>
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
