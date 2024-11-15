import React, { useEffect, useState } from "react";
import { EUROPEAN_COUNTRIES } from "@/utils/countries";
import { getGeoLocation } from "@/utils/helpers";
import { LOCAL_STORAGE_LOCATION } from "@/utils/localstorage";
import Prefix from "./Prefix";

const PrefixPhoneInput = (props: any) => {
  const { className, style, onChange, placeholder } = props;
  //   const [selectedCode, setSelectedCode] = useState(
  //     EUROPEAN_COUNTRIES.find((c) => c.iso2.toUpperCase() === getGeoLocation())
  //   );

  //   const [value, setValue] = useState(undefined);

  //   useEffect(() => {
  //     if (onChange && selectedCode && value) {
  //       onChange(selectedCode.phoneCode + value);
  //     }
  //   }, [selectedCode, value]);

  return (
    <div className="phone-input">
      <Prefix />
      <input
        type="number"
        className="phone-content form-control"
        aria-label="Text input with dropdown button"
      />
    </div>
  );

  {
    /* return (
    <div className={"phone_code " + className} style={style}>
      <Dropdown
        value={selectedCode}
        filter
        onChange={(e) => {
          const inputValue = e.value;

          localStorage.setItem(
            LOCAL_STORAGE_LOCATION,
            EUROPEAN_COUNTRIES.find(
              (c) => c.phoneCode === inputValue.phoneCode
            )["iso2"]
          );

          setSelectedCode(inputValue);
        }}
        options={EUROPEAN_COUNTRIES}
        optionLabel="phoneCode"
        placeholder="Prefix"
        className="phone_code_prefix"
      />
      <InputNumber
        value={value}
        useGrouping={false}
        onValueChange={(e) => setValue(e.target.value)}
        className="phone_code_content"
        placeholder={placeholder ?? "Phone Number"}
      />
    </div>
  ); */
  }
};

export default PrefixPhoneInput;
