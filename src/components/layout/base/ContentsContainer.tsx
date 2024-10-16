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
      className={`mt-4 flex flex-col overflow-y-auto rounded-2xl bg-white p-6 shadow-md lg:p-8 ${containerClass}`}
      style={{
        height: "auto",
        ...(window.innerWidth >= 1024 && { height: "calc(100vh - 11rem)" }),
      }}
    >
      {children}
    </div>
  );
};

export default ContentsContainer;
