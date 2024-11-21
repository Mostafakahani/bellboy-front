"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/BellMazeh/Modal";
import { usePathname } from "next/navigation";
import { getPathType } from "./GetPathType";
import MultiStepForm from "@/components/Stepper/Stepper";
import { CartItem } from "@/hooks/cartType";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import DateTimeSelector, { TimeSlot } from "@/components/DateTimeSelector";
import { FormData } from "@/components/BellShop/ClientShop";
import CartForm from "@/components/Profile/Cart/CartForm";
import { ensureCartArray, useCartOperations } from "@/hooks/useCartOperations";
import { getCookie } from "cookies-next";
import { LocationForm } from "@/components/Location/LocationForm";
import FactorDetails from "../../Factor/FactorDetails";
import { Address } from "@/components/Profile/Address/types";
import { showError } from "@/lib/toastService";
import { saveState } from "@/utils/localStorage";
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isType: string;
}
// Components
const FactorForm: React.FC<{
  formData: any;
  onFormChange: (newData: any) => void;
  type?: string;
}> = ({ formData, onFormChange, type }) => {
  return <FactorDetails type={type} formData={formData} onFormChange={onFormChange} />;
};
const CartDrawer: React.FC<CartDrawerProps> = ({ isType, isOpen, onClose }) => {
  const pathname = usePathname();
  const authenticatedFetch = useAuthenticatedFetch();

  // State

  const [type, setType] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);

  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  // const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    addresses: [],
    selectedAddress: null,
    selectedServices: [],
    selectedDateTime: null,
    paymentComplete: false,
  });
  // Effects
  useEffect(() => {
    const initializeData = async () => {
      if (isOpen) {
        // setIsInitialLoading(true);
        try {
          await Promise.all([
            fetchCart(),
            // fetchAddresses(), // اضافه کردن فراخوانی آدرس‌ها در شروع
          ]);
        } finally {
          // setIsInitialLoading(false);
        }
      }
    };

    initializeData();
  }, [isOpen]);
  useEffect(() => {
    if (cart.length == 0 && isType === "cartDrawer") {
      onClose();
    }
  }, [cart]);
  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen]);
  useEffect(() => {
    if (pathname) {
      const pathType = getPathType(pathname);
      console.log("Current path type:", pathType);

      // می‌توانید بر اساس نوع مسیر، عملیات مختلفی انجام دهید
      if (pathType === "shop") {
        setType("shop");
      } else if (pathType === "mazeh") {
        setType("mazeh");
      } else if (pathType === "service") {
        setType("service");
      }
    }
  }, [pathname]);
  // Data fetching
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
      setFormData((prev) => ({
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
      console.log(data.length === 0);
      // if (data.length === 0) {
      //   onClose();
      // }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const { loadingItems, removeFromCart, updateCartItemQuantity } = useCartOperations(setCart);
  const handleFormChange = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleDateTimeSelect = (date: string, time: TimeSlot) => {
    setFormData((prev) => ({
      ...prev,
      selectedDateTime: {
        date,
        time,
        timeSlotId: time._id,
      },
    }));
  };
  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      console.log({ message });
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };
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
        <LocationForm formData={formData} isLoading={isLoading} onFormChange={handleFormChange} />
      ),
      isComplete: () => formData.selectedAddress !== null,
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
      isComplete: () => formData.selectedDateTime !== null && selectedTime !== null,
    },

    {
      id: 4,
      label: "پرداخت",
      content: <FactorForm type={type} formData={formData} onFormChange={handleFormChange} />,
      isComplete: () => formData.paymentComplete,
    },
  ];
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="سبدخرید">
      <MultiStepForm
        steps={steps}
        formData={formData}
        onFormChange={handleFormChange}
        handleSubmit={() => console.log(formData)}
      />
    </Modal>
  );
};

export default CartDrawer;
