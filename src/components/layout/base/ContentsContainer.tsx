import React from "react";

interface ContentsContainerProps {
  children: React.ReactNode;
  variant: "dashboard" | "campaign";
  size: "full" | "half";
}

const ContentsContainer: React.FC<ContentsContainerProps> = ({
  children,
  variant,
  size,
}) => {
  const containerClass =
    variant === "dashboard" ? "w-full" : "w-full lg:w-[50%]";
  const height = size === "full" ? "h-[78vh]" : "h-[37vh]";
  return (
    <div
      className={`flex flex-col overflow-y-auto rounded-xl bg-white p-[8px] lg:p-[12px] ${containerClass} ${height}`}
    >
      {children}
    </div>
  );
};

export default ContentsContainer;
