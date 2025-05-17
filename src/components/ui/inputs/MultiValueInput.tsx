import { isEmpty } from "lodash";
import React from "react";
import Form from "react-bootstrap/Form";

interface MultiValueInputProps {
  data: Record<string, any>;
  onChange: (updatedData: Record<string, any>) => void;
  label: string;
  textarea?: boolean;
  isInvalid?: boolean;
}

const MultiValueInput: React.FC<MultiValueInputProps> = ({
  data,
  onChange,
  label,
  isInvalid,
  textarea = false,
}) => {
  const handleInputChange = (key: string, value: any) => {
    const updatedValues = {
      ...data,
      [key]: value,
    };    

    onChange(updatedValues);
  };

  if (isEmpty(data)) {
    return null;
  }

  return (
    <div className="form-style-one">
      <div className="input-group-meta form-group mb-30">
        <label
          htmlFor={`main-label`}
          className="block text-sm font-medium mb-1"
        >
          {label}
        </label>
        {Object.entries(data).map(([key, value], index) => (
          <div key={key} className="mb-4">
            <label
              htmlFor={`input-${key}`}
              className="block text-sm font-medium mb-1"
            >
              {key}
            </label>
            <Form.Control
              as={textarea ? "textarea" : "input"}
              id={`input-${key}`}
              type={typeof value === "number" ? "number" : "text"}
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
              isInvalid={isInvalid && index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiValueInput;
