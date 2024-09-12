import React from "react";

interface ContentsContainerProps {
  children: React.ReactNode;
  variant: "dashboard" | "campaign";
}

const ContentsContainer: React.FC<ContentsContainerProps> = ({ children, variant }) => {
  const containerClass = variant === "dashboard" ? "w-full" : "w-full lg:w-[50%]";
  return <div className={`shadow-md rounded-2xl p-6 lg:p-8 bg-white mt-4 h-fit  ${containerClass}`}>{children}</div>;
};

export default ContentsContainer;
