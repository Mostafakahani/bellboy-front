import React from "react";

export const StepOne: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div>
    <h2 className="text-xl font-bold mb-4">اطلاعات شخصی</h2>
    {/* اضافه کردن فیلدهای فرم مربوط به اطلاعات شخصی */}
    <button onClick={onNext} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
      مرحله بعد
    </button>
  </div>
);
