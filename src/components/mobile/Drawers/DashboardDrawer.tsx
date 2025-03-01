import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DashboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardDrawer: React.FC<DashboardDrawerProps> = ({ isOpen, onClose }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      console.log(isRendered);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const services = [
    {
      icon: "/images/icons/bellShop.svg",
      name: "Delivery Time",
      arabic: "زمان تحویل",
      link: "/dashboard/delivery-time",
    },
    {
      icon: "/images/icons/bellMazeh.svg",
      name: "Discounts",
      arabic: "کد های تخفیف",
      link: "/dashboard/discounts",
    },
    {
      icon: "/images/icons/bellClean.svg",
      name: "Create Clean",
      arabic: "ساختن کلین",
      link: "/dashboard/clean/create",
    },
    {
      icon: "/images/icons/bellClean.svg",
      name: "Create Plan Clean",
      arabic: "ساختن پلن کلین",
      link: "/dashboard/clean/plan-clean",
    },
    {
      icon: "/images/icons/bellMazeh.svg",
      name: "Create Service",
      arabic: "ساختن سرویس",
      link: "/dashboard/service",
    },
    {
      icon: "/images/icons/bellService.svg",
      name: "Site Settings",
      arabic: "تنظیمات",
      link: "/dashboard/setting",
    },
    // {
    //   icon: "/images/icons/bellService.svg",
    //   name: "Bell Service",
    //   arabic: "بِل سرویس",
    //   link: "/bell-service",
    // },
    // { icon: "/images/icons/bellGuid.svg", name: "Bell Guide", arabic: "بِل گاید", link: "" },
  ];

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-50 ${
        isOpen ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 h-[62vh] bg-black text-white rounded-t-3xl shadow-lg transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">خدمات میزبانو</h2>
        </div> */}
        <div className="w-full flex flex-col justify-between gap-8">
          <div className="p-4 overflow-y-auto h-full">
            {services.map((service, index) => (
              <div
                key={index}
                className={`mx-2 py-4 border-b border-slate-200/50 transform transition-all duration-300 ease-in-out ${
                  isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Link
                  href={service.link}
                  onClick={onClose}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center mr-3">
                    <Image
                      src={service.icon}
                      alt={service.arabic}
                      width={24}
                      height={24}
                      loading="eager"
                      className="ml-4"
                    />
                    <span className="text-md">{service.arabic}</span>
                  </div>
                  <span className="text-lg ml-3 text-slate-200/50 font-lobester">
                    {service.name}
                  </span>
                </Link>
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

export default DashboardDrawer;
