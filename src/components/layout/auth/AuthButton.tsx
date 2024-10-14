import React from "react";

interface AuthButtonProps {
  disabled: boolean;
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  disabled,
  label,
  onClick,
  buttonRef,
}) => (
  <div className="my-5 flex w-full justify-center">
    <button
      ref={buttonRef}
      disabled={disabled}
      className={`w-full cursor-pointer rounded-lg p-2 text-center ${
        disabled ? "bg-gray-300" : "bg-blue-500 text-white"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  </div>
);

export default AuthButton;
