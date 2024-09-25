import CloseIcon from "../../../assets/icons/CloseIcon";
import "./styles.sass";

import { FC, forwardRef, Ref, useEffect, useState } from "react";

interface InputProps {
  label?: string;
  onChange?: <T>(value: T) => void;
  className?: string;
  inputContainer?: string;
  value?: string;
  id?: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  placeholder?: string;
  icon?: JSX.Element;
  ref?: Ref<HTMLInputElement>;
}

const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      onChange,
      className,
      inputContainer,
      value: propValue,
      id,
      minLength,
      maxLength,
      required,
      placeholder,
      icon,
    },
    ref
  ) => {
    const [localValue, setLocalValue] = useState<string>("");
    const [showClearBtn, setShowClearBtn] = useState<boolean>(false);

    useEffect(() => {
      setShowClearBtn(!!(propValue || localValue));
    }, [propValue, localValue]);

    function setClassNames() {
      const hasIcon = icon ? "with-icon" : "";
      const hasClassName = inputContainer || "";
      return `${hasIcon} ${hasClassName}`;
    }

    function handleClear() {
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.value = "";
        setLocalValue("");
      }
    }

    return (
      <label htmlFor={id} className={`input ${setClassNames()}`}>
        {label && <span className="label-text">{label}</span>}
        <span className="input-container">
          {icon && <span className="icon left">{icon}</span>}
          <input
            ref={ref}
            id={id}
            type="text"
            value={propValue || localValue}
            minLength={minLength && minLength}
            maxLength={maxLength && maxLength}
            required={required ? required : false}
            className={`inputComponent ${className ?? ""}`}
            onChange={(e) => {
              if (onChange) onChange(e.target.value);
              setLocalValue(e.target.value);
            }}
            placeholder={placeholder}
          />
          {showClearBtn && (
            <span
              onClick={handleClear}
              role="button"
              className="icon right clear-icon"
            >
              <CloseIcon />
            </span>
          )}
        </span>
      </label>
    );
  }
);

export default Input;
