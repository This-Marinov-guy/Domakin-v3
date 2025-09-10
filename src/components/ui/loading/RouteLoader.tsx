import React, { useState, useEffect } from "react";
import Router from "next/router";
import { useStore } from "@/stores/storeContext";

export default function RouteLoader() {
  const [loading, setLoading] = useState(false);
  const { blogStore } = useStore();

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      setLoading(true);
      
      // Reset any loading states when navigating to avoid conflicts
      if (url.includes('/blog')) {
        // If navigating to blog, don't reset the loading state as the blog page will handle it
      } else {
        // For other pages, make sure blog loading is reset
        blogStore.loading = false;
      }
    };

    const handleRouteChangeComplete = () => {
      setLoading(false);
    };

    const handleRouteChangeError = () => {
      setLoading(false);
    };

    Router.events.on("routeChangeStart", handleRouteChangeStart);
    Router.events.on("routeChangeComplete", handleRouteChangeComplete);
    Router.events.on("routeChangeError", handleRouteChangeError);
    
    return () => {
      Router.events.off("routeChangeStart", handleRouteChangeStart);
      Router.events.off("routeChangeComplete", handleRouteChangeComplete);
      Router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, [blogStore]);

  return loading && <div className="page-loader-bar" />;
}
