"use client";
import React, { useEffect, useState } from "react";
import MultiStepForm from "@/components/Stepper/Stepper";
import Button from "@/components/ui/Button/Button";
import { Address } from "@/components/Profile/Address/types";

import { Input } from "@/components/ui/Input/Input";
import DateTimeSelector, { TimeSlot } from "@/components/DateTimeSelector";
import HandType from "@/components/HandType";
import BellTypoGraphy from "@/components/BellTypoGraphy";
import { LocationForm } from "@/components/Location/LocationForm";
import { showError, showSuccess } from "@/lib/toastService";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { Modal } from "@/components/BellMazeh/Modal";
import { Dropdown } from "@/components/Dashboard/Dropdown";
import LocationUi from "@/components/LocationUi";
import SupportConnetction from "@/components/SupportConnetction";
import Image from "next/image";
export interface FormData {
  addresses: Address[];
  selectedAddress: Address | null;
  selectedParent: ParentService | null;
  selectedChild: ChildService | null;
  selectedServices: any;

  selectedDateTime: {
    date: string;
    time: TimeSlot;
    timeSlotId: string;
  } | null;
  paymentComplete: boolean;
  desc: string;
}
export interface ParentService {
  _id: string;
  name: string;
  isParent: boolean;
}
export interface ChildService {
  _id: string;
  name: string;
  isParent: boolean;
  id_parent: string;
}
// ServiceForm Component for Step 2
const ServiceForm: React.FC<{ onFormChange: (data: any) => void }> = ({ onFormChange }) => {
  const authenticatedFetch = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(true);

  // Parent and child data
  const [parentDATA, setParentDATA] = useState<ParentService[]>([]);
  const [childDATA, setChildDATA] = useState<ChildService[]>([]);
  const [selectedParent, setSelectedParent] = useState<ParentService>();
  const [selectedChild, setSelectedChild] = useState<ChildService>();
  const [desc, setDesc] = useState<string>("");

  // Fetch parent services
  const fetchParentServices = async () => {
    try {
      setIsLoading(true);

      const { data, error, message } = await authenticatedFetch<ParentService[]>(
        "/service-option",
        { method: "GET" }
      );

      if (error) {
        setIsLoading(false);
        throw new Error(formatErrorMessage(message));
      }

      setParentDATA(Array.isArray(data) ? data : []);
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch child services based on the selected parent
  const fetchChildServices = async (parentId: string) => {
    try {
      setIsLoading(true);

      const { data, error, message } = await authenticatedFetch<ChildService[]>(
        `/service-option/${parentId}`,
        { method: "GET" }
      );

      if (error) {
        setIsLoading(false);
        throw new Error(formatErrorMessage(message));
      }

      setChildDATA(Array.isArray(data) ? data : []);
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch parent services on initial render
  useEffect(() => {
    fetchParentServices();
  }, []);

  // Fetch child services when a parent is selected
  useEffect(() => {
    if (selectedParent) {
      fetchChildServices(selectedParent._id);
      onFormChange({ selectedParent, selectedChild });
    }
  }, [selectedParent, selectedChild]);

  // مدیریت تغییرات در desc به صورت جداگانه
  useEffect(() => {
    onFormChange({ desc });
  }, [desc]);

  return (
    <div className="p-4">
      <Dropdown
        options={parentDATA.map((parent) => ({ value: parent._id, label: parent.name }))}
        label="موضوع"
        value={selectedParent?._id || ""}
        onChange={(value) => {
          const parent = parentDATA.find((p) => p._id === value);
          setSelectedParent(parent);
        }}
        isLoading={isLoading}
      />
      <Dropdown
        options={childDATA.map((child) => ({ value: child._id, label: child.name }))}
        label="نوع سرویس"
        value={selectedChild?._id || ""}
        onChange={(value) => {
          const child = childDATA.find((c) => c._id === value);
          setSelectedChild(child);
        }}
        isLoading={isLoading}
      />
      <Input
        variant="textarea"
        label="توضیحات"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
    </div>
  );
};

const formatErrorMessage = (message: string | string[] | any): string => {
  if (Array.isArray(message)) {
    console.log({ message });
    return message.join(" ");
  }
  return message?.toString() || "خطای ناشناخته رخ داده است";
};
export default function BellServicePage() {
  const authenticatedFetch = useAuthenticatedFetch();

  const [formData, setFormData] = useState<FormData>({
    addresses: [],
    selectedAddress: null,
    selectedParent: null,
    selectedServices: [],

    selectedDateTime: null,
    paymentComplete: false,
    selectedChild: null,
    desc: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);

  const handleFormChange = (newData: any) => {
    setFormData({ ...formData, ...newData });
  };

  // const handleAddressChange = (updatedAddresses: Address[]) => {
  //   setFormData((prevData: any) => ({ ...prevData, addresses: updatedAddresses }));
  // };

  const handleDateTimeSelect = (date: string, time: TimeSlot) => {
    setFormData((prev: any) => ({
      ...prev,
      selectedDateTime: {
        date,
        time,
        timeSlotId: time._id,
      },
    }));
  };
  useEffect(() => {
    if (isModalOpen) {
      fetchAddresses();
    }
  }, [isModalOpen]);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);

      const { data, error, message, status } = await authenticatedFetch("/address", {
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
      setFormData((prev: any) => ({
        ...prev,
        addresses: data as Address[],
      }));

      // handleFormChange({ addresses: data?.data });
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };
  // Fix: Use a function to return whether the step is complete
  const steps = [
    {
      id: 1,
      label: "موقعیت",
      content: (
        <LocationForm formData={formData} isLoading={isLoading} onFormChange={handleFormChange} />
      ),
      isComplete: () => formData.selectedAddress !== null,
    },
    {
      id: 2,
      label: "سرویس",
      content: <ServiceForm onFormChange={handleFormChange} />,
      isComplete: () => {
        // بررسی وجود سرویس والد
        if (!formData.selectedParent?._id) {
          return false;
        }

        // بررسی وجود سرویس فرزند
        if (!formData.selectedChild?._id) {
          return false;
        }

        // desc اختیاری است، پس نیازی به بررسی آن نیست
        return true;
      },
    },
    {
      id: 3,
      label: "زمان",
      content: (
        <DateTimeSelector
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          onSelect={handleDateTimeSelect}
        />
      ),
      isComplete: () => selectedTime !== null,
    },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      addresses: [],
      selectedAddress: null,
      selectedParent: null,
      selectedDateTime: null,
      paymentComplete: false,
      selectedChild: null,
      desc: "",
      selectedServices: [],
    });
    /////clean input values
  };
  const handleSubmit = async () => {
    if (!formData.selectedAddress?._id || !formData) {
      return;
    }

    try {
      const response = await authenticatedFetch(`/order/service`, {
        method: "POST",
        body: JSON.stringify({
          delivery: formData.selectedDateTime?.timeSlotId,
          address: formData.selectedAddress._id,
          type: "service",
          id_service_option: formData.selectedChild?._id,
          description: formData.desc,
        }),
      });

      if (response.error) {
        throw new Error(formatErrorMessage(response.message));
      }

      if (response.status === "success") {
        showSuccess(response.message);
        closeModal();
        // setOrderData(response as OrderData);
        // onFormChange({ paymentComplete: true });
      } else {
        throw new Error(response.message || "خطا در دریافت اطلاعات سفارش");
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };
  const handTypeItems = [
    {
      bold: "سرویس‌های سریع و قابل اطمینان:",
      normal:
        "تیم حرفه‌ای ما با سرعت بالا به درخواست شما پاسخ داده و در کمترین زمان ممکن با شما تماس می‌گیرند.",
    },
    {
      bold: "بازدید رایگان و تعیین قیمت شفاف:",
      normal:
        " پس از دریافت اطلاعات از شما، تیم ما به صورت رایگان به محل شما می‌آید، مشکل را بررسی می‌کند و هزینه دقیق و شفاف را برای شما تعیین می‌کند. هیچ هزینه پنهانی وجود ندارد!",
    },
    {
      bold: "متخصصین با تجربه در هر زمینه:",
      normal:
        " فرقی نمی‌کند که مشکل شما در حوزه قفل و پنجره، تعمیرات برق یا لوله و اتصالات باشد؛ ما تیمی از متخصصین با تجربه و ماهر در هر حوزه داریم که آماده حل مشکل شما هستند.",
    },
  ];

  return (
    <div className="mt-16 w-full flex justify-center items-center">
      <div className=" max-w-lg">
        <BellTypoGraphy farsi="بِل سرویس" english="Bell Service" />
        <HandType items={handTypeItems} />
        <div className="w-full flex justify-center">
          <Button icon="left" onXsIsText onClick={openModal}>
            ثبت سفارش
          </Button>
        </div>
        <div className="my-10">
          <div className="w-full">
            {/* <LineIcon className="w-full !my-0" /> */}
            <Image width={1080} height={150} className="w-full" src="/images/line.svg" alt="" />
          </div>
          <LocationUi />
          <div className="w-full">
            {/* <LineIcon className="w-full !my-0" /> */}
            <Image width={1080} height={150} className="w-full" src="/images/line.svg" alt="" />
          </div>
        </div>
        <SupportConnetction />
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <MultiStepForm
            formData={formData}
            onFormChange={handleFormChange}
            handleSubmit={handleSubmit}
            steps={steps}
          />
        </Modal>
      </div>
    </div>
  );
}
