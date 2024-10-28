"use client";

import MainHeader from "@/components/mobile/Header/MainHeader";
import Image from "next/image";
import { useState, useEffect } from "react";
import { demoProducts } from "./demoData";
import MultiStepModal from "@/components/Stepper/MultiStepModalHeram/MultiStepModalHeram";
import Layout from "@/components/mobile/Drawers/Layout";
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
  const [quantityInCart, setQuantityInCart] = useState(0);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setQuantityInCart(existingProduct.quantity);
    } else {
      setQuantityInCart(1);
    }
  };

  const handleIncreaseQuantity = (productId: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    setQuantityInCart((prevQuantity) => prevQuantity + 1);
  };

  const handleDecreaseQuantity = (productId: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
    setQuantityInCart((prevQuantity) => prevQuantity - 1);
  };

  const handleRemoveFromCart = (productId: number) => {
    removeFromCart(productId);
    setQuantityInCart(0);
  };

  const addToCart = (product: any) => {
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
        <h1 className="text-2xl font-bold mb-4">صفحه اصلی</h1>

        {/* دسته‌بندی‌ها */}
        <div className="flex flex-col mt-16">
          <div className="flex flex-row justify-center gap-5">
            {categorys.map((category) => (
              <div
                style={{
                  borderTopRightRadius: "100%",
                  borderTopLeftRadius: "100%",
                  borderBottomLeftRadius: "24px",
                  borderBottomRightRadius: "24px",
                }}
                className={`flex flex-col gap-5 items-center justify-between  w-[80px] cursor-pointer px-3 py-2.5 border-[3px] border-black transition-all ${
                  category.id === selectedCategory?.id ? "bg-primary-200" : " bg-white"
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
                      className="rounded-lg"
                      src={product.imageUrls[0]}
                      width={150}
                      height={150}
                      alt={product.name}
                    />
                    <span className="text-sm">{product.name}</span>
                    <span className="text-sm">{product.description}</span>
                    <span className="text-sm">{product.price}</span>
                    <div className="absolute">
                      <div className="relative left-28 top-16 flex items-center gap-2">
                        <button
                          className={`relative right-48 flex items-center text-white px-3 py-1 rounded-full transition-all duration-[1000ms] ${
                            cart.find((cartItem) => cartItem.id === product.id)
                              ? "bg-green-500 w-auto"
                              : "bg-gray-400 w-[30px] h-[30px]"
                          }`}
                          onClick={() => {
                            if (cart.find((cartItem) => cartItem.id === product.id)) {
                              handleRemoveFromCart(product.id); // حذف از سبد
                            } else {
                              addToCart(product); // اضافه کردن به سبد
                            }
                          }}
                        >
                          {cart.find((cartItem) => cartItem.id === product.id) ? (
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
                            "+"
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
