import React from "react";
import { PlusIcon, MinusIcon, Loader2 } from "lucide-react";
import { BackArrowIcon, EditIcon, GPSIcon, LeftArrowIcon, TrashIcon } from "@/icons/Icons";

const variantStyles = {
  primary: {
    default:
      "bg-primary-400 py-6 text-black border-[2px] border-black hover:bg-primary-300 active:bg-black active:text-white disabled:bg-primary-100 disabled:text-slate-400 disabled:border-black/30",
    error: "bg-white text-red-500 border-2 border-red-500 py-6",
  },
  secondary: {
    default:
      "bg-primary-400/10 py-6 text-black border-[2px] border-black font-bold bg-primary-300 hover:bg-primary-50 active:bg-black active:text-white disabled:bg-white disabled:text-primary-200 disabled:border-black",
    error: "bg-white text-red-500 border-2 border-red-500",
  },
  tertiary: {
    default:
      "bg-transparent text-black hover:bg-primary-50 active:bg-black active:text-white disabled:border-black/50 disabled:text-primary-200",
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
  icon?: "plus" | "minus" | "trash" | "right" | "gps" | "edit" | "left" | boolean;
  isError?: boolean;
  iconOnly?: boolean;
  children?: React.ReactNode;
  onXsIsText?: boolean;
  loading?: boolean;
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
  loading = false,
  ...props
}) => {
  const variantClass = variantStyles[variant][isError ? "error" : "default"];
  const sizeClass = iconOnly ? iconSizeStyles[size] : sizeStyles[size];

  const getIcon = () => {
    if (loading) {
      return <Loader2 className="w-5 h-5 animate-spin" />;
    }

    switch (icon) {
      case "plus":
        return <PlusIcon className="w-5 h-5" />;
      case "minus":
        return <MinusIcon className="w-5 h-5" />;
      case "trash":
        return <TrashIcon />;
      case "right":
        return <BackArrowIcon className="w-5 h-5" />;
      case "left":
        return <LeftArrowIcon />;
      case "gps":
        return <GPSIcon />;
      case "edit":
        return <EditIcon />;
      default:
        return null;
    }
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full font-bold transition-colors select-none ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {!iconOnly && children && (
        <span
          className={`${onXsIsText ? "block" : "hidden"}  md:block ${icon ? "ml-2" : "text-sm "} ${
            disabled || loading ? "!text-slate-600" : "text-black"
          }${isError && "!text-red-600"} !text-base`}
        >
          {children}
        </span>
      )}
      {(icon || loading) && getIcon()}
    </button>
  );
};

export default Button;
