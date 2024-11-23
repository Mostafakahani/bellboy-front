import React, { useState } from "react";
import { Check } from "lucide-react";
import { Address } from "../Profile/Address/types";
import Button from "../ui/Button/Button";

interface Step {
  id: number;
  label: string;
  content: React.ReactNode;
  isComplete: () => boolean;
}

interface MultiStepFormProps {
  steps: Step[];
  formData: { addresses: Address[]; selectedAddress: any; selectedServices: any[] };
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
          <div
            key={step.id}
            className="flex items-center flex-1 last:flex-none relative min-w-[79px]"
          >
            <div
              className={`flex items-center z-10 ${index === 2 && "mr-4"} ${
                index >= currentStep && "flex-row-reverse"
              }`}
            >
              <div
                className={`ml-1 w-[34px] h-6 flex items-center justify-center rounded-full text-xs
    ${
      isCompleted
        ? "bg-primary-500 border-2 border-black transition-all duration-300 ease-in-out"
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
                className={`absolute top-3 -left-20 right-0 h-0.5 transition-all duration-300 ease-in-out
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
    <div className="flex flex-col h-full relative">
      <div className="flex-1">
        <div className="w-full px-4">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
        <div className="py-4 pb-24">
          {React.cloneElement(steps[currentStep - 1].content as React.ReactElement, {
            formData,
            handleInputChange,
          })}
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 mt-auto top-[unset]"
        style={
          {
            // paddingBottom: "env(safe-area-inset-bottom,0px) / 3",
          }
        }
      >
        <div className="max-w-2xl mx-auto flex justify-between gap-7">
          {currentStep !== 1 && (
            <Button
              icon="right"
              variant="secondary"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
            >
              قبلی
            </Button>
          )}
          <Button
            className="w-full"
            onXsIsText
            onClick={
              currentStep === steps.length && steps[currentStep - 1].isComplete()
                ? handleSubmit
                : handleNextStep
            }
          >
            ادامه
          </Button>
        </div>
      </div>
    </div>
  );
};
export default MultiStepForm;
