"use client";
import React, { useEffect, useState } from "react";
import { Address } from "@/components/Profile/Address/types";
import DateTimeSelector, { TimeSlot } from "@/components/DateTimeSelector";
import FactorDetails from "@/components/Factor/FactorDetails";
import { LocationForm } from "@/components/Location/LocationForm";
import { ServiceForm } from "@/components/ServiceForm/ServiceForm";
import { Modal } from "@/components/BellMazeh/Modal";
import MainHeader from "@/components/mobile/Header/MainHeader";
import BellTypoGraphy from "@/components/BellTypoGraphy";
import { LeftArrowIcon, LineIcon, OneLineIcon } from "@/icons/Icons";
import Image from "next/image";
import { Clean } from "@/app/dashboard/clean/create/page";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import MultiStepForm from "../Stepper/Stepper";
import Button from "../ui/Button/Button";
import { formatCurrency } from "@/utils/formatCurrency";
import { showError } from "@/lib/toastService";
export interface PlanItem {
  _id: string;
  price: number;
  id_clean: {
    active: boolean;
    id_stores: string[];
    _id: string;
    data: { title: string; "short-description": string; data: { key: string; value: string }[] };
  }[];
  data: {
    title: string;
    data: {
      id: string;
      title: string;
      count: number;
      data: string[];
    }[];
  };
}

interface PlanCleanData {
  [key: string]: PlanItem[];
}
const FactorForm: React.FC<{
  formData: any;
  onFormChange: (newData: any) => void;
  planIds?: string[];
}> = ({ formData, onFormChange, planIds }) => {
  return (
    <FactorDetails planIds={planIds} type="clean" formData={formData} onFormChange={onFormChange} />
  );
};

export default function PlanCleanPage({ planDatas }: { planDatas: Clean[] }) {
  const [formData, setFormData] = useState({
    addresses: [] as Address[],
    selectedAddress: null as Address | null,
    selectedServices: [] as string[],
    selectedDateTime: null as { date: string; time: TimeSlot } | null,
    paymentComplete: false,
  });
  const authenticatedFetch = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalSelectedPlanOpen, setIsModalSelectedPlanOpen] = useState(false);
  const [allPlans, setAllPlans] = useState<PlanItem[]>();
  const [selectedPlan, setSelectedPlan] = useState<PlanItem>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchedData, setFetchedData] = useState<PlanCleanData>({});
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const handleViewDetails = (planItem: PlanItem) => {
    setSelectedPlan(planItem);
    setIsModalSelectedPlanOpen(true);
  };
  const fetchSubs = async (cleanId: string) => {
    setIsLoading(true);
    try {
      const { data, error, message } = await authenticatedFetch<PlanItem[]>(
        "/plan-clean/" + cleanId,
        { method: "GET" }
      );
      if (error) {
        throw new Error(formatErrorMessage(message));
      }
      if (data) {
        setFetchedData((prev) => ({
          ...prev,
          [cleanId]: data,
        }));
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!planDatas || planDatas.length === 0) return;

    let index = 0;

    const intervalId = setInterval(() => {
      if (index >= planDatas.length) {
        clearInterval(intervalId);
        return;
      }

      fetchSubs(planDatas[index]._id);

      index++;
    }, 500);

    return () => clearInterval(intervalId);
  }, [planDatas]);

  const handleDateTimeSelect = (date: string, time: TimeSlot) => {
    setFormData((prev) => ({
      ...prev,
      selectedDateTime: {
        date,
        time,
        timeSlotId: time._id,
      },
    }));
  };

  const handleFormChange = (newData: Partial<typeof formData>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };
  useEffect(() => {
    if (isModalOpen) {
      fetchAddresses();
    }
  }, [isModalOpen]);
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
      // console.log(data);
      setFormData((prev) => ({
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
  const steps = [
    {
      id: 1,
      label: "موقعیت",
      content: (
        <LocationForm isLoading={isLoading} formData={formData} onFormChange={handleFormChange} />
      ),
      isComplete: () => formData.selectedAddress !== null,
    },
    {
      id: 2,
      label: "خدمات",
      content: (
        <ServiceForm packages={allPlans} formData={formData} onFormChange={handleFormChange} />
      ),
      isComplete: () => formData.selectedServices.length > 0,
    },
    {
      id: 3,
      label: "زمان",
      content: (
        <DateTimeSelector
          type="clean"
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          onSelect={handleDateTimeSelect}
        />
      ),
      isComplete: () => formData.selectedDateTime !== null && selectedTime !== null,
    },
    {
      id: 4,
      label: "پرداخت",
      content: (
        <FactorForm
          planIds={formData.selectedServices}
          formData={formData}
          onFormChange={handleFormChange}
        />
      ),
      isComplete: () => formData.paymentComplete,
    },
  ];

  const openModal = (plan: PlanItem[]) => {
    setIsModalOpen(true);
    setAllPlans(plan);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      addresses: [] as Address[],
      selectedAddress: null as Address | null,
      selectedServices: [] as string[],
      selectedDateTime: null as { date: string; time: TimeSlot } | null,
      paymentComplete: false,
    });
  };
  const handleSubmit = () => {
    console.log(formData);
  };

  return (
    <>
      <MainHeader />
      <div className="mt-24 flex flex-col gap-y-5">
        <BellTypoGraphy english="Bell Clean" farsi="بِل‌کلین" />
        <p className="w-full text-center leading-relaxed text-lg px-4">
          نظافت بخش‌های داخلی و خارجی اقامتگاه، از حمام و سرویس بهداشتی، راه‌پله، سالن و پذیرایی،
          اتاق خواب و آشپزخانه گرفته تا استخر، باغچه، حیاط، تراس و آلاچیق
        </p>
        <OneLineIcon className="w-full text-center" />
        <div className="w-full flex justify-center flex-row gap-2">
          <p className="text-xl">توجه</p>
          <Image
            src={"/images/icons/hand.png"}
            className="transition rotate-[260deg]"
            width={30}
            height={30}
            quality={100}
            alt="hand"
          />
        </div>
        <p className="w-full text-center leading-relaxed text-lg px-4">
          قیمت‌ها با
          <span className="mx-1 z-10 price relative font-bold text-black after:content-[''] after:absolute after:left-0 after:bottom-1 after:w-full after:h-[5px] after:bg-primary-400 after:z-[-1]">
            پیش‌فرض شرایط عادی
          </span>
          است. قیمت دقیق بعد از مشاهده کارشناس میزبانو مشخص و امضا می‌شود
        </p>
        <LineIcon className="w-full text-center" />
        <div className="w-full flex flex-col justify-center">
          {planDatas?.map((item, index) => (
            <div
              key={index}
              className="w-full flex flex-col items-center justify-center gap-y-6 mb-16"
            >
              <div className="w-full flex justify-center items-center px-6">
                <div className="bg-gray-200 w-full h-26 rounded-2xl overflow-hidden">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${item.id_stores[0].location}`}
                    alt={item.data["short-description"]}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h3 className="w-full flex flex-row justify-start font-bold text-2xl px-6">
                <span className="text-white text-center text-md bg-black rounded-full px-3 font-bold ml-4">
                  {index + 1}
                </span>{" "}
                {item.data.title}
              </h3>
              <div className="w-full flex flex-row justify-between items-center py-4 font-bold px-6 border-b-2 border-black text-[#494A50]">
                <p>خدمات</p>
                <p>قیمت پایه (تومان)</p>
              </div>
              {/* {isLoading ? (
                <p className="text-center text-gray-500">در حال بارگذاری...</p>
              ) :  */}

              {fetchedData[item._id] &&
                Array.isArray(fetchedData[item._id]) &&
                fetchedData[item._id].map((planItem) => {
                  // Filter `id_clean` to get only the relevant data
                  const filteredIdClean = planItem.id_clean.filter((x) => x._id === item._id);
                  // Extract the short description if the filtered data exists
                  const getPackageDataDesc = filteredIdClean.map(
                    (x) => x.data["short-description"]
                  );

                  return (
                    <div
                      key={planItem?._id}
                      className="w-full px-6 flex flex-col border-b border-black pb-8"
                    >
                      <div className="w-full flex flex-col justify-between">
                        <div className="w-full flex flex-row justify-between items-start">
                          <div>
                            <p className="text-lg font-bold">{planItem?.data?.title}</p>
                            <p>{getPackageDataDesc}</p>
                          </div>
                          <p>{formatCurrency(planItem.price)}</p>
                        </div>
                      </div>
                      <div className="w-full flex justify-center items-center mt-5">
                        <button
                          onClick={() => handleViewDetails(planItem)}
                          className="w-full rounded-full bg-gray-50 border-2 border-black py-1 text-xs font-bold flex flex-row gap-2 justify-center items-center"
                        >
                          مشاهده جزییات
                          <LeftArrowIcon className="transform -rotate-90" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              {/* // : (
              //   <p className="text-center">پکیجی وجود ندارد</p>
              // )} */}

              <div className="w-full flex justify-center items-center mt-5">
                <Button icon="left" onXsIsText onClick={() => openModal(fetchedData[item._id])}>
                  {`ثبت سفارش برای  ${item.data.title}`}{" "}
                </Button>
              </div>
              <LineIcon className="w-full text-center" />
            </div>
          ))}
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal} title="بل کلین">
          <MultiStepForm
            steps={steps}
            formData={formData}
            onFormChange={handleFormChange}
            handleSubmit={handleSubmit}
          />
        </Modal>

        <Modal
          isOpen={isModalSelectedPlanOpen && selectedPlan ? true : false}
          onClose={() => setIsModalSelectedPlanOpen(false)}
          title="جزییات"
        >
          {selectedPlan && (
            <div className="space-y-4">
              {/* نمایش عنوان هر داده */}
              <div>
                <h3 className="font-semibold text-xl">عنوان‌ها:</h3>
                <ul className="list-disc pl-5">
                  {selectedPlan.data.data.map((x, index) => (
                    <li key={index}>{x.title}</li>
                  ))}
                </ul>
              </div>

              {/* نمایش مقادیر هر داده */}
              <div>
                <h3 className="font-semibold text-xl">مقادیر:</h3>
                <ul className="list-disc pl-5">
                  {selectedPlan.data.data.map((x, index) => (
                    <li key={index}>{x.count}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-xl">اطلاعات اضافی:</h3>
                <ul className="list-disc pl-5">
                  {selectedPlan.data.data
                    .flatMap((x) => x.data)
                    .map((x, index) => (
                      <li key={index}>{x}</li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
{
  /* <Modal
isOpen={isModalSelectedPlanOpen && selectedPlan ? true : false}
onClose={() => setIsModalSelectedPlanOpen(false)}
title="جزییات"
>
{selectedPlan && (
  <div className="space-y-4">
    {/* نمایش عنوان هر داده */
}
// <div>
//   <h3 className="font-semibold text-xl">عنوان‌ها:</h3>
//   <ul className="list-disc pl-5">
//     {selectedPlan.data.data.map((x, index) => (
//       <li key={index}>{x.title}</li>
//     ))}
//   </ul>
// </div>

{
  /* نمایش مقادیر هر داده */
}
// <div>
//   <h3 className="font-semibold text-xl">مقادیر:</h3>
//   <ul className="list-disc pl-5">
//     {selectedPlan.data.data.map((x, index) => (
//       <li key={index}>{x.count}</li>
//     ))}
//   </ul>
// </div>

{
  /* نمایش داده‌های اضافی */
}
//     <div>
//       <h3 className="font-semibold text-xl">اطلاعات اضافی:</h3>
//       <ul className="list-disc pl-5">
//         {selectedPlan.data.data
//           .flatMap((x) => x.data)
//           .map((x, index) => (
//             <li key={index}>{x}</li>
//           ))}
//       </ul>
//     </div>
//   </div>
// )}
// </Modal> */}
