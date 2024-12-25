"use client";

import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { EUROPEAN_COUNTRIES } from "@/utils/countries";
import { getGeoLocation } from "@/utils/helpers";
import { LOCAL_STORAGE_LOCATION } from "@/utils/localstorage";
import Prefix from "./Prefix";

const PrefixPhoneInput = (props: any) => {
  const { className, style, onChange, isInvalid } = props;

  const [selectedCode, setSelectedCode] = useState("");

  const [value, setValue] = useState(undefined);

  useEffect(() => {
    const storedLocation = localStorage.getItem(LOCAL_STORAGE_LOCATION);
    if (storedLocation) {
      const country = EUROPEAN_COUNTRIES.find(
        (c) => c.iso2.toUpperCase() === storedLocation.toUpperCase()
      );

      if (country) {
        setSelectedCode(country.phoneCode);
      }
    } else {
      const geoLocation = getGeoLocation();
      const country = EUROPEAN_COUNTRIES.find(
        (c) => c.iso2.toUpperCase() === geoLocation
      );

      if (country) {
        setSelectedCode(country.phoneCode);
        localStorage.setItem(LOCAL_STORAGE_LOCATION, country.iso2);
      }
    }
  }, []);

  useEffect(() => {
    if (onChange && selectedCode && value) {
      onChange(selectedCode + value);
    }
  }, [selectedCode, value]);

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
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
        isInvalid={isInvalid}
      />
    </div>
  );
};

export default PrefixPhoneInput;
