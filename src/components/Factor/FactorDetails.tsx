import React, { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import Button from "../ui/Button/Button";
import DiscountDialog from "../Profile/DiscountDialog";
import { ClockIcon, LineIcon } from "@/icons/Icons";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { getCookie } from "cookies-next";
import { showError, showSuccess } from "@/lib/toastService";

interface FormData {
  addresses: any[];
  selectedAddress: { _id: string } | null;
  selectedDateTime: {
    timeSlotId: string;
    date: string;
    time: any;
  } | null;
  paymentComplete: boolean;
}

interface OrderData {
  status: string;
  message: string;
  data: {
    id_user: string;
    data: Array<{
      IsTastePyramids: boolean;
      id: string;
      title: string;
      price: number;
      quantity: number;
      globalDiscount: number;
    }>;
    price: number;
    date: string;
    startHour: string;
    endHour: string;
    status: string;
    paymentStatus: string;
    id_address: string;
    _id: string;
    orderNumber: string;
    createdAt: string;
    updatedAt: string;
    id_discount?: {
      _id: string;
      code: string;
      expiryDate: string;
      usageLimit: number;
      discountPercentage: number;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
}

interface FactorFormProps {
  formData: FormData;
  onFormChange: (newData: Partial<FormData>) => void;
}

export default function FactorForm({ formData, onFormChange }: FactorFormProps) {
  const authenticatedFetch = useAuthenticatedFetch();

  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [orderData, setOrderData] = useState<OrderData | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };

  useEffect(() => {
    const createOrder = async () => {
      if (!formData.selectedAddress?._id || !formData.selectedDateTime?.timeSlotId) {
        return;
      }

      try {
        const response = await authenticatedFetch("/order", {
          method: "POST",
          body: JSON.stringify({
            delivery: formData.selectedDateTime.timeSlotId,
            address: formData.selectedAddress._id,
            type: "shop",
          }),
        });

        if (response.error) {
          throw new Error(formatErrorMessage(response.message));
        }

        if (response.status === "success") {
          setOrderData(response as OrderData);
          onFormChange({ paymentComplete: true });
        } else {
          throw new Error(response.message || "خطا در دریافت اطلاعات سفارش");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
      } finally {
        setIsLoading(false);
      }
    };

    createOrder();
  }, [formData.selectedAddress?._id, formData.selectedDateTime?.timeSlotId]);

  const handleApplyDiscount = async () => {
    setIsLoading(true);
    const token = getCookie("auth_token");
    if (!orderData?.data._id) return;
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/order/" + orderData?.data._id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
          body: JSON.stringify({ discount: discountCode }),
        }
      );

      // if (!response.ok) {
      //   throw new Error("Failed to fetch profile data");
      // }

      const data = await response.json();
      if (data.status === "success") {
        console.log("discount data: ", data);
        setIsDiscountModalOpen(false);
        setOrderData(data);
      } else {
        throw new Error(formatErrorMessage(data?.message) || "خطا در ارسال اطلاعات");
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
      console.error("Error fetching profile data:", error);
      throw error;
    } finally {
      setIsDiscountModalOpen(false);
      setIsLoading(false);
    }
  };
  const handleRemoveDiscount = async () => {
    setIsLoading(true);

    const token = getCookie("auth_token");
    if (!orderData?.data._id) return;
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL +
          "/order/remove-discount-order/" +
          orderData?.data._id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      // if (!response.ok) {
      //   throw new Error("Failed to fetch profile data");
      // }

      const data = await response.json();
      if (data.status === "success") {
        console.log("discount remove data: ", data);
        showSuccess(formatErrorMessage(data?.message));
        setOrderData(data);
      } else {
        throw new Error(formatErrorMessage(data?.message) || "خطا در ارسال اطلاعات");
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
      console.error("Error fetching profile data:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  if (!orderData?.data) {
    return <div className="text-center p-4">اطلاعات سفارش در دسترس نیست</div>;
  }

  const { data: orderItems, price: subtotal } = orderData.data;
  const TAX_RATE = 0.1;
  const tax = subtotal * TAX_RATE;
  const discount = (orderData.data.id_discount?.discountPercentage || 0) / 100;
  const total = subtotal + tax - (subtotal + tax) * discount;

  return (
    <div className="bg-white pt-0">
      <div className="relative bottom-2.5 bg-[#FFFF00] !py-9 text-sm mb-0 px-4 md:px-6 lg:px-8 flex flex-row justify-between items-center font-bold">
        <p className="flex flex-row gap-x-1 items-center">
          <ClockIcon />
          <span>حداکثر زمان تحویل:</span>
        </p>
        <span>{`${orderData.data.startHour} - ${orderData.data.endHour}`}</span>
      </div>

      <div className="relative bottom-10 flex flex-col">
        <div className="w-full relative">
          <LineIcon className="w-full" />
        </div>
        <div className="flex flex-col gap-3 mt-0 py-4">
          {orderItems.map((item, index) => (
            <div key={item.id} className="w-full">
              <div
                className={`w-full relative pt-2 border-t border-black mb-4 ${
                  index === 0 ? "border-t-0" : "border-t-2"
                }`}
              ></div>
              <div className="flex justify-between items-center mb-2 first:pt-0 px-4 md:px-6 lg:px-8">
                <div className="flex flex-col gap-2">
                  <span className="text-md font-bold text-right">{item.title}</span>
                  <span className="text-xs bg-gray-200 rounded-full w-fit px-2 py-1">
                    {item.quantity}x
                  </span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-md text-left">{formatCurrency(item.price)}</span>
                  {item.globalDiscount > 0 && (
                    <div className="flex flex-row gap-x-2 items-center">
                      <span className="py-1.5 px-2 text-[11px] bg-red-500 text-white rounded-full w-fit h-fit text-left">
                        %{item.globalDiscount}
                      </span>
                      <span className="line-through text-gray-400 text-xs text-nowrap">
                        {formatCurrency(item.price * (1 + item.globalDiscount / 100))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full relative border-b-2 border-black mb-4"></div>

        <div className="space-y-2 py-2 px-4 md:px-6 lg:px-8">
          <div className="flex justify-between">
            <span className="text-md font-bold">جمع سفارشات</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-md font-bold">مالیات بر ارزش افزوده</span>
            <span>{formatCurrency(tax)}</span>
          </div>
        </div>

        <div className="w-full relative border-b-2 border-black my-4"></div>

        <div className="flex flex-row justify-between items-center gap-4 my-6 px-4 md:px-6 lg:px-8">
          {orderData.data.id_discount?._id ? (
            <div className="w-full flex flex-row justify-between items-center">
              <div className="flex flex-col gap-y-3 justify-between text-red-600">
                <span className="text-md font-bold">کد تخفیف</span>
                <span>{orderData?.data?.id_discount?.code}</span>
              </div>
              <div>
                <Button
                  onXsIsText
                  loading={isLoading}
                  variant="tertiary"
                  icon="trash"
                  isError
                  className="!p-0"
                  onClick={() => handleRemoveDiscount()}
                >
                  حذف کد تخفیف
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm font-light text-right">
                اگر کد تخفیف بل‌بوی دارید
                <br />
                درکادر زیر وارد کنید
              </p>
              <Button
                onXsIsText
                loading={isLoading}
                variant="tertiary"
                icon="plus"
                className="!p-0"
                onClick={() => setIsDiscountModalOpen(true)}
              >
                کد تخفیف
              </Button>
            </>
          )}
        </div>

        <div className="w-full relative border-b-2 border-black my-4"></div>

        <div className="flex justify-between font-bold text-lg mt-4 px-4 md:px-6 lg:px-8">
          <span className="text-sm">مبلغ قابل پرداخت</span>
          <span className="text-sm font-bold">{formatCurrency(total)}</span>
        </div>
      </div>

      <DiscountDialog
        isLoading={isLoading}
        isOpen={isDiscountModalOpen}
        onSubmit={() => handleApplyDiscount()}
        onClose={() => setIsDiscountModalOpen(false)}
        message="کد تخفیف بل‌بوی را وارد کنید"
        buttonMessage="ثبت"
        onChange={(e) => setDiscountCode(e)}
      />
    </div>
  );
}
