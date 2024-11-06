"use client";
import DashboardHeaderCreateCategory from "@/components/Dashboard/DashboardHeaderCreateCategory";
import ResponsiveTableProduct from "@/components/Dashboard/ResponsiveTableProduct";
import { ApiResponse, useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError } from "@/lib/toastService";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function ProductPage() {
  const authenticatedFetch = useAuthenticatedFetch();
  const [productData, setProductData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

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

      const { data, error, message, status } = await authenticatedFetch<ApiResponse>("/product", {
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
      setProductData(data);
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <DashboardHeaderCreateCategory />
      <div className="flex justify-center flex-col items-center">
        <div className="w-full flex flex-row justify-between items-center mb-4 px-4">
          <p className="text-2xl font-bold">کالاها</p>
          <div className="w-1/3">
            <Link href={"/dashboard/products/new"}>
              <button className="w-full text-sm py-3 rounded-xl border border-gray-300 outline-none hover:bg-gray-300 transition-all focus:outline-none ">
                افزودن کالا
              </button>
            </Link>
          </div>
        </div>
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-center" />
        ) : (
          <ResponsiveTableProduct data={productData} />
        )}
      </div>
    </div>
  );
}
