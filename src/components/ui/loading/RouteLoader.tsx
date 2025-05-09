import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function RouteLoader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) => {
      // Avoid triggering loader for hash changes
      if (url !== router.asPath) {
        setLoading(true);
      }
    };
    const handleComplete = (url: string) => {
      if (url === router.asPath) {
        setLoading(false);
      }
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
    router.events.on("hashChangeStart", handleStart);
    router.events.on("hashChangeComplete", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
      router.events.off("hashChangeStart", handleStart);
      router.events.off("hashChangeComplete", handleComplete);
    };
  }, [router.events, router.asPath]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 z-50 animate-pulse">
      {/* Customize loader style or replace with spinner */}
    </div>
  );
}
