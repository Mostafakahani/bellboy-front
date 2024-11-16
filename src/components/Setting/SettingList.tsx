// components/Setting/SettingList.tsx
import React from "react";
export interface SettingResponse {
  _id: string;
  type: string;
  data: any;
  images: Array<{
    _id: string;
    url: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface TaxSettingData {
  value: number;
}

export interface HomeSettingData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    imageId?: string;
  };
  features: Array<{
    title: string;
    description: string;
    imageId?: string;
  }>;
}

export interface AboutSettingData {
  content: string;
  team: Array<{
    name: string;
    role: string;
    imageId?: string;
  }>;
}

export interface ShippingSettingData {
  methods: Array<{
    name: string;
    cost: number;
    description: string;
  }>;
}

export interface SettingType {
  id: string;
  title: string;
  description: string;
  defaultData: any;
}

// settingTypes.ts
export const SETTING_TYPES: SettingType[] = [
  {
    id: "tax",
    title: "تنظیمات مالیات",
    description: "تنظیم درصد مالیات",
    defaultData: { value: 0 },
  },
  {
    id: "shipping",
    title: "حمل و نقل",
    description: "تعرفه ارسال محصول",
    defaultData: {
      methods: [],
    },
  },
];

interface SettingListProps {
  types: SettingType[];
  onSelect: (type: string) => void;
}

export function SettingList({ types, onSelect }: SettingListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {types.map((type) => (
        <div
          key={type.id}
          onClick={() => onSelect(type.id)}
          className="p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <h3 className="text-lg font-semibold">{type.title}</h3>
          <p className="text-gray-600 text-sm mt-2">{type.description}</p>
        </div>
      ))}
    </div>
  );
}
