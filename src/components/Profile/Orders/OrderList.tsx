"use client";

import React, { useState, useEffect } from "react";
import { Order } from "@/app/profile/orders/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import OrderDetails from "./OrderDetails";

interface OrderListProps {
  orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (selectedOrder) {
      setIsModalOpen(true);
    }
  }, [selectedOrder]);

  const openOrderDetails = async (order: Order) => {
    setIsLoading(true);
    setSelectedOrder(order);
    // شبیه‌سازی یک درخواست API
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const closeOrderDetails = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedOrder(null), 300); // برای انیمیشن بستن
  };

  return (
    <div className="p-4 mt-20 relative">
      <div className="w-full flex flex-row mb-10 justify-between items-center">
        <h1 className="text-2xl font-bold text-right">سفارشات من</h1>
        <Image
          onClick={() => router.push("/profile")}
          width={24}
          height={24}
          src="/images/icons/close.svg"
          alt="بستن"
        />
      </div>
      <div className="w-full flex flex-col-reverse">
        {orders.map((order) => (
          <div
            key={order._id}
            onClick={() => openOrderDetails(order)}
            className="flex flex-row items-center gap-3 rounded-xl border-2 border-black p-5 mb-2 text-right cursor-pointer"
          >
            <p className="font-bold text-sm">سفارش {order.orderNumber}</p>
            <p className="text-[11px] rounded-full py-1 px-2 bg-gray-100 font-black">
              {order.date}
            </p>
          </div>
        ))}
      </div>

      {/* مودال برای جزئیات سفارش */}
      {isModalOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end z-50 transition-opacity duration-300 ease-in-out ${
            isModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeOrderDetails}
        >
          <div
            className={`bg-white w-full max-w-md transform transition-all duration-300 ease-in-out h-[93vh] overflow-y-auto ${
              isModalOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              selectedOrder && <OrderDetails order={selectedOrder} onClose={closeOrderDetails} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
