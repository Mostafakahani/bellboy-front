"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ShoppingBasket } from "lucide-react";

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
import { saveState } from "@/utils/localStorage";
import { ModalSmall } from "../BellMazeh/ModalSmall";
import ProductGrid from "../Products/ProductGrid";
import { useRouter, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const authenticatedFetch = useAuthenticatedFetch();

  // Get category IDs from URL
  const currentParentId = searchParams.get("parentCategory");
  // const currentSubId = searchParams.get("subCategory");
  // State
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [parentCategories] = useState(initialCategories);
  const [selectedParentCategory, setSelectedParentCategory] = useState<CategoryType | null>(() => {
    if (currentParentId) {
      return initialCategories.find((cat) => cat._id === currentParentId) || initialCategories[0];
    }
    return initialCategories[0];
  });
  const [subCategorys, setSubCategories] = useState<CategoryType[]>([]);

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

  // URL update helper
  const updateUrlParams = useCallback(
    (parentId?: string, subId?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (parentId) {
        params.set("parentCategory", parentId);
      } else {
        params.delete("parentCategory");
      }

      if (subId) {
        params.set("subCategory", subId);
      } else {
        params.delete("subCategory");
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (initialProducts?.length > 0) {
      setProducts(initialProducts);
      setIsLoading(false);
    }
  }, [initialProducts]);

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

  // کش کردن درخواست‌های قبلی
  const categoryCache = useRef<Record<string, CategoryType[]>>({});
  const productCache = useRef<Record<string, ProductType[]>>({});

  const handleCategoryChangeAndGetChildData = async (category: CategoryType) => {
    setIsLoading(true);
    try {
      // چک کردن کش برای دسته‌بندی‌ها
      if (categoryCache.current[category._id]) {
        setSubCategories(categoryCache.current[category._id]);
      } else {
        const { data } = await authenticatedFetch(`/category/${category._id}`);
        if (Array.isArray(data)) {
          categoryCache.current[category._id] = data;
          setSubCategories(data);
        }
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = async (category: CategoryType) => {
    setSelectedParentCategory(category);
    updateUrlParams(category._id);
    await handleCategoryChangeAndGetChildData(category);
    await fetchProductsByCategory(category._id);
  };

  // Handle subcategory selection
  const handleSubCategorySelect = async (subCategory: CategoryType) => {
    updateUrlParams(selectedParentCategory?._id, subCategory._id);
    await fetchProductsByCategory(subCategory._id);
  };

  useEffect(() => {
    if (selectedParentCategory && subCategorys.length === 0) {
      handleCategoryChangeAndGetChildData(selectedParentCategory);
    }
  }, [selectedParentCategory?._id]); // فقط به ID وابسته باشه

  useEffect(() => {
    const init = async () => {
      const parentId = searchParams.get("parentCategory");
      const subId = searchParams.get("subCategory");

      if (parentId && parentId !== selectedParentCategory?._id) {
        const category = parentCategories.find((cat) => cat._id === parentId);
        if (category) {
          await handleCategoryChangeAndGetChildData(category);
          setSelectedParentCategory(category);
        }
      }

      if (subId) {
        await fetchProductsByCategory(subId);
      }
    };

    init();
  }, [searchParams.toString()]); // فقط به تغییر URL واکنش نشون بده

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

      const data = await response.json();
      setCart(ensureCartArray(data));
      saveState("cart", ensureCartArray(data));
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  const { loadingItems, addToCart, removeFromCart, updateCartItemQuantity } =
    useCartOperations(setCart);

  const fetchProductsByCategory = async (categoryId: string) => {
    setIsLoading(true);
    try {
      // چک کردن کش برای محصولات
      if (productCache.current[categoryId]) {
        setProducts(productCache.current[categoryId]);
      } else {
        const { data } = await authenticatedFetch(`/product/cat/${categoryId}`);
        if (Array.isArray(data)) {
          const reversedData = [...data].reverse();
          productCache.current[categoryId] = reversedData;
          setProducts(reversedData);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await fetchCart();
      } catch (error) {
        console.error("Error in initial data fetch:", error);
      }
    };

    fetchInitialData();
  }, [isModalOpen]);

  useEffect(() => {
    if (Array.isArray(cart) && cart.length === 0) {
      setIsModalOpen(false);
      setIsParentModalOpen(false);
    }
  }, [cart]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const startInterval = () => {
      if (!interval && document.visibilityState === "visible" && navigator.onLine) {
        interval = setInterval(fetchCart, 20000);
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

    startInterval();

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

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

      if (status === "success") {
        setIsLoading(false);
      }

      setFormData((prev) => ({
        ...prev,
        addresses: data as Address[],
      }));
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <>
      {/* <Button
        onXsIsText
        className="fixed z-[9999999999999999999]"
        onClick={() => handleCategoryChangeAndGetChildData()}
      >
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
                  onClick={() => setIsModalOpen(true)}
                >
                  تکمیل سفارش
                </Button>
              </div>
            </div>
          </div>
        </ModalSmall>
        {/* Parent Categories */}
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
        {/* Subcategories */}
        <CategoryGrid subCategories={subCategorys} onSelectSubCategory={handleSubCategorySelect} />

        <div className="w-full flex justify-center items-center mt-4 px-4 md:px-0">
          <img
            src="https://static.snapp.express/sliders/11/16/14455288-d9fd-4660-b416-98244038c69a.webp"
            alt="bnr"
            className="max-w-md w-full rounded-xl h-[113px] bg-cover"
          />
        </div>

        <ProductGrid
          products={products}
          cart={cart}
          loadingItems={loadingItems}
          handleCartOperations={handleCartOperations}
          addToCart={addToCart}
          setIsParentModalOpen={setIsParentModalOpen}
          isLoading={isLoading}
          selectedCategory={{ type: "list" }}
        />

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

const CategoryGrid = ({
  subCategories,
  onSelectSubCategory,
}: {
  subCategories: CategoryType[];
  onSelectSubCategory: (category: CategoryType) => void;
}) => {
  if (!Array.isArray(subCategories) || subCategories.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-4">
      <h2 className="font-bold text-lg my-6 rtl:text-right">دسته بندی ها</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {subCategories.map((category, index) => (
          <div
            key={category._id || index}
            className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            onClick={() => onSelectSubCategory(category)}
          >
            <div className="relative flex justify-center items-center w-20 h-20 bg-gray-100 rounded-xl overflow-hidden">
              {category.id_store?.location ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${category.id_store.location}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-xl"
                  alt={category.name || "Category image"}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMj8xLy8vLy8xPz5AQEA+RkdIUFRcYWJiY2RkYz01PVtxa2Xi/9sABAEVFxceHh4tISEtYkJCQmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">⚪</span>
                </div>
              )}
            </div>
            <p className="w-full mt-3 text-sm font-medium text-center line-clamp-2">
              {category.name || "Untitled Category"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
