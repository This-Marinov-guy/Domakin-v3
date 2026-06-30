import React, { useState, useRef, useCallback } from "react";
import { useClickAway } from "react-use";

interface SearchableCitySelectProps {
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
  cities: string[];
  placeholder?: string;
}

const SearchableCitySelect: React.FC<SearchableCitySelectProps> = ({
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  value,
  onChange,
  isInvalid,
  cities,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const generatedListboxId = React.useId();
  const listboxId = id ? `${id}-listbox` : generatedListboxId;

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
        id={id}
        className="select-trigger"
        onClick={() => setOpen(!open)}
        role="combobox"
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(!open);
          } else if (e.key === "Escape") {
            setOpen(false);
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
              aria-label="Search cities"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <ul className="options-list" id={listboxId} role="listbox">
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
                  role="option"
                  aria-selected={value === city}
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

