import React, { useState } from "react";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { DashboardInput } from "../DashboardInput";
import DashboardButton from "@/components/ui/Button/DashboardButton";
import { showError, showSuccess } from "@/lib/toastService";
import { PlanClean } from "@/app/dashboard/clean/plan-clean/page";
import EditPlanCleanModal from "./EditPlanCleanModal";

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
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [price, setPrice] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedSubPlan, setSelectedSubPlan] = useState<PlanClean>();
  const [extraFields, setExtraFields] = useState<{ key: string; value: string }[]>([]);

  const handleAddField = () => {
    const newField = { key: `extraField${extraFields.length + 1}`, value: "" };
    setExtraFields([...extraFields, newField]);
  };

  const handleFieldChange = (index: number, value: string) => {
    const newFields = [...extraFields];
    newFields[index].value = value;
    setExtraFields(newFields);
  };
  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      console.log({ message });
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };
  const handleRemoveField = async (planId: string, cleanId: string) => {
    try {
      const { status, error, message } = await authenticatedFetch("/plan-clean/" + planId, {
        method: "DELETE",
      });
      if (error) {
        throw new Error(formatErrorMessage(message));
      }
      if (status === "success") {
        setSelectedClean(cleanId);
        showSuccess(message);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    }
  };
  const handleSubmit = () => {
    if (!selectedClean) {
      showError("لطفا یک کلین را انتخاب کنید");
      return;
    }

    const data = {
      data: {
        title,
        data: extraFields.map((field) => ({
          key: field.key,
          value: field.value,
        })),
      },
      id_clean: selectedClean._id,
      globalDiscount,
      price,
    };

    setTitle("");
    setSelectedClean(null);
    setGlobalDiscount(0);
    setPrice(0);
    setExtraFields([]);

    onSubmit(data);
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
            label="تخفیف همگانی (درصد)"
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
            type="number"
            label="قیمت"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-2">انتخاب کلین</label>
          <div className="grid grid-cols-1 gap-4">
            {cleanList.map((clean: any) => (
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
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
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
            <div key={index} className="w-full flex space-x-2 mb-2">
              <DashboardInput
                label={String(index + 1)}
                type="text"
                placeholder="مقدار"
                value={field.value}
                className="w-full"
                onChange={(e) => handleFieldChange(index, e.target.value)}
              />
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
                      onClick={() => handleRemoveField(clean._id, clean.id_clean._id)}
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
