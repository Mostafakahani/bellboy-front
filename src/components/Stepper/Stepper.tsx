import React, { useState, useEffect, useCallback } from "react";
import { CheckIcon } from "lucide-react";

interface Step {
  label: string;
  isCompleted: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepChange }) => {
  const [mounted, setMounted] = useState(false);

  const loadProgress = useCallback(() => {
    const savedProgress = localStorage.getItem("stepperProgress");
    if (savedProgress) {
      const { currentStep: savedStep, completedSteps } = JSON.parse(savedProgress);
      onStepChange(savedStep);
      return steps.map((step, index) => ({
        ...step,
        isCompleted: completedSteps.includes(index),
      }));
    }
    return steps;
  }, [steps, onStepChange]);

  const [stepsState, setStepsState] = useState<Step[]>(steps);

  useEffect(() => {
    setMounted(true);
    setStepsState(loadProgress());
  }, [loadProgress]);

  useEffect(() => {
    if (mounted) {
      const completedSteps = stepsState
        .map((step, index) => (step.isCompleted ? index : null))
        .filter((index): index is number => index !== null);
      localStorage.setItem("stepperProgress", JSON.stringify({ currentStep, completedSteps }));
    }
  }, [currentStep, stepsState, mounted]);

  const handleStepClick = (index: number) => {
    if (index < currentStep) {
      onStepChange(index);
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full px-4 py-2">
      <div className="flex items-center justify-between">
        {stepsState.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleStepClick(index)}
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  step.isCompleted
                    ? "bg-green-500 hover:bg-green-600"
                    : index === currentStep
                    ? "bg-blue-500 text-white"
                    : index < currentStep
                    ? "bg-gray-300 hover:bg-gray-400"
                    : "bg-gray-300"
                } transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                disabled={index > currentStep}
              >
                {step.isCompleted ? (
                  <CheckIcon className="w-6 h-6 text-white" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </button>
              <span className="mt-2 text-xs font-medium text-center text-gray-600">
                {step.label}
              </span>
            </div>
            {index < stepsState.length - 1 && (
              <div
                className={`flex-1 h-1 ${
                  step.isCompleted ? "bg-green-500" : "bg-gray-300"
                } transition-colors duration-300`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
