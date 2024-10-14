import { Order } from "@/app/profile/orders/types";
import { formatCurrency } from "@/utils/formatCurrency";

interface OrderDetailsProps {
  order: Order;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-right">سفارش {order.id}</h1>
      <div className="bg-yellow-100 p-4 rounded">
        <p className="text-right">تاریخ تحویل: {order.date}</p>
        <p className="text-right">وضعیت سفارش: {order.status}</p>
      </div>
      <div className="mt-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between mb-2">
            <span>{formatCurrency(item.price)}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="flex justify-between">
          <span>جمع سفارشات</span>
          <span>{formatCurrency(order.totalPrice)}</span>
        </p>
        <p className="flex justify-between">
          <span>مالیات بر ارزش افزوده</span>
          <span>{formatCurrency(order.tax)}</span>
        </p>
        <p className="flex justify-between">
          <span>هزینه رفت و آمد</span>
          <span>{order.shippingCost === 0 ? "رایگان" : formatCurrency(order.shippingCost)}</span>
        </p>
        <p className="flex justify-between font-bold">
          <span>مبلغ قابل پرداخت</span>
          <span>{formatCurrency(order.totalPayable)}</span>
        </p>
      </div>
    </div>
  );
}
