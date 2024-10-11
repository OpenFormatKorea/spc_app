import React, { ChangeEvent, KeyboardEvent } from "react";

interface InputNumberTextArgs {
  disabled: boolean;
  type: string;
  id: string;
  placeholder: string;
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const InputNumberTextBox: React.FC<InputNumberTextArgs> = ({
  disabled,
  type,
  id,
  placeholder,
  value,
  onChange,
  onKeyDown,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Allow only numbers by using a regular expression
    if (/^\d*$/.test(inputValue)) {
      onChange(event);
    }
  };

  return (
    <input
      type="text"
      id={id}
      placeholder={placeholder}
      value={value ?? ""}
      className="input-class flex-grow text-sm py-2 w-full lg:max-w-[450px] border-b-[1px]"
      onChange={handleInputChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
    />
  );
};
export default InputNumberTextBox;
