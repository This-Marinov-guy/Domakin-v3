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
}

type NiceSelectProps = {
  options: Option[];
  /** The currently selected value (controlled). Pass undefined to show placeholder. */
  value?: string | number;
  placeholder: string;
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
      className={`nice-select form-select-lg ${className || ""} ${
        open ? "open" : ""
      } ${isInvalid ? "is-invalid" : ""}`}
      style={style}
      role="button"
      tabIndex={0}
      onClick={() => setOpen((prev) => !prev)}
      onKeyDown={(e) => e}
      ref={ref}
    >
      {icon && <img src={icon} style={{ width: "20px" }} alt="icon" />}
      <span className="current">
        {selectedOptions.length
          ? multi
            ? selectedOptions.map((item) => item.text).join(", ")
            : selectedOptions[0].text
          : placeholder}
      </span>
      <ul
        className="list"
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
            role="menuitem"
            onClick={() => currentHandler(item)}
            onKeyDown={(e) => e}
          >
            {multi && (
              <input
                type="checkbox"
                checked={selectedOptions.some((s) => s.value === item.value)}
                onChange={() => {}}
              />
            )}
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NiceSelect;
