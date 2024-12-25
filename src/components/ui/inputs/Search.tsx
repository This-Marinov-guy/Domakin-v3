import useTranslation from "next-translate/useTranslation";
import React from "react";

interface SearchProps {
  options: any[];
  setOptions: Function;
  className?: string;
  style?: object;
  placeholder?: string;
}

const Search = (props: SearchProps) => {
  const {t} = useTranslation("translations");

  const handleChange = (e: any) => {
    const newOptions = props.options.filter((o) => o.toLowerCase().includes(e.target.value.toLowerCase()));
    props.setOptions(newOptions);
  };

  return (
    <div className="search-container">
      <i className="fa-solid fa-magnifying-glass search-icon"></i>
      <input
        type="text"
        onChange={handleChange}
        className={`search-field ${props.className}`}
        placeholder={props.placeholder ?? t("common.search")}
        style={props.style}
      />
    </div>
  );
};

export default Search;
