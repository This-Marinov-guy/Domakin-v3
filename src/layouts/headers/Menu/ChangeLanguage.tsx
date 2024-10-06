import NiceSelect from "@/ui/NiceSelect";
import React from "react";
import setLanguage from "next-translate/setLanguage";
import useTranslation from "next-translate/useTranslation";

const ChangeLanguage = () => {
  const { t } = useTranslation("translations");

  const changeLanguage = async (lang: string) => {
    if (!lang) {
        return ''
    }
    
    await setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const selectHandler = async (e: any) => {
    await changeLanguage(e.target.value);
  };

  return (
    <NiceSelect
      style={{ height: "50px" }}
      className="nice-select fw-normal"
      options={[
        { value: "", text: "Language" },
        { value: "en", text: "English" },
        { value: "bg", text: "Български" },
        { value: "gr", text: "Ελληνικά" },
      ]}
      defaultCurrent={0}
      onChange={selectHandler}
      name=""
      placeholder=""
    />
  );
};

export default ChangeLanguage;
