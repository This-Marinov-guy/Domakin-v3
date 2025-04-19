import React, { useEffect } from "react";
import TrackingLayout from "./TrackingLayout";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "@/components/common/ScrollToTop";
import { StoreProvider, useStore } from "@/stores/storeContext";
import ModalsLayout from "./ModalsLayout";
import { useServer } from "@/hooks/useServer";
import useTranslation from "next-translate/useTranslation";
import { getGeoInfo } from "@/utils/helpers";
import setLanguage from "next-translate/setLanguage";
import { LANGUAGES } from "@/utils/defines";
import supabase from "@/utils/supabase";
import ErrorLayout from "@/pages/_error";
import { SESSION_REFRESH_INTERVAL } from "@/utils/config";

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

const MainLayout = ({ children }: any) => {
  const { sendRequest } = useServer();

  const { t, lang } = useTranslation();

  const {
    commonStore: { toggleFeedbackLoading, setFeedbacks },
    blogStore: { toggleBlogLoading, setBlogPosts },
    propertyStore: { togglePropertiesLoading, setProperties },
    userStore: { login, refreshSession, user },
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

  const fetchLanguage = async () => {
    let locale = window.location.pathname.split("/")[1];
    let storedLanguage = LANGUAGES.includes(locale) ? locale : null;

    if (storedLanguage) {
      localStorage.setItem("language", locale);
      return await setLanguage(storedLanguage);
    }

    if (localStorage.getItem("language")) {
      storedLanguage = localStorage.getItem("language");
    } else {
      const geoLocation = await getGeoInfo();

      if (geoLocation) {
        const country = geoLocation.country.toLowerCase();

        if (LANGUAGES.includes(country)) {
          storedLanguage = country;
          localStorage.setItem("language", country);
        }
      }
    }

    if (storedLanguage) {
      await setLanguage(storedLanguage);
    }
  };

  const loadBlog = async () => {
    toggleBlogLoading();

    const responseData = await sendRequest(
      "/blog/posts",
      "GET",
      {},
      {},
      {
        withError: false,
        withLoading: false,
      }
    );

    if (responseData?.status) {
      setBlogPosts(responseData.data);
    }

    toggleBlogLoading();
  };

  const loadUser = async () => {
    try {
      await login();

      setInterval(async () => {
        await refreshSession();
      }, SESSION_REFRESH_INTERVAL);
    } catch (error) {}
  };

  useEffect(() => {
    loadUser();
    loadProperties();
    loadFeedback();
    loadBlog();
    fetchLanguage();
  }, []);

  return (
    <ErrorLayout>
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
    </ErrorLayout>
  );
};

export default MainLayout;
