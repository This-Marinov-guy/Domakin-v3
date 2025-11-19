"use client";

import React from "react";
import Snowfall from "react-snowfall";
import { THEME, WINTER } from "@/utils/config";

const SnowBackground = () => {
  if (THEME !== WINTER) {
    return;
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "absolute",
        zIndex: "1",
      }}
    >
      <Snowfall snowflakeCount={1000} />
    </div>
  );
};

export default SnowBackground;
