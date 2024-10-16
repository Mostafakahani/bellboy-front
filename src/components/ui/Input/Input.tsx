import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, "onChange"> {
  label?: string;
  variant?: "default" | "dropdown" | "active" | "error" | "search" | "textarea";
  options?: string[];
  errorMessage?: string;
  rows?: number;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  variant = "default",
  options = [],
  errorMessage,
  className = "",
  onChange,
  rows = 3,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const baseInputClasses =
    "w-full px-3 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-0 focus:ring-blue-500 placeholder-black/90 placeholder:text-sm";
  const labelClasses = "block mb-1 mr-2 text-sm font-bold text-right";

  const getInputClasses = () => {
    switch (variant) {
      case "dropdown":
        return `${baseInputClasses} pl-10 cursor-pointer`;
      case "active":
        return `${baseInputClasses} border-primary-500 bg-primary-50`;
      case "error":
        return `${baseInputClasses} border-red-500`;
      case "search":
        return `${baseInputClasses} pl-10`;
      case "textarea":
        return `${baseInputClasses} resize-none`;
      default:
        return baseInputClasses;
    }
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionSelect = (option: string) => {
    if (onChange) {
      const event = {
        target: {
          name: props.name,
          value: option,
        },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(event);
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  const renderInput = () => {
    switch (variant) {
      case "dropdown":
        return (
          <div className="relative" ref={dropdownRef}>
            <input
              {...props}
              className={getInputClasses()}
              readOnly
              onClick={() => setIsOpen(!isOpen)}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            />
            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <input
                  type="text"
                  className="w-full px-3 py-2 border-b border-gray-300"
                  placeholder="جستجو..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ul role="listbox" className="max-h-60 overflow-y-auto">
                  {filteredOptions.map((option, index) => (
                    <li
                      key={index}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-100 text-right ${
                        index !== filteredOptions.length - 1 ? "border-b border-gray-300" : ""
                      }`}
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <ChevronDownIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        );
      case "search":
        return (
          <div className="relative">
            <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input {...props} className={getInputClasses()} onChange={onChange} />
          </div>
        );
      case "textarea":
        return (
          <textarea {...props} rows={rows} className={getInputClasses()} onChange={onChange} />
        );
      default:
        return <input {...props} className={getInputClasses()} onChange={onChange} />;
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={props.id || label} className={labelClasses}>
          {label}
        </label>
      )}
      {renderInput()}
      {variant === "active" && <p className="mt-1 text-sm text-green-600">در حال تایپ</p>}
      {variant === "error" && errorMessage && (
        <p className="mt-1 mr-2 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};
