import useTranslation from "next-translate/useTranslation";
import React from "react";

const SearchQuery = (props: any) => {
  const { t } = useTranslation("translations");

  const {query, setQuery} = props;

  return (
    <div className="search-container m-a">
      <i className="fa-solid fa-magnifying-glass search-icon"></i>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`search-field w-100 ${props.className}`}
        placeholder={props.placeholder ?? t("common.search")}
        style={props.style}
      />
    </div>
  );
};

export default SearchQuery;
