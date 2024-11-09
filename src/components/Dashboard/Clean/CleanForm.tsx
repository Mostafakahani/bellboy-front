import { Clean } from "@/app/dashboard/clean/create/page";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import React, { useState } from "react";
import { DashboardInput } from "../DashboardInput";
import FileUploaderComponent, { FileData } from "@/components/FileUploader/FileUploader";
import DashboardButton from "@/components/ui/Button/DashboardButton";
import { showError, showSuccess } from "@/lib/toastService";

interface ExtraField {
  key: string;
  value: string;
}

interface CleanFormProps {
  onSubmit: (data: any) => void;
  cleanData: Clean[] | undefined;
  loading: boolean;
  fetchCleanList: () => void;
}

const CleanForm: React.FC<CleanFormProps> = ({ onSubmit, cleanData, loading, fetchCleanList }) => {
  const authenticatedFetch = useAuthenticatedFetch();

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [extraFields, setExtraFields] = useState<ExtraField[]>([]);
  const [formData, setFormData] = useState<any>({ selectedFile: [] });
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const handleRemoveFile = (fileId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      selectedFiles: prev.selectedFiles?.filter((file: any) => file._id !== fileId),
    }));
  };
  const handleAddField = () => {
    const newField: ExtraField = { key: `extraField${extraFields.length + 1}`, value: "" };
    setExtraFields([...extraFields, newField]);
  };
  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      console.log({ message });
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };
  const handleRemoveField = async (id: string) => {
    try {
      const { status, error, message } = await authenticatedFetch("/clean/" + id, {
        method: "DELETE",
      });
      if (error) {
        throw new Error(formatErrorMessage(message));
      }
      if (status === "success") {
        fetchCleanList();
        showSuccess(message);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    }
  };

  const handleFieldChange = (index: number, value: string) => {
    const newFields = [...extraFields];
    newFields[index].value = value;
    setExtraFields(newFields);
  };

  const handleSubmit = () => {
    const data = {
      data: {
        title,
        "short-description": shortDescription,
        data: extraFields.map((field) => ({
          key: field.key,
          value: field.value,
        })),
      },
      id_stores: formData.selectedFiles.map((x: any) => x._id),
    };
    setTitle("");
    setFormData([]);
    setShortDescription("");
    setExtraFields([]);

    onSubmit(data);
  };

  const handleFileSelect = (files: FileData[]) => {
    setFormData((prev: any) => ({
      ...prev,
      selectedFiles: [
        ...(prev.selectedFiles || []),
        ...files.filter(
          (file) => !prev.selectedFiles?.some((existing: any) => existing._id === file._id)
        ),
      ],
    }));
    setIsGalleryOpen(false);
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4"> پکیج بل کلین</h2>
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
            label="توضیحات کوتاه"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm">تصاویر محصول</p>
              <DashboardButton
                onXsIsText
                type="button"
                variant="secondary"
                onClick={() => setIsGalleryOpen(true)}
              >
                انتخاب تصویر
              </DashboardButton>
            </div>

            <FileUploaderComponent
              isOpenModal={isGalleryOpen}
              setIsOpenModal={setIsGalleryOpen}
              onFileSelect={handleFileSelect}
              initialSelectedFiles={formData.selectedFiles}
            />
            <div className="grid grid-cols-1 gap-4">
              {formData?.selectedFiles &&
                formData.selectedFiles.length > 0 &&
                formData.selectedFiles.map((item: any, index: any) => (
                  <div
                    key={index} // Add a key to the top-level element inside map for better rendering
                    className="flex gap-4 items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                  >
                    <div className="bg-gray-200 rounded-lg w-12 h-12 overflow-hidden">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${item.location}`} // Use `item` to access properties
                        alt={item.name} // Use `item` for alt text
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-right line-clamp-1">{item.name}</p>{" "}
                      {/* Use `item` for name */}
                      <span className="text-gray-400 text-xs">{item.size}</span>{" "}
                      {/* Use `item` for size */}
                    </div>
                    <DashboardButton
                      variant="tertiary"
                      className="border-[1.5px] border-red-500 rounded-2xl !px-3 !py-6"
                      icon="trash"
                      onClick={() => {
                        if (formData?.selectedFiles && formData.selectedFiles.length > 0) {
                          handleRemoveFile(item._id); // Use `item` to get the _id for removal
                        }
                      }}
                      disabled={loading}
                    />
                  </div>
                ))}
            </div>
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
          <DashboardButton onXsIsText onClick={handleSubmit}>
            ثبت تغییرات
          </DashboardButton>
        </div>
      </div>
      <div className="p-4">
        <p className="font-bold mb-7 text-lg">لیست پکیج بل کلین</p>
        {cleanData?.map((clean, index) => (
          <div key={index} className="mb-4">
            {loading ? (
              <>در حال بارگزاری</>
            ) : (
              <div className="w-full flex flex-row justify-between items-center border border-black p-4 rounded-xl">
                <div className="flex flex-row gap-4 items-center">
                  <div>
                    <div className="w-16 h-16 bg-gray-400 rounded-2xl"></div>
                  </div>
                  <div className="flex flex-col">
                    <p className="line-clamp-1 w-[7rem]">{clean.data.title}</p>
                    <p className="text-xs line-clamp-1 w-[7rem]">
                      {clean.data["short-description"]}
                    </p>
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
  );
};

export default CleanForm;
