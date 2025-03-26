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
const AuthInputBox: React.FC<AuthInputBoxProps> = ({
  label,
  type,
  id,
  placeholder,
  value,
  onChange,
  onKeyDown,
}) => {
  return (
    <div className="w-full items-center justify-start pt-1 text-left">
      <a className="mb-4 w-[25%] text-[12px] text-black">{label}</a>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        className="usernameInput w-full flex-grow border-b-[1px] p-3 text-[12px] lg:max-w-[450px]"
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default AuthInputBox;
