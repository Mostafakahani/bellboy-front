import React, { useEffect, useState } from "react";
import Button from "../ui/Button/Button";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ isOpen, onClose, message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300); // Match this with the outro animation duration
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white border-2 border-black rounded-2xl px-6 py-12 m-4 max-w-sm h-80 w-full transform transition-all duration-300 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <div className="text-center flex flex-col justify-between items-center h-full">
          <p className="text-xl font-black mb-4">{message}</p>
          <Button variant="primary" className="w-fit min-w-24" onXsIsText onClick={onClose}>
            خب
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessDialog;
