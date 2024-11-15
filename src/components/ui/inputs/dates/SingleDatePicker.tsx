import React, { useState, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

const SingleDatePicker = (props: any) => {
  const [selected, setSelected] = useState(props.initialValue);
  const calendarRef = useRef(null);

  const handleDateSelect = (date: string) => {
    setSelected(date);
    props.onSelect(date);
  };

  return (
    <div className="dropdown" ref={calendarRef}>
      <input
        type="text"
        value={selected ? new Date(selected).toLocaleDateString() : ""}
        placeholder={props.placeholder ?? "Select a date"}
        data-bs-toggle="dropdown"
        aria-expanded="false"
        data-bs-auto-close="outside"
      />
      <div className="calendar dropdown-menu">
        <DayPicker
          mode="single"
          captionLayout="dropdown"
          selected={selected}
          // onSelect={handleDateSelect}
        />
      </div>
    </div>
  );
};

export default SingleDatePicker;
