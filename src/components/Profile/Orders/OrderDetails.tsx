import React from "react";
import { Order } from "@/app/profile/orders/types";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { LineIcon } from "@/icons/Icons";

interface OrderDetailsProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderDetails({ order, onClose }: OrderDetailsProps) {
  if (!order) {
    return null;
  }
  const isDiscounted = false;
  const isPending =
    order.status === "PREPARING" ? "در حال تامین" : order.status === "CANCELLED" ? "لغو شده" : "";

  return (
    <div className="relative">
      <div className="flex justify-between items-center p-6">
        <h1 className="text-xl font-bold">سفارش {order._id?.slice(5, 10)}</h1>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <Image width={24} height={24} src="/images/icons/close.svg" alt="close" />
        </button>
      </div>

      <div className={`w-full`}>
        <div
          className={`w-full border-t-2 border-black flex flex-col gap-3 p-6 ${
            order.status === "PREPARING"
              ? "bg-[#FFFF00]"
              : order.status === "CANCELLED"
              ? "bg-gray-300"
              : "bg-primary-400"
          }`}
        >
          <div className="flex flex-row justify-between text-right text-sm font-bold mb-2">
            <p className="flex flex-row gap-1">
              <Image width={20} height={20} src="/images/icons/date.svg" alt="" />
              تاریخ تحویل:
            </p>
            <span className="font-black">{order.date}</span>
          </div>
          <div className="flex flex-row justify-between text-right text-sm font-bold mb-2">
            <p className="flex flex-row gap-1">
              <Image width={20} height={20} src="/images/icons/bigcar.svg" alt="" />
              وضعیت سفارش:
            </p>
            <span className="font-black">{isPending}</span>
          </div>
        </div>
        <div className="w-full absolute left-0 top-[170px]">
          <LineIcon className="w-full" />
          {/* <Image width={1080} height={150} className="w-full" src="/images/line.svg" alt="" /> */}
        </div>
      </div>

      <div className="mb-4">
        {order.data.map((item, index) => (
          <div
            key={index}
            className="flex flex-row justify-between p-6 gap-4 first:border-0 border-t-2 last:border-b-2 border-black"
          >
            <div className="flex flex-col justify-between gap-1">
              <span className="font-black text-sm">{item.title}</span>
              <span className="py-1 px-2 text-xs bg-gray-100 rounded-full w-fit h-fit font-bold">
                {item.quantity}x
              </span>
            </div>
            <div className="flex flex-col justify-between items-end gap-1">
              <span className="font-black text-sm">{formatCurrency(item.price)}</span>
              <div className="flex flex-row items-center gap-3">
                <span className="py-1.5 px-2 text-[11px] bg-red-500 text-white rounded-full w-fit h-fit text-left">
                  %{item.globalDiscount}
                </span>
                <span className="line-through text-sm">3,000,000</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 px-6 pb-5 border-b-2 border-black">
        <div className="flex justify-between">
          <span className="font-bold text-sm">جمع سفارشات</span>
          <span className="text-sm">{formatCurrency(order.price)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold text-sm">مالیات بر ارزش افزوده</span>
          <span className="text-sm">{formatCurrency(50000)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold text-sm">هزینه رفت و آمد</span>
          <span className="text-sm">
            رایگان
            {/* {order.shippingCost === 0 ? "رایگان" : formatCurrency(order.shippingCost)} */}
          </span>
        </div>
        {isDiscounted && (
          <div className="flex justify-between text-red-500">
            <span className="font-bold text-sm">تخفیف</span>
            <span className="text-sm">
              -{" "}
              {/* {formatCurrency(
                order.totalPrice + order.tax + order.shippingCost - order.totalPayable
              )} */}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="font-bold text-sm">مبلغ قابل پرداخت</span>
          <span className="text-sm">{formatCurrency(50000)}</span>
        </div>
      </div>
    </div>
  );
}
// const calculateDiscountedPrice = (price: number, discount: number) => {
//   return price - (price * discount) / 100;
// };
