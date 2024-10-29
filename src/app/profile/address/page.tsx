"use client";
import { useState, useEffect } from "react";
import demoAddresses from "./demo-addresses.json";
import AddressManagement from "@/components/Profile/Address/AddressManagement";
import { ApiResponse, useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError } from "@/lib/toastService";

export default function ProfileAddressPage() {
  const [addresses, setAddresses] = useState<any>(demoAddresses);
  // const [newAddress, setNewAddress] = useState<boolean>(false);
  // const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const authenticatedFetch = useAuthenticatedFetch();

  useEffect(() => {
    fetchAddresses();
  }, []);
  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      console.log({ message });
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };
  const fetchAddresses = async () => {
    try {
      setIsLoading(true);

      const { data, error, message, status } = await authenticatedFetch<ApiResponse>("/address", {
        method: "GET",
      });

      if (error) {
        setIsLoading(false);
        throw new Error(formatErrorMessage(message));
      }

      // if (data?.statusCode && data.statusCode !== 200) {
      //   setIsLoading(false);
      //   throw new Error(formatErrorMessage(data.message));
      // }

      if (status === "success") {
        // showSuccess(message);
        setIsLoading(false);
      }
      //  else {
      //   throw new Error(formatErrorMessage(data?.message) || "خطا در ارسال اطلاعات");
      // }
      console.log(data);
      setAddresses(data);
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressChange = async () =>
    // updatedAddresses: Address[]

    // selectedAddr: Address | null
    {
      // setAddresses(updatedAddresses);
      // setNewAddress(updatedAddresses[updatedAddresses.length - 1]);
      // console.log(updatedAddresses[updatedAddresses.length - 1]);
      // try {
      //   setIsLoading(true);
      //   const latestAddress = updatedAddresses[updatedAddresses.length - 1];
      //   const location = latestAddress || { y: 0, x: 0 };
      //   const { data, error, message, status } = await authenticatedFetch<ApiResponse>("/address", {
      //     method: "POST",
      //     body: JSON.stringify({
      //       // province: latestAddress.province,
      //       // city: latestAddress.city,
      //       // address: latestAddress.address,
      //       // plaque: latestAddress.plaque,
      //       // title: latestAddress.title,
      //       // x: location.x,
      //       // y: location.y,
      //     }),
      //   });
      //   if (error) {
      //     setIsLoading(false);
      //     throw new Error(formatErrorMessage(message));
      //   }
      //   // if (data?.statusCode && data.statusCode !== 200) {
      //   //   setIsLoading(false);
      //   //   throw new Error(formatErrorMessage(data.message));
      //   // }
      //   if (status === "success") {
      //     await fetchAddresses();
      //     // setNewAddress()
      //     showSuccess(message);
      //     setIsLoading(false);
      //   } else {
      //     throw new Error(formatErrorMessage(data?.message) || "خطا در ارسال اطلاعات");
      //   }
      //   console.log(data);
      //   // setAddresses(data);
      // } catch (err) {
      //   showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
      // } finally {
      //   setIsLoading(false);
      // }
      // setSelectedAddress(selectedAddr);
    };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // const isContinueButtonEnabled = selectedAddress !== null;

  return (
    <div className="container mx-auto py-8 mt-20">
      <AddressManagement
        initialAddresses={addresses}
        onAddressChange={handleAddressChange}
        title="آدرس‌های من"
      />
      {/* <button
        className={`mt-4 px-4 py-2 rounded ${
          isContinueButtonEnabled
            ? "bg-blue-500 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!isContinueButtonEnabled}
      >
        ادامه
      </button> */}
    </div>
  );
}
