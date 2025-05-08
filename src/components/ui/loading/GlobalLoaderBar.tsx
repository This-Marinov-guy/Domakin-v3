import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function GlobalLoaderBar() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleStart = (url: string) => setLoading(true);
    const handleComplete = (url: string) => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
  }, []);

  return loading && <div className="page-loader-bar" />;
}
