import React, { useEffect, useState, KeyboardEvent } from "react";
import { Modal } from "@/components/BellMazeh/Modal";
import { DashboardInput } from "../DashboardInput";
import DashboardButton from "@/components/ui/Button/DashboardButton";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError, showSuccess } from "@/lib/toastService";
import { PlanClean } from "@/app/dashboard/clean/plan-clean/page";

interface ExtraField {
  id: number;
  title: string;
  count: number;
  data: string[];
}

interface EditPlanCleanModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PlanClean | undefined;
  onSuccess: () => void;
}

const EditPlanCleanModal: React.FC<EditPlanCleanModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  onSuccess,
}) => {
  const authenticatedFetch = useAuthenticatedFetch();
  const [title, setTitle] = useState("");
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [price, setPrice] = useState(0);
  const [extraFields, setExtraFields] = useState<ExtraField[]>([]);
  const [currentWord, setCurrentWord] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPlan) {
      setTitle(selectedPlan.data.title);
      setGlobalDiscount(selectedPlan.globalDiscount);
      setPrice(selectedPlan.price);

      // Convert the existing data to new format
      const fields = Array.isArray(selectedPlan.data.data) ? selectedPlan.data.data : [];

      setExtraFields(
        fields.map((field: any, index: number) => ({
          id: field.id || index + 1,
          title: field.title || "",
          count: field.count || 0,
          data: Array.isArray(field.data) ? field.data : [],
        }))
      );
    }
  }, [selectedPlan]);

  const handleAddField = () => {
    const newField: ExtraField = {
      id: extraFields.length + 1,
      title: "",
      count: 0,
      data: [],
    };
    setExtraFields([...extraFields, newField]);
  };

  const handleFieldChange = (index: number, fieldName: keyof ExtraField, value: any) => {
    const newFields = [...extraFields];
    if (fieldName === "count") {
      newFields[index] = {
        ...newFields[index],
        [fieldName]: Number(value),
      };
    } else {
      newFields[index] = {
        ...newFields[index],
        [fieldName]: value,
      };
    }
    setExtraFields(newFields);
  };

  const handleAddWord = (index: number, word: string) => {
    if (!word.trim()) return;

    const newFields = [...extraFields];
    newFields[index] = {
      ...newFields[index],
      data: [...newFields[index].data, word.trim()],
    };
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
    newFields[fieldIndex].data = newFields[fieldIndex].data.filter((_, idx) => idx !== wordIndex);
    setExtraFields(newFields);
  };

  const handleRemoveField = (index: number) => {
    setExtraFields(extraFields.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    if (!selectedPlan) return;

    try {
      setLoading(true);

      const updateData = {
        data: {
          title,
          data: extraFields.map((field) => ({
            id: field.id,
            title: field.title,
            count: field.count,
            data: field.data,
          })),
        },
        id_clean: selectedPlan.id_clean._id,
        globalDiscount,
        price,
      };

      const { error, message } = await authenticatedFetch(`/plan-clean/${selectedPlan._id}`, {
        method: "PATCH",
        body: JSON.stringify(updateData),
      });

      if (error) {
        throw new Error(Array.isArray(message) ? message.join(" ") : message);
      }

      showSuccess("با موفقیت بروزرسانی شد");
      onSuccess();
      onClose();
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در بروزرسانی");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">ویرایش پلن</h2>

        <div className="space-y-4">
          <DashboardInput
            type="text"
            label="عنوان"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

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

          <DashboardInput
            type="number"
            label="قیمت"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="font-semibold">فیلدهای اضافه</label>
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

                <div className="flex justify-end">
                  <DashboardButton
                    variant="secondary"
                    isError
                    icon="trash"
                    onXsIsText
                    onClick={() => handleRemoveField(index)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-8">
            <DashboardButton onXsIsText variant="secondary" onClick={onClose} disabled={loading}>
              انصراف
            </DashboardButton>
            <DashboardButton onXsIsText onClick={handleSubmit} disabled={loading}>
              ذخیره تغییرات
            </DashboardButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditPlanCleanModal;
