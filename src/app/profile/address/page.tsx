"use client";

import { useState, useEffect } from "react";
import { Address, Province } from "./types";
import AddressList from "@/components/Profile/Address/AddressList";
import AddressModal from "@/components/Profile/Address/AddressModal";
import { useRouter } from "next/navigation";
import demoAddresses from "./demo-addresses.json";

export default function ProfileAddressPage() {
  const [addresses, setAddresses] = useState<Address[]>(demoAddresses);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "edit">("list");

  const router = useRouter();

  useEffect(() => {
    fetchAddresses();
    fetchProvinces();
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      // Simulated API call
      const response = await fetch("/api/addresses");
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    setMode("edit");
  };

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setMode("edit");
  };

  const handleSaveAddress = async (address: Address) => {
    // Simulated API call to save address
    if (address.id) {
      // Update existing address
      setAddresses(addresses.map((a) => (a.id === address.id ? address : a)));
    } else {
      // Add new address
      setAddresses([...addresses, { ...address, id: Date.now().toString() }]);
    }
    setMode("list");
  };

  const handleDeleteAddress = async (addressId: string) => {
    // Simulated API call to delete address
    setAddresses(addresses.filter((a) => a.id !== addressId));
  };

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const handleBackToList = () => {
    setMode("list");
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">آدرس‌های من</h1>
      {mode === "list" ? (
        <>
          <AddressList
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onEdit={handleEditAddress}
            onDelete={handleDeleteAddress}
            onSelect={handleSelectAddress}
          />
          <button
            onClick={handleAddAddress}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            افزودن موقعیت جدید
          </button>
        </>
      ) : (
        <AddressModal
          address={selectedAddress}
          provinces={provinces}
          onSave={handleSaveAddress}
          onClose={handleBackToList}
        />
      )}
    </div>
  );
}
