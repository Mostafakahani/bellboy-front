import React, { useEffect, useState } from "react";
import { Modal } from "../BellMazeh/Modal";
import { CartItem, ProductType } from "@/hooks/cartType";
import ProductSlider from "../ui/Slider/ProductSliderNew";
import { Loader2, Minus, PlusIcon, TrashIcon } from "lucide-react";
import { getCookie } from "cookies-next";
import { ensureCartArray, useCartOperations } from "@/hooks/useCartOperations";
import { useRouter } from "next/navigation";
import { LeftArrowIcon } from "@/icons/Icons";
// import { BackHandler } from "@/app/bell-shop/[id]/ProductDetails";

interface ProductDetailsProps {
  open: boolean;
  setOpen: (status: boolean) => void;
  id: string;
}

async function fetchProduct(id: string): Promise<ProductType[] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ open, setOpen, id }) => {
  const router = useRouter();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
  useEffect(() => {
    if (!open) {
      setProduct(null);
      return;
    }

    if (id && open) {
      setLoading(true);
      fetchProduct(id)
        .then((data) => {
          if (data && data.length > 0) {
            setProduct(data[0]);
          } else {
            setProduct(null);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch product:", error);
          setProduct(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, open]);

  if (!id) {
    return null;
  }
  const renderProductControls = () => {
    if (!product) return;
    const cartItem = Array.isArray(cart)
      ? cart.find((item) => item.productId._id === product._id)
      : null;
    const isInCart = Boolean(cartItem);
    const isLoading = loadingItems[product._id] || (cartItem?._id && loadingItems[cartItem._id]);

    return (
      <button
        className={`flex items-center justify-center border-[2px] border-black w-[40px] h-[40px] text-white px-1 py-1 rounded-full transition-all duration-300 shadow-md hover:shadow-none focus-visible:outline-none ${
          isInCart ? "bg-primary-400 !w-[90px]" : "bg-white w-full hover:scale-105"
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
              className={`${isLoading ? "opacity-50" : ""} size-5 cursor-pointer`}
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
                <span className="w-fit font-bold text-black px-2">افزودن به سبد خرید</span>
                {/* <PlusIcon className="w-5 h-5" /> */}
              </>
            )}
          </>
        )}
      </button>
    );
  };
  return (
    <Modal isOpen={open} onClose={() => setOpen(false)} title={product?.title}>
      <div className="px-4 pb-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : product ? (
          <div className="w-full">
            <div className="w-full my-5 flex flex-row justify-between items-center">
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
              {/* <BackHandler fallbackUrl="/bell-shop" /> */}
            </div>
            <div className="w-full flex flex-col items-center gap-5">
              <div className="w-[21rem] h-[21rem] bg-gray-200 rounded-xl">
                <ProductSlider
                  images={product.id_stores.map((x) => ({
                    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${x.location}`,
                    alt: x.name || "Product Image",
                  }))}
                />
              </div>
              <div className="w-full bg-white flex flex-col gap-2">
                <h1 className="text-lg text-right w-full font-bold">{product.title}</h1>
                <p className="text-gray-800 text-[13px] leading-5 font-light text-right">
                  {product.description}
                </p>
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
            {/* Add more product details as needed */}
          </div>
        ) : (
          <div className="text-center text-gray-600">Product not found.</div>
        )}
      </div>
    </Modal>
  );
};

export default ProductDetails;
