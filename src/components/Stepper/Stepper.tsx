import React, { useState } from "react";
import { Check } from "lucide-react";
import { Address } from "../Profile/Address/types";
import Button from "../ui/Button/Button";

interface Step {
  id: number;
  label: string;
  content: React.ReactNode;
  isComplete: () => boolean; // Add this line to define isComplete as a function
}

interface MultiStepFormProps {
  steps: Step[]; // The steps array will now contain `isComplete` for each step
  formData: { addresses: Address[]; selectedAddress: any; selectedServices: any[] }; // Adjust formData to match structure
  onFormChange: (newData: {
    addresses: Address[];
    selectedAddress?: any;
    selectedServices?: any[];
  }) => void;
  handleSubmit: () => void;
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

const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  formData,
  onFormChange,
  handleSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    if (currentStep < steps.length && steps[currentStep - 1].isComplete()) {
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
    <div className="max-w-2xl mx-auto flex flex-col justify-between min-h-[80vh]">
      <div className="w-full h-full">
        <div className="w-full overflow-y-auto">
          <Stepper steps={steps} currentStep={currentStep} />
          <div className="w-full border-b-2 border-black absolute top-36 left-0"></div>
        </div>
        <div className="">
          {React.cloneElement(steps[currentStep - 1].content as React.ReactElement, {
            formData,
            handleInputChange,
          })}
        </div>
      </div>
      <div className="mt-8 flex justify-between gap-7 mx-1">
        <Button
          icon="right"
          variant="secondary"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
        >
          قبلی
        </Button>
        <Button
          className="w-full"
          onXsIsText
          onClick={
            currentStep === steps.length && steps[currentStep - 1].isComplete()
              ? handleSubmit
              : handleNextStep
          }
          // disabled={currentStep === steps.length || formData.addresses.length === 0}
        >
          ادامه
        </Button>
      </div>
    </div>
  );
};

export default MultiStepForm;
