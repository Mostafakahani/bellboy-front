import { Order } from "./types";
import OrderList from "@/components/Profile/Orders/OrderList";

async function getOrders(): Promise<Order[]> {
  // In a real application, fetch this data from an API or database
  return [
    {
      id: "13215648",
      date: "1402/07/17 14:25",
      status: "در حال تامین",
      items: [
        { name: "هرم مزه سفارشی", price: 2430000, quantity: 1, offer: 20 },
        { name: "سینی مزه 1504", price: 750000, quantity: 1, offer: 20 },
      ],
      totalPrice: 3180000,
      tax: 286000,
      shippingCost: 0,
      totalPayable: 3466000,
      offer: 20,
    },
    {
      id: "13215628",
      date: "1402/01/14 12:25",
      status: "در حال تامین",
      items: [
        { name: "هرم مزه سفارشی", price: 2430000, quantity: 1, offer: 20 },
        { name: "سینی مزه 1504", price: 750000, quantity: 1, offer: 20 },
        { name: "سینی مزه 1502", price: 650000, quantity: 2, offer: 20 },
        { name: "سینی مزه 1504", price: 750000, quantity: 1, offer: 20 },
        { name: "سینی مزه 1502", price: 650000, quantity: 2, offer: 20 },
        { name: "سینی مزه 1504", price: 750000, quantity: 1, offer: 20 },
        { name: "سینی مزه 1502", price: 650000, quantity: 2, offer: 20 },
        { name: "سینی مزه 1504", price: 750000, quantity: 1, offer: 20 },
        { name: "سینی مزه 1502", price: 650000, quantity: 2, offer: 20 },
      ],
      totalPrice: 3180000,
      tax: 286000,
      shippingCost: 0,
      totalPayable: 3466000,
      offer: 20,
    },
  ];
}
export default async function OrdersPage() {
  const orders = await getOrders();
  return <OrderList orders={orders} />;
}
