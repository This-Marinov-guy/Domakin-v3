"use client";

import React, { useEffect, useState } from "react";
import { EUROPEAN_COUNTRIES } from "@/utils/countries";
import { getGeoLocation } from "@/utils/helpers";
import { LOCAL_STORAGE_LOCATION } from "@/utils/localstorage";

const Prefix = () => {
  return (
    <>
      <button
        style={{
          color: "white",
          backgroundColor: "#ff914d",
        }}
        className="btn btn-outline-secondary btn-sm dropdown-toggle phone-prefix"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        data-bs-auto-close="outside"
      >
        Code
      </button>
      <ul className="dropdown-menu phone-prefix-dropdown">
        {/* Add searchbar */}
        {EUROPEAN_COUNTRIES.map((c, i) => {
          return (
            <li key={i}>
              <a className="dropdown-item" href="#">
                {c.phoneCode}
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Prefix;
