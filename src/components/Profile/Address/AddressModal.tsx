import { Address, Province } from "@/app/profile/address/types";
import Button from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
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
    if (name === "province") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        city: "", // Reset city when province changes
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const cities = formData.province
    ? provinces.find((p) => p["province-fa"] === formData.province)?.cities || []
    : [];

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 transition-opacity duration-300 ease-in-out ${
        address ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="fixed bottom-0 left-0 right-0 h-[86vh] bg-white p-6 w-full overflow-y-auto max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {address ? "ویرایش موقعیت" : "افزودن موقعیت جدید"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-between h-full">
            <div className="mb-4">
              <Input
                variant="dropdown"
                label="استان"
                name="province"
                value={formData.province}
                onChange={handleChange}
                options={provinces.map((province) => province["province-fa"])}
                required
              />
            </div>
            <div className="mb-4">
              <Input
                variant="dropdown"
                label="شهر"
                name="city"
                value={formData.city}
                onChange={handleChange}
                options={cities.map((city) => city["city-fa"])}
                required
              />
            </div>
            <div className="mb-4">
              <Input
                type="text"
                label="آدرس دقیق"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <Input
                type="text"
                label="پلاک"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <Input
                type="text"
                label="عنوان موقعیت"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="w-full flex justify-center">
              <Button className="w-full" onXsIsText type="submit">
                ثبت موقعیت
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
