import React, { useState, useEffect } from "react";
import { SearchIcon, SortIcon, TrashIcon, EditIcon } from "@/icons/Icons";
import { RightMenu } from "../mobile/Menu/RightMenu";
import { DashboardInput } from "./DashboardInput";
import DashboardButton from "../ui/Button/DashboardButton";
import { Dropdown } from "./Dropdown";
import { ProductFormData } from "@/app/dashboard/products/new/page";
import FileUploaderComponent, { FileData } from "../FileUploader/FileUploader";
import { ChevronDownIcon, ChevronUpIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { showError } from "@/lib/toastService";
import { ApiResponse, useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
// types.ts
interface Category {
  _id: string;
  name: string;
  isParent: boolean;
  path: string;
  IsShow: boolean;
  layer: number;
  id_parent?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
const initialFormData: ProductFormData = {
  title: "",
  description: "",
  price: 0,
  stock: 0,
  id_categories: [],
  TastingTray: false,
  globalDiscount: "",
  selectedFiles: [],
  active: true,
};
interface Store {
  _id: string;
  name: string;
  size: string;
  type: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ParentCategory extends Category {
  id_store: Store;
}

export default function DashboardHeaderCreateCategory() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isCreateParentCat, setIsCreateParentCat] = useState(false);
  const [selectedParentCat, setSelectedParentCat] = useState("");
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [categoryChildren, setCategoryChildren] = useState<{ [key: string]: Category[] }>({});
  const [isDeletingCategory, setIsDeletingCategory] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const authenticatedFetch = useAuthenticatedFetch();

  // Form states
  const [parentCatName, setParentCatName] = useState("");
  const [parentCatPath, setParentCatPath] = useState("");
  const [childCatName, setChildCatName] = useState("");
  const [childCatPath, setChildCatPath] = useState("");

  const parentCategoryOptions = parentCategories.map((cat) => ({
    value: cat._id,
    label: cat.name,
  }));

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const fetchCategoriesData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`);
      const data = await response.json();
      setParentCategories(data.filter((cat: Category) => cat.isParent));
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("خطا در دریافت اطلاعات");
      setLoading(false);
    }
  };

  const handleFileSelect = (files: FileData[]) => {
    setFormData((prev) => ({
      ...prev,
      selectedFiles: [
        ...(prev.selectedFiles || []),
        ...files.filter(
          (file) => !prev.selectedFiles?.some((existing) => existing._id === file._id)
        ),
      ],
    }));
    setIsGalleryOpen(false);
  };
  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      console.log({ message });
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };
  const handleRemoveFile = (fileId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedFiles: prev.selectedFiles?.filter((file) => file._id !== fileId),
    }));
  };

  const handleCreateParentCategory = async () => {
    if (formData.selectedFiles?.length === 0) {
      setError("انتخاب یک تصویر الزامی است");
      return;
    }

    try {
      setLoading(true);
      const { error, message, status } = await authenticatedFetch<ApiResponse>("/category", {
        method: "POST",
        body: JSON.stringify({
          name: parentCatName,
          path: parentCatPath,
          isParent: true,
          id_store: formData.selectedFiles ? formData.selectedFiles[0]._id : null,
        }),
      });

      if (error) {
        setLoading(false);
        throw new Error(formatErrorMessage(message));
      }
      if (status === "success") {
        setParentCatName("");
        setParentCatPath("");
        setIsCreateParentCat(false);
        setFormData(initialFormData);
        fetchCategoriesData();
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };
  const handleCreateChildCategory = async () => {
    if (!selectedParentCat) return;

    try {
      const { error, message, status } = await authenticatedFetch<ApiResponse>(
        "/category/" + selectedParentCat,
        {
          method: "POST",
          body: JSON.stringify({
            name: childCatName,
            path: childCatPath,
          }),
        }
      );

      if (error) {
        setLoading(false);
        throw new Error(formatErrorMessage(message));
      }
      if (status === "success") {
        setChildCatName("");
        setChildCatPath("");
        setSelectedParentCat("");
        fetchCategoryChildren(selectedParentCat);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryChildren = async (parentId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${parentId}`);
      const data = await response.json();
      setCategoryChildren((prev) => ({ ...prev, [parentId]: data }));
    } catch (err) {
      console.log(err);

      setError("خطا در دریافت زیر دسته‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryExpand = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
      fetchCategoryChildren(categoryId);
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    try {
      setLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${category._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: category.name,
          path: category.path,
          IsShow: category.IsShow,
        }),
      });
      setEditingCategory(null);
      fetchCategoriesData();
      if (!category.isParent) {
        fetchCategoryChildren(category.id_parent || "");
      }
    } catch (err) {
      console.log(err);

      setError("خطا در بروزرسانی دسته‌بندی");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (category: Category) => {
    try {
      setLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${category._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          IsShow: !category.IsShow,
        }),
      });
      fetchCategoriesData();
      if (!category.isParent && category.id_parent) {
        fetchCategoryChildren(category.id_parent);
      }
    } catch (err) {
      console.log(err);

      setError("خطا در تغییر وضعیت نمایش");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string, parentId?: string) => {
    try {
      setIsDeletingCategory(categoryId);

      if (parentId) {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${categoryId}`, {
          method: "DELETE",
        });
        fetchCategoryChildren(parentId);
      } else {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${categoryId}`
        );
        const children = await response.json();

        if (children.length > 0) {
          setError("ابتدا باید تمام زیر دسته‌ها را حذف کنید");
          return;
        }

        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${categoryId}`, {
          method: "DELETE",
        });
        fetchCategoriesData();
      }
    } catch (err) {
      console.log(err);

      setError("خطا در حذف دسته‌بندی");
    } finally {
      setIsDeletingCategory(null);
    }
  };

  const renderEditForm = () => (
    <div className="flex w-full gap-x-2 items-center">
      <DashboardInput
        value={editingCategory?.name || ""}
        onChange={(e) => setEditingCategory({ ...editingCategory!, name: e.target.value })}
        className="w-40"
      />
      <DashboardInput
        value={editingCategory?.path || ""}
        onChange={(e) => setEditingCategory({ ...editingCategory!, path: e.target.value })}
        className="w-40"
      />
      <DashboardButton
        variant="primary"
        onClick={() => handleUpdateCategory(editingCategory!)}
        disabled={loading}
      >
        ذخیره
      </DashboardButton>
      <DashboardButton variant="tertiary" onClick={() => setEditingCategory(null)}>
        انصراف
      </DashboardButton>
    </div>
  );

  const renderCategoryItem = (category: Category, isChild = false) => (
    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
      {editingCategory?._id === category._id ? (
        renderEditForm()
      ) : (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-x-2">
            {!isChild && (
              <button
                onClick={() => handleCategoryExpand(category._id)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {expandedCategory === category._id ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </button>
            )}
            <span>{category.name}</span>
          </div>
          <div className="flex gap-x-2">
            <button
              onClick={() => handleToggleVisibility(category)}
              className={category.IsShow ? "text-green-600" : "text-gray-400"}
            >
              {category.IsShow ? (
                <EyeIcon className="h-5 w-5" />
              ) : (
                <EyeOffIcon className="h-5 w-5" />
              )}
            </button>
            <button onClick={() => setEditingCategory(category)} className="text-blue-600">
              <EditIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() =>
                handleDeleteCategory(category._id, isChild ? category.id_parent : undefined)
              }
              className="text-red-600"
              disabled={isDeletingCategory === category._id}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderCategoriesList = () => (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-4">لیست دسته‌بندی‌ها</h3>
      {loading ? (
        <div className="p-4 text-center">در حال بارگذاری...</div> // Loading indicator
      ) : (
        parentCategories.map((category) => (
          <div key={category._id} className="mb-4">
            {renderCategoryItem(category)}
            {expandedCategory === category._id && (
              <div className="pr-6 mt-2">
                {categoryChildren[category._id]?.map((child) => (
                  <div key={child._id} className="mb-2">
                    {renderCategoryItem(child, true)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <header className="bg-white p-4">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <button
          className={`p-2 rounded-xl border md:hover:bg-gray-100 transition-all ${
            openDrawer && "bg-gray-100"
          }`}
          onClick={() => setOpenDrawer(!openDrawer)}
        >
          <SortIcon className="h-8 w-8 text-gray-500" />
        </button>
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="جستجو"
            className="w-full pl-16 pr-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
          />
          <SearchIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 h-7 w-7 text-gray-400" />
        </div>
      </div>

      <RightMenu isOpen={openDrawer} onClose={() => setOpenDrawer(false)} title="دسته بندی">
        <div className="w-full flex flex-col gap-y-3">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <DashboardButton
            variant={isCreateParentCat ? "tertiary" : "primary"}
            onClick={() => setIsCreateParentCat(!isCreateParentCat)}
            onXsIsText
          >
            ساخت دسته بندی
          </DashboardButton>

          {isCreateParentCat && (
            <div className="flex flex-col gap-y-3">
              <DashboardInput
                label="نام دسته بندی"
                value={parentCatName}
                onChange={(e) => setParentCatName(e.target.value)}
              />
              <DashboardInput
                label="مسیر دسته بندی"
                value={parentCatPath}
                onChange={(e) => {
                  const value = e.target.value;
                  const isValid = /^[a-zA-Z]+$/.test(value); // فقط حروف انگلیسی بدون فاصله

                  if (!isValid) {
                    showError("لطفاً فقط از حروف انگلیسی بدون فاصله استفاده کنید.");
                  } else {
                    setParentCatPath(value);
                  }
                }}
              />

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

                <div className="grid grid-cols-1 gap-4">
                  {formData?.selectedFiles && formData.selectedFiles.length > 0 && (
                    <div className="flex gap-4 items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                      <div className="bg-gray-200 rounded-lg w-12 h-12 overflow-hidden">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${formData.selectedFiles[0].location}`}
                          alt={formData.selectedFiles[0].name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-right line-clamp-1">{formData.selectedFiles[0].name}</p>
                        <span className="text-gray-400 text-xs">
                          {formData.selectedFiles[0].size}
                        </span>
                      </div>
                      <DashboardButton
                        variant="tertiary"
                        className="border-[1.5px] border-red-500 rounded-2xl !px-3 !py-6"
                        icon="trash"
                        onClick={() => {
                          if (formData?.selectedFiles && formData.selectedFiles.length > 0) {
                            handleRemoveFile(formData.selectedFiles[0]._id);
                          }
                        }}
                        disabled={loading}
                      />
                    </div>
                  )}
                </div>
              </div>
              <DashboardButton onClick={handleCreateParentCategory} disabled={loading} onXsIsText>
                ثبت دسته بندی
              </DashboardButton>
            </div>
          )}

          <DashboardButton
            variant={selectedParentCat ? "tertiary" : "primary"}
            onClick={() =>
              setSelectedParentCat(selectedParentCat ? "" : parentCategoryOptions[0]?.value || "")
            }
            onXsIsText
          >
            ساخت زیر دسته بندی
          </DashboardButton>

          {selectedParentCat && (
            <div className="flex flex-col gap-y-3">
              <Dropdown
                label="انتخاب دسته بندی"
                options={parentCategoryOptions}
                value={selectedParentCat}
                onChange={setSelectedParentCat}
              />

              <DashboardInput
                label="نام زیر دسته بندی"
                value={childCatName}
                onChange={(e) => setChildCatName(e.target.value)}
              />
              <DashboardInput
                label="مسیر زیر دسته بندی"
                value={childCatPath}
                onChange={(e) => {
                  const value = e.target.value;
                  const isValid = /^[a-zA-Z]+$/.test(value); // فقط حروف انگلیسی بدون فاصله

                  if (!isValid) {
                    showError("لطفاً فقط از حروف انگلیسی بدون فاصله استفاده کنید.");
                  } else {
                    setChildCatPath(value);
                  }
                }}
              />

              <DashboardButton onClick={handleCreateChildCategory} disabled={loading} onXsIsText>
                ثبت زیر دسته بندی
              </DashboardButton>
            </div>
          )}

          {renderCategoriesList()}
        </div>
      </RightMenu>
    </header>
  );
}
