import React, {
  useState,
  useCallback,
  useRef,
  FC,
  ChangeEvent,
} from "react";
import { useClickAway } from "react-use";

interface Option {
  value: string | number;
  text: string;
  /** Optional leading icon (e.g. a flag) shown next to the option text. */
  icon?: string;
}

const optionIconStyle: React.CSSProperties = {
  width: 20,
  height: 14,
  objectFit: "cover",
  borderRadius: 2,
  flexShrink: 0,
  border: "1px solid rgba(0, 0, 0, 0.1)",
};

type NiceSelectProps = {
  options: Option[];
  /** The currently selected value (controlled). Pass undefined to show placeholder. */
  value?: string | number;
  placeholder: string;
  id?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  className?: string;
  style?: React.CSSProperties;
  icon?: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  isInvalid?: boolean;
  multi?: boolean;
};

const NiceSelect: FC<NiceSelectProps> = ({
  options,
  value,
  placeholder,
  id,
  ariaLabel,
  ariaLabelledBy,
  className,
  style,
  onChange,
  icon,
  name,
  isInvalid,
  multi = false,
}) => {
  const [open, setOpen] = useState(false);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const ref = useRef<HTMLDivElement | null>(null);
  useClickAway(ref, onClose);
  const generatedListboxId = React.useId();
  const listboxId = id ? `${id}-listbox` : generatedListboxId;

  // Derive selected options from the value prop — no internal selection state
  const selectedOptions =
    value === undefined || value === ""
      ? []
      : multi
      ? options.filter((opt) =>
          (Array.isArray(value) ? value.map(String) : String(value).split(",")).includes(
            String(opt.value)
          )
        )
      : options.filter((opt) => String(opt.value) === String(value));

  const currentHandler = (item: Option) => {
    if (multi) {
      const isSelected = selectedOptions.some((s) => s.value === item.value);
      const newSelection = isSelected
        ? selectedOptions.filter((s) => s.value !== item.value)
        : [...selectedOptions, item];
      onChange({
        target: { value: newSelection.map((s) => s.value).join(",") },
      } as ChangeEvent<HTMLSelectElement>);
    } else {
      onChange({ target: { value: item.value } } as ChangeEvent<HTMLSelectElement>);
      onClose();
    }
  };

  return (
    <div
      id={id}
      className={`nice-select form-select-lg ${className || ""} ${
        open ? "open" : ""
      } ${isInvalid ? "is-invalid" : ""}`}
      style={style}
      role="combobox"
      tabIndex={0}
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls={listboxId}
      aria-label={ariaLabel || (!ariaLabelledBy ? placeholder : undefined)}
      aria-labelledby={ariaLabelledBy}
      onClick={() => setOpen((prev) => !prev)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((prev) => !prev);
        } else if (e.key === "Escape") {
          setOpen(false);
        }
      }}
      ref={ref}
    >
      {icon && <img src={icon} style={{ width: "20px" }} alt="icon" />}
      <span className="current d-inline-flex align-items-center gap-2">
        {selectedOptions.length && !multi && selectedOptions[0].icon && (
          <img src={selectedOptions[0].icon} alt="" style={optionIconStyle} />
        )}
        {selectedOptions.length
          ? multi
            ? selectedOptions.map((item) => item.text).join(", ")
            : selectedOptions[0].text
          : placeholder}
      </span>
      <ul
        id={listboxId}
        className="list"
        role="listbox"
        aria-multiselectable={multi || undefined}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {options?.map((item, i) => (
          <li
            key={i}
            data-value={item.value}
            className={`d-flex align-items-center justify-content-start gap-2 option ${
              selectedOptions.some((s) => s.value === item.value)
                ? "selected focus"
                : ""
            }`}
            style={{ fontSize: "14px" }}
            role="option"
            aria-selected={selectedOptions.some((s) => s.value === item.value)}
            onClick={() => currentHandler(item)}
            onKeyDown={(e) => e}
          >
            {multi && (
              <span
                aria-hidden="true"
                className="nice-select-check"
                style={{
                  alignItems: "center",
                  border: "1px solid currentColor",
                  display: "inline-flex",
                  height: 14,
                  justifyContent: "center",
                  width: 14,
                }}
              >
                {selectedOptions.some((s) => s.value === item.value) && (
                  <i className="fa-solid fa-check" aria-hidden="true"></i>
                )}
              </span>
            )}
            {item.icon && <img src={item.icon} alt="" style={optionIconStyle} />}
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NiceSelect;
