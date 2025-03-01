import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Address, AddressFormMode, Province } from "./types";
import { Input } from "@/components/ui/Input/Input";
import dynamic from "next/dynamic";
import Button from "@/components/ui/Button/Button";
// import { useRouter } from "next/router";

const IranMap = dynamic(() => import("@/components/Map/IranMap"), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

interface Location {
  x: number;
  y: number;
}

interface AddressModalProps {
  isOpen: boolean;
  address: Address | null;
  provinces: Province[];
  mode: AddressFormMode;
  onSave: (address: Address) => void;
  onClose: () => void;
}

// Updated ExtendedAddress interface with all required properties
interface ExtendedAddress {
  title: string;
  province: string;
  city: string;
  address: string;
  plaque: string;
  location: Location;
  addressCode: string; // Added missing required property
  active: boolean; // Added missing required property
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  address,
  provinces,
  mode,
  onSave,
  onClose,
}) => {
  // const router = useRouter();
  const currentUrl = window.location.pathname;

  const [formData, setFormData] = useState<ExtendedAddress>({
    title: "",
    province: "",
    city: "",
    address: "",
    plaque: "",
    location: { x: 35, y: 51 },
    addressCode: "", // Initialize with default value
    active: true, // Initialize with default value
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (address) {
      setFormData({
        ...address,
        location: {
          x: address.x || 35,
          y: address.y || 51,
        },
        addressCode: address.addressCode || "",
        active: address.active ?? true,
      });
    } else {
      setFormData({
        title: "",
        province: "",
        city: "",
        address: "",
        plaque: "",
        location: { x: 35, y: 51 },
        addressCode: "",
        active: true,
      });
    }
  }, [address, isOpen]);

  useEffect(() => {
    const isValid = Object.entries(formData).every(([key, value]) => {
      if (key === "location") {
        return value.x !== 0 || value.y !== 0;
      }
      if (key === "active" || key === "addressCode" || key === "plaque" || key === "title") {
        return true; // این فیلدها اجباری نیستند
      }

      return typeof value === "string" ? value.trim() !== "" : true;
    });
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
      const submitData: Address = {
        ...formData,
        x: formData.location.x,
        y: formData.location.y,
        addressCode: formData.addressCode,
        active: formData.active,
      };
      onSave(submitData);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setFormData((prevData) => ({
      ...prevData,
      location: location,
    }));
    setShowMap(false);
  };
  const isProfileAddress = (url: string): boolean => {
    return url.startsWith("/profile/address");
  };
  const cities = formData.province
    ? provinces.find((p) => p["province-fa"] === formData.province)?.cities || []
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center overflow-y-auto z-50">
      <div className="fixed bottom-16 left-0 right-0 h-[90vh] bg-white p-6 w-full overflow-y-auto max-w-md">
        <div
          className={`flex justify-between items-center mb-4 ${
            isProfileAddress(currentUrl) ? " " : "mt-24"
          }`}
        >
          <h2 className="text-xl font-semibold">
            {mode === AddressFormMode.EDIT ? "ویرایش موقعیت" : "افزودن موقعیت جدید"}
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
                <p className="font-bold text-sm">موقعیت مکانی</p>
              </div>
              <Button
                variant="tertiary"
                type="button"
                onClick={() => setShowMap(true)}
                icon="edit"
              ></Button>
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
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <Input
                type="text"
                label="پلاک"
                name="plaque"
                value={formData.plaque}
                onChange={handleChange}
                // required
              />
            </div>
            <div className="mb-4">
              <Input
                type="text"
                label="عنوان موقعیت"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {(formData.location.x !== 0 || formData.location.y !== 0) && (
              <div className="mb-4">
                <p>
                  مختصات انتخاب شده: {formData.location.y.toFixed(6)},{" "}
                  {formData.location.x.toFixed(6)}
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
