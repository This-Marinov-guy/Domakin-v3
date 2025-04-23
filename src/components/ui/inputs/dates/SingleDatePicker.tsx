import React, { useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

const SingleDatePicker = (props: any) => {
  const calendarRef = useRef(null);

  const handleDateSelect = (date:string) => {
    props.onChange(date);
  };

  return (
    <div className="dropdown" ref={calendarRef}>
      <input
        type="text"
        value={props.value ? new Date(props.value).toLocaleDateString() : ""}
        placeholder={props.placeholder ?? "Select a date"}
        data-bs-toggle="dropdown"
        aria-expanded="false"
        data-bs-auto-close="outside"
        className={`${props.isInvalid ? "is-invalid" : ""} form-control`}
      />
      <div className="calendar dropdown-menu">
        <DayPicker
          mode="single"
          captionLayout="dropdown"
          selected={props.value}
          onSelect={(date: any) => handleDateSelect(date)}
          {...props}
        />
      </div>
    </div>
  );
};

export default SingleDatePicker;
