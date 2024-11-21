"use client";

import MainHeader from "@/components/mobile/Header/MainHeader";
import Image from "next/image";
import { useState, useEffect } from "react";
import Layout from "@/components/mobile/Drawers/Layout";
import BellTypoGraphy from "@/components/BellTypoGraphy";
import { Loader2, Minus, PlusIcon, ShoppingBasket } from "lucide-react";
import { TrashIcon } from "@/icons/Icons";
import Button from "@/components/ui/Button/Button";
import { CartItem, Items, ProductType } from "@/hooks/cartType";
import MultiStepModal from "@/components/Stepper/MultiStepModalHeram/MultiStepModalHeram";
import DateTimeSelector, { TimeSlot } from "@/components/DateTimeSelector";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { useRouter } from "next/navigation";
import { FormData } from "@/components/BellShop/ClientShop";
import { ensureCartArray, useCartOperations } from "@/hooks/useCartOperations";
import { saveState } from "@/utils/localStorage";
import { getCookie } from "cookies-next";
import { Address } from "@/components/Profile/Address/types";
import { showError } from "@/lib/toastService";
import { Modal } from "./Modal";
import MultiStepForm from "../Stepper/Stepper";
import CartForm, { formatPrice } from "../Profile/Cart/CartForm";
import FactorDetails from "../Factor/FactorDetails";
import { LocationForm } from "../Location/LocationForm";
import ModalSmall from "./ModalSmall";
interface ClientShopProps {
  initialProducts: ProductType[];
}
const categorys = [
  { id: 1, name: "هرم مزه", icon: "/images/icons/heramMazeh.svg", type: "drawer" },
  { id: 2, name: "سینی مزه", icon: "/images/icons/siniMazeh.svg", type: "list" },
];
const FactorForm: React.FC<{ formData: any; onFormChange: (newData: any) => void }> = ({
  formData,
  onFormChange,
}) => {
  return <FactorDetails formData={formData} onFormChange={onFormChange} />;
};

const BellMazehClient = ({ initialProducts }: ClientShopProps) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCheckOutOpen, setIsModalCheckOutOpen] = useState(false);
  //   const [loading, setLoading] = useState<boolean>(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);

  const [products, setProducts] = useState<ProductType[]>(initialProducts); // eslint-disable-line @typescript-eslint/no-unused-vars
  const authenticatedFetch = useAuthenticatedFetch();

  // State

  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  // const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    addresses: [],
    selectedAddress: null,
    selectedServices: [],
    selectedDateTime: null,
    paymentComplete: false,
  });

  //   useEffect(() => {
  //     const loadProducts = async () => {
  //       const data = await fetchProducts();
  //       setProducts(data);
  //     };
  //     loadProducts();
  //   }, []);

  // const handleRemoveFromCart = (productId: string) => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  //   removeFromCart(productId);
  // };

  // const addToCart = (product: ProductType) => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  //   setCart((prevCart) => {
  //     const existingProduct = prevCart.find((item) => item._id === product._id);
  //     if (existingProduct) {
  //       return prevCart.map((item) =>
  //         item._id === product._id ? { ...item, quantity: (item as any).quantity + 1 } : item
  //       );
  //     }
  //     return [...prevCart, { ...product, quantity: 1 }];
  //   });
  // };

  // const removeFromCart = (productId: string) => {
  //   setCart((prevCart) =>
  //     prevCart
  //       .map((item) =>
  //         item._id === productId ? { ...item, quantity: (item as any).quantity - 1 } : item
  //       )
  //       .filter((item) => (item as any).quantity > 0)
  //   );
  // };

  useEffect(() => {
    const defaultCategory = categorys.find((category) => category.type === "list");
    console.log({ defaultCategory });
    if (defaultCategory) {
      setSelectedCategory(defaultCategory);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("سبد خرید به‌روز شد:", cart);
  }, [cart]);
  const handleFormChange = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleDateTimeSelect = (date: string, time: TimeSlot) => {
    setFormData((prev) => ({
      ...prev,
      selectedDateTime: {
        date,
        time,
        timeSlotId: time._id,
      },
    }));
  };
  const fetchCart = async () => {
    const token = getCookie("auth_token");

    if (!token) return;
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      // if (!response.ok) {
      //   throw new Error("Failed to fetch profile data");
      // }

      const data = await response.json();

      console.log(data);

      setCart(ensureCartArray(data));
      saveState("cart", ensureCartArray(data));
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const { loadingItems, addToCart, removeFromCart, updateCartItemQuantity } =
    useCartOperations(setCart);
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          fetchCart(),
          // fetchAddresses(),
        ]);
      } catch (error) {
        console.error("Error in initial data fetch:", error);
      }
    };

    fetchInitialData();
  }, [isModalOpen]);

  // برای اجرای درخواست‌های دوره‌ای
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const startInterval = () => {
      // فقط اگر قبلاً interval وجود نداشته باشد، یکی جدید ایجاد کن
      if (!interval && document.visibilityState === "visible" && navigator.onLine) {
        interval = setInterval(async () => {
          try {
            await fetchCart();
          } catch (error) {
            console.error("Error fetching cart:", error);
          }
        }, 20000);
      }
    };

    const stopInterval = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const handleOnlineStatus = () => {
      if (navigator.onLine) {
        startInterval();
      } else {
        stopInterval();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startInterval();
      } else {
        stopInterval();
      }
    };

    // راه‌اندازی اولیه
    startInterval();

    // اضافه کردن event listeners
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // cleanup
    return () => {
      stopInterval();
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  useEffect(() => {
    if (isParentModalOpen) {
      fetchAddresses();
    }
  }, [isParentModalOpen]);
  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      console.log({ message });
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };
  const fetchAddresses = async () => {
    try {
      setIsLoading(true);

      const { data, error, message, status } = await authenticatedFetch("/address", {
        method: "GET",
      });

      if (error) {
        setIsLoading(false);
        throw new Error(formatErrorMessage(message));
      }

      // if (data?.statusCode && data.statusCode !== 200) {
      //   setIsLoading(false);
      //   throw new Error(formatErrorMessage(data.message));
      // }

      if (status === "success") {
        // showSuccess(message);
        setIsLoading(false);
      }
      //  else {
      //   throw new Error(formatErrorMessage(data?.message) || "خطا در ارسال اطلاعات");
      // }
      console.log(data);
      setFormData((prev) => ({
        ...prev,
        addresses: data as Address[],
      }));

      // handleFormChange({ addresses: data?.data });
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };
  // اضافه کردن useEffect برای نظارت بر تغییرات cart
  useEffect(() => {
    if (Array.isArray(cart) && cart.length === 0) {
      setIsModalCheckOutOpen(false);
      setIsParentModalOpen(false);
    }
  }, [cart]); // وابستگی به cart

  // و handleCartOperations رو ساده‌تر کنیم
  const handleCartOperations = {
    remove: async (cartId: string) => {
      await removeFromCart(cartId);
      await fetchCart();
    },
    updateQuantity: async (cartId: string, newQuantity: number, currentQuantity: number) => {
      await updateCartItemQuantity(cartId, newQuantity, currentQuantity);
      if (newQuantity === 0) {
        await fetchCart();
      }
    },
  };
  // Steps configuration
  const steps = [
    {
      id: 1,
      label: "سبدخرید",
      content: (
        <CartForm
          fetchCart={fetchCart}
          setCart={setCart}
          cartData={cart}
          isLoading={false}
          loadingItems={loadingItems}
          onUpdateQuantity={updateCartItemQuantity}
          onRemoveItem={removeFromCart}
          // onContinue={handleContinue}
        />
      ),
      isComplete: () => cart.length !== 0,
    },
    {
      id: 2,
      label: "موقعیت",
      content: (
        <LocationForm formData={formData} isLoading={isLoading} onFormChange={handleFormChange} />
      ),
      isComplete: () => formData.selectedAddress !== null,
    },
    {
      id: 3,
      label: "زمان",
      content: (
        <DateTimeSelector
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          onSelect={handleDateTimeSelect}
        />
      ),
      isComplete: () => formData.selectedDateTime !== null && selectedTime !== null,
    },

    {
      id: 4,
      label: "پرداخت",
      content: <FactorForm formData={formData} onFormChange={handleFormChange} />,
      isComplete: () => formData.paymentComplete,
    },
  ];

  const renderProductControls = (product: ProductType) => {
    const cartItem = Array.isArray(cart)
      ? cart.find((item) => item?.productId?._id === product._id && !item.IsTastePyramids)
      : null;
    const isInCart = Boolean(cartItem);
    const isLoading = loadingItems[product._id] || (cartItem?._id && loadingItems[cartItem._id]);

    return (
      <button
        className={`relative right-[7.5rem] top-4 flex items-center justify-center border-[3px] border-black w-[40px] h-[40px] text-white px-1 py-1 rounded-full transition-all duration-[500ms] ${
          isInCart ? "bg-primary-400 !w-[90px] !right-[4.1rem]" : "bg-white"
        }`}
        onClick={(e) => {
          e.preventDefault();
          if (!Array.isArray(cart)) return;
          if (cartItem) {
            handleCartOperations.updateQuantity(
              cartItem._id,
              cartItem.quantity - 1,
              cartItem.quantity
            );
          } else {
            addToCart(product._id);
            setIsParentModalOpen(true);
          }
        }}
      >
        {isInCart ? (
          <div className="text-black flex flex-row items-center justify-between gap-1">
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
              <Loader2 className="w-5 h-5 animate-spin text-black" />
            ) : (
              <PlusIcon className="text-black size-5" />
            )}
          </>
        )}
      </button>
    );
  };

  return (
    <>
      <MainHeader />
      <Layout>
        <div className="flex flex-col mt-16">
          <BellTypoGraphy farsi="بِل مزه" english="Bell Mazeh" className="!rotate-[3deg]" />
          <ModalSmall isOpen={isParentModalOpen} onClose={() => setIsParentModalOpen(false)}>
            <div className="h-full flex flex-row justify-end w-full px-3">
              <div className="w-full flex flex-col gap-y-3 px-3">
                <div className="w-full">
                  <p className="flex flex-row gap-2 text-right mb-2">
                    <ShoppingBasket />
                    {cart.length} محصول در سبد
                  </p>
                  <hr />
                </div>
                <div className="w-full flex flex-row justify-between">
                  <p>مجموع سبد خرید</p>
                  <p>
                    <span className="font-bold ml-1">
                      {cart
                        .reduce((total, item) => total + item.productId.price * item.quantity, 0)
                        .toLocaleString("fa-IR")}
                    </span>
                    تومان
                  </p>
                </div>

                <div className="w-full">
                  <Button
                    className="w-full"
                    variant="primary"
                    onXsIsText
                    onClick={() => setIsModalCheckOutOpen(true)}
                  >
                    تکمیل سفارش
                  </Button>
                </div>
              </div>
            </div>
          </ModalSmall>
          <div className="flex flex-row justify-center gap-5 mt-8">
            {categorys.map((category) => (
              <div
                style={{
                  borderTopRightRadius: "50px",
                  borderTopLeftRadius: "50px",
                  borderBottomLeftRadius: "20px",
                  borderBottomRightRadius: "20px",
                }}
                className={`flex flex-col gap-5 items-center justify-between w-[80px] cursor-pointer px-3 p-2 pt-3 border-[3px] transition-all ${
                  category.id === selectedCategory?.id
                    ? "bg-primary-400 border-black"
                    : "border-transparent bg-white"
                }`}
                onClick={() => {
                  if (category.type === "drawer") {
                    setIsModalOpen(true);
                    setSelectedCategory(category);
                  } else {
                    setSelectedCategory(category);
                  }
                }}
                key={category.id}
              >
                <div className="flex flex-col items-center justify-between gap-y-1 py-1">
                  <Image
                    src={category.icon}
                    width={24}
                    height={24}
                    className="w-10 h-10"
                    alt={category.name}
                  />
                  <span className="text-sm font-bold text-center text-nowrap">{category.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* نمایش محصولات */}
          <div className="mt-16 mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-4 justify-items-center">
            {products?.length && selectedCategory && selectedCategory.type === "list"
              ? products.map((product) => (
                  <div className="flex flex-col gap-3 w-[160px]" key={product._id}>
                    <Image
                      className="rounded-xl w-40 h-40 object-cover"
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${product.id_stores[0]?.location}`}
                      width={150}
                      height={150}
                      alt={product.title}
                    />

                    <div
                      className="flex flex-col gap-2"
                      onClick={() => router.push("/bell-shop/" + product._id)}
                    >
                      <span className="text-sm font-bold">{product.title}</span>
                      <span className="text-xs line-clamp-2">{product.description}</span>
                      {product.stock == 2 ? (
                        <span className="text-red-500 text-xs">2 موجودی باقیمانده</span>
                      ) : product.stock == 1 ? (
                        <span className="text-red-500 text-xs">1 موجودی باقیمانده</span>
                      ) : (
                        <span></span>
                      )}
                      <div className="text-left flex flex-col gap-1">
                        <span className="text-xs">تومان</span>
                        {product.globalDiscount !== 0 ? (
                          <>
                            <span className="text-sm font-bold">
                              {Math.round(
                                Number(product.price) * (1 - Number(product.globalDiscount) / 100)
                              ).toLocaleString()}
                            </span>
                            <div className="w-full flex flex-row justify-between items-center">
                              <span className="py-1.5 px-2 text-[11px] bg-red-500 text-white rounded-full w-fit h-fit text-left">
                                %{product.globalDiscount}
                              </span>
                              <span className={`text-sm line-through`}>
                                {product.price.toLocaleString("fa-IR")}
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className={`text-sm font-bold`}>
                            {product.price.toLocaleString("fa-IR")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="absolute" onClick={() => null}>
                      <div className="relative left-0 top-24 flex items-center gap-2">
                        {renderProductControls(product)}
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>

          {/* نمایش سبد خرید */}

          {cart.length > 0 && (
            <div className="mt-16 mb-8 w-full flex flex-col gap-y-3 px-3">
              <div className="w-full flex flex-row justify-between">
                <p>مبلغ {cart.length} کالا</p>
                <p>
                  <span className="font-bold ml-1">
                    {formatPrice(
                      cart.reduce((total, item) => {
                        if (item?.IsTastePyramids && item.items) {
                          // Calculate the total for items in the stages
                          const stageTotal = (
                            ["stage1", "stage2", "stage3", "stage4"] as (keyof Items)[]
                          ).reduce((stageSum, stage) => {
                            const stageItems = item.items[stage]; // Get the stage items dynamically
                            if (Array.isArray(stageItems)) {
                              return (
                                stageSum +
                                stageItems.reduce((sum, stageItem) => {
                                  const price = stageItem?.productId?.price || 0;
                                  const quantity = stageItem?.quantity || 0;
                                  return sum + price * quantity;
                                }, 0)
                              );
                            }
                            return stageSum;
                          }, 0);
                          return total + stageTotal;
                        } else {
                          // Calculate the total for regular items
                          const price = item?.productId?.price || 0;
                          const quantity = item?.quantity || 0;
                          return total + price * quantity;
                        }
                      }, 0)
                    ).toLocaleString()}{" "}
                  </span>
                  تومان
                </p>
              </div>

              <div className="w-full">
                <Button
                  className="w-full"
                  variant="primary"
                  onXsIsText
                  onClick={() => setIsModalCheckOutOpen(true)}
                >
                  تکمیل سفارش
                </Button>
              </div>
            </div>
          )}

          <Modal
            isOpen={isModalCheckOutOpen}
            onClose={() => {
              setIsModalCheckOutOpen(false);
            }}
          >
            <MultiStepForm
              steps={steps}
              formData={formData}
              onFormChange={handleFormChange}
              handleSubmit={() => console.log(formData)}
            />
          </Modal>
          {products && (
            // <Modal
            //   isOpen={isModalOpen && selectedCategory && selectedCategory.type === "drawer"}
            //   onClose={() => {
            //     setIsModalOpen(false);
            //   }}
            // >
            <MultiStepModal
              products={products}
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedCategory(categorys.find((category) => category.type === "list"));
              }}
            />
            // </Modal>
          )}
        </div>
      </Layout>
    </>
  );
};

export default BellMazehClient;
