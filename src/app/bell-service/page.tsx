"use client";
import Stepper from "@/components/Stepper/Stepper";
import React, { useState } from "react";

const steps = [
  { label: "زمان", isCompleted: false },
  { label: "موقعیت", isCompleted: false },
  { label: "سرویس", isCompleted: false },
  // Voeg meer stappen toe indien nodig
];

const YourComponent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    // Hier kun je de logica toevoegen voor het controleren of de velden zijn ingevuld
    // en de stap als voltooid markeren
  };

  return (
    <div>
      <Stepper steps={steps} currentStep={currentStep} onStepChange={handleStepChange} />
      <button onClick={() => setCurrentStep(currentStep - 1)}>-setCurrentStep</button>
      <button onClick={() => setCurrentStep(currentStep + 1)}>setCurrentStep</button>
      {/* Voeg hier de inhoud van je stappen toe */}
    </div>
  );
};

export default YourComponent;
