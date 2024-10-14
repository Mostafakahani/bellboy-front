import { Order } from "./types";
import OrderList from "@/components/Profile/Orders/OrderList";

async function getOrders(): Promise<Order[]> {
  // In a real application, fetch this data from an API or database
  return [
    {
      id: "13215648",
      date: "1402/07/17 سه‌شنبه",
      status: "در حال تامین",
      items: [
        { name: "هرم مزه سفارشی", price: 2430000, quantity: 1 },
        { name: "سینی مزه 1504", price: 750000, quantity: 1 },
      ],
      totalPrice: 3180000,
      tax: 286000,
      shippingCost: 0,
      totalPayable: 3466000,
    },
    // Add more orders as needed
  ];
}

export default async function OrdersPage() {
  const orders = await getOrders();
  return <OrderList orders={orders} />;
}
