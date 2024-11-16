import React from "react";
import { TaxSettingData } from "../SettingList";
import { DashboardInput } from "@/components/Dashboard/DashboardInput";
import { showError } from "@/lib/toastService";

interface ShippingFormProps {
  data: TaxSettingData;
  onChange: (data: TaxSettingData) => void;
}

export function ShippingForm({ data, onChange }: ShippingFormProps) {
  const formatNumber = (num: string) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const unformatNumber = (num: string) => {
    return num.replace(/,/g, "");
  };

  return (
    <div className="space-y-4">
      <div>
        <DashboardInput
          label="تعرفه حمل نقل (تومان)"
          type="text"
          placeholder="250,000"
          value={data.value ? formatNumber(data.value.toString()) : ""}
          onChange={(e) => {
            const inputValue = unformatNumber(e.target.value);

            const isValid = /^\d*$/.test(inputValue);

            if (!isValid) {
              showError("لطفاً فقط از اعداد استفاده کنید.");
              return;
            }

            onChange({ value: inputValue ? Number(inputValue) : 0 });
          }}
        />
      </div>
    </div>
  );
}
