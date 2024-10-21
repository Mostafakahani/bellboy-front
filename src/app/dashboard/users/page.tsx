"use client";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import ResponsiveTable from "@/components/Dashboard/ResponsiveTable";
import React from "react";
const usersData = [
  {
    id: 12453,
    firstName: "علیرضا",
    lastName: "میر حیدری",
    phone: "09123454789",
    email: "alirexa@gmail.com",
    date: "۱۳۷۱/۰۷/۰۴",
    orders: [
      { id: 1325441478, price: 24500000 },
      { id: 7325441428, price: 24500 },
      { id: 5325441448, price: 24500 },
      { id: 2325441468, price: 2450000 },
      { id: 1325441478, price: 24500000 },
      { id: 1325434468, price: 24500000 },
      { id: 2326441468, price: 24500000 },
      { id: 1325441461, price: 245000 },
      { id: 1325441448, price: 24500000 },
      { id: 6325441468, price: 24500000 },
    ],
  },
  {
    id: 12454,
    firstName: "لیلا",
    lastName: "میر حیدری",
    phone: "09123454629",
    email: "alirexa@gmail.com",
    date: "۱۳۷۱/۰۷/۰۴",
    orders: [
      { id: 1325441478, price: 24500000 },
      { id: 7325441428, price: 24500 },
      { id: 5325441448, price: 24500 },
      { id: 2325441468, price: 2450000 },
      { id: 1325441478, price: 24500000 },
      { id: 1325434468, price: 24500000 },
      { id: 2326441468, price: 24500000 },
      { id: 1325441461, price: 245000 },
      { id: 1325441448, price: 24500000 },
      { id: 6325441468, price: 24500000 },
    ],
  },
  {
    id: 12454,
    firstName: "علی",
    lastName: "حسین زاده اصل",
    phone: "09123454749",
    email: "alirexa2@gmail.com",
    date: "۱۳۷۱/۰۷/۰۴",
    orders: [
      { id: 1325441478, price: 24500000 },
      { id: 7325441428, price: 24500 },
      { id: 5325441448, price: 24500 },
      { id: 2325441468, price: 2450000 },
      { id: 1325441478, price: 24500000 },
      { id: 1325434468, price: 24500000 },
      { id: 2326441468, price: 24500000 },
      { id: 1325441461, price: 245000 },
      { id: 1325441448, price: 24500000 },
      { id: 6325441468, price: 24500000 },
    ],
  },
];
export default function UsersPage() {
  return (
    <div>
      <DashboardHeader />
      <div className="">
        <div className="w-full flex flex-row justify-between items-center mb-4 px-4">
          <p className="text-2xl font-bold">کاربران</p>
          <div className="w-1/3">
            <button className="w-full py-3 rounded-xl border border-gray-300 outline-none hover:bg-gray-300 transition-all focus:outline-none ">
              افزودن کاربر
            </button>
          </div>
        </div>
        <ResponsiveTable data={usersData} />
      </div>
    </div>
  );
}
