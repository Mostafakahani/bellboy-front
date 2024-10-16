"use client";
import { useState, useEffect } from "react";
import demoAddresses from "./demo-addresses.json";
import { Address } from "@/components/Profile/Address/types";
import AddressManagement from "@/components/Profile/Address/AddressManagement";

export default function ProfileAddressPage() {
  const [addresses, setAddresses] = useState<Address[]>(demoAddresses);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
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

  const handleAddressChange = (updatedAddresses: Address[]) => {
    setAddresses(updatedAddresses);
    // Here you can add logic to sync with the backend if needed
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <AddressManagement initialAddresses={addresses} onAddressChange={handleAddressChange} />
    </div>
  );
}
