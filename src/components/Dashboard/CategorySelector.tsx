import React, { useState, useEffect } from "react";
import { Dropdown } from "./Dropdown"; // استفاده از کامپوننت Dropdown که ارائه کردید
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";

interface Category {
  _id: string;
  name: string;
  path: string;
  isParent: boolean;
  layer: number;
}

interface CategorySelectorProps {
  onCategorySelect: (parentId: string, childId: string) => void;
  //   disabled?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ onCategorySelect }) => {
  const authenticatedFetch = useAuthenticatedFetch();
  const [parentCategories, setParentCategories] = useState<Category[] | any>([]);
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [selectedParentId, setSelectedParentId] = useState("");
  const [selectedChildId, setSelectedChildId] = useState("");
  const [selectedPath, setSelectedPath] = useState("");

  // دریافت دسته‌بندی‌های اصلی در لود اولیه
  useEffect(() => {
    fetchParentCategories();
  }, []);

  // دریافت زیردسته‌ها وقتی دسته اصلی انتخاب می‌شود
  useEffect(() => {
    if (selectedParentId) {
      fetchChildCategories(selectedParentId);
    }
  }, [selectedParentId]);

  const fetchParentCategories = async () => {
    try {
      const { data } = await authenticatedFetch<Category[]>("/category");
      const parents = data?.filter((category: Category) => category.isParent);
      setParentCategories(parents);
    } catch (error) {
      console.log(error);

      setParentCategories([]);
    }
  };

  const fetchChildCategories = async (parentId: string) => {
    try {
      const { data } = await authenticatedFetch<Category[]>(`/category/${parentId}`);
      setChildCategories(data || []);
    } catch (error) {
      console.log(error);

      setChildCategories([]);
    }
  };

  const handleParentChange = (value: string) => {
    setSelectedParentId(value);
    setSelectedChildId(""); // ریست کردن انتخاب زیردسته
    setSelectedPath(""); // ریست کردن مسیر
    onCategorySelect(value, "");
  };

  const handleChildChange = (value: string) => {
    setSelectedChildId(value);
    const selectedChild = childCategories.find((cat) => cat._id === value);
    if (selectedChild) {
      setSelectedPath(selectedChild.path);
    }
    onCategorySelect(selectedParentId, value);
  };
  if (!parentCategories) return;
  // تبدیل دسته‌بندی‌ها به فرمت مورد نیاز Dropdown
  const parentOptions = parentCategories.map((category: any) => ({
    value: category._id,
    label: category.name,
  }));

  const childOptions = childCategories.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  return (
    <div className="space-y-4">
      <Dropdown
        label="دسته‌بندی اصلی"
        options={parentOptions}
        value={selectedParentId}
        onChange={handleParentChange}
      />

      {selectedParentId && (
        <Dropdown
          label="زیر دسته"
          options={childOptions}
          value={selectedChildId}
          onChange={handleChildChange}
        />
      )}

      {selectedPath && (
        <p className="text-xs text-gray-500 mt-0 mr-2 text-right">مسیر: {selectedPath}</p>
      )}
    </div>
  );
};

export default CategorySelector;
