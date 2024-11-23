// product/[id]/ProductDetails.tsx
"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { Loader2, Minus, PlusIcon } from "lucide-react";
import { CartItem, ProductType } from "@/hooks/cartType";
import { ensureCartArray, useCartOperations } from "@/hooks/useCartOperations";
import ProductSliderNew from "@/components/ui/Slider/ProductSliderNew";
import { BackArrowIcon, LeftArrowIcon, TrashIcon } from "@/icons/Icons";
import { useRouter } from "next/navigation";

interface ProductDetailsProps {
  product: ProductType;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { loadingItems, addToCart, removeFromCart, updateCartItemQuantity } =
    useCartOperations(setCart);

  const handleCartOperations = {
    remove: async (cartId: string) => {
      await removeFromCart(cartId);
      await fetchCart();
    },
    updateQuantity: async (cartId: string, newQuantity: number, currentQuantity: number) => {
      await updateCartItemQuantity(cartId, newQuantity, currentQuantity);
      if (newQuantity === 0) await fetchCart();
    },
  };

  const fetchCart = async () => {
    const token = getCookie("auth_token");
    if (!token) {
      setIsLoading(false);
      console.log(isLoading);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();
      setCart(ensureCartArray(data));
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const renderProductControls = () => {
    const cartItem = Array.isArray(cart)
      ? cart.find((item) => item.productId._id === product._id)
      : null;
    const isInCart = Boolean(cartItem);
    const isLoading = loadingItems[product._id] || (cartItem?._id && loadingItems[cartItem._id]);

    return (
      <button
        className={`relative flex items-center justify-center border-[3px] border-black h-[50px] text-black px-4 py-1 rounded-full transition-all duration-[500ms] ${
          isInCart ? "bg-primary-400 w-[110px]" : "bg-primary-400 w-[200px] gap-2"
        }`}
        onClick={(e) => {
          e.preventDefault();
          if (!Array.isArray(cart)) return;
          if (!isInCart) {
            addToCart(product._id);
          }
        }}
      >
        {isInCart ? (
          <div className="text-black flex flex-row items-center justify-between gap-1 w-full">
            <PlusIcon
              className={`${isLoading ? "opacity-50" : ""} cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (cartItem && !loadingItems[cartItem._id]) {
                  handleCartOperations.updateQuantity(
                    cartItem._id,
                    cartItem.quantity + 1,
                    cartItem.quantity
                  );
                }
              }}
            />
            <span className="font-bold text-lg text-nowrap w-6 line-clamp-1 flex justify-center items-center">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : cartItem?.quantity || 0}
            </span>
            {/* <TrashIcon
              className={`${isLoading ? "opacity-50" : ""} cursor-pointer`}
              onClick={async (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (cartItem && !loadingItems[cartItem._id]) {
                  if (cartItem.quantity === 1) {
                    await handleCartOperations.remove(cartItem._id);
                  } else {
                    await handleCartOperations.updateQuantity(
                      cartItem._id,
                      cartItem.quantity - 1,
                      cartItem.quantity
                    );
                  }
                }
              }}
              color="black"
            /> */}
            {cartItem?.quantity === 1 ? (
              <TrashIcon
                className={`${isLoading ? "opacity-50" : ""} size-4 cursor-pointer`}
                onClick={async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (cartItem && !loadingItems[cartItem._id]) {
                    if (cartItem.quantity === 1) {
                      await handleCartOperations.remove(cartItem._id);
                    } else {
                      await handleCartOperations.updateQuantity(
                        cartItem._id,
                        cartItem.quantity - 1,
                        cartItem.quantity
                      );
                    }
                  }
                }}
                color="black"
              />
            ) : (
              <Minus
                className={`${isLoading ? "opacity-50" : ""} size-4 cursor-pointer`}
                onClick={async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (cartItem && !loadingItems[cartItem._id]) {
                    if (cartItem.quantity === 1) {
                      await handleCartOperations.remove(cartItem._id);
                    } else {
                      await handleCartOperations.updateQuantity(
                        cartItem._id,
                        cartItem.quantity - 1,
                        cartItem.quantity
                      );
                    }
                  }
                }}
                color="black"
              />
            )}
          </div>
        ) : (
          <>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span className="w-fit font-bold">افزودن به سبد خرید</span>
                {/* <PlusIcon className="w-5 h-5" /> */}
              </>
            )}
          </>
        )}
      </button>
    );
  };

  return (
    <div className="p-4 mt-16 mb-7 flex flex-col justify-between items-center min-h-[85vh]">
      <div className="w-full mt-5 flex flex-row justify-between items-center">
        <div className="w-full flex flex-row gap-x-1 text-sm items-center justify-start">
          {Array.isArray(product.id_categories) &&
            product.id_categories.map((category, index) => {
              if (typeof category === "object" && category.isParent) {
                return (
                  <div
                    className="flex flex-row gap-x-1 text-xs items-center"
                    key={String(category._id)}
                  >
                    <span onClick={() => router.push("/bell-shop")}>بِل‌شاپ</span>
                    <LeftArrowIcon />
                    {category.name} <LeftArrowIcon />
                  </div>
                );
              } else {
                return (
                  <div key={index} className="font-medium text-xs">
                    {String(category.name)}
                  </div>
                );
              }
            })}
        </div>
        <BackHandler fallbackUrl="/bell-shop" />
      </div>
      <div className="w-full flex flex-col items-center gap-5">
        <div className="w-[21rem] h-[21rem] bg-gray-200 rounded-xl">
          <ProductSliderNew
            images={product.id_stores.map((x) => ({
              url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${x.location}`,
              alt: x.name || "Product Image",
            }))}
          />
        </div>
        <div className="w-full bg-white flex flex-col gap-2">
          <h1 className="text-lg text-right w-full font-bold">{product.title}</h1>
          <p className="text-gray-800 text-[13px] leading-5 font-light">{product.description}</p>
        </div>
        {product.stock == 2 ? (
          <span className="text-red-500 text-xs text-right w-full">2 موجودی باقیمانده</span>
        ) : product.stock == 1 ? (
          <span className="text-red-500 text-xs text-right w-full">1 موجودی باقیمانده</span>
        ) : (
          <span></span>
        )}
      </div>
      <div className="w-full flex flex-row justify-between items-center mt-10">
        <div>{renderProductControls()}</div>
        <div className="text-left flex flex-col gap-1">
          {product.globalDiscount !== 0 ? (
            <>
              <div className="w-full flex flex-row justify-between items-center">
                <span className="ml-2 py-1.5 px-2 text-[11px] bg-red-500 text-white rounded-full w-fit h-fit text-left">
                  %{product.globalDiscount}
                </span>
                <span className={`text-sm line-through`}>
                  {product.price.toLocaleString("fa-IR")}
                </span>
              </div>
              <span className="text-md font-bold">
                {Math.round(
                  Number(product.price) * (1 - Number(product.globalDiscount) / 100)
                ).toLocaleString()}{" "}
                تومان
              </span>
            </>
          ) : (
            <span className={`text-md font-bold`}>
              {product.price.toLocaleString("fa-IR")} تومان
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface BackHandlerProps {
  fallbackUrl?: string;
  className?: string;
}

export const BackHandler = ({ fallbackUrl = "/", className = "" }: BackHandlerProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined") {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push(fallbackUrl);
      }
    }
  };

  return (
    <div
      onClick={handleBack}
      className={`transform rotate-180 cursor-pointer hover:opacity-75 transition-opacity ${className}`}
    >
      <BackArrowIcon />
    </div>
  );
};
