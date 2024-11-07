"use client";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { DashboardInput } from "@/components/Dashboard/DashboardInput";
import { DatePickerDemo } from "@/components/DatePicker";
import DashboardButton from "@/components/ui/Button/DashboardButton";
import { Switch } from "@/components/ui/Input/Switch";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError, showSuccess } from "@/lib/toastService";
import React, { useEffect, useState } from "react";

interface DiscountFormData {
  code: string;
  expiryDate: string;
  usageLimit: number;
  discountPercentage: number;
  isActive: boolean;
}

interface DiscountItem extends DiscountFormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

const DiscountsPage = () => {
  const authenticatedFetch = useAuthenticatedFetch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DiscountFormData>({
    code: "",
    expiryDate: "",
    usageLimit: 0,
    discountPercentage: 0,
    isActive: true,
  });
  const [discountList, setDiscountList] = useState<DiscountItem[]>([]);

  const handleFormChange = (field: keyof DiscountFormData, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { error, message } = await authenticatedFetch("/discount", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (error) {
        setLoading(false);
        throw new Error(message);
      }

      showSuccess("تخفیف با موفقیت ذخیره شد");
      fetchDiscountList();
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const { error, message, status } = await authenticatedFetch(`/discount/change-status/${id}`, {
        method: "GET",
      });

      if (error) {
        setLoading(false);
        throw new Error(message);
      }
      if (status === "success") {
        showSuccess(message);
        fetchDiscountList();
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscountList = async () => {
    try {
      setLoading(true);
      const { data, error } = await authenticatedFetch("/discount", { method: "GET" });

      if (error) throw new Error("خطا در دریافت لیست تخفیف‌ها");
      setDiscountList(Array.isArray(data) ? data : []);
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };
  const handleDateChange = (value: string | null) => {
    handleFormChange("expiryDate", value || "");
  };
  useEffect(() => {
    fetchDiscountList();
  }, []);

  return (
    <>
      <DashboardHeader />
      <div className="bg-white p-6 max-w-lg mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-4">ایجاد تخفیف جدید</h2>
        <form className="flex flex-col gap-2">
          <DashboardInput
            label="کد تخفیف"
            value={formData.code}
            onChange={(e) => handleFormChange("code", e.target.value)}
          />

          <DatePickerDemo
            label="تاریخ"
            value={formData.expiryDate}
            onChange={handleDateChange}
            readOnly={false}
          />
          <DashboardInput
            label="محدودیت استفاده"
            type="text"
            value={formData.usageLimit}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                // بررسی اینکه مقدار فقط شامل اعداد باشد
                handleFormChange("usageLimit", Number(value));
              }
            }}
          />
          <DashboardInput
            label="درصد تخفیف"
            type="text"
            value={formData.discountPercentage}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                // بررسی اینکه مقدار فقط شامل اعداد باشد
                handleFormChange("discountPercentage", Number(value));
              }
            }}
          />

          <div className="flex justify-between items-start">
            <label className="mr-2">وضعیت</label>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(e) => handleFormChange("isActive", e)}
            />
          </div>
          <div className="w-full flex flex-row justify-end mt-16">
            <DashboardButton onXsIsText type="button" onClick={handleSubmit}>
              ذخیره
            </DashboardButton>
          </div>
        </form>

        <h2 className="text-2xl font-bold mt-8 mb-4">لیست تخفیف‌ها</h2>
        {loading ? (
          <h4>در حال بارگذاری...</h4>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border text-center text-xs text-nowrap">کد تخفیف</th>
                <th className="p-2 border text-center text-xs text-nowrap">تاریخ انقضا</th>
                <th className="p-2 border text-center text-xs text-nowrap">درصد تخفیف</th>
                <th className="p-2 border text-center text-xs text-nowrap">فعال</th>
                <th className="p-2 border text-center text-xs text-nowrap">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {discountList.map((item) => (
                <tr key={item._id}>
                  <td className="p-2 border text-center text-sm text-nowrap">{item.code}</td>
                  <td className="p-2 border text-center text-sm text-nowrap">
                    {item.expiryDate.split("T")[0]}
                  </td>
                  <td className="p-2 border text-center text-sm text-nowrap">
                    {item.discountPercentage}%
                  </td>
                  <td className="p-2 border text-center text-sm text-nowrap">
                    {item.isActive ? "بله" : "خیر"}
                  </td>
                  <td className="p-2 border text-center text-sm">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      تغییر وضعیت
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default DiscountsPage;
