"use client";
import React, { useState, useEffect } from "react";
import { DashboardInput } from "@/components/Dashboard/DashboardInput";
import DashboardButton from "@/components/ui/Button/DashboardButton";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError, showSuccess } from "@/lib/toastService";
import { Switch } from "@/components/ui/Input/Switch";
import { Check, ChevronLeft } from "lucide-react";

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
  files: File[];
}

const CreateProductForm = () => {
  const authenticatedFetch = useAuthenticatedFetch();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState<Category | null>(null);
  // Changed to store child categories
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
    files: [],
  });
  const [loading, setLoading] = useState(false);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...files],
    }));
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  // const handleTastingTrayChange = (checked: boolean) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     TastingTray: checked,
  //     // Clear categories when enabling TastingTray
  //     id_categories: checked ? [] : prev.id_categories,
  //   }));
  // };
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

    try {
      // اعتبارسنجی فیلدها
      if (!formData.title.trim()) throw new Error("عنوان کالا الزامی است");
      if (!formData.description.trim()) throw new Error("توضیحات کالا الزامی است");
      if (!formData.price.trim()) throw new Error("قیمت کالا الزامی است");
      if (!formData.stock.trim()) throw new Error("موجودی کالا الزامی است");
      if (!formData.TastingTray && formData.id_categories.length === 0) {
        throw new Error("انتخاب حداقل یک دسته‌بندی الزامی است");
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

      // افزودن فایل‌ها
      formData.files.forEach((file) => {
        form.append("files", file);
      });

      const { message, status } = await authenticatedFetch("/product", {
        method: "POST",
        body: form,
      });

      if (status === "success") {
        showSuccess("محصول با موفقیت ایجاد شد");
        // Reset form or redirect
      } else {
        throw new Error(message || "خطا در ایجاد محصول");
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : "خطا در ارسال اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 p-4">
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

        <div className="grid grid-cols-2 gap-4">
          <DashboardInput
            label="قیمت (تومان)"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            type="number"
          />

          <DashboardInput
            label="موجودی"
            value={formData.stock}
            onChange={(e) => handleInputChange("stock", e.target.value)}
            type="number"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tasting Tray</span>
            <Switch
              checked={formData.TastingTray}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({
                  ...prev,
                  TastingTray: checked,
                  id_categories: checked ? [] : prev.id_categories,
                }));
                handleResetCategorySelection();
              }}
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
          <p className="text-sm font-medium">تصاویر محصول</p>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer inline-block px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            انتخاب فایل
          </label>

          <div className="grid grid-cols-2 gap-4">
            {formData.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        </div>
        <DashboardButton type="submit" className="w-full" disabled={loading}>
          {loading ? "در حال ارسال..." : "ایجاد محصول"}
        </DashboardButton>
      </form>
    </>
  );
};

export default CreateProductForm;
