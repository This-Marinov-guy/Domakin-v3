import React from "react";
import TimePicker from "rc-time-picker";

const TimePickerInput = (props: any) => {
  const { isInvalid, ...otherProps } = props;
  return (
    <TimePicker
      {...otherProps}
      className={`${props.isInvalid ? "is-invalid" : ""}`}
    />
  );
};

export default TimePickerInput;
