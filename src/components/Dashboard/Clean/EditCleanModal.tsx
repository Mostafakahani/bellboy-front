import React, { useEffect, useState } from "react";
import { Modal } from "@/components/BellMazeh/Modal";
import { DashboardInput } from "../DashboardInput";
import DashboardButton from "@/components/ui/Button/DashboardButton";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError, showSuccess } from "@/lib/toastService";
import { Clean } from "@/app/dashboard/clean/create/page";
import FileUploaderComponent, { FileData } from "@/components/FileUploader/FileUploader";

interface ExtraField {
  key: string;
  value: string;
}

interface EditCleanModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: Clean | undefined;
  onSuccess: () => void;
}

const EditCleanModal: React.FC<EditCleanModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  onSuccess,
}) => {
  const authenticatedFetch = useAuthenticatedFetch();
  const [title, setTitle] = useState("");
  const [idStores, setIdStores] = useState<FileData[]>([]);
  const [shortDesc, setShortDesc] = useState<string>();
  const [extraFields, setExtraFields] = useState<ExtraField[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGalleryOpenEdit, setIsGalleryOpenEdit] = useState(false);
  const handleFileSelectEdit = (files: FileData[]) => {
    if (files.length > 0) {
      setIdStores(files);
      console.log({ idStores });
    }
    setIsGalleryOpenEdit(false);
  };
  useEffect(() => {
    if (selectedPlan) {
      setTitle(selectedPlan.data.title);
      // Ensure `idStores` is an array
      setIdStores(Array.isArray(selectedPlan.id_stores) ? selectedPlan.id_stores : []);
      setShortDesc(selectedPlan.data["short-description"]);

      // Convert the existing data to new format
      const fields = Array.isArray(selectedPlan.data.data) ? selectedPlan.data.data : [];

      setExtraFields(
        fields.map((field: ExtraField) => ({
          key: field.key,
          value: field.value,
        }))
      );
    }
  }, [selectedPlan]);

  const handleAddField = () => {
    const newField: ExtraField = {
      key: `extraField${extraFields.length + 1}`,
      value: "",
    };
    setExtraFields([...extraFields, newField]);
  };

  const handleFieldChange = (index: number, fieldName: keyof ExtraField, value: any) => {
    const newFields = [...extraFields];

    newFields[index] = {
      ...newFields[index],
      [fieldName]: value,
    };

    setExtraFields(newFields);
  };

  const handleRemoveField = (index: number) => {
    setExtraFields(extraFields.filter((_, idx) => idx !== index));
  };
  const handleRemoveFile = (fileId: string) => {
    setIdStores((prev) => {
      // Ensure prev is an array before filtering
      if (!Array.isArray(prev)) {
        return []; // Return an empty array if prev is not an array
      }
      // Filter out the file with the given fileId
      return prev.filter((file) => file._id !== fileId);
    });
  };

  const handleSubmit = async () => {
    if (!selectedPlan) return;

    try {
      setLoading(true);

      const updateData = {
        data: {
          title,
          "short-description": shortDesc,
          data: extraFields.map((field) => ({
            key: field.key,
            value: field.value,
          })),
        },
        id_stores: idStores.map((x) => x._id),
      };

      const { error, message } = await authenticatedFetch(`/clean/${selectedPlan._id}`, {
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
    <Modal isOpen={isOpen} onClose={onClose} title="ویرایش پلن">
      <div className="px-6 pb-6">
        <h2 className="text-xl font-bold mb-6">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">تصاویر محصول</p>
            <DashboardButton
              onXsIsText
              type="button"
              variant="secondary"
              onClick={() => setIsGalleryOpenEdit(true)}
            >
              انتخاب تصویر
            </DashboardButton>
          </div>
          <FileUploaderComponent
            isOpenModal={isGalleryOpenEdit}
            setIsOpenModal={setIsGalleryOpenEdit}
            onFileSelect={handleFileSelectEdit}
            initialSelectedFiles={Array.isArray(idStores) ? idStores : []}
          />
          <div className="grid grid-cols-1 gap-4">
            {idStores.length !== 0 &&
              idStores?.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                >
                  <div className="bg-gray-200 rounded-lg w-12 h-12 overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${item.location}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <p className="text-right text-xs line-clamp-1">{item.name}</p>
                    <span className="text-gray-400 text-xs text-right w-full">{item.size}</span>
                  </div>
                  <DashboardButton
                    variant="tertiary"
                    className="border-[1.5px] border-red-500 rounded-2xl !px-3 !py-6"
                    icon="trash"
                    onClick={() => {
                      if (item) {
                        handleRemoveFile(item._id);
                      }
                    }}
                    disabled={loading}
                  />
                </div>
              ))}
          </div>
        </h2>

        <div className="space-y-4">
          <DashboardInput
            type="text"
            label="عنوان"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <DashboardInput
            type="text"
            label="توضیحات کوتاه"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
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
              <div key={index} className="border p-4 rounded-lg mb-4">
                <DashboardInput
                  label="عنوان"
                  type="text"
                  value={field.value}
                  onChange={(e) => handleFieldChange(index, "value", e.target.value)}
                />

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

export default EditCleanModal;
