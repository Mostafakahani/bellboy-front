import React, { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import { PhoneNumberDisplay } from "./PhoneNumberDisplay";
import { PhoneNumberEditDialog } from "./PhoneNumberEditDialog";
import { DialogProps, FormData } from "./ProfileTypes";

export const ProfileDialog: React.FC<DialogProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "علیرضا",
    lastName: "میر حیدری",
    phoneNumber: "09123456789",
    birthDate: "1371/07/04",
  });
  const [showPhoneEdit, setShowPhoneEdit] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  const handlePhoneEdit = () => {
    console.log(`Sending OTP to ${formData.phoneNumber}`);
    setShowPhoneEdit(true);
  };

  const handlePhoneSave = (newNumber: string) => {
    setFormData((prev) => ({ ...prev, phoneNumber: newNumber }));
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white w-full p-6 transform transition-all duration-300 ease-out ${
            isOpen
              ? "translate-y-0 scale-100 opacity-100 h-vh"
              : "translate-y-full scale-95 opacity-0 h-0"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">مشخصات حساب من</h2>
            <button onClick={onClose}>
              <Image width={24} height={24} src="/images/icons/close.svg" alt="close" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col justify-between h-[85vh] mt-12">
            <div className="flex flex-col gap-4">
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                type="text"
                label="نام"
              />
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                type="text"
                label="نام خانوادگی"
              />
              <PhoneNumberDisplay phoneNumber={formData.phoneNumber} onEdit={handlePhoneEdit} />
              <Input
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                type="date"
                label="تاریخ تولد"
              />
            </div>
            <Button onXsIsText type="submit">
              ذخیره تغییرات
            </Button>
          </form>
        </div>
      </div>
      <PhoneNumberEditDialog
        isOpen={showPhoneEdit}
        onClose={() => setShowPhoneEdit(false)}
        onSave={handlePhoneSave}
        currentPhoneNumber={formData.phoneNumber}
      />
    </>
  );
};
