"use client";

import React, { useEffect, useState } from "react";
import { EUROPEAN_COUNTRIES } from "@/utils/countries";
import useTranslation from "next-translate/useTranslation";
import Search from "../Search";

const Prefix = (props: any) => {
  const { value, onChange } = props;
  const { t } = useTranslation("translations");

  const PHONE_CODES = EUROPEAN_COUNTRIES.map((c) => c.phoneCode);
  const [options, setOptions] = useState(PHONE_CODES);

  return (
    <>
      <button
        style={{
          color: "white",
          backgroundColor: "#ff914d",
        }}
        className="btn btn-outline-secondary btn-sm dropdown-toggle phone-prefix"
        type="button"
        data-bs-toggle="dropdown" // Bootstrap handles dropdown toggle
        aria-expanded="false"
      >
        {value || t("common.code")}
      </button>
      <ul
        className="dropdown-menu phone-prefix-dropdown"
        aria-labelledby="dropdownMenuButton"
      >
        <Search options={PHONE_CODES} setOptions={setOptions} />
        {options.map((c, i) => {
          return (
            <li onClick={() => onChange(c)} className="dropdown-item" key={i}>
              {c}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Prefix;
