import React from "react";

import Button from "@/components/ui/Button/Button";
import { ProductType } from "@/hooks/cartType";

export type FormDataType = {
  step1: ProductType | null;
  step2: any;
  step3: any; // تعریف دقیق‌تر بر اساس نیاز
  step4: any; // تعریف دقیق‌تر بر اساس نیاز
  step5: any; // تعریف دقیق‌تر بر اساس نیاز
};

interface StepProps {
  data: any;
  onUpdate: (data: any) => void;
}

interface Step0Props extends StepProps {
  onNext: () => void;
  products: ProductType[];
}

export const Step0: React.FC<Step0Props> = ({ onNext }) => {
  return (
    <div className="flex flex-col justify-between min-h-[80vh]">
      <div className="relative flex-grow bg-gray-200">
        <div className="w-full h-full"></div>
      </div>
      <div>
        <div className="bg-white py-4 flex items-center justify-center">
          <Button onXsIsText className="w-40" onClick={onNext}>
            شروع کن
          </Button>
        </div>
      </div>
    </div>
  );
};
