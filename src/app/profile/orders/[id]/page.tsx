import { notFound } from "next/navigation";
import { Order } from "../types";
import OrderDetails from "@/components/Profile/Orders/OrderDetails";

async function getOrder(id: string): Promise<Order | null> {
  // In a real application, fetch this data from an API or database
  const order: Order = {
    id,
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
  };

  return order;
}

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);

  if (!order) {
    notFound();
  }

  return <OrderDetails order={order} />;
}
