"use client";
import React, { useState, useEffect } from "react";
import { DashboardInput } from "@/components/Dashboard/DashboardInput";
import DashboardButton from "@/components/ui/Button/DashboardButton";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError, showSuccess } from "@/lib/toastService";
import { Switch } from "@/components/ui/Input/Switch";
import { Check, ChevronLeft } from "lucide-react";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import FileUploaderComponent, { FileData } from "@/components/FileUploader/FileUploader";
import { getCookie } from "cookies-next";

interface Category {
  _id: string;
  name: string;
  isParent: boolean;
  path: string;
  photo: string;
  IsShow: boolean;
  layer: number;
}

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  stock: string;
  id_categories: string[];
  TastingTray: boolean;
  globalDiscount: string;
  selectedFiles: FileData[]; // تغییر به FileData[]
}

const CreateProductForm = () => {
  const authenticatedFetch = useAuthenticatedFetch();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState<Category | null>(null);
  const [childCategories, setChildCategories] = useState<Category[] | null>();
  const [selectedChildCategories, setSelectedChildCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    price: "",
    stock: "",
    id_categories: [],
    TastingTray: false,
    globalDiscount: "",
    selectedFiles: [], // تغییر نام از files به selectedFiles
  });
  const [loading, setLoading] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleFileSelect = (files: FileData[]) => {
    setFormData((prev) => {
      // استخراج شناسه‌های فایل‌های فعلی
      const existingFileIds = prev.selectedFiles.map((file) => file._id);

      // فیلتر کردن فایل‌های جدید که قبلاً در لیست موجود نیستند
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await authenticatedFetch<Category[] | any>("/category");
      const parentCategories = data.filter((category: Category) => category.isParent);
      setCategories(parentCategories);
    } catch (error) {
      console.log(error);
      showError("خطا در دریافت دسته‌بندی‌ها");
    }
  };
  const handleParentCategorySelect = async (category: Category) => {
    try {
      const { data } = await authenticatedFetch<Category[] | null>(`/category/${category._id}`);
      setSelectedParentCategory(category); // Store the parent category
      setChildCategories(data); // Store the child categories
      setSelectedChildCategories([]);
      setFormData((prev) => ({
        ...prev,
        id_categories: [],
      }));
    } catch (error) {
      console.log(error);
      showError("خطا در دریافت زیردسته‌بندی‌ها");
    }
  };

  const handleInputChange = (name: keyof ProductFormData, value: string | boolean | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTastingTrayChange = (checked: boolean) => {
    console.log("TastingTray changing to:", checked); // Debug log
    setFormData((prev) => ({
      ...prev,
      TastingTray: checked,
      id_categories: checked ? [] : prev.id_categories,
    }));

    if (checked) {
      handleResetCategorySelection();
    }
  };
  const handleChildCategoryToggle = (childCategory: Category) => {
    const isSelected = selectedChildCategories.some((c) => c._id === childCategory._id);

    if (isSelected) {
      // Remove if already selected
      setSelectedChildCategories((prev) => prev.filter((c) => c._id !== childCategory._id));
      setFormData((prev) => ({
        ...prev,
        id_categories: prev.id_categories.filter((id) => id !== childCategory._id),
      }));
    } else {
      // Add if not selected
      setSelectedChildCategories((prev) => [...prev, childCategory]);
      setFormData((prev) => ({
        ...prev,
        id_categories: [...prev.id_categories, childCategory._id],
      }));
    }
  };

  const handleResetCategorySelection = () => {
    setSelectedParentCategory(null);
    setChildCategories([]);
    setSelectedChildCategories([]);
    setFormData((prev) => ({
      ...prev,
      id_categories: [],
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = getCookie("auth_token");
    if (!token) return;
    try {
      // اعتبارسنجی فیلدها
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

      const form = new FormData();

      // افزودن فیلدهای ساده
      form.append("title", formData.title.trim());
      form.append("description", formData.description.trim());
      form.append("price", formData.price);
      form.append("stock", formData.stock);
      form.append("TastingTray", String(formData.TastingTray));

      // افزودن globalDiscount فقط اگر مقدار داشته باشد
      if (formData.globalDiscount) {
        form.append("globalDiscount", formData.globalDiscount);
      }

      // افزودن دسته‌بندی‌ها به صورت یک آرایه واحد
      if (formData.id_categories.length > 0) {
        form.append("id_categories", JSON.stringify(formData.id_categories));
      }

      // افزودن آرایه‌ای از شناسه‌های فایل‌ها
      const fileIds = formData.selectedFiles.map((file) => file._id);
      form.append("id_stores", JSON.stringify(fileIds));

      const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/product", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await response.json();

      if (data.status === "success") {
        showSuccess("محصول با موفقیت ایجاد شد");
        // Reset form or redirect
      } else {
        throw new Error(data.message || "خطا در ایجاد محصول");
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : "خطا در ارسال اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardHeader />

      <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-gray-100">
        <DashboardInput
          label="عنوان کالا"
          value={formData.title}
          onChange={(e) => {
            handleInputChange("title", e.target.value);
            console.log(categories);
          }}
        />

        <DashboardInput
          label="توضیحات"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          variant="textarea"
        />

        <DashboardInput
          label="موجودی"
          value={formData.stock}
          onChange={(e) => handleInputChange("stock", e.target.value)}
          type="number"
        />
        <div className="flex flex-row gap-x-4 justify-between items-center">
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
          />

          <DashboardInput
            label="تخفیف (%)"
            value={formData.globalDiscount}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, "");
              if (Number(value) > 100) value = "100";
              setFormData((prev) => ({
                ...prev,
                globalDiscount: value,
              }));
            }}
            type="text"
            inputMode="numeric"
          />

          {formData.price && formData.globalDiscount ? (
            <div className="flex flex-col items-end justify-center">
              <span className="text-gray-400 line-through text-sm">
                {Number(formData.price).toLocaleString()}
              </span>
              <span className="text-sm">
                {Math.round(
                  Number(formData.price) * (1 - Number(formData.globalDiscount) / 100)
                ).toLocaleString()}{" "}
              </span>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tasting Tray</span>
            <Switch
              checked={formData.TastingTray}
              onCheckedChange={handleTastingTrayChange}
              disabled={formData.id_categories.length > 0}
            />
          </div>

          {!formData.TastingTray && (
            <div className="space-y-4">
              {!selectedParentCategory ? (
                <div>
                  <p className="text-sm font-medium mb-4">انتخاب دسته اصلی</p>
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((category) => (
                      <button
                        key={category._id}
                        type="button"
                        onClick={() => handleParentCategorySelect(category)}
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-grow">
                          <p className="font-medium">{category.name}</p>
                          <p className="text-xs text-gray-500">{category.path}</p>
                        </div>
                        <ChevronLeft className="text-gray-400" size={20} />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium">
                        زیردسته‌های {selectedParentCategory.name}
                      </p>
                      <button
                        type="button"
                        onClick={handleResetCategorySelection}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        بازگشت به دسته‌های اصلی
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {childCategories?.map((childCategory) => (
                      <button
                        key={childCategory._id}
                        type="button"
                        onClick={() => handleChildCategoryToggle(childCategory)}
                        className={`flex items-center p-3 rounded-lg border transition-colors ${
                          selectedChildCategories.some((c) => c._id === childCategory._id)
                            ? "bg-blue-50 border-blue-300"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex-grow">
                          <p className="font-medium">{childCategory.name}</p>
                          <p className="text-xs text-gray-500">{childCategory.path}</p>
                        </div>
                        {selectedChildCategories.some((c) => c._id === childCategory._id) && (
                          <Check className="text-blue-600" size={20} />
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedChildCategories.length > 0 && (
                    <div className="mt-4 text-sm text-gray-600">
                      تعداد زیردسته‌های انتخاب شده: {selectedChildCategories.length}
                    </div>
                  )}
                </div>
              )}
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

          <div className="flex flex-col gap-y-6 pb-4">
            {formData.selectedFiles.map((file) => (
              <div className="flex gap-x-4 items-center justify-between" key={file._id}>
                <div>
                  <div className="bg-gray-200 rounded-lg w-12 h-12 overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${file.location}`}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <p className="text-right line-clamp-1 max-w-[200px]">{file.name}</p>
                  <span className="text-gray-400 text-xs">{file.size}</span>
                </div>
                <div>
                  <DashboardButton
                    variant="tertiary"
                    className="border-[1.5px] border-red-500 rounded-2xl !px-3 !py-6"
                    icon="trash"
                    onClick={() => handleRemoveFile(file._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <DashboardButton type="submit" className="w-full" onXsIsText disabled={loading}>
          {loading ? "در حال ارسال..." : "ایجاد محصول"}
        </DashboardButton>
      </form>
    </>
  );
};

export default CreateProductForm;
