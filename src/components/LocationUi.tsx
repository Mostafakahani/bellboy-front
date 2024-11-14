import React from "react";

export default function LocationUi() {
  return (
    <div className="w-full flex flex-col justify-center items-center bg-primary-200 px-4 gap-5 py-16">
      <h3 className="text-xl font-bold">محدوده ارایه خدمات</h3>
      <p className="text-center text-sm px-6">
        در حال حاضر بخش جنوبی کردان شامل مناطق الهیه، طاووسیه، شهرک سهیلیه، سنقرآباد، لشکرآباد،
        زعفرانیه ارائه خدمات صورت می‌گیرد.
      </p>
      <img
        className="h-auto max-w-xs"
        src="/images/main/map.png"
        alt="map location bell boy"
        onClick={() => window.alert("map")}
      />
    </div>
  );
}
