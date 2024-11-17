"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Minus, PlusIcon, ShoppingBasket, TrashIcon } from "lucide-react";

import BellTypoGraphy from "@/components/BellTypoGraphy";
import MainHeader from "@/components/mobile/Header/MainHeader";
import Button from "@/components/ui/Button/Button";
import BannerSlider from "@/components/ui/Slider/BannerSlider";
import { Modal } from "../BellMazeh/Modal";
import MultiStepForm from "../Stepper/Stepper";
import { LocationForm } from "../Location/LocationForm";
import DateTimeSelector, { TimeSlot } from "../DateTimeSelector";
import FactorDetails from "../Factor/FactorDetails";

import { ensureCartArray, useCartOperations } from "@/hooks/useCartOperations";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { CartItem, CategoryType, ProductType } from "@/hooks/cartType";
import { Address } from "../Profile/Address/types";
import { showError } from "@/lib/toastService";
import CartForm from "../Profile/Cart/CartForm";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { saveState } from "@/utils/localStorage";
import { ModalSmall } from "../BellMazeh/ModalSmall";

// Types
interface ClientShopProps {
  initialCategories: CategoryType[];
  initialProducts: ProductType[];
}

export interface FormData {
  addresses: Address[];
  selectedAddress: Address | null;
  selectedServices: string[];
  selectedDateTime: { date: string; time: TimeSlot } | null;
  paymentComplete: boolean;
}

// Constants
const BANNER_IMAGES = [
  { url: "/images/shop/banner1.jpg", alt: "توضیحات تصویر اول" },
  { url: "/images/shop/banner2.jpg", alt: "توضیحات تصویر دوم" },
];

// Components
const FactorForm: React.FC<{ formData: any; onFormChange: (newData: any) => void }> = ({
  formData,
  onFormChange,
}) => {
  return <FactorDetails type="shop" formData={formData} onFormChange={onFormChange} />;
};

export default function ClientShop({ initialCategories, initialProducts }: ClientShopProps) {
  const router = useRouter();
  const authenticatedFetch = useAuthenticatedFetch();

  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  // State
  const [parentCategories] = useState(initialCategories);
  const [selectedParentCategory, setSelectedParentCategory] = useState(
    initialCategories[0] || null
  );
  const [products, setProducts] = useState<ProductType[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    addresses: [],
    selectedAddress: null,
    selectedServices: [],
    selectedDateTime: null,
    paymentComplete: false,
  });
  useEffect(() => {
    if (initialProducts?.length > 0) {
      setProducts(initialProducts);
      setIsLoading(false);
    }
  }, []);
  // const handleContinue = (selectedAddress: string, deliveryId: string) => {
  //   // Handle the continuation logic here
  //   console.log({ isInitialLoading });
  //   console.log("Selected Address:", selectedAddress);
  //   console.log("Delivery ID:", deliveryId);
  // };
  // Handlers
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

  // تغییر در handleCategoryChange
  const handleCategoryChange = async (category: CategoryType) => {
    setSelectedParentCategory(category);
    setIsLoading(true);
    try {
      const { data } = await authenticatedFetch(`/product/cat/${category._id}`);
      if (Array.isArray(data)) {
        const reversedData = [...data].reverse();
        setProducts(reversedData);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };
  // const handleCategoryChangeAndGetChildData = async () => {
  //   setIsLoading(true);
  //   try {
  //     const { data } = await authenticatedFetch(`/category/${selectedParentCategory._id}`);
  //     if (Array.isArray(data)) {
  //       const reversedData = [...data].reverse();
  //       setProducts(reversedData);
  //     }
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //     setProducts([]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
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

  // Data fetching
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

  // Effects
  // برای اجرای درخواست اولیه هنگام تغییر modal
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
    if (isModalOpen) {
      fetchAddresses();
    }
  }, [isModalOpen]);
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
  // Render helpers
  const renderProductControls = (product: ProductType) => {
    const cartItem = Array.isArray(cart)
      ? cart.find((item) => item.productId._id === product._id)
      : null;
    const isInCart = Boolean(cartItem);
    const isLoading = loadingItems[product._id] || (cartItem?._id && loadingItems[cartItem._id]);

    return (
      <button
        className={`relative right-[6rem] flex items-center justify-center border-[3px] border-black w-[50px] h-[50px] text-white px-1 py-1 rounded-full transition-all duration-[500ms] ${
          isInCart ? "bg-primary-400 !w-[110px] !right-[2.2rem]" : "bg-white"
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
          <div className="text-black flex flex-row items-center justify-between gap-2">
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
      {/* <Button onXsIsText className="fixed z-[9999999999999999999]" onClick={log}>
        LOG
      </Button> */}
      <MainHeader />
      <div className="mt-20 overflow-y-auto">
        <BellTypoGraphy english="Bell Shop" farsi="بل شاپ" />
        <BannerSlider images={BANNER_IMAGES} activeDotColor="#000000" inactiveDotColor="#48FDBC" />
        <ModalSmall isOpen={isParentModalOpen} onClose={() => setIsParentModalOpen(false)}>
          <div className="h-full flex flex-row justify-end w-full px-3">
            <div className="w-full flex flex-col gap-y-3 px-3">
              <div className="w-full">
                <p className="flex flex-row gap-2 text-right mb-2">
                  <ShoppingBasket />
                  {cart.length} در سبد
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
                  onClick={() => setIsModalOpen(true)}
                >
                  مشاهده سبدخرید
                </Button>
              </div>
            </div>
          </div>
        </ModalSmall>
        <div className="relative w-full mt-8">
          <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4">
            <div className="flex gap-5 px-4 min-w-max mx-auto">
              {parentCategories.map((category) => (
                <div
                  key={category._id}
                  className={`flex flex-col gap-5 min-h-[110px] items-center justify-between w-[80px] cursor-pointer pt-3 border-[3px] rounded-t-[50px] rounded-b-[20px] transition-all ${
                    category._id === selectedParentCategory?._id
                      ? "bg-primary-400 border-black"
                      : "border-transparent bg-white"
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  <div className="flex flex-col items-center justify-between gap-y-3 py-1">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${category?.id_store?.location}`}
                      width={24}
                      height={24}
                      className="w-10 h-10"
                      alt={category.name}
                    />
                    <span className="text-xs font-bold text-center">{category.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center items-center mt-4 px-4 md:px-0">
          <img
            src="https://static.snapp.express/sliders/11/16/14455288-d9fd-4660-b416-98244038c69a.webp"
            alt="bnr"
            className="max-w-md w-full rounded-xl h-[113px] bg-cover"
          />
        </div>

        <div className="mt-16 mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-4 justify-items-center">
          {isLoading ? (
            // Loading placeholders
            Array.from({ length: 4 }).map((_, index) => (
              <div
                className="flex flex-col gap-3 w-[160px] min-h-[300px]"
                key={`skeleton-${index}`}
              >
                <div className="rounded-xl w-40 h-40 bg-gray-200 animate-pulse" />
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
                  <div className="text-left flex flex-col gap-1">
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <div className="flex flex-col gap-3 w-[160px] min-h-[300px]" key={product._id}>
                <Image
                  className="rounded-xl w-40 h-40 object-cover"
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${product.id_stores[0]?.location}`}
                  width={150}
                  height={150}
                  alt={product.title}
                  onClick={() => router.push("/bell-shop/" + product._id)}
                />
                <div
                  className="flex flex-col gap-2"
                  onClick={() => router.push("/bell-shop/" + product._id)}
                >
                  <span className="text-xs font-bold">{product.title}</span>
                  <span className="text-[10px] line-clamp-2">{product.description}</span>
                  {product.stock == 2 ? (
                    <span className="text-red-500 text-xs">2 موجودی باقیمانده</span>
                  ) : product.stock == 1 ? (
                    <span className="text-red-500 text-xs">1 موجودی باقیمانده</span>
                  ) : null}
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
          ) : (
            <div className="col-span-full text-center py-8">
              محصولی برای این دسته‌بندی وجود ندارد
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="mt-16 mb-8 w-full flex flex-col gap-y-3 px-3">
            <div className="w-full flex flex-row justify-between">
              <p>مبلغ {cart.length} کالا</p>
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
                onClick={() => setIsModalOpen(true)}
              >
                تکمیل سفارش
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <MultiStepForm
          steps={steps}
          formData={formData}
          onFormChange={handleFormChange}
          handleSubmit={() => console.log(formData)}
        />
      </Modal>
    </>
  );
}
