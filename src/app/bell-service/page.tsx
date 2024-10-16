"use client";
import React, { useState } from "react";
import MultiStepForm from "@/components/Stepper/Stepper";
import Button from "@/components/ui/Button/Button";
import { Address } from "@/components/Profile/Address/types";
import AddressManagement from "@/components/Profile/Address/AddressManagement";
import Image from "next/image";
import { Input } from "@/components/ui/Input/Input";

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

const ConfirmationForm: React.FC = () => (
  <div className="p-4">
    <h1>تایید</h1>
    <p>لطفاً اطلاعات وارد شده را تایید کنید.</p>
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

export default function Page() {
  const [formData, setFormData] = useState<{ addresses: Address[] }>({ addresses: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormChange = (newData: any) => {
    setFormData({ ...formData, ...newData });
  };

  const handleAddressChange = (updatedAddresses: Address[]) => {
    setFormData((prevData) => ({ ...prevData, addresses: updatedAddresses }));
  };

  const steps = [
    {
      id: 1,
      label: "موقعیت",
      content: <DetailsForm addresses={formData.addresses} onAddressChange={handleAddressChange} />,
    },
    { id: 2, label: "سرویس", content: <ServiceForm /> },
    { id: 3, label: "زمان", content: <ConfirmationForm /> },
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
