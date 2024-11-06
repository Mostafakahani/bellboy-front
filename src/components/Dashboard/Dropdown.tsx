import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  options: SelectOption[];
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const Dropdown: React.FC<Props> = ({ options, label, value, onChange }) => {
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

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm text-right mr-2">{label}</label>
      <div className="relative" ref={dropdownRef}>
        <input
          type="text"
          readOnly
          value={options.find((opt) => opt.value === value)?.label || ""}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          placeholder="انتخاب دسته بندی"
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
            <ul className="max-h-60 overflow-y-auto">
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className="px-4 py-3 cursor-pointer hover:bg-gray-100 text-right border-b border-gray-300"
                  onClick={() => handleOptionSelect(option.value)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
        <ChevronDownIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};
