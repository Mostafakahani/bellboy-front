import React, { useEffect, useState } from "react";
import { Modal } from "@/components/BellMazeh/Modal";
import { FormDataType, ProductType, Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step0 } from "./Step0";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";

interface MultiStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductType[];
}

const MultiStepModal: React.FC<MultiStepModalProps> = ({ isOpen, onClose, products }) => {
  const [step, setStep] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formData, setFormData] = useState<FormDataType>({
    step0: null,
    step1: null,
    step2: null,
    step3: null,
    step4: null,
    step5: null,
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleFinish = () => {
    console.log("اطلاعات نهایی:", formData);

    // setStep(0);
    // onClose();
  };
  useEffect(() => {
    const totalP =
      (formData.step1?.price || 0) +
      (formData.step2?.price || 0) +
      (formData.step3?.price || 0) +
      (formData.step4?.price || 0);
    setTotalPrice(totalP);
  }, [formData]); // هر بار که formData تغییر کند، useEffect اجرا می‌شود

  const onUpdate = (stepData: any) => {
    console.log(formData);
    setFormData((prevData) => ({
      ...prevData,
      [`step${step}`]: stepData,
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Step0
            onNext={handleNext}
            data={formData.step1}
            onUpdate={onUpdate}
            products={products}
          />
        );
      case 1:
        return (
          <Step1
            onNext={handleNext}
            onPrev={handlePrev}
            data={formData.step1}
            onUpdate={onUpdate}
            products={products}
            totalPrice={totalPrice}
          />
        );
      case 2:
        return (
          <Step2
            onNext={handleNext}
            onPrev={handlePrev}
            data={formData.step2}
            onUpdate={onUpdate}
            products={products}
            totalPrice={totalPrice}
          />
        );
      case 3:
        return (
          <Step3
            onNext={handleNext}
            onPrev={handlePrev}
            data={formData.step3}
            onUpdate={onUpdate}
            products={products}
            totalPrice={totalPrice}
          />
        );
      case 4:
        return (
          <Step4
            onNext={handleNext}
            onPrev={handlePrev}
            data={formData.step4}
            onUpdate={onUpdate}
            products={products}
            totalPrice={totalPrice}
          />
        );
      case 5:
      // return (
      //   <Step5
      //     onPrev={handlePrev}
      //     onFinish={handleFinish}
      //     data={formData.step5}
      //     onUpdate={onUpdate}
      //   />
      // );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="هرم مزه سفارشی">
      <button onClick={handleFinish}>log</button>
      {renderStep()}
    </Modal>
  );
};

export default MultiStepModal;
