import React, { useState, KeyboardEvent, useEffect } from "react";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { DashboardInput } from "../DashboardInput";
import DashboardButton from "@/components/ui/Button/DashboardButton";
import { showError, showSuccess } from "@/lib/toastService";
import { PlanClean } from "@/app/dashboard/clean/plan-clean/page";
import EditPlanCleanModal from "./EditPlanCleanModal";
import { Clean } from "@/app/dashboard/clean/create/page";

interface ExtraField {
  id: number;
  title: string;
  count: number;
  data: string[];
}

interface PlanCleanFormProps {
  cleanList: PlanClean[] | any;
  loading: boolean;
  onSubmit: (data: any) => void;
  fetchCleanList: () => void;
  selectedClean: PlanClean | any;
  setSelectedClean: any;
  cleanSubList: any;
}

const PlanCleanForm: React.FC<PlanCleanFormProps> = ({
  onSubmit,
  cleanList,
  loading,
  fetchCleanList,
  selectedClean,
  setSelectedClean,
  cleanSubList,
}) => {
  const authenticatedFetch = useAuthenticatedFetch();
  const [title, setTitle] = useState("");
  const [globalDiscount, setGlobalDiscount] = useState<number>();
  const [price, setPrice] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedSubPlan, setSelectedSubPlan] = useState<PlanClean>();

  // New state for extra fields
  const [extraFields, setExtraFields] = useState<ExtraField[]>([]);
  const [currentWord, setCurrentWord] = useState("");

  const handleAddField = () => {
    const newField: ExtraField = {
      id: extraFields.length + 1,
      title: "",
      count: 0,
      data: [],
    };
    setExtraFields([...extraFields, newField]);
  };

  const handleFieldChange = (index: number, field: keyof ExtraField, value: string | number) => {
    const newFields = [...extraFields];
    newFields[index] = {
      ...newFields[index],
      [field]: field === "count" ? Number(value) : value,
    };
    setExtraFields(newFields);
  };

  const handleAddWord = (index: number, word: string) => {
    if (!word.trim()) return;

    const newFields = [...extraFields];
    newFields[index].data.push(word.trim());
    setExtraFields(newFields);
    setCurrentWord("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddWord(index, currentWord);
    }
  };

  const handleRemoveWord = (fieldIndex: number, wordIndex: number) => {
    const newFields = [...extraFields];
    newFields[fieldIndex].data.splice(wordIndex, 1);
    setExtraFields(newFields);
  };

  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };

  useEffect(() => {
    if (selectedSubPlan && cleanSubList) {
      const updatedPlan = cleanSubList.find((plan: PlanClean) => plan._id === selectedSubPlan._id);
      if (updatedPlan) {
        setSelectedSubPlan(updatedPlan);
      }
    }
  }, [cleanSubList]);

  const handleRemoveField = async (planId: string) => {
    try {
      const { status, error, message } = await authenticatedFetch("/plan-clean/" + planId, {
        method: "DELETE",
      });
      if (error) {
        throw new Error(formatErrorMessage(message));
      }
      if (status === "success") {
        showSuccess(message);
        // بعد از حذف، لیست را به‌روز می‌کنیم اما clean انتخاب شده را حفظ می‌کنیم
        if (selectedClean) {
          await fetchCleanList();
        }
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    }
  };

  const handleSubmit = async () => {
    if (!selectedClean) {
      showError("لطفا یک کلین را انتخاب کنید");
      return;
    }
    if (!price) {
      showError("فیلد قیمت خالی است.");
      return;
    }
    if (!title) {
      showError("فیلد تایتل خالی است.");
      return;
    }

    const data = {
      data: {
        title,
        data: extraFields.map((field) => ({
          id: field.id,
          title: field.title,
          count: field.count,
          data: field.data,
        })),
      },
      id_clean: selectedClean._id,
      globalDiscount,
      price,
    };

    await onSubmit(data);
    await fetchCleanList(); // اضافه کردن await

    // ریست کردن فرم بدون تغییر selectedClean
    setTitle("");
    setGlobalDiscount(0);
    setPrice(0);
    setExtraFields([]);
  };

  const handleEditSuccess = () => {
    fetchCleanList();
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">پلن بل کلین</h2>
        <div className="mb-2">
          <DashboardInput
            type="text"
            label="تایتل"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <DashboardInput
            type="text"
            label="تخفیف همگانی (%)"
            placeholder="50"
            value={globalDiscount}
            inputMode="numeric"
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, "");

              if (Number(value) > 100) value = "100";

              setGlobalDiscount(Number(value));
            }}
          />
        </div>

        <div className="mb-2">
          <DashboardInput
            type="text"
            label="قیمت (تومان)"
            placeholder="250,000"
            value={price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}
            inputMode="numeric"
            onChange={(e) => {
              const value = e.target.value.replace(/,/g, ""); // حذف کاماها
              const isValid = /^\d*$/.test(value); // بررسی فقط اعداد

              if (isValid) {
                setPrice(Number(value));
              } else {
                showError("لطفاً فقط از اعداد استفاده کنید.");
              }
            }}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-2">انتخاب کلین</label>
          <div className="grid grid-cols-1 gap-4">
            {cleanList.map((clean: Clean) => (
              <div
                key={clean._id}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  selectedClean?._id === clean._id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                } cursor-pointer`}
                onClick={() => setSelectedClean(clean)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${clean.id_stores[0].location}`}
                      alt={clean.data.title}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{clean.data.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1 w-[10rem]">
                      {clean.data["short-description"]}
                    </p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center">
                  {selectedClean?._id === clean._id && (
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <div className="w-full flex flex-row justify-between items-center mb-4">
            <label className="block font-semibold">فیلد های اضافه</label>
            <DashboardButton
              variant="secondary"
              iconColor="black"
              icon="plus"
              onXsIsText
              onClick={handleAddField}
            />
          </div>

          {extraFields.map((field, index) => (
            <div key={field.id} className="border p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <DashboardInput
                  label="عنوان"
                  type="text"
                  value={field.title}
                  onChange={(e) => handleFieldChange(index, "title", e.target.value)}
                />
                <DashboardInput
                  label="تعداد"
                  type="number"
                  value={field.count}
                  onChange={(e) => handleFieldChange(index, "count", e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">کلمات و توضیحات</label>
                <div className="flex gap-2 mb-2">
                  <DashboardInput
                    type="text"
                    value={currentWord}
                    onChange={(e) => setCurrentWord(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e as any, index)}
                    placeholder="کلمه یا توضیح را وارد کنید و اینتر بزنید"
                  />
                  <DashboardButton
                    variant="secondary"
                    onXsIsText
                    onClick={() => handleAddWord(index, currentWord)}
                  >
                    افزودن
                  </DashboardButton>
                </div>

                <div className="flex flex-wrap gap-2">
                  {field.data.map((word, wordIndex) => (
                    <div
                      key={wordIndex}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      <span>{word}</span>
                      <button
                        onClick={() => handleRemoveWord(index, wordIndex)}
                        className="text-blue-800 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full flex-row justify-end mt-12">
          <DashboardButton onXsIsText onClick={handleSubmit} disabled={!selectedClean || loading}>
            ثبت تغییرات
          </DashboardButton>
        </div>
        <div className="">
          <p className="font-bold mb-7 text-lg">لیست پکیج بل کلین</p>
          {cleanSubList?.map((clean: PlanClean, index: number) => (
            <div key={index} className="mb-4">
              {loading ? (
                <>در حال بارگزاری</>
              ) : (
                <div className="w-full flex flex-row justify-between items-center border border-black p-4 rounded-xl">
                  <div
                    className="flex flex-row gap-4 items-center"
                    onClick={() => {
                      setSelectedSubPlan(clean);
                      setOpen(true);
                    }}
                  >
                    <div>
                      <div className="w-16 h-16 bg-gray-400 rounded-2xl"></div>
                    </div>
                    <div className="flex flex-col">
                      <p className="line-clamp-1 w-[7rem]">{clean.data.title}</p>
                      <p className="text-xs">{clean.price}</p>
                      <p className="text-xs">{clean.globalDiscount}%</p>
                    </div>
                  </div>
                  <div>
                    <DashboardButton
                      variant="secondary"
                      isError
                      className="border-[1.5px] border-red-500 rounded-2xl !px-3 !py-6"
                      icon="trash"
                      onXsIsText
                      onClick={() => handleRemoveField(clean._id)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <EditPlanCleanModal
        isOpen={open}
        onClose={() => setOpen(false)}
        selectedPlan={selectedSubPlan}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default PlanCleanForm;
