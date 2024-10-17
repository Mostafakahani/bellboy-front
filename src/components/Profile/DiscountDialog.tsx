import React, { useEffect, useState } from "react";
import Button from "../ui/Button/Button";
import { Input } from "../ui/Input/Input";

interface DiscountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  onChange?: (value: string) => void;
  message: string;
  buttonMessage?: string;
}

const DiscountDialog: React.FC<DiscountDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onChange,
  message,
  buttonMessage,
}) => {
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
        className={`bg-white border-2 border-black rounded-2xl px-6 py-12 m-4 max-w-sm h-90 w-full transform transition-all duration-300 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <div className="text-center flex flex-col justify-between items-center h-full">
          <p className="text-xl font-black mb-4">{message}</p>
          <div className="w-full mt-16">
            <Input
              onChange={(e) => onChange?.(e.target.value)}
              placeholder="بنویسید"
              style={{ textAlign: "center" }}
            />
          </div>
          <div className="w-full flex flex-col items-center gap-5 mt-2">
            <Button variant="primary" className="text-sm w-full" onXsIsText onClick={onSubmit}>
              {buttonMessage}
            </Button>
            <Button variant="tertiary" className="text-sm" onXsIsText onClick={onClose}>
              انصراف
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountDialog;
