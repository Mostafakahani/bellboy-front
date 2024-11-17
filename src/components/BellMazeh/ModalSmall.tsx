"use client";
import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface ModalSmallProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  // title?: string;
  haveBorder?: boolean;
  px?: boolean;
  customStyle?: string;
}

export const ModalSmall: React.FC<ModalSmallProps> = ({
  isOpen,
  onClose,
  children,
  // title,
  haveBorder = false,
  customStyle,
  px = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose} dir="rtl">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center text-center sm:items-center">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-out duration-300"
              enterFrom="translate-y-full opacity-0 sm:translate-y-0 sm:scale-95"
              enterTo="translate-y-0 opacity-100 sm:scale-100"
              leave="transform transition ease-in duration-200"
              leaveFrom="translate-y-0 opacity-100 sm:scale-100"
              leaveTo="translate-y-full opacity-0 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`
                  w-full transform overflow-hidden bg-white text-left transition-all
                  ${haveBorder ? "border border-black" : ""}
                  py-2
                  sm:max-w-md sm:rounded-2xl
                  ${haveBorder ? "sm:border sm:border-black" : ""}
                  rounded-t-2xl
                `}
              >
                <div className="bg-white w-full">
                  <div className={`w-full ${customStyle || "mt-8 sm:my-2"} ${px ? "px-4" : ""}`}>
                    {children}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ModalSmall;
