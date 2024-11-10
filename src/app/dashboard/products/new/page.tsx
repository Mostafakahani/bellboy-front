"use client";
import React, { useState } from "react";
import { DashboardInput } from "@/components/Dashboard/DashboardInput";
import DashboardButton from "@/components/ui/Button/DashboardButton";
// import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError, showSuccess } from "@/lib/toastService";
import { Switch } from "@/components/ui/Input/Switch";
import FileUploaderComponent, { FileData } from "@/components/FileUploader/FileUploader";
import { getCookie } from "cookies-next";
import CategorySelector, { Category } from "@/components/Dashboard/CategorySelector";
import DashboardHeaderCreateCategory from "@/components/Dashboard/DashboardHeaderCreateCategory";
import { useRouter } from "next/navigation";

// Interfaces
export interface ProductFormData {
  _id?: string;
  title: string;
  description: string;
  price: number | null;
  stock: number | null;
  id_categories: Category[] | any[];
  TastingTray: boolean;
  globalDiscount: string;
  selectedFiles?: FileData[];
  active: boolean;
  id_stores?: any[];
  __v?: any;
}

const initialFormData: ProductFormData = {
  title: "",
  description: "",
  price: null,
  stock: null,
  id_categories: [],
  TastingTray: false,
  globalDiscount: "",
  selectedFiles: [],
  active: true,
};

const CreateProductForm = () => {
  // Preserved commented sections
  // const authenticatedFetch = useAuthenticatedFetch();
  // const [categories, setCategories] = useState<Category[]>([]);
  // const [selectedParentCategory, setSelectedParentCategory] = useState<Category | null>(null);
  // const [childCategories, setChildCategories] = useState<Category[] | null>();
  // const [selectedChildCategories, setSelectedChildCategories] = useState<Category[]>([]);

  // State management
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  // const [loading, setLoading] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File handling
  const handleFileSelect = (files: FileData[]) => {
    setFormData((prev) => {
      const existingFileIds = prev?.id_stores?.map((file) => file._id) || [];
      const newFiles = files.filter((file) => !existingFileIds.includes(file._id));

      return {
        ...prev,
        id_stores: [...(prev?.id_stores || []), ...newFiles],
      };
    });
    setIsGalleryOpen(false);
  };

  const handleRemoveFile = (fileId: string) => {
    setFormData((prev) => ({
      ...prev,
      id_stores: prev.id_stores?.filter((file) => file._id !== fileId),
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
    if (!formData.price) throw new Error("قیمت کالا الزامی است");
    if (!formData.stock) throw new Error("موجودی کالا الزامی است");
    if (!formData.TastingTray && formData.id_categories.length === 0) {
      throw new Error("انتخاب حداقل یک دسته‌بندی الزامی است");
    }
    if (formData.id_stores?.length === 0) {
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === "success") {
        showSuccess("محصول با موفقیت ایجاد شد");
        setFormData(initialFormData);
        router.push("/dashboard/products");
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
      <DashboardHeaderCreateCategory />
      <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-6 lg:p-8 bg-gray-100">
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">سینی مزه</span>
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
              value={formData.stock || ""}
              placeholder="مثال: ۵۰"
              onChange={(e) => {
                const value = e.target.value;
                const isValid = /^\d*$/.test(value); // Check for only numeric characters

                if (!isValid) {
                  showError("لطفاً فقط از اعداد استفاده کنید.");
                } else {
                  handleInputChange("stock", value);
                }
              }}
              type="text"
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

          <div className="grid grid-cols-1 gap-4 items-end">
            <DashboardInput
              label="قیمت (تومان)"
              placeholder="250,000"
              value={
                formData?.price
                  ? formData.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, ""); // حذف کاماها
                const isValid = /^\d*$/.test(value); // بررسی فقط اعداد

                if (isValid) {
                  setFormData((prev) => ({
                    ...prev,
                    price: value ? Number(value) : 0,
                  }));
                } else {
                  showError("لطفاً فقط از اعداد استفاده کنید.");
                }
              }}
              type="text"
              disabled={isSubmitting}
            />
            <DashboardInput
              label="تخفیف (%)"
              value={formData.globalDiscount}
              placeholder="50"
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
              initialSelectedFiles={formData.id_stores}
            />

            <div className="grid grid-cols-1 gap-4">
              {formData.id_stores?.map((file) => (
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
