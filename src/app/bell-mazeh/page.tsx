"use client";

import MainHeader from "@/components/mobile/Header/MainHeader";
import Image from "next/image";
import { useState, useEffect } from "react";
import { demoProducts } from "./demoData";
import MultiStepModal from "@/components/Stepper/MultiStepModalHeram/MultiStepModalHeram";
import Layout from "@/components/mobile/Drawers/Layout";

const categorys = [
  { id: 1, name: "هرم مزه", icon: "/images/icons/heramMazeh.svg", type: "drawer" },
  { id: 2, name: "سینی مزه", icon: "/images/icons/siniMazeh.svg", type: "list" },
];

const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    localStorage.setItem("cart", JSON.stringify(cart));

    console.log("سبد خرید به‌روز شد:", cart);
  }, [cart]);

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
                className={`flex flex-col gap-5 items-center justify-between h-16 cursor-pointer p-3 rounded-lg ${
                  selectedCategory?.id === category.id && "bg-primary-400"
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
                <Image
                  src={category.icon}
                  width={24}
                  height={24}
                  className="w-10 h-10"
                  alt={category.name}
                />
                <span className="text-sm font-bold">{category.name}</span>
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

                    {/* دکمه اضافه کردن به سبد خرید */}
                    <button
                      className="bg-green-500 text-white p-2 rounded-lg"
                      onClick={() => addToCart(product)}
                    >
                      اضافه به سبد خرید
                    </button>

                    {/* دکمه حذف از سبد خرید */}
                    <button
                      className="bg-red-500 text-white p-2 rounded-lg"
                      onClick={() => removeFromCart(product.id)}
                    >
                      حذف از سبد خرید
                    </button>
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
