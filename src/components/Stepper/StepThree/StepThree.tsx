import React from "react";

export const StepThree: React.FC<{ onPrev: () => void; onSubmit: () => void }> = ({
  onPrev,
  onSubmit,
}) => (
  <div>
    <h2 className="text-xl font-bold mb-4">بررسی نهایی</h2>
    {/* نمایش خلاصه اطلاعات وارد شده */}
    <div className="mt-4">
      <button onClick={onPrev} className="bg-gray-300 text-black px-4 py-2 rounded mr-2">
        مرحله قبل
      </button>
      <button onClick={onSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
        ثبت نهایی
      </button>
    </div>
  </div>
);
