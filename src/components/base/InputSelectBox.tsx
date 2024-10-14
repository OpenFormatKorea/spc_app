import React, { ChangeEvent, KeyboardEvent } from "react";
interface InputSelectBoxArgs {
  id: string;
  value: string;
  options: string[]; // Add options as a prop to list dropdown options
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}
const InputSelectBox: React.FC<InputSelectBoxArgs> = ({
  id,
  value,
  options,
  onChange,
}) => {
  return (
    <select
      id={id}
      value={value}
      className="input-class ml-2 w-[200px] rounded-md border p-3 text-xs"
      onChange={onChange}
    >
      <option key="1" value="1">
        1
      </option>
      <option key="2" value="2">
        2
      </option>
      <option key="3" value="3">
        3
      </option>
    </select>
  );
};

export default InputSelectBox;
