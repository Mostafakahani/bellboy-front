import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Address, Province } from "./types";
import { Input } from "@/components/ui/Input/Input";
import dynamic from "next/dynamic";
import Button from "@/components/ui/Button/Button";
const IranMap = dynamic(() => import("@/components/Map/IranMap"), {
  ssr: false,
});
interface AddressModalProps {
  isOpen: boolean;
  address: Address | null;
  provinces: Province[];
  onSave: (address: Address) => void;
  onClose: () => void;
}

interface Location {
  lat: number;
  lng: number;
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  address,
  provinces,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Address & { location?: Location }>({
    title: "",
    province: "",
    city: "",
    street: "",
    postalCode: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (address) {
      setFormData(address);
    } else {
      setFormData({
        title: "",
        province: "",
        city: "",
        street: "",
        postalCode: "",
      });
    }
  }, [address, isOpen]);

  useEffect(() => {
    const isValid =
      Object.values(formData).every(
        (value) => value !== null && (typeof value === "string" ? value.trim() !== "" : true)
      ) && formData.location !== undefined;
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "province") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        city: "",
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
    if (isFormValid) {
      onSave(formData);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setFormData((prevData) => ({
      ...prevData,
      location: location,
    }));
    setShowMap(false);
  };

  const cities = formData.province
    ? provinces.find((p) => p["province-fa"] === formData.province)?.cities || []
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="fixed bottom-0 left-0 right-0 h-[95vh] bg-white p-6 w-full overflow-y-auto max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {address ? "ویرایش موقعیت" : "افزودن موقعیت جدید"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <Image width={20} height={20} src="/images/icons/close.svg" alt="close" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-between h-full">
            <div className="mb-6 mt-4 flex flex-row justify-between items-center">
              <div className="flex flex-row gap-4 items-center">
                <Image
                  width={1080}
                  height={1080}
                  className="h-16 w-16 bg-cover"
                  src="/images/icons/gps.png"
                  alt="gps"
                  quality={100}
                />
                <p className="font-bold text-sm"> موقعیت مکانی</p>
              </div>
              <Button variant="tertiary" onClick={() => setShowMap(true)} icon="edit"></Button>
            </div>
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
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <Input
                type="text"
                label="عنوان موقعیت"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {formData.location && (
              <div className="mb-4">
                <p>
                  مختصات انتخاب شده: {formData.location.lat.toFixed(6)},{" "}
                  {formData.location.lng.toFixed(6)}
                </p>
              </div>
            )}
            <div className="w-full flex justify-center">
              <Button className="w-full" onXsIsText type="submit" disabled={!isFormValid}>
                ثبت موقعیت
              </Button>
            </div>
          </div>
        </form>
      </div>
      {showMap && (
        <IranMap
          onClose={() => setShowMap(false)}
          onLocationSelect={handleLocationSelect}
          initialLocation={formData.location}
        />
      )}
    </div>
  );
};

export default AddressModal;
