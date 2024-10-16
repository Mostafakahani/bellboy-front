import React from "react";

export const StepTwo: React.FC<{ onNext: () => void; onPrev: () => void }> = ({
  onNext,
  onPrev,
}) => (
  <div>
    <h2 className="text-xl font-bold mb-4">تحصیلات</h2>
    {/* اضافه کردن فیلدهای فرم مربوط به تحصیلات */}
    <div className="mt-4">
      <button onClick={onPrev} className="bg-gray-300 text-black px-4 py-2 rounded mr-2">
        مرحله قبل
      </button>
      <button onClick={onNext} className="bg-blue-500 text-white px-4 py-2 rounded">
        مرحله بعد
      </button>
    </div>
  </div>
);
