import React from "react";
import { PlusIcon, MinusIcon, TrashIcon } from "lucide-react";

const variantStyles = {
  primary: {
    default:
      "bg-emerald-400 py-6 text-black border-[2px] border-black hover:bg-emerald-300 active:bg-black active:text-white disabled:bg-emerald-100 disabled:text-slate-400 disabled:border-black/30",
    error: "bg-white text-red-500 border border-red-500",
  },
  secondary: {
    default:
      "bg-white text-black border-[2px] border-emerald-400 bg-emerald-300 hover:bg-emerald-50 active:bg-black active:text-white disabled:bg-white disabled:text-emerald-200 disabled:border-emerald-200",
    error: "bg-white text-red-500 border border-red-500",
  },
  tertiary: {
    default:
      "bg-transparent text-black hover:bg-emerald-50 active:bg-black active:text-white disabled:text-emerald-200",
    error: "bg-transparent text-red-500",
  },
};

const sizeStyles = {
  sm: "h-10 w-10 p-2 text-sm",
  md: "h-10 px-4",
  lg: "h-12 px-6",
};

const iconSizeStyles = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  icon?: "plus" | "minus" | "trash";
  isError?: boolean;
  iconOnly?: boolean;
  children?: React.ReactNode;
  onXsIsText?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  isError = false,
  iconOnly = false,
  children,
  className = "",
  disabled = false,
  onXsIsText = false,
  ...props
}) => {
  const variantClass = variantStyles[variant][isError ? "error" : "default"];
  const sizeClass = iconOnly ? iconSizeStyles[size] : sizeStyles[size];

  const getIcon = () => {
    switch (icon) {
      case "plus":
        return <PlusIcon className="w-5 h-5" />;
      case "minus":
        return <MinusIcon className="w-5 h-5" />;
      case "trash":
        return <TrashIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full font-bold transition-colors select-none ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {!iconOnly && children && (
        <span
          className={`${onXsIsText ? "block" : "hidden"}  md:block ${icon ? "ml-2" : "text-sm"} ${
            disabled ? "!text-slate-600" : "text-black"
          }!text-base`}
        >
          {children}
        </span>
      )}
      {icon && getIcon()}
    </button>
  );
};

export default Button;
