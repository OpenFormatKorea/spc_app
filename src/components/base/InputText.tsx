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
    <>
      <style jsx>{`
        /* Chrome, Safari, Edge, Opera */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* Firefox */
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        className="input-class flex-grow text-xs p-3 rounded-md w-full lg:max-w-[350px] border"
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </>
  );
};

export default InputTextBox;
