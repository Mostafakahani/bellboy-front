"use client";

import CleanForm from "@/components/Dashboard/Clean/CleanForm";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError, showSuccess } from "@/lib/toastService";
import React, { useEffect, useState } from "react";
export interface CleanData {
  title: string;
  "short-description": string;
  [key: string]: any; // To allow for extra fields with dynamic keys and values
}

export interface Clean {
  _id: string;
  data: CleanData;
  id_stores: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type CleanResponse = Clean[];

const CleanPage = () => {
  const authenticatedFetch = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [cleanData, setCleanData] = useState<Clean[]>();
  const handleFormSubmit = async (dataList: any) => {
    try {
      setIsLoading(true);

      const { error, message } = await authenticatedFetch("/clean", {
        method: "POST",
        body: JSON.stringify(dataList),
      });

      if (error) {
        throw new Error(formatErrorMessage(message));
      }

      showSuccess(message);

      setCleanData([]);
      fetchCleanList();
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };
  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      console.log({ message });
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };
  const fetchCleanList = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const { data, error, message } = await authenticatedFetch("/clean", {
        method: "GET",
      });

      if (error) {
        throw new Error(formatErrorMessage(message));
      }

      setCleanData(Array.isArray(data) ? data : []);
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCleanList();
  }, []);
  return (
    <>
      <DashboardHeader />
      <div className="container mx-auto p-4">
        <CleanForm
          fetchCleanList={fetchCleanList}
          cleanData={cleanData}
          onSubmit={handleFormSubmit}
          loading={isLoading}
        />
      </div>
    </>
  );
};

export default CleanPage;
