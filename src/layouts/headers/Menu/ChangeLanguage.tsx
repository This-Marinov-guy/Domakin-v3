import NiceSelect from "@/ui/NiceSelect";
import React from "react";
import setLanguage from "next-translate/setLanguage";
import useTranslation from "next-translate/useTranslation";

const ChangeLanguage = () => {
  const { t, lang } = useTranslation("translations");

  const options = [
    { value: "en", text: "English" },
    { value: "bg", text: "Български" },
    { value: "gr", text: "Ελληνικά" },
  ];

  const defOption = options.findIndex((l) => l.value === lang)

  const changeLanguage = async (lang: string) => {
    if (!lang) {
      return "";
    }

    await setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const selectHandler = async (e: any) => {
    await changeLanguage(e.target.value);
  };

  return (
    <NiceSelect
      style={{ height: "50px", minWidth: "130px" }}
      className="nice-select fw-normal"
      options={options}
      defaultCurrent={defOption}
      onChange={selectHandler}
      name=""
      placeholder=""
      icon="/assets/img/icons/translate-icon.png"
    />
  );
};

export default ChangeLanguage;
