import NiceSelect from "@/ui/NiceSelect";
import React from "react";
import axios from "axios";
import setLanguage from "next-translate/setLanguage";
import useTranslation from "next-translate/useTranslation";

const ChangeLanguage = () => {
  const { lang } = useTranslation("translations");

  // const options = [
  //   { value: "en", text: "English" },
  //   { value: "bg", text: "Български" },
  //   { value: "gr", text: "Ελληνικά" },
  // ];

  const options = [
    { value: "en", text: "EN" },
    { value: "bg", text: "BG" },
    { value: "gr", text: "GR" },
  ];

  const changeLanguage = async (newLang: string) => {
    if (!newLang) return;

    axios.defaults.headers.common["Accept-Language"] = newLang;
    localStorage.setItem("language", newLang);
    await setLanguage(newLang);
  };

  const selectHandler = async (e: any) => {
    await changeLanguage(e.target.value);
  };

  return (
    <NiceSelect
      style={{ height: "50px", minWidth: "80px" }}
      className="nice-select fw-normal"
      options={options}
      value={lang}
      onChange={selectHandler}
      name=""
      placeholder=""
      icon="/assets/img/icons/translate-icon.png"
    />
  );
};

export default ChangeLanguage;
