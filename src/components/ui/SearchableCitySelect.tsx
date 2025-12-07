import React, { useState, useRef, useCallback } from "react";
import { useClickAway } from "react-use";

interface SearchableCitySelectProps {
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
  cities: string[];
  placeholder?: string;
}

const SearchableCitySelect: React.FC<SearchableCitySelectProps> = ({
  value,
  onChange,
  isInvalid,
  cities,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onClose = useCallback(() => {
    setOpen(false);
    setSearchTerm("");
  }, []);

  useClickAway(ref, onClose);

  const handleSelect = (city: string) => {
    onChange(city);
    onClose();
  };

  return (
    <div
      ref={ref}
      className={`searchable-city-select ${open ? "open" : ""} ${isInvalid ? "is-invalid" : ""}`}
    >
      <div
        className="select-trigger"
        onClick={() => setOpen(!open)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(!open);
          }
        }}
      >
        <span className={value ? "selected-value" : "placeholder"}>
          {value || placeholder}
        </span>
        <i className={`bi bi-chevron-${open ? "up" : "down"} chevron-icon`}></i>
      </div>
      {open && (
        <div className="select-dropdown">
          <div className="search-input-wrapper">
            <i className="bi bi-search"></i>
            <input
            style={{ padding: "0 20px 0 34px" }}
              type="text"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <ul className="options-list">
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <li
                  key={index}
                  className={`option ${value === city ? "selected" : ""}`}
                  onClick={() => handleSelect(city)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSelect(city);
                    }
                  }}
                  role="menuitem"
                  tabIndex={0}
                >
                  {city}
                </li>
              ))
            ) : (
              <li className="no-results">No cities found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableCitySelect;

