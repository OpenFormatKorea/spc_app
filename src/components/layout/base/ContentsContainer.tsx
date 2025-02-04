import React from "react";

interface ContentsContainerProps {
  children: React.ReactNode;
  variant: "dashboard" | "campaign";
}

const ContentsContainer: React.FC<ContentsContainerProps> = ({
  children,
  variant,
}) => {
  const containerClass =
    variant === "dashboard" ? "w-full" : "w-full lg:w-[50%]";
  return (
    <div
      className={`m-[5px] flex flex-col overflow-y-auto rounded-2xl bg-white p-[16px] lg:p-[16px] ${containerClass}`}
      style={{ height: "calc(78vh)" }}
    >
      {children}
    </div>
  );
};

export default ContentsContainer;
