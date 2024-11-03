import { useState } from "react";
import { showError, showSuccess } from "@/lib/toastService";
import { ApiResponse, useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { CartItem } from "./cartType";

interface CartOperationsHook {
  loading?: boolean;
  loadingItems: { [key: string]: boolean };
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (cartId: string) => Promise<void>;
  updateCartItemQuantity: (
    cartId: string,
    quantity: number,
    currentQuantity: number
  ) => Promise<void>;
  fetchCart: () => Promise<void>;
}

export const useCartOperations = (
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
): CartOperationsHook => {
  const authenticatedFetch = useAuthenticatedFetch();
  // const [loading, setLoading] = useState<boolean>(false);
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>({});

  const setItemLoading = (itemId: string, isLoading: boolean) => {
    setLoadingItems((prev) => ({ ...prev, [itemId]: isLoading }));
  };

  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };

  // Helper function to ensure we're always working with an array
  const ensureCartArray = (data: any): CartItem[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.cart && Array.isArray(data.cart)) return data.cart;
    return [];
  };

  const fetchCart = async () => {
    try {
      const { data } = await authenticatedFetch<ApiResponse>("/cart");
      setCart(ensureCartArray(data));
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]); // Set empty array on error
    }
  };

  const addToCart = async (productId: string) => {
    setItemLoading(productId, true);
    try {
      const response = await authenticatedFetch<ApiResponse>("/cart", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });

      if (response.status === "success") {
        await fetchCart(); // Fetch fresh cart data
        showSuccess("محصول به سبد خرید اضافه شد");
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setItemLoading(productId, false);
    }
  };

  const removeFromCart = async (cartId: string) => {
    setItemLoading(cartId, true);
    try {
      const response = await authenticatedFetch<ApiResponse>(`/cart/${cartId}`, {
        method: "DELETE",
      });

      if (response.status === "success") {
        await fetchCart(); // Fetch fresh cart data
        showSuccess("محصول از سبد خرید حذف شد");
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setItemLoading(cartId, false);
    }
  };

  const updateCartItemQuantity = async (
    cartId: string,
    newQuantity: number,
    currentQuantity: number
  ) => {
    setItemLoading(cartId, true);
    try {
      if (currentQuantity === 1 && newQuantity < currentQuantity) {
        await removeFromCart(cartId);
        return;
      }

      const response = await authenticatedFetch<ApiResponse>(`/cart/${cartId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.error) {
        throw new Error(formatErrorMessage(response.message));
      }

      if (response.status === "success") {
        await fetchCart(); // Fetch fresh cart data
        showSuccess("تعداد محصول بروزرسانی شد");
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setItemLoading(cartId, false);
    }
  };

  return {
    // loading,
    loadingItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    fetchCart,
  };
};
