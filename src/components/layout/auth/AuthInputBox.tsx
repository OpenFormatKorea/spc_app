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
    <div className="w-full justify-start items-center text-left pt-1">
      <a className="w-[25%] mb-4 text-xs text-gray-500">{label}</a>
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
