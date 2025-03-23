"use client";

import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { EUROPEAN_COUNTRIES } from "@/utils/countries";
import { getGeoLocation } from "@/utils/helpers";
import { LOCAL_STORAGE_LOCATION } from "@/utils/localstorage";
import Prefix from "./Prefix";

const PrefixPhoneInput = (props: any) => {
  const { className, style, value = "", onChange, isInvalid } = props;

  const [selectedCode, setSelectedCode] = useState("");
  const [mainPart, setMainPart] = useState("");

  // Split initial value when component mounts
  useEffect(() => {
    if (value) {      
      const parts = value.split(" ");
      setSelectedCode(parts[0] || ""); // First part as prefix
      setMainPart(parts.slice(1).join(" ") || ""); // Rest as number
    }
  }, [value]);

  // Set default country code from geolocation
  useEffect(() => {
    if (!selectedCode && typeof window !== "undefined" && window.localStorage) {
      const country = EUROPEAN_COUNTRIES.find(
        (c) => c.iso2.toUpperCase() === getGeoLocation()
      );

      if (country) {
        setSelectedCode(country.phoneCode);
        onChange(`${country.phoneCode} ${mainPart}`);
      }
    }
  }, [selectedCode]);

  // Update parent when values change
  useEffect(() => {
    if (onChange && selectedCode && mainPart !== undefined) {
      onChange(`${selectedCode} ${mainPart}`);
    }
  }, [selectedCode, mainPart]);

  return (
    <div className="phone-input">
      <Prefix
        value={selectedCode}
        onChange={(code: string) => {
          const country = EUROPEAN_COUNTRIES.find((c) => c.phoneCode === code);

          if (country) {
            localStorage.setItem(LOCAL_STORAGE_LOCATION, country.iso2);
          }

          setSelectedCode(code);
        }}
      />
      <Form.Control
        type="number"
        className="phone-content form-control"
        value={mainPart}
        onChange={(e) => setMainPart(e.target.value)}
        isInvalid={isInvalid}
      />
    </div>
  );
};

export default PrefixPhoneInput;
