import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { useEffect, useState } from "react";
import { Dropdown } from "./Dropdown";

export interface Category {
  _id: string;
  name: string;
  path: string;
  isParent: boolean;
  layer: number;
}

interface CategorySelectorProps {
  onCategorySelect: (parentId: string, childId: string) => void;
  selectedParentId?: string;
  selectedChildId?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  onCategorySelect,
  selectedParentId,
  selectedChildId,
}) => {
  const authenticatedFetch = useAuthenticatedFetch();
  const [parentCategories, setParentCategories] = useState<Category[] | any>([]);
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [localSelectedParentId, setLocalSelectedParentId] = useState(selectedParentId || "");
  const [localSelectedChildId, setLocalSelectedChildId] = useState(selectedChildId || "");
  const [selectedPath, setSelectedPath] = useState("");
  const [isLoadingParents, setIsLoadingParents] = useState(true);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);

  useEffect(() => {
    fetchParentCategories();
  }, []);

  useEffect(() => {
    if (localSelectedParentId) {
      fetchChildCategories(localSelectedParentId);
    }
  }, [localSelectedParentId]);

  useEffect(() => {
    if (selectedParentId && selectedChildId) {
      setLocalSelectedParentId(selectedParentId);
      setLocalSelectedChildId(selectedChildId);
      onCategorySelect(selectedParentId, selectedChildId);
    }
  }, [selectedParentId, selectedChildId, onCategorySelect]);

  const fetchParentCategories = async () => {
    setIsLoadingParents(true);
    try {
      const { data } = await authenticatedFetch<Category[]>("/category");
      const parents = data?.filter((category: Category) => category.isParent);
      setParentCategories(parents);
    } catch (error) {
      console.log(error);
      setParentCategories([]);
    } finally {
      setIsLoadingParents(false);
    }
  };

  const fetchChildCategories = async (parentId: string) => {
    setIsLoadingChildren(true);
    try {
      const { data } = await authenticatedFetch<Category[]>(`/category/${parentId}`);
      setChildCategories(data || []);
    } catch (error) {
      console.log(error);
      setChildCategories([]);
    } finally {
      setIsLoadingChildren(false);
    }
  };

  const handleParentChange = (value: string) => {
    setLocalSelectedParentId(value);
    setLocalSelectedChildId("");
    setSelectedPath("");
    onCategorySelect(value, "");
  };

  const handleChildChange = (value: string) => {
    setLocalSelectedChildId(value);
    const selectedChild = childCategories.find((cat) => cat._id === value);
    if (selectedChild) {
      setSelectedPath(selectedChild.path);
    }
    onCategorySelect(localSelectedParentId, value);
  };

  if (!parentCategories && !isLoadingParents) return null;

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
        label="دسته بندی"
        options={parentOptions}
        value={localSelectedParentId}
        onChange={handleParentChange}
        isLoading={isLoadingParents}
      />

      {localSelectedParentId && (
        <Dropdown
          label="زیر دسته بندی"
          options={childOptions}
          value={localSelectedChildId}
          onChange={handleChildChange}
          isLoading={isLoadingChildren}
        />
      )}

      {selectedPath && (
        <p className="text-xs text-gray-500 mt-0 mr-2 text-right">مسیر: {selectedPath}</p>
      )}
    </div>
  );
};

export default CategorySelector;
