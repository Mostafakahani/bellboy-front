import React, { useState, useEffect } from "react";
import { X, Moon, Bell, Lock, Globe } from "lucide-react";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("fa");
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300); // مدت زمان انیمیشن
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-50 ${
        isOpen ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">تنظیمات</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-full">
          <section className="mb-6">
            <h3 className="text-md font-medium mb-2">ظاهر</h3>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <Moon size={20} className="ml-2" />
                حالت تاریک
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-md font-medium mb-2">اعلان‌ها</h3>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <Bell size={20} className="ml-2" />
                دریافت اعلان‌ها
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-md font-medium mb-2">زبان</h3>
            <div className="flex items-center">
              <Globe size={20} className="ml-2" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mr-2 p-2 border rounded-md"
              >
                <option value="fa">فارسی</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-md font-medium mb-2">امنیت</h3>
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center">
              <Lock size={20} className="ml-2" />
              تغییر رمز عبور
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsDrawer;
