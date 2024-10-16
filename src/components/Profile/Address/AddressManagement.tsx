import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Address, Province } from "./types";
import AddressList from "@/components/Profile/Address/AddressList";
import AddressModal from "@/components/Profile/Address/AddressModal";
import ErrorDialog from "@/components/Profile/ErrorDialog";
import Button from "@/components/ui/Button/Button";

interface AddressManagementProps {
  initialAddresses: Address[];
  onAddressChange: (addresses: Address[]) => void;
  title?: string;
}

const AddressManagement: React.FC<AddressManagementProps> = ({
  initialAddresses,
  onAddressChange,
  title,
}) => {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedForDeleteAddressId, setSelectedForDeleteAddressId] = useState("");
  const [clickEditButton, setClickEditButton] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
    setIsModalOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const handleSaveAddress = (address: Address) => {
    let updatedAddresses: Address[];
    if (address.id) {
      updatedAddresses = addresses.map((a) => (a.id === address.id ? address : a));
    } else {
      updatedAddresses = [...addresses, { ...address, id: Date.now().toString() }];
    }
    setAddresses(updatedAddresses);
    onAddressChange(updatedAddresses);
    setIsModalOpen(false);
  };

  const handleDeleteAddressDialog = (addressId: string) => {
    setOpenDeleteDialog(true);
    setSelectedForDeleteAddressId(addressId);
  };

  const handleDeleteAddress = () => {
    const updatedAddresses = addresses.filter((a) => a.id !== selectedForDeleteAddressId);
    setAddresses(updatedAddresses);
    onAddressChange(updatedAddresses);
    setOpenDeleteDialog(false);
  };

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAddress(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-row justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{title || "آدرس‌ها"}</h1>
        <button
          onClick={() => setClickEditButton(!clickEditButton)}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <Image width={25} height={25} src="/images/icons/edit.svg" alt="edit" />
        </button>
      </div>
      <div className="w-full flex justify-center flex-col gap-3">
        <AddressList
          clickEditButton={clickEditButton}
          addresses={addresses}
          selectedAddressId={selectedAddressId}
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
