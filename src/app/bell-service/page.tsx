"use client";
import React, { useState } from "react";
import MultiStepForm from "@/components/Stepper/Stepper";
import Button from "@/components/ui/Button/Button";
import { Address } from "@/components/Profile/Address/types";
import AddressManagement from "@/components/Profile/Address/AddressManagement";
import Image from "next/image";
import { Input } from "@/components/ui/Input/Input";
import DateTimeSelector from "@/components/DateTimeSelector";

// DetailsForm Component for Step 1
const DetailsForm: React.FC<{
  addresses: Address[];
  onAddressChange: (addresses: Address[]) => void;
}> = ({ addresses, onAddressChange }) => (
  <div className="py-4">
    <div className="container mx-auto">
      <AddressManagement
        title="موقعیت خود را انتخاب کنید"
        initialAddresses={addresses}
        onAddressChange={onAddressChange}
      />
    </div>
  </div>
);

// ServiceForm Component for Step 2
const ServiceForm: React.FC = () => (
  <div className="py-4">
    <Input variant="dropdown" placeholder="انتخاب کنید" label="موضوع" />
    <Input variant="dropdown" placeholder="انتخاب کنید" label="نوع سرویس" />
    <Input variant="textarea" label="توضیحات" />
  </div>
);

// Modal Component to display MultiStepForm
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
          <h5 className="font-black text-xl">بل سرویس</h5>
          <button onClick={onClose}>
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
  const [formData, setFormData] = useState<{
    addresses: Address[];
    selectedAddress: any;
    selectedServices: any[];
  }>({
    addresses: [],
    selectedAddress: null,
    selectedServices: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);

  // Example data for a week schedule
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
    setSelectedTime(time);
  };

  // Fix: Use a function to return whether the step is complete
  const steps = [
    {
      id: 1,
      label: "موقعیت",
      content: <DetailsForm addresses={formData.addresses} onAddressChange={handleAddressChange} />,
      isComplete: () => formData.addresses.length > 0, // Dynamic function to check completion
    },
    {
      id: 2,
      label: "سرویس",
      content: <ServiceForm />,
      isComplete: () => formData.selectedServices.length > 0, // Dynamic function to check completion
    },
    {
      id: 3,
      label: "زمان",
      content: (
        <DateTimeSelector
          weekSchedule={demoWeekSchedule}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          onSelect={handleDateTimeSelect}
        />
      ),
      isComplete: () => selectedTime !== null, // Dynamic function to check completion
    },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleSubmit = () => {
    console.log(formData);
  };
  return (
    <div className="p-4">
      <Button onXsIsText onClick={openModal}>
        ثبت سفارش
      </Button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <MultiStepForm
          formData={formData}
          onFormChange={handleFormChange}
          handleSubmit={handleSubmit}
          steps={steps}
        />
      </Modal>
    </div>
  );
}
