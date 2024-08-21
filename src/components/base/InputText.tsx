import React, { ChangeEvent, KeyboardEvent } from "react";

interface InputTextArgs {
  type: string;
  id: string;
  placeholder: string;
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const InputTextBox: React.FC<InputTextArgs> = ({ type, id, placeholder, value, onChange, onKeyDown }) => {
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      className="input-class text-xs p-3 rounded-md w-full lg:max-w-[350px] border"
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
};

export default InputTextBox;
