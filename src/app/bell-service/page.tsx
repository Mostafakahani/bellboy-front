"use client";

import MultiStepForm from "@/components/Stepper/Stepper";
import React, { useState } from "react";

const ServiceForm: React.FC = () => (
  <div className="p-4">
    <h1>انتخاب سرویس</h1>
    <input name="service" placeholder="نام سرویس" className="border p-2 rounded" />
  </div>
);

const DetailsForm: React.FC = () => (
  <div className="p-4">
    <h1>مشخصات</h1>
    <input name="name" placeholder="نام" className="border p-2 rounded mb-2" />
    <input name="email" placeholder="ایمیل" className="border p-2 rounded" />
  </div>
);

const ConfirmationForm: React.FC = () => (
  <div className="p-4">
    <h1>تایید</h1>
    <p>لطفاً اطلاعات وارد شده را تایید کنید.</p>
  </div>
);

const steps = [
  { id: 1, label: "موقعیت", content: <DetailsForm /> },
  { id: 2, label: "سرویس", content: <ServiceForm /> },
  { id: 3, label: "زمان", content: <ConfirmationForm /> },
  { id: 4, label: "زمان", content: <ConfirmationForm /> },
];

export default function Page() {
  const [formData, setFormData] = useState({});

  const handleFormChange = (newData: any) => {
    setFormData({ ...formData, ...newData });
  };

  return (
    <div className="p-4">
      <MultiStepForm formData={formData} onFormChange={handleFormChange} steps={steps} />
    </div>
  );
}
