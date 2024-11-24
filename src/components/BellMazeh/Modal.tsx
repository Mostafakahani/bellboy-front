"use client";
import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  haveBorder?: boolean;
  px?: boolean;
  customStyle?: string;
  notUseClose?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  haveBorder = false,
  customStyle,
  px = false,
  notUseClose = true,
}) => {
  const pathname = usePathname();

  // Effect for URL changes
  useEffect(() => {
    if (isOpen && notUseClose) {
      onClose();
    }
  }, [pathname]);
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
    <Transition show={isOpen} as={Fragment}>
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
          <div className="flex min-h-full items-center justify-center sm:p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`
                  w-full transform overflow-hidden bg-white transition-all
                  ${haveBorder ? "border border-black" : ""}
                  /* موبایل: تمام صفحه */
                  h-[85vh]
                  sm:max-w-md sm:rounded-2xl
                  ${haveBorder ? "sm:border sm:border-black" : ""}
                `}
              >
                <div className="bg-white w-full h-full overflow-auto">
                  <div className="sticky w-full z-[40] top-0 bg-white flex justify-between items-center mt-4 sm:mt-6 px-4 pb-4 border-b">
                    <Dialog.Title className="font-black text-lg sm:text-xl text-right">
                      {title || "بل سرویس"}
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      type="button"
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="بستن"
                    >
                      <Image width={20} height={20} src="/images/icons/close.svg" alt="close" />
                    </button>
                  </div>
                  <div className={`w-full ${customStyle || "mt-8 sm:mt-10"} ${px ? "px-4" : ""}`}>
                    {children}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
