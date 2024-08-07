import { type } from "os";
import React, { ChangeEvent } from "react";
interface AuthButtonProps {
  disabled: boolean;
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}
const AuthButton: React.FC<AuthButtonProps> = ({ disabled, label, onClick }) => {
  return (
    <div className="m-2 w-full flex justify-center">
      <button
        disabled={disabled}
        className={`p-2 w-full text-center m-2 cursor-pointer ${disabled ? "bg-gray-300" : "bg-black text-white"}`}
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
};

export default AuthButton;
