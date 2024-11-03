"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, PlusIcon, TrashIcon } from "lucide-react";

import BellTypoGraphy from "@/components/BellTypoGraphy";
import MainHeader from "@/components/mobile/Header/MainHeader";
import Button from "@/components/ui/Button/Button";
import BannerSlider from "@/components/ui/Slider/BannerSlider";
import { Modal } from "../BellMazeh/Modal";
import MultiStepForm from "../Stepper/Stepper";
import { LocationForm } from "../Location/LocationForm";
import { ServiceForm } from "../ServiceForm/ServiceForm";
import DateTimeSelector from "../DateTimeSelector";
import FactorDetails from "../Factor/FactorDetails";

import { useCartOperations } from "@/hooks/useCartOperations";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { CartItem, CategoryType, ProductType } from "@/hooks/cartType";
import { TimeSlot } from "@/app/bell-clean/page";
import { Address } from "../Profile/Address/types";

// Types
interface ClientShopProps {
  initialCategories: CategoryType[];
  initialProducts: ProductType[];
}

interface FormData {
  addresses: Address[];
  selectedAddress: Address | null;
  selectedServices: string[];
  selectedDateTime: { date: string; time: TimeSlot } | null;
  paymentComplete: boolean;
}

type DaySchedule = {
  date: string;
  dayName: string;
  timeSlots: TimeSlot[];
};

// Constants
const BANNER_IMAGES = [
  { url: "/images/shop/banner1.jpg", alt: "توضیحات تصویر اول" },
  { url: "/images/shop/banner2.jpg", alt: "توضیحات تصویر دوم" },
];

const DEMO_WEEK_SCHEDULE: DaySchedule[] = [
  {
    date: "۱۲ مهر",
    dayName: "شنبه",
    timeSlots: [
      { start: "۸", end: "۱۲" },
      { start: "۱۳", end: "۱۷" },
      { start: "۱۸", end: "۲۲" },
    ],
  },
  {
    date: "۱۳ مهر",
    dayName: "یکشنبه",
    timeSlots: [
      { start: "۸", end: "۱۲" },
      { start: "۱۳", end: "۱۷" },
      { start: "۱۸", end: "۲۲" },
    ],
  },
];

const DEMO_ORDER_SUMMARY = {
  products: [
    { name: "پکیج استاندارد نظافت داخلی", price: 400000 },
    { name: "پکیج استاندارد نظافت خارجی", price: 300000 },
    { name: "پکیج استاندارد نظافت خارجی", price: 300000 },
  ],
  shippingCost: 50000,
};

// Components
const FactorForm: React.FC<{ formData: any; onFormChange: (newData: any) => void }> = () => {
  return <FactorDetails orderSummary={DEMO_ORDER_SUMMARY} />;
};

export default function ClientShop({ initialCategories, initialProducts }: ClientShopProps) {
  const authenticatedFetch = useAuthenticatedFetch();

  // State
  const [parentCategories] = useState(initialCategories);
  const [selectedParentCategory, setSelectedParentCategory] = useState(
    initialCategories[0] || null
  );
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    addresses: [],
    selectedAddress: null,
    selectedServices: [],
    selectedDateTime: null,
    paymentComplete: false,
  });

  // Handlers
  const handleFormChange = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleDateTimeSelect = (date: string, time: TimeSlot) => {
    setFormData((prev) => ({
      ...prev,
      selectedDateTime: { date, time },
    }));
  };

  const handleCategoryChange = async (category: CategoryType) => {
    setSelectedParentCategory(category);
    try {
      const { data } = await authenticatedFetch(`/product/cat/${category._id}`);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

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
    try {
      const { data } = await authenticatedFetch("/cart");
      setCart(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
    }
  };

  const { loadingItems, addToCart, removeFromCart, updateCartItemQuantity } =
    useCartOperations(setCart);
  // Steps configuration
  const steps = [
    {
      id: 1,
      label: "موقعیت",
      content: <LocationForm formData={formData} onFormChange={handleFormChange} />,
      isComplete: () => formData.selectedAddress !== null,
    },
    {
      id: 2,
      label: "سرویس",
      content: <ServiceForm formData={formData} onFormChange={handleFormChange} />,
      isComplete: () => formData.selectedServices.length > 0,
    },
    {
      id: 3,
      label: "زمان",
      content: (
        <DateTimeSelector
          weekSchedule={DEMO_WEEK_SCHEDULE}
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
  useEffect(() => {
    const initializeCart = async () => {
      setIsInitialLoading(true);
      try {
        await fetchCart();
      } finally {
        setIsInitialLoading(false);
        console.log(isInitialLoading);
      }
    };

    initializeCart();
  }, []);

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
          }
        }}
      >
        {isInCart ? (
          <div className="text-black flex flex-row items-center justify-between gap-2">
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
            <TrashIcon
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
            />
          </div>
        ) : (
          <>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-black" />
            ) : (
              <PlusIcon className="text-black" />
            )}
          </>
        )}
      </button>
    );
  };

  return (
    <>
      <MainHeader />
      <div className="mt-20 overflow-y-auto">
        <BellTypoGraphy english="Bell Shop" farsi="بل شاپ" />
        <BannerSlider images={BANNER_IMAGES} activeDotColor="#000000" inactiveDotColor="#48FDBC" />

        <div className="flex flex-row justify-center gap-5 mt-8">
          {parentCategories.map((category) => (
            <div
              key={category._id}
              className={`flex flex-col gap-5 items-center justify-between w-[80px] cursor-pointer px-3 p-2 pt-3 border-[3px] rounded-t-[50px] rounded-b-[20px] transition-all ${
                category._id === selectedParentCategory?._id
                  ? "bg-primary-400 border-black"
                  : "border-transparent bg-white"
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              <div className="flex flex-col items-center justify-between gap-y-3 py-1">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${category.id_store.location}`}
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

        <div className="mt-16 mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-4 justify-items-center">
          {products.length > 0 ? (
            products.map((product) => (
              <div className="flex flex-col gap-3 w-[160px]" key={product._id}>
                <Image
                  className="rounded-xl w-40 h-40 object-cover"
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${product.id_stores[0].location}`}
                  width={150}
                  height={150}
                  alt={product.title}
                />
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-bold">{product.title}</span>
                  <span className="text-xs line-clamp-1">{product.description}</span>
                  <div className="text-left flex flex-col gap-1">
                    <span className="text-xs">تومان</span>
                    <span className="text-sm font-bold">
                      {product.price.toLocaleString("fa-IR")}
                    </span>
                  </div>
                </div>

                <div className="absolute">
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
