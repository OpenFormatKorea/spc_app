import React, { ReactNode } from "react";

interface BigModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const BigModal: React.FC<BigModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 p-3"
      onClick={handleBackgroundClick}
    >
      <div className="relative max-w-[1100px] overflow-hidden rounded-xl bg-gray-100 p-4 text-center shadow-lg">
        <button
          className="absolute right-5 top-2 text-3xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex">{children}</div>
      </div>
    </div>
  );
};

export default BigModal;
