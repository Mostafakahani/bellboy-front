"use client";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import ResponsiveTableOrders from "@/components/Dashboard/ResponsiveTableOrders";
import React from "react";
const productData = [
  {
    id: 12453,
    title: "لیوان یکبار مصرف",
    amount: 100,
    service: "بل شاپ",
    category: "لوازم یکبار مصرف",
    price: 50000,
    desc: "6 addad liwan",
    discountValue: "alirexa@gmail.com",
    file: [
      { id: 1325441478, name: "image02", format: "jpg" },
      { id: 1325441472, name: "image02", format: "jpg" },
      { id: 1325441476, name: "image02", format: "jpg" },
      { id: 1325441471, name: "image02", format: "jpg" },
    ],
  },
  {
    id: 12454,
    title: "دستمال کاغذی",
    amount: 50,
    service: "تولید سلامت",
    category: "بهداشتی",
    price: 30000,
    desc: "12 addad dastmal kaghazi",
    discountValue: "healthshop@gmail.com",
    file: [
      { id: 1325441490, name: "image03", format: "jpg" },
      { id: 1325441491, name: "image04", format: "jpg" },
    ],
  },
  {
    id: 12455,
    title: "قاشق یکبار مصرف",
    amount: 200,
    service: "ایران پلاست",
    category: "لوازم یکبار مصرف",
    price: 15000,
    desc: "100 addad qashoq",
    discountValue: "iranplast@gmail.com",
    file: [
      { id: 1325441500, name: "image05", format: "jpg" },
      { id: 1325441501, name: "image06", format: "jpg" },
      { id: 1325441502, name: "image07", format: "jpg" },
    ],
  },
  {
    id: 12456,
    title: "ظرف غذا یکبار مصرف",
    amount: 75,
    service: "ایران پلاست",
    category: "لوازم یکبار مصرف",
    price: 70000,
    desc: "ظرف غذای پلاستیکی",
    discountValue: "iranplast@gmail.com",
    file: [
      { id: 1325441510, name: "image08", format: "jpg" },
      { id: 1325441511, name: "image09", format: "jpg" },
    ],
  },
];

export default function OrdersPage() {
  return (
    <div>
      <DashboardHeader />
      <div className="">
        <div className="w-full flex flex-row justify-between items-center mb-4 px-4">
          <p className="text-2xl font-bold">سفارش‌ها</p>
          {/* <div className="w-1/3">
            <button className="w-full text-sm py-3 rounded-xl border border-gray-300 outline-none hover:bg-gray-300 transition-all focus:outline-none ">
              افزودن کالا
            </button>
          </div> */}
        </div>
        <ResponsiveTableOrders data={productData} />
      </div>
    </div>
  );
}
