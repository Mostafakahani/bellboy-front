"use client";

import Table from "@/components/Dashboard/Table/Table";
import { Column } from "@/components/Dashboard/Table/types";
import React from "react";
const columns: Column[] = [
  {
    header: "نام محصول",
    key: "name",
    cellType: "text-bold",
    sortable: true,
  },
  {
    header: "قیمت",
    key: "price",
    cellType: "text",
  },
  {
    header: "وضعیت",
    key: "status",
    cellType: "status",
  },
  {
    header: "عملیات",
    key: "actions",
    cellType: "button",
  },
];

const data = [
  {
    name: "محصول 1",
    price: "24,000 تومان",
    status: true,
    actions: {
      onClick: () => console.log("clicked"),
      label: "ویرایش",
    },
  },
  {
    name: "محصول 2",
    price: "24,000 تومان",
    status: true,
    actions: {
      onClick: () => console.log("clicked"),
      label: "ویرایش",
    },
  },
  // ...
];
export default function OrdersPage() {
  return (
    <div>
      <div>
        <Table
          columns={columns}
          data={data}
          onSort={(key, direction) => {
            console.log(`Sorting ${key} ${direction}`);
          }}
        />
      </div>
    </div>
  );
}
