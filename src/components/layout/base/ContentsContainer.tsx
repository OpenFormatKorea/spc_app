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
      className={`flex h-[78vh] flex-col overflow-y-auto rounded-xl bg-white p-[8px] lg:p-[12px] ${containerClass}`}
    >
      {children}
    </div>
  );
};

export default ContentsContainer;
