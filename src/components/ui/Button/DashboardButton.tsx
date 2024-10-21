import React from "react";
import { PlusIcon, MinusIcon } from "lucide-react";
import {
  BackArrowIcon,
  CloseIcon,
  Edit2Icon,
  GPSIcon,
  LeftArrowIcon,
  TrashIcon,
} from "@/icons/Icons";

const variantStyles = {
  primaryIsIcon: {
    default:
      "bg-white py-6 text-blackborder-2 border-gray-100 hover:bg-[#343A40] hover:border-[#00B673] hover:text-white disabled:bg-gray-300/80 disabled:text-gray-100 disabled:border-black/30",
    error: "bg-white text-red-500 border-2 border-red-500 py-6",
  },
  primary: {
    default:
      "bg-[#00B673] py-6 text-black hover:bg-[#008554] text-white active:bg-black active:text-white disabled:bg-gray-300/80 disabled:text-gray-100 disabled:border-black/30",
    error: "bg-white text-red-500 border-2 border-red-500 py-6",
  },
  secondary: {
    default:
      "bg-white py-6 text-gray-800/90 hover:border-[#00B673] border-2 border-gray-100 active:bg-primary-100 active:text-black disabled:bg-white disabled:text-gray-50 disabled:border-gray-100",
    error: "bg-white text-red-500 border-2 border-red-500",
  },
  tertiary: {
    default:
      "bg-transparent py-6 text-black hover:bg-primary-50 active:bg-black active:text-white disabled:border-black/50 disabled:text-primary-200",
    error: "bg-transparent text-red-500",
  },
  oneIcon: {
    default:
      "py-6 text-green-700 py-2 rounded-2xl flex items-center border-gray-100 hover:border-[#00B673] border-2 border-gray-100 hover:bg-gray-800/90 hover:border-transparent hover:text-white disabled:bg-gray-300/80 disabled:text-gray-100 disabled:border-black/30",
    error: "bg-red-500 text-white py-2 rounded-2xl flex items-center",
  },
  twoIcons: {
    default:
      "py-6 border-2 border-gray-100 text-green-700 py-2 hover:bg-gray-800/90 hover:border-transparent hover:text-white disabled:bg-gray-300/80 disabled:text-gray-100 disabled:border-black/30 hover:border-[#00B673] text-white py-2 rounded-2xl flex items-center justify-between",
    error: "bg-red-500 text-white py-2 rounded-2xl flex items-center justify-between",
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

interface DashboardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "primaryIsIcon" | "oneIcon" | "twoIcons";
  size?: "sm" | "md" | "lg";
  icon?: "plus" | "minus" | "trash" | "right" | "gps" | "edit" | "left" | boolean;
  secondIcon?: "x";
  isError?: boolean;
  iconOnly?: boolean;
  children?: React.ReactNode;
  onXsIsText?: boolean;
  iconClassname?: string;
  iconColor?: string;
}

const DashboardButton: React.FC<DashboardButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  iconClassname,
  iconColor = "#ffffff",
  secondIcon = "x",
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

  const getIcon = (iconType: string, isSecondIcon: boolean = false) => {
    const IconComponent = {
      plus: PlusIcon,
      minus: MinusIcon,
      trash: TrashIcon,
      right: BackArrowIcon,
      left: LeftArrowIcon,
      gps: GPSIcon,
      edit: Edit2Icon,
      x: CloseIcon,
    }[iconType];

    return IconComponent ? (
      <IconComponent
        className={`${iconClassname} ${
          isSecondIcon && variant === "twoIcons" ? "second-icon-hover" : ""
        }`}
        style={{
          color: iconColor,
          ...(isSecondIcon &&
            variant === "twoIcons" && {
              background: "#E9ECEF",
              borderRadius: "50%",
              padding: "5px",
              width: "20px",
              height: "auto",
              color: "#344054",
              marginRight: "8px",
            }),
        }}
      />
    ) : null;
  };

  const renderContent = () => {
    if (variant === "oneIcon" || variant === "twoIcons") {
      return (
        <>
          {icon && getIcon(icon as string)}
          <span className="mr-2">{children}</span>
          {variant === "twoIcons" && secondIcon && getIcon(secondIcon, true)}
        </>
      );
    }

    return (
      <>
        {!iconOnly && children && (
          <span
            className={`${onXsIsText ? "block" : "hidden"} font-light md:block ${
              icon ? "ml-2" : "text-sm "
            } ${disabled ? "text-gray-400" : ""} !text-base`}
          >
            {children}
          </span>
        )}
        {icon && getIcon(icon as string)}
      </>
    );
  };

  return (
    <>
      <style jsx>{`
        .second-icon-hover:hover {
          background: red !important;
        }
      `}</style>
      <button
        className={`inline-flex items-center justify-center rounded-2xl transition-colors select-none ${variantClass} ${sizeClass} ${className}`}
        disabled={disabled}
        {...props}
      >
        {renderContent()}
      </button>
    </>
  );
};

export default DashboardButton;
