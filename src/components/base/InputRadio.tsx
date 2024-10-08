import React, { ChangeEvent } from "react";
interface InputRadioBoxProps {
  disabled: boolean;
  label: string;
  value: any;
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const InputRadioBox: React.FC<InputRadioBoxProps> = ({ disabled, label, value, name, checked, onChange }) => (
  <div className="flex space-x-2 justify-center items-center text-gray-500 mr-5 cursor-pointer">
    <input
      type="radio"
      name={name}
      value={value}
      id={`radio_${name}`}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <label htmlFor={`radio_${name}`}>{label}</label>
  </div>
);

export default InputRadioBox;
