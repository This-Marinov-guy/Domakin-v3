"use client";

import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { EUROPEAN_COUNTRIES } from "@/utils/countries";
import { getGeoLocation } from "@/utils/helpers";
import { LOCAL_STORAGE_LOCATION } from "@/utils/localstorage";
import Prefix from "./Prefix";

const PrefixPhoneInput = (props: any) => {
  const { className, style, value, onChange, isInvalid } = props;

  const [selectedCode, setSelectedCode] = useState("");

  const [mainPart, setMainPart] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const country = EUROPEAN_COUNTRIES.find(
        (c) => c.iso2.toUpperCase() === getGeoLocation()
      );

      if (country) {
        setSelectedCode(country.phoneCode);
      }
    }
  }, []);

  useEffect(() => {
    if (onChange && selectedCode && mainPart) {
      onChange(selectedCode + ' ' + mainPart);
    }
  }, [selectedCode, mainPart]);

  useEffect(() => {
    if (!value) {
      setMainPart("");
    }
  }, [value]);

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
        onChange={(e: any) => setMainPart(e.target.value)}
        isInvalid={isInvalid}
      />
    </div>
  );
};

export default PrefixPhoneInput;
