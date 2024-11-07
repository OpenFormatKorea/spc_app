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
      className={`mt-4 flex flex-col overflow-auto rounded-2xl bg-white p-6 shadow-md lg:p-8 ${containerClass}`}
      style={{ height: "calc(78vh)" }}
    >
      {children}
    </div>
  );
};

export default ContentsContainer;
