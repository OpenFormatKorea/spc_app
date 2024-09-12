import React from "react";

interface AuthButtonProps {
  disabled: boolean;
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const AuthButton: React.FC<AuthButtonProps> = ({ disabled, label, onClick, buttonRef }) => (
  <div className=" w-full flex justify-center my-5">
    <button
      ref={buttonRef}
      disabled={disabled}
      className={`p-2 rounded-lg w-full text-center cursor-pointer ${
        disabled ? "bg-gray-300" : "bg-blue-500 text-white"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  </div>
);

export default AuthButton;
