import React, { ChangeEvent, KeyboardEvent } from "react";
interface AuthInputBoxProps {
  label: string;
  type: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}
const AuthInputBox: React.FC<AuthInputBoxProps> = ({ label, type, id, placeholder, value, onChange, onKeyDown }) => {
  return (
    <div className="flex w-full mx-2 mt-2 p-1 justify-start items-center text-left">
      <a className="w-[25%] m-2 text-xs">{label}</a>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        className="usernameInput  flex-grow text-xs p-3 w-full lg:max-w-[450px] border-b-[1px]"
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default AuthInputBox;
