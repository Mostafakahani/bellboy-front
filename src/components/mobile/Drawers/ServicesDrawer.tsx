import React, { useState, useEffect } from "react";
import { X, ShoppingBag, Sparkles, Wrench, HelpCircle } from "lucide-react";

interface ServicesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ServicesDrawer: React.FC<ServicesDrawerProps> = ({ isOpen, onClose }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      console.log(isRendered)
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const services = [
    { icon: ShoppingBag, name: "Bell Shop", arabic: "بل شاب" },
    { icon: Sparkles, name: "Bell Mazah", arabic: "بل مزه" },
    { icon: Sparkles, name: "Bell Clean", arabic: "بل کلین" },
    { icon: Wrench, name: "Bell Service", arabic: "بل سرویس" },
    { icon: HelpCircle, name: "Bell Guide", arabic: "بل گاید" },
  ];

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-50 ${
        isOpen ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 h-[60vh] bg-black text-white rounded-t-3xl shadow-lg transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">خدمات بِل‌بوی</h2>
        </div>
        <div className="w-full flex flex-col justify-between gap-8">
          <div className="p-4 overflow-y-auto h-full">
            {services.map((service, index) => (
              <div
                key={index}
                className={`mx-2 flex items-center justify-between py-4 border-b border-slate-200/50 transform transition-all duration-300 ease-in-out ${
                  isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center mr-3">
                  <service.icon size={24} className="ml-4" />
                  <span className="text-lg">{service.arabic}</span>
                </div>
                <span className="text-lg ml-3 text-slate-200/50 font-lobester">{service.name}</span>
              </div>
            ))}
          </div>
          <button
            onClick={onClose}
            className="text-white flex justify-center hover:text-gray-300 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesDrawer;
