import React, { ChangeEvent } from "react";
import { TaxSettingData } from "../SettingList";
import { DashboardInput } from "@/components/Dashboard/DashboardInput";

interface TaxFormProps {
  data: TaxSettingData;
  onChange: (data: TaxSettingData) => void;
}

export function TaxForm({ data, onChange }: TaxFormProps) {
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    let value = Number(e.target.value);

    // Restrict the value to a range between 0 and 100
    if (value < 0) value = 0;
    if (value > 100) value = 100;

    onChange({ value });
  };

  return (
    <div className="space-y-4">
      <div>
        <DashboardInput
          type="text"
          inputMode="numeric"
          label="درصد مالیات (%)"
          value={data.value.toString()}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
