import React from "react";
import Image from "next/image";

interface PhoneNumberDisplayProps {
  phoneNumber: string;
  onEdit: () => void;
}

export const PhoneNumberDisplay: React.FC<PhoneNumberDisplayProps> = ({ phoneNumber, onEdit }) => (
  <div className="mb-4">
    <label className="block mb-1 mr-2 text-sm font-bold text-right">شماره موبایل</label>
    <div className="relative w-full max-w-md">
      <div className="flex items-center justify-between border-2 px-3 py-3 border-black rounded-xl focus:outline-none focus:ring-0 bg-gray-100">
        <span className="text-gray-700">{phoneNumber}</span>
        <button
          type="button"
          onClick={onEdit}
          className="text-gray-400 hover:text-gray-600 focus:outline-none ml-2"
        >
          <Image width={22} height={22} src="/images/icons/edit.svg" alt="edit" />
        </button>
      </div>
    </div>
  </div>
);
