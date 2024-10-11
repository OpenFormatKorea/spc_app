import React, { ChangeEvent, KeyboardEvent } from "react";

interface InputTextArgs {
  disabled: boolean;
  type: string;
  id: string;
  placeholder: string;
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const InputTextBox: React.FC<InputTextArgs> = ({ disabled, type, id, placeholder, value, onChange, onKeyDown }) => (
  <>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      value={value ?? ""}
      className="input-class flex-grow text-sm py-2 w-full lg:max-w-[450px] border-b-[1px]"
      onChange={onChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
    />
  </>
);

export default InputTextBox;
