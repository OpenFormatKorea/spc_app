import React from "react";
interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  return (
    <div className="AuthContainer w-full bg-sky-200 flex justify-center items-center text-center h-screen">
      <div className="flex justify-center items-center h-screen"></div>
      <main>{children}</main>
    </div>
  );
};
export default AuthContainer;
