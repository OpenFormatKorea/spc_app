import React from "react";
interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  return (
    <div className="AuthContainer flex  w-full bg-gray-400 justify-center items-center text-center h-screen">
      <main>{children}</main>
    </div>
  );
};
export default AuthContainer;
