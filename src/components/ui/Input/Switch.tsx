import React from "react";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer
        rounded-full transition-colors duration-200 ease-in-out
        ${checked ? "bg-blue-600" : "bg-gray-200"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform
          rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
          ${checked ? "translate-x-5" : "translate-x-0"}
        `}
        style={{ margin: "2px" }}
      />
    </button>
  );
};

export { Switch };
