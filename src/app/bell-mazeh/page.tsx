"use client";

import MainHeader from "@/components/mobile/Header/MainHeader";
import Image from "next/image";
import { useState, useEffect } from "react";
import { demoProducts } from "./demoData";
import MultiStepModal from "@/components/Stepper/MultiStepModalHeram/MultiStepModalHeram";
import Layout from "@/components/mobile/Drawers/Layout";
import BellTypoGraphy from "@/components/BellTypoGraphy";
import { Loader2, PlusIcon } from "lucide-react";
import { TrashIcon } from "@/icons/Icons";
import Button from "@/components/ui/Button/Button";

const categorys = [
  { id: 1, name: "هرم مزه", icon: "/images/icons/heramMazeh.svg", type: "drawer" },
  { id: 2, name: "سینی مزه", icon: "/images/icons/siniMazeh.svg", type: "list" },
];

const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRemoveFromCart = (productId: number) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    removeFromCart(productId);
  };

  const addToCart = (product: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };
  useEffect(() => {
    const defaultCategory = categorys.find((category) => category.type === "list");
    if (defaultCategory) {
      setSelectedCategory(defaultCategory);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));

    console.log("سبد خرید به‌روز شد:", cart);
  }, [cart]);

  return (
    <>
      <MainHeader />
      <Layout>
        <div className="flex flex-col mt-16">
          <BellTypoGraphy farsi="بِل مزه" english="Bell Mazeh" className="!rotate-[3deg]" />
          <div className="flex flex-row justify-center gap-5 mt-8">
            {categorys.map((category) => (
              <div
                style={{
                  borderTopRightRadius: "50px",
                  borderTopLeftRadius: "50px",
                  borderBottomLeftRadius: "20px",
                  borderBottomRightRadius: "20px",
                }}
                className={`flex flex-col gap-5 items-center justify-between  w-[80px] cursor-pointer px-3 p-2 pt-3 border-[3px] transition-all ${
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
                    console.log(category.id == selectedCategory?.id);
                  }
                }}
                key={category.id}
              >
                <div className="flex flex-col items-center justify-between gap-y-3 py-1">
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
          <div className="mt-16 mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-4 justify-items-center	">
            {selectedCategory && selectedCategory.type === "list"
              ? demoProducts.map((product) => (
                  <div className="flex flex-col gap-3 w-[160px]" key={product.id}>
                    <Image
                      className="rounded-xl w-40 h-40 object-cover"
                      src={product.imageUrls[0]}
                      width={150}
                      height={150}
                      alt={product.name}
                    />
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-bold">{product.name}</span>
                      <span className="text-xs line-clamp-1 w-full">{product.description}</span>
                      <div className="text-left flex flex-col gap-1">
                        <span className="text-xs">تومان</span>
                        <span className="text-sm font-bold">
                          {product.price.toLocaleString("fa-IR")}
                        </span>
                      </div>
                    </div>
                    <div className="absolute">
                      <div className="relative left-0 top-24 flex items-center gap-2">
                        <button
                          className={`relative right-[6rem] flex items-center justify-center border-[3px] border-black w-[50px] h-[50px] text-white px-1 py-1 rounded-full transition-all duration-[500ms] ${
                            cart.find((cartItem) => cartItem.id === product.id)
                              ? "bg-primary-400 !w-[110px] !right-[2.2rem]"
                              : "bg-white"
                          }`}
                          onClick={() => {
                            if (cart.find((cartItem) => cartItem.id === product.id)) {
                              // حذف از سبد
                            } else {
                              addToCart(product); // اضافه کردن به سبد
                            }
                          }}
                        >
                          {cart.find((cartItem) => cartItem.id === product.id) ? (
                            <div className="text-black flex flex-row items-center justify-between gap-2">
                              <PlusIcon onClick={() => addToCart(product)} className="" />
                              <span className="font-bold text-lg text-nowrap w-6 line-clamp-1">
                                {loading ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  cart.find((cartItem) => cartItem.id === product.id)?.quantity || 0
                                )}
                              </span>
                              <TrashIcon
                                onClick={() => handleRemoveFromCart(product.id)}
                                color="black"
                              />
                            </div>
                          ) : (
                            <div className="">
                              <PlusIcon className={"text-black"} />
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>

          {/* نمایش سبد خرید */}
          {selectedCategory && selectedCategory.type === "list" && cart.length !== 0 && (
            <div className="mt-16 mb-8 w-full flex flex-col gap-y-3 px-3">
              <div className="w-full flex flex-row justify-between">
                <p>مبلغ {cart.length} کالا</p>
                <p>
                  <span className="font-bold ml-1">
                    {cart.reduce((total, item) => total + item.price, 0).toLocaleString("fa-IR")}
                  </span>
                  تومان
                </p>
              </div>

              <div className="w-full">
                <Button className="w-full" variant="primary" onXsIsText>
                  تکمیل سفارش
                </Button>
              </div>
            </div>
          )}
          {selectedCategory && selectedCategory.type === "drawer" && (
            <MultiStepModal
              products={demoProducts}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      </Layout>
    </>
  );
};

export default HomePage;
