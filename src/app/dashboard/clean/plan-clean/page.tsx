"use client";
import PlanCleanForm from "@/components/Dashboard/Clean/PlanCleanForm";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError, showSuccess } from "@/lib/toastService";
import { useEffect, useState } from "react";

interface ExtraField {
  key: string;
  value: string;
}

interface CleanData {
  title: string;
  "short-description": string;
  data: ExtraField[];
}

export interface PlanClean {
  _id: string;
  data: {
    title: string;
    "short-description": string;
    data: any[];
  };
  globalDiscount: number;
  active: boolean;
  price: number;
  id_clean: {
    _id: string;
    data: CleanData;
    id_stores: string[];
    active: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

const PlanCleanPage = () => {
  const authenticatedFetch = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [cleanSubList, setCleanSubList] = useState<PlanClean[]>([]);
  const [cleanList, setCleanList] = useState<PlanClean[]>([]);
  const [selectedClean, setSelectedClean] = useState<PlanClean | null>(null);

  const handleFormSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const { error, message } = await authenticatedFetch("/plan-clean", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (error) {
        throw new Error(Array.isArray(message) ? message.join(" ") : message);
      }

      showSuccess(message);
      fetchCleanList();
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (selectedClean?._id) {
      fetchCleanSubList(selectedClean._id);
    }
  }, [selectedClean]);
  useEffect(() => {
    fetchCleanList();
  }, []);

  const fetchCleanSubList = async (id: string) => {
    try {
      setIsLoading(true);
      const { data, error, message } = await authenticatedFetch("/plan-clean/" + id, {
        method: "GET",
      });

      if (error) {
        throw new Error(Array.isArray(message) ? message.join(" ") : message);
      }
      setCleanSubList(Array.isArray(data) ? data : []);
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCleanList = async () => {
    try {
      setIsLoading(true);
      const { data, error, message } = await authenticatedFetch("/clean", {
        method: "GET",
      });

      if (error) {
        throw new Error(Array.isArray(message) ? message.join(" ") : message);
      }

      setCleanList(Array.isArray(data) ? data : []);
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <DashboardHeader />
      <div className="container mx-auto p-4">
        <PlanCleanForm
          fetchCleanList={fetchCleanList}
          loading={isLoading}
          cleanList={cleanList}
          onSubmit={handleFormSubmit}
          selectedClean={selectedClean}
          setSelectedClean={setSelectedClean}
          cleanSubList={cleanSubList}
        />
      </div>
    </>
  );
};
export default PlanCleanPage;
