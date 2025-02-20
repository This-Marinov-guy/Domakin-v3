"use client";

import { logoByTheme } from "@/utils/config";
import Image from "next/image";
import React from "react";

const PageLoader = () => {
  return (
    <div className="page-loader">
      <div className="loading-div">
        <Image src={logoByTheme()} alt="logo" />
        <h4>Loading...</h4>
      </div>
    </div>
  );
};

export default PageLoader;
