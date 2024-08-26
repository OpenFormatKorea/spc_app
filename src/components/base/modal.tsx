// components/Modal.js
import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50"
      onClick={handleBackgroundClick} // Attach click handler to the overlay
    >
      <div className="rounded-2xl p-4 w-full text-center lg:max-w-[30%] relative m-4 shadow-lg bg-white">
        <button className="absolute top-2 right-5 text-gray-500 hover:text-gray-700 text-xl" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
