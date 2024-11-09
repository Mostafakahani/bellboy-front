"use client";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { DashboardInput } from "@/components/Dashboard/DashboardInput";
import { Dropdown } from "@/components/Dashboard/Dropdown";
import { DatePickerDemo } from "@/components/DatePicker";
import DashboardButton from "@/components/ui/Button/DashboardButton";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError, showSuccess } from "@/lib/toastService";
import React, { useEffect, useState } from "react";

interface FormData {
  date: string;
  startHour: string;
  endHour: string;
  type: string;
}

interface DeliveryItem extends FormData {
  _id: string;
}

const DEFAULT_FORM_STATE: FormData = {
  date: "",
  startHour: "00:00",
  endHour: "01:00",
  type: "",
};

const DeliveryTimeForm = () => {
  const authenticatedFetch = useAuthenticatedFetch();

  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("");
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_STATE);

  const [deliveryList, setDeliveryList] = useState<DeliveryItem[]>([]);

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (value: string | null) => {
    handleFormChange("date", value || "");
  };

  const resetForm = () => {
    setFormData(DEFAULT_FORM_STATE);
  };

  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      console.log({ message });
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const { data, error, message, status } = await authenticatedFetch("/delivery-time", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (error) {
        setLoading(false);
        throw new Error(formatErrorMessage(message));
      }

      if (status === "success") {
        showSuccess(message);
        setLoading(false);
        fetchListDeliveryTime();
        resetForm(); // Reset form after successful submission
      }

      console.log(data);
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);

      const { data, error, message, status } = await authenticatedFetch("/delivery-time/" + id, {
        method: "DELETE",
      });

      if (error) {
        setLoading(false);
        throw new Error(formatErrorMessage(message));
      }

      if (status === "success") {
        showSuccess(message);
        setLoading(false);
        fetchListDeliveryTime();
      }

      console.log(data);
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const fetchListDeliveryTime = async () => {
    if (!type) return;
    try {
      setLoading(true);

      const { data, error, message } = await authenticatedFetch("/delivery-time/" + type, {
        method: "GET",
      });

      if (error) {
        setLoading(false);
        throw new Error(formatErrorMessage(message));
      }

      setDeliveryList(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const options = [
    { _id: "shop", name: "shop" },
    { _id: "service", name: "service" },
    { _id: "clean", name: "clean" },
  ].map((category: any) => ({
    value: category._id,
    label: category.name,
  }));

  useEffect(() => {
    fetchListDeliveryTime();
  }, [type]);

  return (
    <>
      <DashboardHeader />
      <div className="bg-white p-6 max-w-lg mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-4">بازه زمانی</h2>
        <form className="space-y-4">
          <div>
            <DatePickerDemo
              label="تاریخ"
              value={formData.date}
              onChange={handleDateChange}
              readOnly={false}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <DashboardInput
                label="زمان شروع"
                type="time"
                id="startHour"
                value={formData.startHour}
                onChange={(e) => handleFormChange("startHour", e.target.value)}
                className="[&::-webkit-calendar-picker-indicator]:bg-none"
                step="60"
              />
            </div>
            <div>
              <DashboardInput
                label="زمان پایان"
                type="time"
                id="endHour"
                value={formData.endHour}
                onChange={(e) => handleFormChange("endHour", e.target.value)}
                className="[&::-webkit-calendar-picker-indicator]:bg-none"
                step="60"
              />
            </div>
          </div>
          <div>
            <Dropdown
              label="سرویس"
              options={options}
              value={formData.type}
              onChange={(e: any) => {
                handleFormChange("type", e);
                setType(e);
              }}
            />
          </div>
          <div className="w-full flex flex-row justify-end">
            <DashboardButton type="button" onXsIsText onClick={handleSubmit}>
              ذخیره
            </DashboardButton>
          </div>
        </form>

        <h2 className="text-2xl font-bold mt-8 mb-4">لیست بازه زمان ها</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border text-center text-xs text-nowrap">تاریخ</th>
              <th className="p-2 border text-center text-xs text-nowrap">زمان شروع</th>
              <th className="p-2 border text-center text-xs text-nowrap">زمان پایان</th>
              <th className="p-2 border text-center text-xs text-nowrap">سرویس</th>
              <th className="p-2 border text-center text-xs text-nowrap"></th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={5} className="text-center p-4">
                  <h4>در حال بارگزاری</h4>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {deliveryList.map((item) => (
                <tr key={item._id}>
                  <td className="p-2 border text-center text-sm text-nowrap">{item.date}</td>
                  <td className="p-2 border text-center text-sm text-nowrap">{item.startHour}</td>
                  <td className="p-2 border text-center text-sm text-nowrap">{item.endHour}</td>
                  <td className="p-2 border text-center text-sm text-nowrap">{item.type}</td>
                  <td className="p-2 border text-center text-sm text-nowrap">
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:text-red-600 text-center"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </>
  );
};

export default DeliveryTimeForm;
