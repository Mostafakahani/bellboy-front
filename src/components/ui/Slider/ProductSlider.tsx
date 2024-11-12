"use client";
import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { ProductType, StoreImage } from "@/hooks/cartType";

interface ProductSliderProps {
  product: ProductType;
  dots?: boolean;
  className?: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ product, dots, className }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % product.id_stores.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + product.id_stores.length) % product.id_stores.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      handleNext();
    }
    if (touchStart - touchEnd < -75) {
      handlePrev();
    }
  };

  const getImageUrl = (image: StoreImage) => {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${image.location}`;
  };

  return (
    <div
      className={`relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 ${className}`}
    >
      <div
        className="relative w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {product.id_stores.map((image, index) => (
          <Transition
            key={index}
            show={currentSlide === index}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <img
              src={getImageUrl(image)}
              alt={`${product.title} - ${index + 1}`}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </Transition>
        ))}

        {/* Dots indicator */}
        {dots && product.id_stores.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {product.id_stores.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSlide === index ? "bg-black" : "bg-primary-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSlider;
