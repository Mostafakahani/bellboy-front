"use client";
import { Tab } from "@headlessui/react";
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
  const [productTastingTray, setProductTastingTrayData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const [productResponse, tastingTrayResponse] = await Promise.all([
        authenticatedFetch<ApiResponse>("/product", { method: "GET" }),
        authenticatedFetch<ApiResponse>("/product/tasting-tray", { method: "GET" }),
      ]);

      const {
        data: productData,
        error: productError,
        message: productMessage,
        // status: productStatus,
      } = productResponse;
      const {
        data: tastingTrayData,
        error: tastingTrayError,
        message: tastingTrayMessage,
        // status: tastingTrayStatus,
      } = tastingTrayResponse;

      if (productError || tastingTrayError) {
        throw new Error(formatErrorMessage(productError ? productMessage : tastingTrayMessage));
      }
      console.log(tastingTrayResponse.data);

      // if (productStatus === "success" && tastingTrayStatus === "success") {
      setProductData(productData);
      setProductTastingTrayData(tastingTrayData);
      // } else {
      //   throw new Error("خطا در ارسال اطلاعات");
      // }
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
              <button className="w-full text-sm py-3 rounded-xl border border-gray-300 outline-none hover:bg-gray-300 transition-all focus:outline-none">
                افزودن کالا
              </button>
            </Link>
          </div>
        </div>
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-center" />
        ) : (
          <Tab.Group className={"w-full"}>
            <Tab.List className="w-full flex space-x-1 p-1">
              <Tab
                className={({ selected }) =>
                  `w-full py-2.5 text-sm leading-5 font-bold rounded-lg focus:ring-0 active:ring-0 ${
                    selected ? "bg-white shadow" : "text-gray-400 hover:bg-white"
                  }`
                }
              >
                محصولات
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full py-2.5 text-sm leading-5 font-bold rounded-lg focus:ring-0 active:ring-0 ${
                    selected ? "bg-white shadow" : "text-gray-400 hover:bg-white"
                  }`
                }
              >
                سینی مزه
              </Tab>
            </Tab.List>
            <Tab.Panels className="w-full mt-2">
              <Tab.Panel>
                <ResponsiveTableProduct fetchProducts={fetchProducts} data={productData} />
              </Tab.Panel>
              <Tab.Panel>
                <ResponsiveTableProduct fetchProducts={fetchProducts} data={productTastingTray} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        )}
      </div>
    </div>
  );
}
