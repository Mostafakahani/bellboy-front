"use client";
import MainHeader from "@/components/mobile/Header/MainHeader";
import Button from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { Moon } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
      <MainHeader />
      <div className="h-[150vh]">
        <div className="space-y-4 p-5">
          <div className="flex flex-col gap-3">
            <Button variant="primary" size="sm" icon="plus">
              جديد
            </Button>
            <Button variant="primary" isError size="sm" icon="trash" />
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-400"></div>
                </label>
              </div>
            </section>
            <ThemeSelector darkMode={darkMode} setDarkMode={setDarkMode} />
            <ThemeSelectorCheckBox darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
          <div className="space-y-4 p-4">
            <Input label="عنوان فیلد" />
            <Input
              label="عنوان فیلد"
              variant="dropdown"
              placeholder="عنوان سردست"
              options={["گزینه 1", "گزینه 2", "گزینه 3"]}
            />
            <Input label="تاچ / کلیک / انتخاب" variant="active" value="در حال تایپ" />
            <Input
              label="عنوان فیلد"
              variant="error"
              value="مقدار اشتباه"
              errorMessage="این بخش اجباری است"
            />
            <Input variant="search" placeholder="جستجو" />
          </div>
        </div>
      </div>
    </>
  );
}
const ThemeSelector = ({ darkMode, setDarkMode }: any) => {
  return (
    <section className="mb-6">
      <h3 className="text-md font-medium mb-2">انتخاب تم</h3>
      <div className="flex flex-col space-y-2">
        {/* Combined Radio Buttons */}
        {["light", "dark"].map((theme) => (
          <label
            key={theme}
            className={`inline-flex items-center cursor-pointer ${
              darkMode === (theme === "dark") ? "opacity-100" : "opacity-90"
            }`}
          >
            <input
              type="radio"
              name="theme"
              value={theme}
              className="sr-only peer"
              checked={darkMode === (theme === "dark")}
              onChange={() => setDarkMode(theme === "dark")}
            />
            <div className="relative w-6 h-6 rounded-full border-2 border-black flex items-center justify-center">
              <div
                className={`w-4 h-4 rounded-full peer-checked:bg-primary-400 border-2 border-black ${
                  darkMode === (theme === "dark") ? "bg-primary-400" : "bg-white border-0"
                }`}
              ></div>
            </div>
            <span className="ml-2">{theme === "dark" ? "حالت تاریک" : "حالت روشن"}</span>
          </label>
        ))}
      </div>
    </section>
  );
};
const ThemeSelectorCheckBox = ({ darkMode, setDarkMode }: any) => {
  return (
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
          <CheckMark isChecked={darkMode} />
        </label>
      </div>
    </section>
  );
};
const CheckMark = ({ isChecked }: any) => {
  return (
    <div
      className={`w-6 h-6 rounded-md border-2 border-black flex items-center justify-center ${
        isChecked ? "bg-primary-400" : "bg-white"
      }`}
    >
      {isChecked && (
        <svg
          className="w-4 h-4 text-black"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
};
