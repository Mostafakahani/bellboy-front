// components/AddressModal.tsx
import { Address, Province } from "@/app/profile/address/types";
import React, { useState, useEffect } from "react";

interface AddressModalProps {
  address: Address | null;
  provinces: Province[];
  onSave: (address: Address) => void;
  onClose: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ address, provinces, onSave, onClose }) => {
  const [formData, setFormData] = useState<Address>({
    title: "",
    province: "",
    city: "",
    street: "",
    postalCode: "",
  });

  useEffect(() => {
    if (address) {
      setFormData(address);
    }
  }, [address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const cities = formData.province
    ? provinces.find((p) => p["province-fa"] === formData.province)?.cities || []
    : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {address ? "ویرایش آدرس" : "افزودن آدرس جدید"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-1">
              عنوان
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="province" className="block mb-1">
              استان
            </label>
            <select
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">انتخاب کنید</option>
              {provinces.map((province) => (
                <option key={province["province-en"]} value={province["province-fa"]}>
                  {province["province-fa"]}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="city" className="block mb-1">
              شهر
            </label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">انتخاب کنید</option>
              {cities.map((city) => (
                <option key={city["city-en"]} value={city["city-fa"]}>
                  {city["city-fa"]}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="street" className="block mb-1">
              آدرس دقیق
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="postalCode" className="block mb-1">
              کد پستی
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 border rounded">
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
