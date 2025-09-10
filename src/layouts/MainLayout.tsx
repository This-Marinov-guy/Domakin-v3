import React, { useEffect } from "react";
import axios from "axios";
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
import { useRouter } from "next/router";
import RouteLoader from "@/components/ui/loading/RouteLoader";

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

const MainLayout = ({ children }: any) => {
  const { sendRequest } = useServer();

  const { t, lang } = useTranslation();

  const router = useRouter();

  const {
    commonStore: { toggleFeedbackLoading, setFeedbacks, feedbacks },
    blogStore: { toggleBlogLoading, setBlogPosts, posts },
    propertyStore: { setListingLoading, setProperties, setReferralCode, properties },
    userStore: { login, refreshSession, user },
    serviceStore,
  } = useStore();

  const loadFeedback = async () => {
    toggleFeedbackLoading();

    const responseData = await sendRequest(
      "/feedback/list",
      "GET",
      {},
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
    setListingLoading(true);

    try {
      const response = await sendRequest(
        "/property/listing",
        "GET",
        {},
        {},
        {
          withError: false,
          withLoading: true,
        }
      );

      if (response?.status) {
        setProperties(response.data);
      }
    } catch (error) {
      console.error("Error loading listing:", error);
    }

    setListingLoading(false);
  };

  const fetchLanguage = async () => {
    let locale = window.location.pathname.split("/")[1];
    let storedLanguage = LANGUAGES.includes(locale) ? locale : null;

    if (storedLanguage) {
      localStorage.setItem("language", locale);
      axios.defaults.headers.common["Accept-Language"] = lang || "en";
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
      axios.defaults.headers.common["Accept-Language"] = lang || "en";
      await setLanguage(storedLanguage);
    }
  };

  const loadBlog = async () => {
    toggleBlogLoading();

    try {
      const responseData = await sendRequest(
        "/blog/posts",
        "GET",
        {},
        {},
        {
          withError: true, // Enable error handling
          withLoading: false,
        }
      );

      if (responseData?.status) {
        setBlogPosts(responseData.data);
      } else {
        // Set empty array in case of error
        setBlogPosts([]);
      }
    } catch (error) {
      // Set empty array in case of exception
      setBlogPosts([]);
    } finally {
      toggleBlogLoading();
    }
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
    fetchLanguage();
    
    // Check if data hasn't been loaded through SSR
    if (!posts || posts.length === 0) {
      loadBlog();
    }
  }, []);

  // Language dependent data loading
  useEffect(() => {
    // Check if data hasn't been loaded through SSR before fetching
    if (!feedbacks || feedbacks.length === 0) {
      loadFeedback();
    }
    
    if (!properties || properties.length === 0) {
      loadProperties();
    }
  }, [lang]);

  useEffect(() => {
    if (router.query.ref) {
      serviceStore.setReferralCode(router.query.ref as string);
      setReferralCode(router.query.ref as string);
    }
  }, [router.query.ref]);

  return (
    <ErrorLayout>
      <StoreProvider>
        <TrackingLayout>
          <RouteLoader />
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
