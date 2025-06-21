import React from "react";
import Portal from "./Portal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <Portal id="modal-root">
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="relative bg-white p-6 rounded-lg shadow-lg w-80">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-0 right-0 m-2 p-2 text-gray-500 hover:text-gray-700 text-2xl hover:cursor-pointer"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
