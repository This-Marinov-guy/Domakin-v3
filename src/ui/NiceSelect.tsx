import React, {
  useState,
  useCallback,
  useRef,
  FC,
  ChangeEvent,
  useEffect,
} from "react";
import { useClickAway } from "react-use";

interface Option {
  value: string|number;
  text: string;
}

type NiceSelectProps = {
  options: Option[];
  defaultCurrent?: number | number[]; // Made optional
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
  defaultCurrent,
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

  const [current, setCurrent] = useState<Option[]>(
    defaultCurrent !== undefined
      ? multi
        ? Array.isArray(defaultCurrent)
          ? defaultCurrent.map((index) => options[index])
          : []
        : [options[defaultCurrent as number]]
      : []
  );

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const ref = useRef<HTMLDivElement | null>(null);

  useClickAway(ref, onClose);

  useEffect(() => {
    if (current.length) {
      if (multi) {
        onChange({
          target: { value: current.map((item) => item.value).join(",") },
        } as ChangeEvent<HTMLSelectElement>);
      } else {
        onChange({
          target: { value: current[0].value },
        } as ChangeEvent<HTMLSelectElement>);
      }
    }
  }, [current]);

  const currentHandler = (item: Option) => {
    if (multi) {
      const isSelected = current.some(
        (selected) => selected.value === item.value
      );
      let newSelection: Option[];

      if (isSelected) {
        newSelection = current.filter(
          (selected) => selected.value !== item.value
        );
      } else {
        newSelection = [...current, item];
      }

      setCurrent(newSelection);
      onChange({
        target: {
          value: newSelection.map((selected) => selected.value).join(","),
        },
      } as ChangeEvent<HTMLSelectElement>);
    } else {
      setCurrent([item]);
      onChange({
        target: { value: item.value },
      } as ChangeEvent<HTMLSelectElement>);
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
        {current.length
          ? multi
            ? current.map((item) => item.text).join(", ")
            : current[0].text
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
              current.some((selected) => selected.value === item.value)
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
                checked={current.some(
                  (selected) => selected.value === item.value
                )}
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
