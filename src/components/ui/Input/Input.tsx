import React, { useState } from "react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: "default" | "dropdown" | "active" | "error" | "search";
  options?: string[];
  errorMessage?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  variant = "default",
  options = [],
  errorMessage,
  className = "",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const baseInputClasses =
    "w-full px-3 py-2 border-2 border-black rounded-xl focus:outline-none focus:ring-0 focus:ring-blue-500 placeholder-black/90 placeholder:text-sm";
  const labelClasses = "block mb-1 mr-2 text-sm font-bold text-right ";

  const getInputClasses = () => {
    switch (variant) {
      case "dropdown":
        return `${baseInputClasses} pl-10 cursor-pointer`;
      case "active":
        return `${baseInputClasses} border-green-500 bg-green-50`;
      case "error":
        return `${baseInputClasses} border-red-500`;
      case "search":
        return `${baseInputClasses} pl-10`;
      default:
        return baseInputClasses;
    }
  };

  const renderInput = () => {
    switch (variant) {
      case "dropdown":
        return (
          <div className="relative">
            <input
              {...props}
              className={getInputClasses()}
              readOnly
              onClick={() => setIsOpen(!isOpen)}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            />
            {isOpen && (
              <ul
                role="listbox"
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
              >
                {options.map((option, index) => (
                  <li
                    key={index}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-100 text-right ${
                      index !== options.length - 1 ? "border-b border-gray-300" : ""
                    }`}
                    onClick={() => {
                      if (props.onChange) {
                        props.onChange({
                          target: { value: option },
                        } as React.ChangeEvent<HTMLInputElement>);
                      }
                      setIsOpen(false);
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
            <ChevronDownIcon className="absolute right-[16.9rem] top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        );
      case "search":
        return (
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input {...props} className={getInputClasses()} />
          </div>
        );
      default:
        return <input {...props} className={getInputClasses()} />;
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className={labelClasses}>{label}</label>}
      {renderInput()}
      {variant === "active" && <p className="mt-1 text-sm text-green-600">در حال تایپ</p>}
      {variant === "error" && errorMessage && (
        <p className="mt-1 mr-2 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};
