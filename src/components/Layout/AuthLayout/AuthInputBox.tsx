import { type } from "os";
import React, { ChangeEvent } from "react";
interface AuthInputBoxProps {
  label: string;
  type: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const AuthInputBox: React.FC<AuthInputBoxProps> = ({ label, type, id, placeholder, value, onChange }) => {
  return (
    <div className="flex w-full mx-2 mt-2 p-1 justify-start items-center text-left">
      <a className="w-[23%] m-2 text-xs">{label}</a>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        className="usernameInput ml-2 text-xs p-2 w-[77%]"
        onChange={onChange}
      />
    </div>
  );
};

export default AuthInputBox;
