// components/Setting/Setting.tsx
import React, { useState, useEffect } from "react";
import { ApiResponse, useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError, showSuccess } from "@/lib/toastService";
import { SETTING_TYPES, SettingList, SettingResponse } from "./SettingList";
import { TaxForm } from "./SettingForms/TaxForm";
import { Modal } from "../BellMazeh/Modal";
import { ShippingForm } from "./SettingForms/ShippingForm";
import DashboardButton from "../ui/Button/DashboardButton";

interface SettingProps {
  type?: string;
}

export default function Setting({ type: initialType }: SettingProps) {
  const authenticatedFetch = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(initialType || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settingData, setSettingData] = useState<SettingResponse | null>(null);

  const loadSettingData = async (type: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/setting/${type}`, {
        method: "GET",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(Array.isArray(data.message) ? data.message.join(" ") : data.message);
      }
      console.log(data);
      if (data) {
        setSettingData(data);
      } else {
        // اگر داده‌ای وجود نداشت، از داده‌های پیش‌فرض استفاده می‌کنیم
        const defaultType = SETTING_TYPES.find((t) => t.id === type);
        console.log({ defaultType });
        if (defaultType) {
          setSettingData({
            _id: "",
            type,
            data: defaultType.defaultData,
            images: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
      setIsModalOpen(true);
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedType || !settingData) return;

    setIsLoading(true);
    try {
      const { error, message } = await authenticatedFetch<ApiResponse>(`/setting`, {
        method: "POST",
        body: JSON.stringify({
          data: settingData.data,
          type: settingData.type,
          images: settingData.images,
        }),
      });

      if (error) {
        throw new Error(Array.isArray(message) ? message.join(" ") : message);
      }

      showSuccess("تنظیمات با موفقیت ذخیره شد");
      setIsModalOpen(false);
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در ذخیره تنظیمات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    loadSettingData(type);
  };

  const handleFormChange = (newData: any) => {
    if (settingData) {
      setSettingData({
        ...settingData,
        data: newData,
      });
    }
  };
  const renderForm = () => {
    if (!selectedType || !settingData) return null;
    console.log({ settingData });
    switch (selectedType) {
      case "tax":
        return <TaxForm data={settingData.data} onChange={handleFormChange} />;
      case "shipping":
        return <ShippingForm data={settingData.data} onChange={handleFormChange} />;
      // Add other form components for different types
      default:
        return <div>فرم مورد نظر یافت نشد</div>;
    }
  };

  useEffect(() => {
    if (initialType) {
      handleTypeSelect(initialType);
    }
  }, [initialType]);

  return (
    <div className="container mx-auto px-4">
      <SettingList types={SETTING_TYPES} onSelect={handleTypeSelect} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={SETTING_TYPES.find((t) => t.id === selectedType)?.title || "تنظیمات"}
      >
        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : (
            <>
              {renderForm()}
              <div className="mt-6 flex justify-end space-x-2 space-x-reverse">
                <DashboardButton
                  onXsIsText
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  variant="secondary"
                >
                  انصراف
                </DashboardButton>
                <DashboardButton onXsIsText onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </DashboardButton>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
