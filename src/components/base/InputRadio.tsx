import React, { ChangeEvent } from "react";
interface InputRadioBoxProps {
  disabled: boolean;
  label: string;
  value: any;
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const InputRadioBox: React.FC<InputRadioBoxProps> = ({
  disabled,
  label,
  value,
  name,
  checked,
  onChange,
}) => (
  <div className="mr-5 flex cursor-pointer items-center justify-center space-x-2 text-gray-500">
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
