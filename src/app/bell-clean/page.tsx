"use client";
import React, { useState } from "react";
import MultiStepForm from "@/components/Stepper/Stepper";
import Button from "@/components/ui/Button/Button";
import { Address } from "@/components/Profile/Address/types";
import DateTimeSelector from "@/components/DateTimeSelector";
import FactorDetails from "@/components/Factor/FactorDetails";
import { LocationForm } from "@/components/Location/LocationForm";
import { ServiceForm } from "@/components/ServiceForm/ServiceForm";
import { Modal } from "@/components/BellMazeh/Modal";

interface FactorFormProps {
  formData: any; // You might want to define a more specific type here
  onFormChange: (newData: any) => void;
}

const FactorForm: React.FC<FactorFormProps> = () => {
  const orderSummary = {
    products: [
      { name: "پکیج استاندارد نظافت داخلی", price: 400000 },
      { name: "پکیج استاندارد نظافت خارجی", price: 300000 },
      { name: "پکیج استاندارد نظافت خارجی", price: 300000 },
      // You can add more products here as needed
    ],
    shippingCost: 50000,
  };
  // const handleApplyDiscount = (code: string) => {
  //   // Implement discount logic here
  //   console.log(`Applying discount code: ${code}`);
  //   // Update orderSummary and formData as needed
  // };

  return <FactorDetails orderSummary={orderSummary} />;
};

// export const Modal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
// }> = ({ isOpen, onClose, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
//       <div className="bg-white w-full h-full overflow-auto p-4 relative">
//         <div className="flex justify-between items-center mb-4">
//           <h5 className="font-black text-xl">خدمات نظافت </h5>
//           <button onClick={() => onClose()}>
//             <Image width={24} height={24} src="/images/icons/close.svg" alt="close" />
//           </button>
//         </div>
//         <div className="w-full mt-12">{children}</div>
//       </div>
//     </div>
//   );
// };

export type TimeSlot = {
  start: string;
  end: string;
};

type DaySchedule = {
  date: string;
  dayName: string;
  timeSlots: TimeSlot[];
};

export default function BellCleanPage() {
  const [formData, setFormData] = useState({
    addresses: [] as Address[],
    selectedAddress: null as Address | null,
    selectedServices: [] as string[],
    selectedDateTime: null as { date: string; time: TimeSlot } | null,
    paymentComplete: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);

  // Sample data for a week
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

  const handleDateTimeSelect = (date: string, time: TimeSlot) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedDateTime: { date, time },
    }));
  };

  const handleFormChange = (newData: Partial<typeof formData>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };
  const steps = [
    {
      id: 1,
      label: "موقعیت",
      content: <LocationForm formData={formData} onFormChange={handleFormChange} />,
      isComplete: () => formData.selectedAddress !== null,
    },
    {
      id: 2,
      label: "سرویس",
      content: <ServiceForm formData={formData} onFormChange={handleFormChange} />,
      isComplete: () => formData.selectedServices.length > 0,
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
      isComplete: () => formData.selectedDateTime !== null && selectedTime !== null,
    },
    {
      id: 4,
      label: "پرداخت",
      content: <FactorForm formData={formData} onFormChange={handleFormChange} />,
      isComplete: () => formData.paymentComplete,
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
          steps={steps}
          formData={formData}
          onFormChange={handleFormChange}
          handleSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}
