import React, { useState } from "react";
import { Check } from "lucide-react";

interface Step {
  id: number;
  label: string;
  content: React.ReactNode;
}

interface MultiStepFormProps {
  steps: Step[];
  formData: Record<string, string>;
  onFormChange: (newData: Record<string, string>) => void;
}

const Stepper: React.FC<{ steps: Step[]; currentStep: number }> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between w-full mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep - 1;
        const isCurrent = index === currentStep - 1;
        const isUpcoming = index > currentStep - 1;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none relative">
            <div className={`flex items-center z-10 ${index >= currentStep && "flex-row-reverse"}`}>
              <div
                className={`ml-1 w-[34px] h-6 flex items-center justify-center rounded-full text-xs
    ${
      isCompleted
        ? "bg-primary-600 border-2 border-black transition-all duration-300 ease-in-out"
        : isCurrent
        ? "bg-black text-white transition-all duration-300 ease-in-out shadow-[-15px_0_0_4px_white]"
        : "bg-white border-2 border-black transition-all duration-300 ease-in-out"
    }`}
              >
                {isCompleted ? (
                  <Check size={12} className="text-black" />
                ) : (
                  <span className={isUpcoming ? "text-black font-bold" : ""}>{step.id}</span>
                )}
              </div>

              <div
                className={`ml-2 bg-black text-white px-3 py-1 rounded-full font-bold text-xs
                ${isCurrent ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                transition-all duration-300 ease-in-out`}
              >
                {step.label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-3 -left-14 right-0 h-0.5 transition-all duration-300 ease-in-out
                  ${isCompleted ? "bg-black" : "bg-black"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const MultiStepForm: React.FC<MultiStepFormProps> = ({ steps, formData, onFormChange }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormChange({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="w-full overflow-y-auto">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>
      <div className="mt-8">
        {React.cloneElement(steps[currentStep - 1].content as React.ReactElement, {
          formData,
          handleInputChange,
        })}
      </div>
      <div className="mt-8 flex justify-between">
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          قبلی
        </button>
        <button
          onClick={handleNextStep}
          disabled={currentStep === steps.length}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          بعدی
        </button>
      </div>
    </div>
  );
};

export default MultiStepForm;
