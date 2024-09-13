import React from "react";
interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  return (
    <div className="AuthContainer flex w-full justify-center items-center text-center h-screen bg-gradient-to-b from-gray-200 to-gray-300">
      <main>{children}</main>
    </div>
  );
};
export default AuthContainer;
