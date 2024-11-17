import React, { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import Button from "../ui/Button/Button";
import DiscountDialog from "../Profile/DiscountDialog";
import { ClockIcon, LineIcon } from "@/icons/Icons";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { getCookie } from "cookies-next";
import { showError, showSuccess } from "@/lib/toastService";
import { Product } from "@/hooks/cartType";
import Image from "next/image";
import ErrorDialog from "../Profile/ErrorDialog";

interface FormData {
  addresses: any[];
  selectedAddress: { _id: string } | null;
  selectedDateTime: {
    timeSlotId: string;
    date: string;
    time: { _id: string };
  } | null;
  paymentComplete: boolean;
}

interface OrderItem {
  IsTastePyramids: boolean;
  dataTastePyramids?: Product[];
  id?: string;
  title?: string;
  price?: number;
  quantity?: number;
  globalDiscount?: number;
  data?: { title: string; data: { id: number; count: number; title: string; data: string[] }[] };
}

interface OrderData {
  status: string;
  message: string;
  TypeOrder?: string;
  data: {
    id_user: string;
    data: OrderItem[];
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
  type?: string;
  planIds?: string[];
}

const FactorForm: React.FC<FactorFormProps> = ({
  formData,
  onFormChange,
  type = "shop",
  planIds = undefined,
}) => {
  const authenticatedFetch = useAuthenticatedFetch();
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [orderData, setOrderData] = useState<OrderData | null>();
  const [shippingPrice, setShippingPrice] = useState<number>(0);
  const [taxValue, setTaxValue] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      return message.join(" ");
    }
    return message?.toString() || "Unknown error occurred";
  };

  const handleApplyDiscount = async () => {
    setIsLoading(true);
    const token = getCookie("auth_token");
    if (!orderData?.data._id) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/${orderData.data._id}`,
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

      const data = await response.json();
      if (data.status === "success") {
        setIsDiscountModalOpen(false);
        setOrderData(data);
      } else {
        throw new Error(formatErrorMessage(data?.message) || "Error submitting information");
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "Error connecting to the server");
      console.error("Error applying discount:", err);
    } finally {
      setIsDiscountModalOpen(false);
      setIsLoading(false);
    }
  };

  const handleCancelAddress = async () => {
    setIsLoading(true);
    const token = getCookie("auth_token");
    if (!orderData?.data._id) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/cancel/${orderData.data._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        showSuccess(formatErrorMessage(data?.message));
        window.location.reload();
      } else {
        throw new Error(formatErrorMessage(data?.message) || "Error submitting information");
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "Error connecting to the server");
      console.error("Error removing discount:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRemoveDiscount = async () => {
    setIsLoading(true);
    const token = getCookie("auth_token");
    if (!orderData?.data._id) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/remove-discount-order/${orderData.data._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        showSuccess(formatErrorMessage(data?.message));
        setOrderData(data);
      } else {
        throw new Error(formatErrorMessage(data?.message) || "Error submitting information");
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "Error connecting to the server");
      console.error("Error removing discount:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const createOrder = async () => {
      console.log({ type, planIds });
      if (!formData.selectedAddress?._id || !formData.selectedDateTime?.timeSlotId) {
        return;
      }

      try {
        const response = await authenticatedFetch(
          `/order${type === "service" ? "/service" : type === "clean" ? "/clean" : ""}`,
          {
            method: "POST",
            body: JSON.stringify({
              delivery:
                formData.selectedDateTime.time._id === "custom-delivery"
                  ? undefined
                  : formData.selectedDateTime.timeSlotId,
              address: formData.selectedAddress._id,
              type: type || "shop",
              plans: type === "clean" ? planIds : undefined,
              expires_at:
                formData.selectedDateTime.timeSlotId === "custom-delivery" ? true : undefined,
            }),
          }
        );

        if (response.error) {
          throw new Error(formatErrorMessage(response.message));
        }

        if (response.status === "success") {
          setOrderData(response as OrderData);
          onFormChange({ paymentComplete: true });
        } else {
          throw new Error(response.message || "Error fetching order information");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error connecting to the server");
      } finally {
        setIsLoading(false);
      }
    };

    createOrder();
  }, [formData.selectedAddress?._id, formData.selectedDateTime?.timeSlotId]);
  useEffect(() => {
    const fetchShippingPrice = async () => {
      try {
        setIsLoading(true);
        const { data } = await authenticatedFetch<any>("/setting/shipping");

        setShippingPrice(data?.value || 0);
      } catch (error) {
        console.error("Error fetching delivery times:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const getTaxValue = async () => {
      try {
        const response = await authenticatedFetch<any>(`/setting/tax`, {
          method: "GET",
        });

        if (response.error) {
          throw new Error(formatErrorMessage(response.message));
        }
        console.log(response.data.value);
        setTaxValue(response?.data?.value);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error connecting to the server");
      } finally {
        setIsLoading(false);
      }
    };
    fetchShippingPrice();
    getTaxValue();
  }, [formData.selectedAddress?._id]);

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  if (isLoading) {
    return <div className="text-center p-4">درحال بارگزاری...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  const renderOrderItem = (item: Product, index: number, isFirstItem: boolean) => {
    return (
      <div key={item.id} className="w-full">
        <div
          className={`w-full relative pt-2 border-t border-black mb-4 ${
            isFirstItem ? "border-t-0" : "border-t-2"
          }`}
        />
        <div className="flex justify-between items-center mb-2 first:pt-0 px-4 md:px-6 lg:px-8">
          <div className="flex flex-col gap-2">
            <span className="text-md font-bold text-right">{item.title}</span>
            {type !== "clean" && (
              <span className="text-xs bg-gray-200 rounded-full w-fit px-2 py-1">
                {item.quantity}x
              </span>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {item.globalDiscount > 0 ? (
              <>
                <span className="text-md text-left">
                  {formatCurrency(calculateDiscountedPrice(item.price, item.globalDiscount))}
                </span>
                <div className="flex flex-row gap-x-2 items-center">
                  <span className="py-1.5 px-2 text-[11px] bg-red-500 text-white rounded-full w-fit h-fit text-left">
                    %{item.globalDiscount}
                  </span>
                  <span className="line-through text-gray-400 text-xs text-nowrap">
                    {formatCurrency(item.price)}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-md text-left">{formatCurrency(item.price)}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderOrderItems = () => {
    if (!orderData?.data.data) return null;

    return orderData.data.data.map((orderItem, index) => {
      if (orderItem.IsTastePyramids && orderItem.dataTastePyramids) {
        return orderItem.dataTastePyramids.map((item, itemIndex) =>
          renderOrderItem(item, itemIndex, index === 0 && itemIndex === 0)
        );
      } else if (!orderItem.IsTastePyramids && orderItem.id) {
        return renderOrderItem(
          {
            id: orderItem.id,
            title: orderItem.title || orderItem.data?.title || "",
            price: orderItem.price || 0,
            quantity: orderItem.quantity || 0,
            globalDiscount: orderItem.globalDiscount || 0,
          },
          index,
          index === 0
        );
      }
      return null;
    });
  };

  if (!orderData?.data) {
    return <div className="text-center p-4">Order information is not available</div>;
  }

  const { data: orderItems, price: subtotal } = orderData.data;
  console.log(orderItems);
  const TAX_RATE = taxValue || 0;
  const tax = subtotal * (TAX_RATE / 100); // تقسیم بر 100 برای تبدیل درصد به اعشار
  const discountPercentage = orderData.data.id_discount?.discountPercentage || 0;
  const discount = (discountPercentage / 100) * subtotal; // استفاده از subtotal به جای totalPrice
  const total = subtotal + tax - (subtotal + tax) * (discountPercentage / 100);

  return (
    <div className="bg-white pt-0">
      <div className="relative bottom-2.5 bg-[#FFFF00] !py-9 text-sm mb-0 px-4 md:px-6 lg:px-8 flex flex-row justify-between items-center font-bold">
        <p className="flex flex-row gap-x-1 items-center">
          <ClockIcon />
          <span>زمان تحویل:</span>
        </p>
        <span>{`${orderData.data.startHour} - ${orderData.data.endHour}`}</span>
      </div>

      <div className="relative bottom-10 flex flex-col">
        <div className="w-full relative">
          <LineIcon className="w-full" />
        </div>

        <div className="flex flex-col gap-3 mt-0 py-4">{renderOrderItems()}</div>

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
          <div className="flex justify-between">
            <span className="text-md font-bold">هزینه حمل و نقل</span>
            <span>{formatCurrency(shippingPrice || 0)}</span>
          </div>
          {orderData.data.id_discount?._id && (
            <div className="flex justify-between">
              <span className="text-md font-bold">تخفیف</span>
              <span>{formatCurrency(discount)}</span>
            </div>
          )}
        </div>

        <div className="w-full relative border-b-2 border-black mt-4"></div>

        <div className="flex flex-row justify-between items-center gap-4 px-4 py-5 md:px-6 lg:px-8 bg-primary-200">
          {orderData.data.id_discount?._id ? (
            <div className="w-full flex flex-row justify-between items-center">
              <div className="flex flex-col gap-y-3 justify-between">
                <span className="text-sm font-bold">
                  کد تخفیف به ارزش {orderData?.data?.id_discount?.discountPercentage}% ثبت شد
                </span>
              </div>
              <div>
                <button
                  onClick={handleRemoveDiscount}
                  type="button"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="بستن"
                >
                  <Image width={20} height={20} src="/images/icons/close.svg" alt="close" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm font-light text-right">
                اگر کدتخفیف بل بوی دارید
                <br />
                در کادر زیر وارد کنید
              </p>
              <Button
                onXsIsText
                loading={isLoading}
                variant="tertiary"
                icon="plus"
                className="!p-0"
                textClassName="!text-sm"
                onClick={() => setIsDiscountModalOpen(true)}
              >
                کد تخفیف
              </Button>
            </>
          )}
        </div>

        <div className="w-full relative border-b-2 border-black mb-4"></div>
        <div className="flex flex-row justify-between items-center gap-4 md:px-6 lg:px-8">
          <div
            className="w-full flex flex-row justify-center items-center text-red-400 text-center font-bold text-sm"
            onClick={() => setOpenCancelDialog(true)}
          >
            لغو سفارش
          </div>
        </div>
        <div className="w-full relative border-b-2 border-black my-4"></div>
        <div className="flex justify-between font-bold text-lg mt-4 px-4 md:px-6 lg:px-8">
          <span className="text-sm">مبلغ قابل پرداخت</span>
          <span className="text-sm font-bold">{formatCurrency(total)}</span>
        </div>
      </div>
      <ErrorDialog
        isOpen={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        onDelete={handleCancelAddress}
        message="آیا مطمئن هستید؟"
        buttonMessage="بله، لفو سفارش کن"
      />
      <DiscountDialog
        isLoading={isLoading}
        isOpen={isDiscountModalOpen}
        onSubmit={handleApplyDiscount}
        onClose={() => setIsDiscountModalOpen(false)}
        message="کد تخفیف بل‌بوی را وارد کنید"
        buttonMessage="ثبت"
        onChange={(e) => setDiscountCode(e)}
      />
    </div>
  );
};

export default FactorForm;
