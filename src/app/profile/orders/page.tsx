"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { Order } from "./types";
import OrderList from "@/components/Profile/Orders/OrderList";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError } from "@/lib/toastService";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const authenticatedFetch = useAuthenticatedFetch();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = getCookie("auth_token");
      if (!token) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error, message } = await authenticatedFetch("/order", {
          method: "GET",
        });

        if (error) {
          throw new Error(Array.isArray(message) ? message.join(" ") : message);
        }

        console.log(data);
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
        showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return <OrderList orders={orders} />;
};

export default OrdersPage;
