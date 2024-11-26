"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PlusIcon, MinusIcon, Loader2Icon, TrashIcon } from "lucide-react";
import { CartItem, ProductType } from "@/hooks/cartType";
// import { useRouter } from "next/navigation";
import ProductDetails from "./ProductDetails";

interface ProductGridProps {
  products: ProductType[];
  cart: CartItem[];
  loadingItems: Record<string, boolean>;
  handleCartOperations: {
    updateQuantity: (cartItemId: string, newQuantity: number, oldQuantity: number) => void;
    remove: (cartItemId: string) => Promise<void>;
  };
  addToCart: (productId: string) => void;
  setIsParentModalOpen: (isOpen: boolean) => void;
  isLoading?: boolean;
  selectedCategory?: {
    type: string;
  };
}

interface ProductCardProps {
  product: ProductType;
  cart: CartItem[];
  loadingItems: Record<string, boolean>;
  handleCartOperations: ProductGridProps["handleCartOperations"];
  addToCart: (productId: string) => void;
  setIsParentModalOpen: (isOpen: boolean) => void;
  // setOpenDetailsModal?: (isOpen: boolean) => void;
}

const ProductControls: React.FC<ProductCardProps> = ({
  product,
  cart,
  loadingItems,
  handleCartOperations,
  addToCart,
  setIsParentModalOpen,
}) => {
  const cartItem = Array.isArray(cart)
    ? cart.find((item) => item?.productId?._id === product._id && !item.IsTastePyramids)
    : null;
  const isInCart = Boolean(cartItem);
  const isLoading = loadingItems[product._id] || (cartItem?._id && loadingItems[cartItem._id]);

  const handleQuantityUpdate = async (e: React.MouseEvent, newQuantity: number) => {
    e.stopPropagation();
    e.preventDefault();
    if (cartItem && !loadingItems[cartItem._id]) {
      if (newQuantity === 0) {
        await handleCartOperations.remove(cartItem._id);
      } else {
        await handleCartOperations.updateQuantity(cartItem._id, newQuantity, cartItem.quantity);
      }
    }
  };

  return (
    <div className="absolute -top-10 left-4 z-10">
      <button
        className={`flex items-center justify-center border-[2px] border-black w-[40px] h-[40px] text-white px-1 py-1 rounded-full transition-all duration-300 shadow-md hover:shadow-none focus-visible:outline-none ${
          isInCart ? "bg-primary-400 !w-[90px]" : "bg-white hover:scale-105"
        }`}
        onClick={(e) => {
          e.preventDefault();
          if (!Array.isArray(cart)) return;
          if (cartItem) {
            handleQuantityUpdate(e, cartItem.quantity - 1);
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
              onClick={(e) => handleQuantityUpdate(e, (cartItem?.quantity || 0) + 1)}
            />
            <span className="font-bold text-lg text-nowrap w-6 line-clamp-1 flex justify-center items-center">
              {isLoading ? (
                <Loader2Icon className="w-5 h-5 animate-spin" />
              ) : (
                cartItem?.quantity || 0
              )}
            </span>
            {cartItem?.quantity === 1 ? (
              <TrashIcon
                className={`${isLoading ? "opacity-50" : ""} size-4 cursor-pointer`}
                onClick={(e) => handleQuantityUpdate(e, 0)}
                color="black"
              />
            ) : (
              <MinusIcon
                className={`${isLoading ? "opacity-50" : ""} size-4 cursor-pointer`}
                onClick={(e) => handleQuantityUpdate(e, (cartItem?.quantity || 0) - 1)}
                color="black"
              />
            )}
          </div>
        ) : (
          <>
            {isLoading ? (
              <Loader2Icon className="w-5 h-5 animate-spin text-black" />
            ) : (
              <PlusIcon className="text-black size-5" />
            )}
          </>
        )}
      </button>
    </div>
  );
};
const ProductCard: React.FC<
  ProductCardProps & { handleSelectDetails: (value: string) => void }
> = ({
  product,
  cart,
  loadingItems,
  handleCartOperations,
  addToCart,
  setIsParentModalOpen,
  // setOpenDetailsModal,
  handleSelectDetails,
}) => {
  // const router = useRouter();

  return (
    <div className="group relative border-s border-b last:border-b-0 flex flex-col h-full bg-white overflow-hidden transition-all duration-500 hover:shadow-2xl hover:z-30">
      <div className="relative flex justify-center items-center mt-4">
        <div className="relative  w-36 h-36 pt-[100%]">
          {/* Aspect ratio 1:1 */}
          <Image
            className="absolute inset-0 object-cover transition-transform duration-300 group-hover:scale-105"
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${product.id_stores[0]?.location}`}
            // layout="fill"
            width={250}
            height={250}
            alt={product.title}
            onClick={() => handleSelectDetails(product._id)}
          />
        </div>
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
      </div>

      <div className="relative flex-1 p-2 flex flex-col">
        <ProductControls
          product={product}
          cart={cart}
          loadingItems={loadingItems}
          handleCartOperations={handleCartOperations}
          addToCart={addToCart}
          setIsParentModalOpen={setIsParentModalOpen}
        />

        <div
          className="flex flex-col gap-4 cursor-pointer"
          onClick={() => handleSelectDetails(product._id)}
          // onClick={() => router.push("/bell-shop/" + product._id)}
        >
          <h3 className="text-sm font-bold text-gray-800 transition-colors">{product.title}</h3>
          {/* <p className="text-[10px] text-gray-600 line-clamp-2">{product.description}</p> */}

          {product.stock <= 2 && product.stock > 0 && (
            <span className="inline-flex items-center gap-1 text-red-500 text-xs">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {product.stock} موجودی باقیمانده
            </span>
          )}

          <PriceDisplay price={product.price} globalDiscount={product.globalDiscount} />
        </div>
      </div>
    </div>
  );
};
const PriceDisplay = ({ price, globalDiscount }: any) => {
  const discountedPrice = Math.round(price * (1 - globalDiscount / 100));

  return (
    <div className="flex flex-col gap-1">
      {globalDiscount > 0 ? (
        <>
          <div className="flex items-center gap-2">
            <span className="font-bold">{discountedPrice.toLocaleString("fa-IR")}</span>
            <span className="text-xs font-light">تومان</span>
          </div>
          <div className="text-gray-400 text-sm">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold mr-2">
              {globalDiscount}%
            </span>
            <span className="line-through ">{price.toLocaleString("fa-IR")}</span>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <span className="font-bold">{price.toLocaleString("fa-IR")}</span>
          <span>تومان</span>
        </div>
      )}
    </div>
  );
};
const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  cart,
  loadingItems,
  handleCartOperations,
  addToCart,
  setIsParentModalOpen,
  isLoading,
  selectedCategory,
}) => {
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<string | null>(null);

  const handleSelectDetails = (details: string) => {
    if (selectedDetails === details) {
      // Reset and set again to trigger state update
      setSelectedDetails(null);
      setTimeout(() => setSelectedDetails(details), 0); // Delay to ensure state change
    } else {
      setSelectedDetails(details);
    }
  };

  useEffect(() => {
    if (selectedDetails) {
      setOpenDetailsModal(true);
      console.log("Opening modal due to selected details:", selectedDetails);
    } else {
      setOpenDetailsModal(false);
      console.log("Closing modal because no details are selected.");
    }
  }, [selectedDetails]);
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="w-full pt-[100%] relative bg-gray-200 animate-pulse" />
            <div className="p-4 flex flex-col gap-3">
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="mt-2 pt-3 border-t border-gray-100">
                <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="mb-4">🏪</div>
          محصولی برای این دسته‌بندی وجود ندارد
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 p-3">
      {(!selectedCategory || selectedCategory.type === "list") &&
        products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            cart={cart}
            loadingItems={loadingItems}
            handleCartOperations={handleCartOperations}
            addToCart={addToCart}
            setIsParentModalOpen={setIsParentModalOpen}
            // setOpenDetailsModal={setOpenDetailsModal}
            handleSelectDetails={handleSelectDetails}
          />
        ))}
      <ProductDetails
        open={openDetailsModal}
        setOpen={setOpenDetailsModal}
        id={selectedDetails || ""}
      />
    </div>
  );
};

export default ProductGrid;
