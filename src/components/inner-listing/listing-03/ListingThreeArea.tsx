"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { SORT_NEWEST } from "@/utils/enum";

// Dynamically import the client component with SSR disabled
const ListingThreeAreaClient = dynamic(
  () => import("./ListingThreeAreaClient"),
  {
    ssr: false,
    loading: () => null, // Don't show loading component to prevent hydration mismatch
  }
);

interface ListingThreeAreaProps {
  style?: boolean;
  properties?: any[];
}

const ListingThreeArea = ({ style, properties = [] }: ListingThreeAreaProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return empty div with same structure on server to prevent hydration mismatch
  if (!isClient) {
    return (
      <div
        className={`property-listing-six pb-170 xl-pb-120 ${
          style ? "pt-80 xl-pt-60" : "pt-80 md-pt-40 mt-80 xl-mt-60 bg-pink-two"
        }`}
        style={{ minHeight: '800px' }}
      >
        <div className="container"></div>
      </div>
    );
  }

  return (
    <ListingThreeAreaClient
      style={style}
      properties={properties}
      initialQuery=""
      initialSort={SORT_NEWEST}
      initialPage={0}
      initialCity="all"
      initialPrice="200-2000"
      initialAvail="all"
    />
  );
};

export default ListingThreeArea;
