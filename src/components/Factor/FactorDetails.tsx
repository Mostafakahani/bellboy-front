import React, { useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/utils/formatCurrency";
import Button from "../ui/Button/Button";
import DiscountDialog from "../Profile/DiscountDialog";

interface Product {
  name: string;
  price: number;
}

interface OrderSummary {
  products: Product[];
  shippingCost: number;
}

interface FactorDetailsProps {
  orderSummary: OrderSummary;
}

const TAX_RATE = 0.1; // 10% tax rate

export default function FactorDetails({ orderSummary }: FactorDetailsProps) {
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);

  const subtotal = orderSummary.products.reduce((sum, product) => sum + product.price, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + orderSummary.shippingCost - (appliedDiscount || 0);

  const handleApplyDiscount = () => {
    if (discountCode === "30") {
      setAppliedDiscount(30000);
      setIsDiscountModalOpen(false);
    }
  };

  return (
    <div className="bg-white pt-4 px-4 md:px-6 lg:px-8">
      <h2 className="text-lg font-bold text-right my-4">صورتحساب شما</h2>

      <div className="w-full absolute left-0 top-[205px]">
        <Image width={1080} height={150} className="w-full" src="/images/line.svg" alt="" />
      </div>

      <div className="flex flex-col gap-3 mt-16 py-4">
        {orderSummary.products.map((product, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <span className="text-md font-bold">{product.name}</span>
            <span className="text-sm">{formatCurrency(product.price)}</span>
          </div>
        ))}
      </div>

      <div className="w-screen relative -right-[32px] border-b-2 border-black my-4"></div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-md font-bold">جمع سفارشات</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-md font-bold">مالیات بر ارزش افزوده</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-md font-bold">هزینه رفت و آمد</span>
          <span>
            {orderSummary.shippingCost === 0 ? "رایگان" : formatCurrency(orderSummary.shippingCost)}
          </span>
        </div>
        {appliedDiscount && (
          <div className="flex justify-between text-red-600">
            <span className="text-md font-bold">کد تخفیف</span>
            <span>{formatCurrency(appliedDiscount)}</span>
          </div>
        )}
      </div>
      <div className="w-screen relative -right-[32px] border-b-2 border-black my-4"></div>

      <div className="flex flex-row justify-between items-center gap-4 my-6">
        <p className="text-sm font-light">
          اگر کد تخفیف بل‌بوی دارید
          <br />
          درکادر زیر وارد کنید
        </p>
        <Button
          onXsIsText
          variant="tertiary"
          icon="plus"
          className="!p-0"
          onClick={() => setIsDiscountModalOpen(true)}
        >
          کد تخفیف
        </Button>
      </div>

      <div className="w-screen relative -right-[32px] border-b-2 border-black my-4"></div>

      <div className="flex justify-between font-bold text-lg mt-4">
        <span className="text-sm">مبلغ قابل پرداخت</span>
        <span className="text-sm font-bold">{formatCurrency(total)}</span>
      </div>
      <DiscountDialog
        isOpen={isDiscountModalOpen}
        onSubmit={handleApplyDiscount}
        onClose={() => setIsDiscountModalOpen(false)}
        message="کد تخفیف بل‌بوی را وارد کنید"
        buttonMessage="ثبت"
        onChange={(e) => setDiscountCode(e)}
      />
      {/* {isDiscountModalOpen && (
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-500 ease-in-out z-50 ${
            isDiscountModalOpen ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsDiscountModalOpen(false)}
        >
          <div
            className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
              isDiscountModalOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">وارد کردن کد تخفیف</h2>
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="کد تخفیف خود را وارد کنید"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsDiscountModalOpen(false)}
                className="mr-2 px-4 py-2 bg-gray-200 rounded"
              >
                لغو
              </button>
              <button
                onClick={handleApplyDiscount}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                اعمال
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
