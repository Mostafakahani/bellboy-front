import { Order } from "@/app/profile/orders/types";
import Link from "next/link";

interface OrderListProps {
  orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-right">سفارشات من</h1>
      {orders.map((order) => (
        <Link href={`/profile/orders/${order.id}`} key={order.id}>
          <div className="border rounded p-4 mb-2 text-right">
            <p>سفارش {order.id}</p>
            <p>{order.date}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
