import { table } from "console";
import React, { ChangeEvent } from "react";
interface InputRadioBoxProps {
  label: string;
  value: any;
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const InputRadioBox: React.FC<InputRadioBoxProps> = ({ label, value, name, checked, onChange }) => {
  return (
    <>
      <div className="flex space-x-2 justify-center items-center text-gray-500 mr-5 cursor-pointer">
        <input type="radio" name={name} value={value} id={`radio_${value}`} checked={checked} onChange={onChange} />
        <label htmlFor={`radio_${value}`}>{label}</label>
      </div>
    </>
  );
};

export default InputRadioBox;
