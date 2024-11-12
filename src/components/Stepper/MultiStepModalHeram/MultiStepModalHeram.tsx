import React, { useEffect, useState } from "react";
import { Modal } from "@/components/BellMazeh/Modal";
import { FormDataType, Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step0 } from "./Step0";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";
import { CartItem, ProductType } from "@/hooks/cartType";
import MultiStepForm from "../Stepper";
import DateTimeSelector, { TimeSlot } from "@/components/DateTimeSelector";
import { LocationForm } from "@/components/Location/LocationForm";
import CartForm from "@/components/Profile/Cart/CartForm";
import { ensureCartArray, useCartOperations } from "@/hooks/useCartOperations";
import { saveState } from "@/utils/localStorage";
import { getCookie } from "cookies-next";
import { FormData } from "@/components/BellShop/ClientShop";
import { ApiResponse, useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { Address } from "@/components/Profile/Address/types";
import { showError, showSuccess } from "@/lib/toastService";
import FactorDetails from "../../Factor/FactorDetails";
import { Loader2 } from "lucide-react";
interface MultiStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductType[];
}
const FactorForm: React.FC<{ formData: any; onFormChange: (newData: any) => void }> = ({
  formData,
  onFormChange,
}) => {
  return <FactorDetails formData={formData} onFormChange={onFormChange} />;
};

const MultiStepModal: React.FC<MultiStepModalProps> = ({ isOpen, onClose, products }) => {
  const authenticatedFetch = useAuthenticatedFetch();

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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [isModalCheckOutOpen, setIsModalCheckOutOpen] = useState(false);
  const [formData1, setFormData1] = useState<FormData>({
    addresses: [],
    selectedAddress: null,
    selectedServices: [],
    selectedDateTime: null,
    paymentComplete: false,
  });
  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleFinish = async () => {
    const token = getCookie("auth_token");

    if (!token) {
      showError("برای انجام این عملیات باید وارد حساب خود شده باشید");
      return;
    }
    setIsLoading(true);
    try {
      const response = await authenticatedFetch<ApiResponse>("/cart", {
        method: "POST",
        body: JSON.stringify({
          items: {
            stage1: [{ productId: formData.step1?._id, quantity: 1 }],
            stage2: [{ productId: formData.step2?._id, quantity: 1 }],
            stage3: [{ productId: formData.step3?._id, quantity: 1 }],
            stage4: [{ productId: formData.step4?._id, quantity: 1 }],
            count: 1,
          },
        }),
      });

      if (response.status === "success") {
        await fetchCart();
        showSuccess("محصول به سبد خرید اضافه شد");
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
    closeAndRemoveFileds();
  };
  function closeAndRemoveFileds() {
    setStep(0);
    setFormData({
      step0: null,
      step1: null,
      step2: null,
      step3: null,
      step4: null,
      step5: null,
    });
    onClose();
  }
  useEffect(() => {
    const totalP =
      (formData.step1?.price || 0) +
      (formData.step2?.price || 0) +
      (formData.step3?.price || 0) +
      (formData.step4?.price || 0);
    setTotalPrice(totalP);
  }, [formData]); // هر بار که formData تغییر کند، useEffect اجرا می‌شود

  const onUpdate = (stepData: any) => {
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
            onNext={async () => {
              handleNext();
              // onClose();
              await handleFinish();
              setIsModalCheckOutOpen(true);
            }}
            onPrev={handlePrev}
            data={formData.step4}
            onUpdate={onUpdate}
            products={products}
            totalPrice={totalPrice}
          />
        );
      case 5:
        return (
          <Modal
            isOpen={isModalCheckOutOpen}
            onClose={() => {
              setIsModalCheckOutOpen(false);
            }}
            title="هرم مزه"
          >
            <MultiStepForm
              steps={steps}
              formData={formData1}
              onFormChange={handleFormChange}
              handleSubmit={() => console.log(formData)}
            />
          </Modal>
        );
      default:
        return <Loader2 className="w-5 h-5 animate-spin" />;
    }
  };
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("سبد خرید به‌روز شد:", cart);
  }, [cart]);
  const handleFormChange = (newData: Partial<FormData>) => {
    setFormData1((prev) => ({ ...prev, ...newData }));
  };

  const handleDateTimeSelect = (date: string, time: TimeSlot) => {
    setFormData1((prev) => ({
      ...prev,
      selectedDateTime: {
        date,
        time,
        timeSlotId: time._id,
      },
    }));
  };
  const fetchCart = async () => {
    const token = getCookie("auth_token");

    if (!token) return;
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      // if (!response.ok) {
      //   throw new Error("Failed to fetch profile data");
      // }

      const data = await response.json();
      console.log(data);
      setCart(ensureCartArray(data));
      saveState("cart", ensureCartArray(data));
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };
  const { loadingItems, removeFromCart, updateCartItemQuantity } = useCartOperations(setCart);
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          fetchCart(),
          // fetchAddresses(),
        ]);
      } catch (error) {
        console.error("Error in initial data fetch:", error);
      }
    };

    fetchInitialData();
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      fetchAddresses();
    }
  }, [isModalOpen]);
  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      console.log({ message });
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };
  const fetchAddresses = async () => {
    try {
      setIsLoading(true);

      const { data, error, message, status } = await authenticatedFetch("/address", {
        method: "GET",
      });

      if (error) {
        setIsLoading(false);
        throw new Error(formatErrorMessage(message));
      }

      // if (data?.statusCode && data.statusCode !== 200) {
      //   setIsLoading(false);
      //   throw new Error(formatErrorMessage(data.message));
      // }

      if (status === "success") {
        // showSuccess(message);
        setIsLoading(false);
      }
      //  else {
      //   throw new Error(formatErrorMessage(data?.message) || "خطا در ارسال اطلاعات");
      // }
      console.log(data);
      setFormData1((prev) => ({
        ...prev,
        addresses: data as Address[],
      }));

      // handleFormChange({ addresses: data?.data });
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };
  // const handleCartOperations = {
  //   remove: async (cartId: string) => {
  //     await removeFromCart(cartId);
  //     await fetchCart();
  //   },
  //   updateQuantity: async (cartId: string, newQuantity: number, currentQuantity: number) => {
  //     await updateCartItemQuantity(cartId, newQuantity, currentQuantity);
  //     if (newQuantity === 0) await fetchCart();
  //   },
  // };

  // Steps configuration
  const steps = [
    {
      id: 1,
      label: "سبدخرید",
      content: (
        <CartForm
          fetchCart={fetchCart}
          setCart={setCart}
          cartData={cart}
          isLoading={false}
          loadingItems={loadingItems}
          onUpdateQuantity={updateCartItemQuantity}
          onRemoveItem={removeFromCart}
          // onContinue={handleContinue}
        />
      ),
      isComplete: () => cart.length !== 0,
    },
    {
      id: 2,
      label: "موقعیت",
      content: (
        <LocationForm formData={formData1} isLoading={isLoading} onFormChange={handleFormChange} />
      ),
      isComplete: () => formData1.selectedAddress !== null,
    },
    {
      id: 3,
      label: "زمان",
      content: (
        <DateTimeSelector
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          onSelect={handleDateTimeSelect}
        />
      ),
      isComplete: () => formData1.selectedDateTime !== null && selectedTime !== null,
    },

    {
      id: 4,
      label: "پرداخت",
      content: <FactorForm formData={formData} onFormChange={handleFormChange} />,
      isComplete: () => formData1.paymentComplete,
    },
  ];
  return (
    <Modal isOpen={isOpen} onClose={() => closeAndRemoveFileds()} title="هرم مزه سفارشی">
      {/* <button onClick={handleFinish}>log</button> */}
      {renderStep()}
      {/* <Modal
        isOpen={isModalCheckOutOpen}
        onClose={() => {
          setIsModalCheckOutOpen(false);
        }}
      >
      
      </Modal> */}
    </Modal>
  );
};

export default MultiStepModal;
