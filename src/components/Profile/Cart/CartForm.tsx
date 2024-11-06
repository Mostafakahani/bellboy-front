import React, { useCallback, useState } from "react";
import { Trash2, Plus, Loader2, RotateCcw } from "lucide-react";
import { CartItem } from "@/hooks/cartType";

interface CartProps {
  cartData: CartItem[];
  isLoading: boolean;
  // onContinue?: (selectedAddress: string, deliveryId: string) => void;
  loadingItems?: { [key: string]: boolean };
  onUpdateQuantity?: (cartId: string, quantity: number, currentQuantity: number) => Promise<void>;
  onRemoveItem?: (cartId: string) => Promise<void>;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  fetchCart: () => Promise<void>;
}

export const CartForm: React.FC<CartProps> = ({
  cartData,
  isLoading,
  loadingItems = {},
  onUpdateQuantity,
  onRemoveItem,
  setCart,
  fetchCart,
}) => {
  const [itemsToDelete, setItemsToDelete] = useState<{ [key: string]: number }>({});
  const [deleteTimeouts, setDeleteTimeouts] = useState<{ [key: string]: NodeJS.Timeout }>({});

  const handleQuantityChange = useCallback(
    async (cartId: string, newQuantity: number, currentQuantity: number) => {
      if (onUpdateQuantity) {
        if (newQuantity === 0) {
          const item = cartData.find((item) => item._id === cartId);
          if (!item) return;

          if (item.quantity === 1) {
            // اگر تعداد 1 است، شروع تایمر برای حذف
            setItemsToDelete((prev) => ({ ...prev, [cartId]: Date.now() + 3000 }));
            const timeoutId = setTimeout(async () => {
              if (onRemoveItem) {
                await onRemoveItem(cartId);
                setCart((prev) => prev.filter((item) => item._id !== cartId));
              }
              setItemsToDelete((prev) => {
                const newState = { ...prev };
                delete newState[cartId];
                return newState;
              });
            }, 3000);

            setDeleteTimeouts((prev) => ({ ...prev, [cartId]: timeoutId }));
          } else {
            // اگر تعداد بیشتر از 1 است، کاهش فوری
            await onUpdateQuantity(cartId, currentQuantity - 1, currentQuantity);
            await fetchCart();
          }
        } else {
          await onUpdateQuantity(cartId, newQuantity, currentQuantity);
          await fetchCart();
        }
      }
    },
    [onUpdateQuantity, onRemoveItem, cartData, setCart, fetchCart]
  );

  const cancelDeletion = useCallback(
    (cartId: string) => {
      if (deleteTimeouts[cartId]) {
        clearTimeout(deleteTimeouts[cartId]);
        setDeleteTimeouts((prev) => {
          const newState = { ...prev };
          delete newState[cartId];
          return newState;
        });
      }

      setItemsToDelete((prev) => {
        const newState = { ...prev };
        delete newState[cartId];
        return newState;
      });
    },
    [deleteTimeouts]
  );

  const handleRemoveItem = useCallback(
    async (cartId: string) => {
      const item = cartData.find((item) => item._id === cartId);
      if (!item) return;

      if (item.quantity === 1) {
        // اگر تعداد 1 است، شروع تایمر برای حذف
        setItemsToDelete((prev) => ({ ...prev, [cartId]: Date.now() + 3000 }));
        const timeoutId = setTimeout(async () => {
          if (onRemoveItem) {
            await onRemoveItem(cartId);
            setCart((prev) => prev.filter((item) => item._id !== cartId));
          }
          setItemsToDelete((prev) => {
            const newState = { ...prev };
            delete newState[cartId];
            return newState;
          });
        }, 3000);

        setDeleteTimeouts((prev) => ({ ...prev, [cartId]: timeoutId }));
      } else {
        // اگر تعداد بیشتر از 1 است، کاهش فوری
        if (onUpdateQuantity) {
          await onUpdateQuantity(cartId, item.quantity - 1, item.quantity);
          await fetchCart();
        }
      }
    },
    [onRemoveItem, onUpdateQuantity, cartData, setCart, fetchCart]
  );

  // const handleContinue = useCallback(() => {
  //   const mockSelectedAddress = "test-address-id";
  //   const mockDeliveryId = "test-delivery-id";

  //   if (onContinue) {
  //     onContinue(mockSelectedAddress, mockDeliveryId);
  //   }
  // }, [onContinue]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-40">در حال بارگذاری...</div>;
  }

  const calculateTotalPrice = (items: CartItem[]) => {
    return items.reduce((total, item) => total + item.productId.price * item.quantity, 0);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR");
  };

  // const getTimeLeft = (cartId: string) => {
  //   const endTime = itemsToDelete[cartId];
  //   if (!endTime) return 0;
  //   return Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
  // };

  return (
    <div className="container mx-auto py-4 px-4 flex flex-col justify-between min-h-[70vh]">
      <div>
        <h1 className="text-md text-right font-bold mb-6">لیست محصولات سبد خرید شما</h1>

        <div className="space-y-4">
          {cartData.map((item) => {
            const isDeleting = itemsToDelete[item._id];
            // const timeLeft = getTimeLeft(item._id);
            const showResetButton = isDeleting && item.quantity === 1;

            return (
              <div key={item._id} className="border-2 border-black rounded-xl">
                <div className="flex justify-between items-center transition-all">
                  {showResetButton ? (
                    <div className="flex flex-col justify-center items-center gap-2 bg-gray-100 w-full p-4 rounded-xl transition-all">
                      <div className="w-full px-4 py-1 flex flex-col items-center gap-4">
                        <span className="text-md font-medium">این محصول از سبد خرید حذف شد</span>
                        <button
                          className="flex items-center justify-center font-bold rounded-lg transition-all duration-300"
                          onClick={() => cancelDeletion(item._id)}
                        >
                          <RotateCcw size={16} className="ml-2" />
                          بازگردانی
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full justify-between items-center p-4 transition-all">
                      <div className="flex-1">
                        <h3 className="text-md text-right font-semibold">{item.productId.title}</h3>
                        <div className="flex flex-col items-start gap-2 mt-2">
                          <span className="text-md">{formatPrice(item.productId.price)} تومان</span>
                          {item.productId.globalDiscount > 0 && (
                            <div className="flex flex-row gap-x-2 items-center">
                              <span className="line-through text-gray-400">
                                {formatPrice(
                                  item.productId.price * (1 + item.productId.globalDiscount / 100)
                                )}
                              </span>
                              <span className="py-1.5 px-2 text-[11px] bg-red-500 text-white rounded-full w-fit h-fit text-left">
                                %{item.productId.globalDiscount}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="relative flex items-center border-2 border-black rounded-full bg-white w-[110px] h-[50px] justify-between px-3">
                          <Plus
                            size={20}
                            className={`text-black cursor-pointer ${
                              loadingItems[item._id] ? "opacity-50" : ""
                            }`}
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1, item.quantity)
                            }
                          />
                          <span className="font-bold text-lg text-black w-6 text-center">
                            {loadingItems[item._id] ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <Trash2
                            size={20}
                            className={`text-black cursor-pointer ${
                              loadingItems[item._id] ? "opacity-50" : ""
                            }`}
                            onClick={() => handleRemoveItem(item._id)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {cartData.length > 0 && (
        <div className="mt-16 w-full flex flex-col gap-y-3 pt-20">
          <div className="w-full flex flex-row justify-between">
            <p>مبلغ {cartData.length} کالا</p>
            <p>
              <span className="font-bold ml-1">{formatPrice(calculateTotalPrice(cartData))}</span>
              تومان
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartForm;
