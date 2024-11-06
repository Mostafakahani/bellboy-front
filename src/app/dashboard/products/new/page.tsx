"use client";
import React, { useState } from "react";
import { DashboardInput } from "@/components/Dashboard/DashboardInput";
import DashboardButton from "@/components/ui/Button/DashboardButton";
// import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError, showSuccess } from "@/lib/toastService";
import { Switch } from "@/components/ui/Input/Switch";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import FileUploaderComponent, { FileData } from "@/components/FileUploader/FileUploader";
import { getCookie } from "cookies-next";
import CategorySelector from "@/components/Dashboard/CategorySelector";

// Interfaces
export interface ProductFormData {
  title: string;
  description: string;
  price: string;
  stock: string;
  id_categories: string[];
  TastingTray: boolean;
  globalDiscount: string;
  selectedFiles: FileData[];
}

const initialFormData: ProductFormData = {
  title: "",
  description: "",
  price: "",
  stock: "",
  id_categories: [],
  TastingTray: false,
  globalDiscount: "",
  selectedFiles: [],
};

const CreateProductForm = () => {
  // Preserved commented sections
  // const authenticatedFetch = useAuthenticatedFetch();
  // const [categories, setCategories] = useState<Category[]>([]);
  // const [selectedParentCategory, setSelectedParentCategory] = useState<Category | null>(null);
  // const [childCategories, setChildCategories] = useState<Category[] | null>();
  // const [selectedChildCategories, setSelectedChildCategories] = useState<Category[]>([]);

  // State management
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  // const [loading, setLoading] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File handling
  const handleFileSelect = (files: FileData[]) => {
    setFormData((prev) => {
      const existingFileIds = prev.selectedFiles.map((file) => file._id);
      const newFiles = files.filter((file) => !existingFileIds.includes(file._id));
      return {
        ...prev,
        selectedFiles: [...prev.selectedFiles, ...newFiles],
      };
    });
    setIsGalleryOpen(false);
  };

  const handleRemoveFile = (fileId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedFiles: prev.selectedFiles.filter((file) => file._id !== fileId),
    }));
  };

  // Form handling
  const handleInputChange = (name: keyof ProductFormData, value: string | boolean | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTastingTrayChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      TastingTray: checked,
      id_categories: checked ? [] : prev.id_categories,
    }));

    if (checked) {
      handleResetCategorySelection();
    }
  };

  // Preserved commented sections for future multi-category implementation
  //// age yerozi mikhast multi kone
  // const handleParentCategorySelect = async (category: Category) => {
  //   // ... preserved code
  // };
  // const handleChildCategoryToggle = (childCategory: Category) => {
  //   // ... preserved code
  // };
  //// END

  const handleResetCategorySelection = () => {
    // setSelectedParentCategory(null);
    // setChildCategories([]);
    // setSelectedChildCategories([]);
    setFormData((prev) => ({
      ...prev,
      id_categories: [],
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) throw new Error("عنوان کالا الزامی است");
    if (!formData.description.trim()) throw new Error("توضیحات کالا الزامی است");
    if (!formData.price.trim()) throw new Error("قیمت کالا الزامی است");
    if (!formData.stock.trim()) throw new Error("موجودی کالا الزامی است");
    if (!formData.TastingTray && formData.id_categories.length === 0) {
      throw new Error("انتخاب حداقل یک دسته‌بندی الزامی است");
    }
    if (formData.selectedFiles.length === 0) {
      throw new Error("انتخاب حداقل یک تصویر الزامی است");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = getCookie("auth_token");

    if (!token) {
      showError("لطفا مجددا وارد شوید");
      return;
    }

    try {
      validateForm();
      const form = new FormData();

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "id_categories" && value.length > 0) {
          form.append(key, JSON.stringify(value));
        } else if (key === "selectedFiles") {
          const fileIds = value.map((file: FileData) => file._id);
          form.append("id_stores", JSON.stringify(fileIds));
        } else if (key === "globalDiscount" && value) {
          form.append(key, value);
        } else if (key !== "selectedFiles") {
          form.append(key, String(value));
        }
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await response.json();

      if (data.status === "success") {
        showSuccess("محصول با موفقیت ایجاد شد");
        setFormData(initialFormData);
      } else {
        throw new Error(data.message || "خطا در ایجاد محصول");
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : "خطا در ارسال اطلاعات");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySelect = (parentId: string, childId: string) => {
    setFormData((prev) => ({
      ...prev,
      id_categories: childId ? [parentId, childId] : [parentId],
    }));
  };

  return (
    <>
      <DashboardHeader />
      <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-6 lg:p-8 bg-gray-100">
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tasting Tray</span>
            <Switch
              checked={formData.TastingTray}
              onCheckedChange={handleTastingTrayChange}
              disabled={formData.id_categories.length > 0 || isSubmitting}
            />
          </div>

          {!formData.TastingTray && (
            <CategorySelector
              onCategorySelect={handleCategorySelect}
              // disabled={loading || isSubmitting}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DashboardInput
              label="عنوان کالا"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              disabled={isSubmitting}
            />

            <DashboardInput
              label="موجودی"
              value={formData.stock}
              onChange={(e) => handleInputChange("stock", e.target.value)}
              type="number"
              disabled={isSubmitting}
            />
          </div>

          <DashboardInput
            label="توضیحات"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            variant="textarea"
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <DashboardInput
              label="قیمت (تومان)"
              value={
                formData?.price ? Number(formData.price.replace(/\D/g, "")).toLocaleString() : ""
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: e.target.value.replace(/\D/g, ""),
                }))
              }
              type="text"
              disabled={isSubmitting}
            />

            <DashboardInput
              label="تخفیف (%)"
              value={formData.globalDiscount}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (Number(value) > 100) value = "100";
                handleInputChange("globalDiscount", value);
              }}
              type="text"
              inputMode="numeric"
              disabled={isSubmitting}
            />

            {formData.price && formData.globalDiscount && (
              <div className="flex flex-col items-end justify-center">
                <span className="text-gray-400 line-through text-sm">
                  {Number(formData.price).toLocaleString()}
                </span>
                <span className="text-sm">
                  {Math.round(
                    Number(formData.price) * (1 - Number(formData.globalDiscount) / 100)
                  ).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">تصاویر محصول</p>
              <DashboardButton
                onXsIsText
                type="button"
                variant="secondary"
                onClick={() => setIsGalleryOpen(true)}
                disabled={isSubmitting}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.selectedFiles.map((file) => (
                <div
                  key={file._id}
                  className="flex gap-4 items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                >
                  <div className="bg-gray-200 rounded-lg w-12 h-12 overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${file.location}`}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-right line-clamp-1">{file.name}</p>
                    <span className="text-gray-400 text-xs">{file.size}</span>
                  </div>
                  <DashboardButton
                    variant="tertiary"
                    className="border-[1.5px] border-red-500 rounded-2xl !px-3 !py-6"
                    icon="trash"
                    onClick={() => handleRemoveFile(file._id)}
                    disabled={isSubmitting}
                  />
                </div>
              ))}
            </div>
          </div>

          <DashboardButton
            type="submit"
            className="w-full transition-all duration-300"
            onXsIsText
            disabled={isSubmitting}
          >
            {isSubmitting ? "در حال ارسال..." : "ایجاد محصول"}
          </DashboardButton>
        </div>
      </form>
    </>
  );
};

export default CreateProductForm;
