"use client";
import React, { useState } from "react";
import MultiStepForm from "@/components/Stepper/Stepper";
import Button from "@/components/ui/Button/Button";
import { Address } from "@/components/Profile/Address/types";
import AddressManagement from "@/components/Profile/Address/AddressManagement";
import Image from "next/image";
import { Input } from "@/components/ui/Input/Input";
import DateTimeSelector from "@/components/DateTimeSelector";

const DetailsForm: React.FC<{
  addresses: Address[];
  onAddressChange: (addresses: Address[]) => void;
}> = ({ addresses, onAddressChange }) => (
  <div className="p-4">
    <div className="container mx-auto">
      <AddressManagement
        title="موقعیت خود را انتخاب کنید"
        initialAddresses={addresses}
        onAddressChange={onAddressChange}
      />
    </div>
  </div>
);

const ServiceForm: React.FC = () => (
  <div className="p-4">
    <Input variant="dropdown" placeholder="انتخاب کنید" label="موضوع" />
    <Input variant="dropdown" placeholder="انتخاب کنید" label="نوع سرویس" />
    <Input variant="textarea" label="توضیحات" />
  </div>
);

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white w-full h-full overflow-auto p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h5 className="font-black text-xl">بل سرویس </h5>
          <button onClick={() => onClose()}>
            <Image width={24} height={24} src="/images/icons/close.svg" alt="close" />
          </button>
        </div>
        <div className="w-full mt-12">{children}</div>
      </div>
    </div>
  );
};

type TimeSlot = {
  start: string;
  end: string;
};

type DaySchedule = {
  date: string;
  dayName: string;
  timeSlots: TimeSlot[];
};

export default function Page() {
  const [formData, setFormData] = useState<{ addresses: Address[] }>({ addresses: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // نمونه داده برای یک هفته
  const demoWeekSchedule: DaySchedule[] = [
    {
      date: "۱۲ مهر",
      dayName: "شنبه",
      timeSlots: [
        { start: "۸", end: "۱۲" },
        { start: "۱۳", end: "۱۷" },
        { start: "۱۸", end: "۲۲" },
      ],
    },
    {
      date: "۱۳ مهر",
      dayName: "یکشنبه",
      timeSlots: [
        { start: "۸", end: "۱۲" },
        { start: "۱۳", end: "۱۷" },
        { start: "۱۸", end: "۲۲" },
      ],
    },
  ];
  const handleFormChange = (newData: any) => {
    setFormData({ ...formData, ...newData });
  };

  const handleAddressChange = (updatedAddresses: Address[]) => {
    setFormData((prevData) => ({ ...prevData, addresses: updatedAddresses }));
  };
  const handleDateTimeSelect = (date: string, time: TimeSlot) => {
    console.log(`Selected: ${date}, ${time.start}-${time.end}`);
  };
  const steps = [
    {
      id: 1,
      label: "موقعیت",
      content: <DetailsForm addresses={formData.addresses} onAddressChange={handleAddressChange} />,
    },
    { id: 2, label: "سرویس", content: <ServiceForm /> },
    {
      id: 3,
      label: "زمان",
      content: <DateTimeSelector weekSchedule={demoWeekSchedule} onSelect={handleDateTimeSelect} />,
    },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-4">
      <Button onXsIsText onClick={openModal}>
        ثبت سفارش
      </Button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <MultiStepForm formData={formData} onFormChange={handleFormChange} steps={steps} />
      </Modal>
    </div>
  );
}
