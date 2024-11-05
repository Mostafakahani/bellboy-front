import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Address, AddressFormMode, Province } from "./types";
import AddressList from "@/components/Profile/Address/AddressList";
import AddressModal from "@/components/Profile/Address/AddressModal";
import ErrorDialog from "@/components/Profile/ErrorDialog";
import Button from "@/components/ui/Button/Button";
import { ApiResponse, useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError, showSuccess } from "@/lib/toastService";

interface AddressManagementProps {
  initialAddresses: Address[];
  onAddressChange: (addresses: Address[], selectedAddress: Address | null) => void;
  title?: string;
}

interface UpdateAddressApiResponse extends ApiResponse {
  _id?: string;
}

const AddressManagement: React.FC<AddressManagementProps> = ({
  initialAddresses,
  onAddressChange,
  title = "آدرس‌ها",
}) => {
  const [formMode, setFormMode] = useState<AddressFormMode>(AddressFormMode.CREATE);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedForDeleteAddressId, setSelectedForDeleteAddressId] = useState("");
  const [clickEditButton, setClickEditButton] = useState<boolean>(false);
  const authenticatedFetch = useAuthenticatedFetch();

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const response = await fetch("/iran-data/province_city.json");
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setFormMode(AddressFormMode.CREATE);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setFormMode(AddressFormMode.EDIT);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAddress(null);
    setFormMode(AddressFormMode.CREATE);
  };

  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      console.log({ message });
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };

  const handleSaveAddress = async (address: Address) => {
    try {
      const baseAddressData = {
        province: address.province,
        city: address.city,
        address: address.address,
        plaque: address.plaque,
        title: address.title,
        x: address.x,
        y: address.y,
      };

      let apiResponse;

      if (formMode === AddressFormMode.CREATE) {
        apiResponse = await authenticatedFetch<UpdateAddressApiResponse>("/address", {
          method: "POST",
          body: JSON.stringify(baseAddressData),
        });
      } else {
        apiResponse = await authenticatedFetch<UpdateAddressApiResponse>(
          `/address/${address._id}`,
          {
            method: "PATCH",
            body: JSON.stringify(baseAddressData),
          }
        );
      }

      const { data, error, message, status } = apiResponse;

      if (error) {
        throw new Error(formatErrorMessage(message));
      }

      if (status === "success") {
        let updatedAddresses: Address[];
        if (formMode === AddressFormMode.EDIT) {
          updatedAddresses = addresses.map((a) =>
            a._id === address._id ? { ...a, ...baseAddressData } : a
          );
        } else {
          const newAddress = {
            ...baseAddressData,
            active: false,
            addressCode: Date.now().toString(),
            _id: data?._id || Date.now().toString(),
          };
          updatedAddresses = [...addresses, newAddress];
        }

        setAddresses(updatedAddresses);
        setSelectedAddress(address);
        onAddressChange(updatedAddresses, address);
        setIsModalOpen(false);
        showSuccess(message);
      } else {
        throw new Error(formatErrorMessage(data?.message) || "خطا در ارسال اطلاعات");
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    }
  };

  const handleDeleteAddressDialog = (addressId: string) => {
    setOpenDeleteDialog(true);
    setSelectedForDeleteAddressId(addressId);
  };

  const handleDeleteAddress = () => {
    const updatedAddresses = addresses.filter((a) => a._id !== selectedForDeleteAddressId);
    setAddresses(updatedAddresses);
    setSelectedAddress(null);
    onAddressChange(updatedAddresses, null);
    setOpenDeleteDialog(false);
  };

  const handleSelectAddress = (addressId: string) => {
    const selected = addresses.find((a) => a._id === addressId) || null;
    setSelectedAddress(selected);
    onAddressChange(addresses, selected);
  };

  return (
    <div className="w-full px-4">
      <div className="w-full flex flex-row justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{title}</h1>
        <button
          onClick={() => setClickEditButton(!clickEditButton)}
          className={`text-gray-400 hover:text-gray-600 focus:outline-none p-2 ${
            clickEditButton && "bg-gray-100 rounded-full"
          }`}
        >
          <Image width={25} height={25} src="/images/icons/edit.svg" alt="edit" />
        </button>
      </div>
      <div className="w-full flex justify-center flex-col gap-3">
        <AddressList
          clickEditButton={clickEditButton}
          addresses={addresses}
          selectedAddressId={selectedAddress?._id || null}
          onEdit={handleEditAddress}
          onDelete={handleDeleteAddressDialog}
          onSelect={handleSelectAddress}
        />
        <Button
          onClick={handleAddAddress}
          onXsIsText
          className="flex-row-reverse gap-2"
          variant="tertiary"
          icon="plus"
        >
          افزودن موقعیت جدید
        </Button>
      </div>
      <AddressModal
        isOpen={isModalOpen}
        address={selectedAddress}
        provinces={provinces}
        mode={formMode}
        onSave={handleSaveAddress}
        onClose={handleCloseModal}
      />
      <ErrorDialog
        isOpen={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onDelete={handleDeleteAddress}
        message="آیا مطمئن هستید؟"
        buttonMessage="بله، حذف کن"
      />
    </div>
  );
};

export default AddressManagement;
