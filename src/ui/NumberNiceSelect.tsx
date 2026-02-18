"use client"
import React, { useState, useCallback, useRef, FC, ChangeEvent } from "react";
import { useClickAway } from "react-use";

interface Option {
   value: number;
   text: number;
}

type NumberNiceSelectProps = {
   options: Option[];
   /** The currently selected value (controlled). */
   value: number;
   placeholder: string;
   className?: string;
   onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
   name: string;
}

const NumberNiceSelect: FC<NumberNiceSelectProps> = ({
   options,
   value,
   placeholder,
   className,
   onChange,
   name,
}) => {
   const [open, setOpen] = useState(false);

   const onClose = useCallback(() => {
      setOpen(false);
   }, []);

   const ref = useRef<HTMLDivElement | null>(null);
   useClickAway(ref, onClose);

   // Derive the selected option from the value prop — no internal selection state
   const selectedOption = options.find((opt) => opt.value === value);

   const currentHandler = (item: Option) => {
      onChange({ target: { value: item.value } } as unknown as ChangeEvent<HTMLSelectElement>);
      onClose();
   };

   return (
      <div
         className={`nice-select form-select-lg ${className || ""} ${open ? "open" : ""}`}
         role="button"
         tabIndex={0}
         onClick={() => setOpen((prev) => !prev)}
         onKeyDown={(e) => e}
         ref={ref}
      >
         <span className="current">{selectedOption?.text ?? placeholder}</span>
         <ul
            className="list"
            role="menubar"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
         >
            {options?.map((item, i) => (
               <li
                  key={i}
                  data-value={item.value}
                  className={`option ${item.value === value ? "selected focus" : ""}`}
                  style={{ fontSize: '14px' }}
                  role="menuitem"
                  onClick={() => currentHandler(item)}
                  onKeyDown={(e) => e}
               >
                  {item.text}
               </li>
            ))}
         </ul>
      </div>
   );
};

export default NumberNiceSelect;
