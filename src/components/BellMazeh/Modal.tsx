import React, { useState, useEffect } from "react";
import Image from "next/image";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  haveBorder?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, haveBorder }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setTimeout(() => setIsVisible(false), 300);
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white border-2 ${
          haveBorder && "border-black rounded-2xl"
        }  w-full max-w-sm h-full overflow-y-auto transform transition-all duration-300 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white w-full h-full overflow-auto relative">
          <div className="flex justify-between items-center mt-4 sm:mt-6 px-4">
            <h5 className="font-black text-lg sm:text-xl">{title || "بل سرویس"}</h5>
            <button onClick={onClose} className="p-2">
              <Image width={20} height={20} src="/images/icons/close.svg" alt="close" />
            </button>
          </div>
          <div className="w-full mt-8 sm:mt-10">{children}</div>
          {/* <div className="px-4">
            <Button className="w-full" onXsIsText>
              ادامه
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
};
