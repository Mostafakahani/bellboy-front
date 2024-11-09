import React, { useEffect, useState } from "react";
import { Modal } from "@/components/BellMazeh/Modal";
import { DashboardInput } from "../DashboardInput";
import DashboardButton from "@/components/ui/Button/DashboardButton";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError, showSuccess } from "@/lib/toastService";
import { PlanClean } from "@/app/dashboard/clean/plan-clean/page";

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
  const [extraFields, setExtraFields] = useState<{ key: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPlan) {
      setTitle(selectedPlan.data.title);
      setGlobalDiscount(selectedPlan.globalDiscount);
      setPrice(selectedPlan.price);
      // Convert the data object to array of key-value pairs
      const fields = selectedPlan.data.data
        ? Object.entries(selectedPlan.data.data).map(([key, value]) => ({
            key,
            value: String(value),
          }))
        : [];
      setExtraFields(fields);
    }
  }, [selectedPlan]);

  const handleAddField = () => {
    const newField = { key: `extraField${extraFields.length + 1}`, value: "" };
    setExtraFields([...extraFields, newField]);
  };

  const handleFieldChange = (index: number, field: "key" | "value", value: string) => {
    const newFields = [...extraFields];
    newFields[index][field] = value;
    setExtraFields(newFields);
  };

  const handleRemoveField = (index: number) => {
    const newFields = [...extraFields];
    newFields.splice(index, 1);
    setExtraFields(newFields);
  };

  const handleSubmit = async () => {
    if (!selectedPlan) return;

    try {
      setLoading(true);

      // Convert extraFields array to object format
      const dataObject = extraFields.reduce((acc, field) => {
        acc[field.key] = field.value;
        return acc;
      }, {} as Record<string, string>);

      const updateData = {
        data: {
          title,
          data: dataObject,
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
              <div key={index} className="flex gap-2">
                <DashboardInput
                  label="کلید"
                  type="text"
                  value={field.key}
                  onChange={(e) => handleFieldChange(index, "key", e.target.value)}
                  className="flex-1"
                />
                <DashboardInput
                  label="مقدار"
                  type="text"
                  value={field.value}
                  onChange={(e) => handleFieldChange(index, "value", e.target.value)}
                  className="flex-1"
                />
                <DashboardButton
                  variant="secondary"
                  isError
                  icon="trash"
                  onXsIsText
                  className="mt-6"
                  onClick={() => handleRemoveField(index)}
                />
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
