import React, { useState, useEffect } from "react";
import Image from "next/image";

export interface ItemExprience {
  image: string;
  name: string;
  role: string;
  desc: string;
}

interface MainSliderProps {
  exprienceData: ItemExprience[];
}

const MainSlider: React.FC<MainSliderProps> = ({ exprienceData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleTransitionEnd = () => {
    setIsAnimating(false);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === exprienceData.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? exprienceData.length - 1 : prev - 1));
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
    <div className="w-full max-w-md mx-auto px-4">
      <div className="relative">
        {/* Navigation Arrows */}
        <button onClick={handlePrev} className="absolute left-0 top-24 -translate-y-1/2 z-10 p-2">
          <Image
            width={1080}
            height={150}
            className="w-full"
            src={"/images/main/left.svg"}
            alt="left"
          />
        </button>

        <button onClick={handleNext} className="absolute right-0 top-24 -translate-y-1/2 z-10 p-2">
          <Image
            width={1080}
            height={150}
            className="w-full"
            src={"/images/main/right.svg"}
            alt="right"
          />
        </button>

        <div
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`transition-all duration-500 ease-in-out`}
            onTransitionEnd={handleTransitionEnd}
          >
            {/* Image Container */}
            <div className="aspect-square w-48 h-48 mx-auto rounded-full border-[14px] border-emerald-400 overflow-hidden transition-transform duration-500">
              <Image
                src={exprienceData[currentSlide].image}
                alt={exprienceData[currentSlide].name}
                width={1080}
                height={1080}
                className={`w-full h-full object-cover transform transition-transform duration-500 ${
                  isAnimating ? "scale-110" : "scale-100"
                }`}
                priority
                quality={100}
              />
            </div>

            {/* Content */}
            <div
              className={`mt-6 text-center transition-opacity duration-500 ${
                isAnimating ? "opacity-50" : "opacity-100"
              }`}
            >
              <h2 className="text-xl font-semibold">{exprienceData[currentSlide].name}</h2>
              <p className="text-gray-600 mt-5">{exprienceData[currentSlide].role}</p>
              <p className="text-sm text-gray-700 max-w-md mx-auto leading-relaxed mt-8">
                {exprienceData[currentSlide].desc}
              </p>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {exprienceData.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentSlide(index);
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-4 bg-black" : "w-2 bg-primary-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainSlider;
