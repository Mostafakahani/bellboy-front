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
type CategoryType = "drawer" | "list";

interface Category {
  id: number;
  name: string;
  icon: string;
  type: CategoryType;
}
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
  const handleCategoryClick = (category: any) => {
    if (category.type === "drawer") {
      setIsModalOpen(true);
      setSelectedCategory(category);
    } else {
      setSelectedCategory(category);
    }
  };
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
          <div className="mt-16 flex flex-wrap gap-4 justify-center">
            {selectedCategory && selectedCategory.type === "list"
              ? demoProducts.map((product) => (
                  <div className="flex flex-col gap-3" key={product.id}>
                    <Image
                      className="rounded-xl w-40 h-40 object-cover"
                      src={product.imageUrls[0]}
                      width={150}
                      height={150}
                      alt={product.name}
                    />
                    <span className="text-sm">{product.name}</span>
                    <span className="text-sm">{product.description}</span>
                    <span className="text-sm">{product.price}</span>
                    <div className="absolute">
                      <div className="relative left-0 top-24 flex items-center gap-2">
                        <button
                          className={`relative right-[6rem] flex items-center justify-center border-[3px] border-black w-[50px] h-[50px] text-white px-1 py-1 rounded-full transition-all duration-[500ms] ${
                            cart.find((cartItem) => cartItem.id === product.id)
                              ? "bg-primary-400 w-[110px] !right-[2.2rem]"
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
          {selectedCategory && selectedCategory.type === "list" && (
            <div className="mt-16">
              <h2 className="text-xl font-bold">سبد خرید</h2>
              {cart.length === 0 ? (
                <p>سبد خرید شما خالی است</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex flex-row justify-between">
                    <span>{item.name}</span>
                    <span>{item.quantity}</span>
                  </div>
                ))
              )}
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
{
  /* {cart.find((cartItem) => cartItem.id === product.id) ? (
                            <div className="flex items-center gap-2 justify-end">
                              {(cart.find((cartItem) => cartItem.id === product.id)?.quantity ||
                                0) > 1 ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDecreaseQuantity(product.id);
                                  }}
                                  className="bg-red-500 w-[30px] h-[30px] text-white rounded-full flex items-center justify-center"
                                >
                                  -
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFromCart(product.id);
                                  }}
                                  className="bg-red-500 text-white p-2 rounded-lg"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951A52.662 52.662 0 0112 4c.257 0 .511.001.765.003 1.603.051 2.816 1.387 2.816 2.951zm-6.136-1.452a51.196 51.196 0 013.273-.512 3.753 3.753 0 00-3.386-2.372Zm-2.911-.095a3 3 0 00-2.966 3.48l1.061 14.246a2.25 2.25 0 002.22 2.023h6.533a2.25 2.25 0 002.22-2.023l1.061-14.246a3 3 0 00-2.966-3.48l-.255.015a49.sdfsdf.001A52.662 52.662 0 0112 4c.257 0 .511.001.765.003-2.501-.001-5.201 0-8.066.095Z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              )}
                              <span className="px-2">
                                {cart.find((cartItem) => cartItem.id === product.id)?.quantity || 0}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(product);
                                }}
                                className="bg-green-500 w-[30px] h-[30px] text-white rounded-full flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <div className="text-black">
                              <PlusIcon />
                            </div>
                          )} */
}
