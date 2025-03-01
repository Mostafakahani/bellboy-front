import React, { useState, useEffect, useLayoutEffect } from "react";

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  haveBorder?: boolean;
}

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  children,
  // title,
  haveBorder,
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useLayoutEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = "unset";
      }, 300); // match this with your animation duration
      return () => clearTimeout(timer);
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ease-out ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? "opacity-50" : "opacity-0"
        }`}
      />
      <div
        className={`bg-white border-2 ${
          haveBorder ? "border-black rounded-2xl" : ""
        } w-full max-w-sm h-full overflow-y-auto relative transition-all duration-300 ease-out ${
          isAnimating ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white w-full h-full overflow-auto relative">
          {/* <div className="flex justify-between items-center mt-4 sm:mt-6 px-4">
            <h5 className="font-black text-lg sm:text-xl">{title || "بل سرویس"}</h5>
            <button onClick={onClose} className="p-2">
              <Image width={20} height={20} src="/images/icons/close.svg" alt="close" />
            </button>
          </div> */}
          <div className="w-full mt-2 sm:mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
