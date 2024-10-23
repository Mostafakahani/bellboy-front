import React, { useState, useEffect } from "react";
import Image from "next/image";

// File imports for slick-carousel CSS are commented out as they're not typically used in React components
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

import { ProductType } from "@/components/BellMazeh/types";

interface ProfileSliderProps {
  product: ProductType;
  dots?: boolean;
  className?: string;
}

const ProfileSlider: React.FC<ProfileSliderProps> = ({ product, dots, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, product.imageUrls.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === product.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? product.imageUrls.length - 1 : prevIndex - 1
    );
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

  return (
    <div className={`w-full max-w-3xl ${className}`}>
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full">
          <Image
            src={product.imageUrls[currentIndex]}
            alt={`${product.name} - تصویر ${currentIndex + 1}`}
            width={1080}
            height={1080}
            className="rounded-xl transition-opacity duration-300 w-40 h-40 object-cover"
            priority
            quality={80}
          />
        </div>
      </div>
      {dots && (
        <div className="mt-4 flex justify-center gap-2">
          {product.imageUrls.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex ? "bg-blue-500 w-4" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileSlider;
