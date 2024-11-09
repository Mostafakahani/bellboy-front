import { useWindowSize } from "@/hooks/useWindowSize";
import React, { useState } from "react";
import { DashboardModal } from "./DashboardModal";
import { DashboardInput } from "./DashboardInput";
import { Modal } from "../BellMazeh/Modal";
import DashboardButton from "../ui/Button/DashboardButton";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError, showSuccess } from "@/lib/toastService";
import { ProductFormData } from "@/app/dashboard/products/new/page";
import FileUploaderComponent, { FileData } from "../FileUploader/FileUploader";
import { getCookie } from "cookies-next";
import { Switch } from "../ui/Input/Switch";
import CategorySelector from "./CategorySelector";

interface ResponsiveTableProductProps {
  data: ProductFormData[];
  fetchProducts: () => void;
}
const initialFormData: ProductFormData = {
  _id: "",
  title: "",
  description: "",
  price: 0,
  stock: 0,
  id_categories: [],
  TastingTray: false,
  globalDiscount: "",
  id_stores: [],
  active: true,
};
const ResponsiveTableProduct: React.FC<ResponsiveTableProductProps> = ({ data, fetchProducts }) => {
  // const router = useRouter();

  const { width } = useWindowSize();
  const isMobile = width ? width < 1024 : false;
  const authenticatedFetch = useAuthenticatedFetch();
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (formData?.id_stores?.length === 0) {
      throw new Error("انتخاب حداقل یک تصویر الزامی است");
    }
  };
  const prepareFormDataForSubmission = (data: ProductFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...filteredData } = data;

    // Clean the form data
    const cleanedData = {
      ...filteredData,
      // Clean stores array - these are objects that need _id extraction
      id_stores: filteredData.id_stores?.filter((store) => store?._id).map((store) => store._id),
      // Keep categories as is since they're already strings
      id_categories: filteredData.id_categories || [],
    };

    return cleanedData;
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

      // Debug log to check formData before cleaning
      console.log("FormData before cleaning:", formData);

      // Prepare the cleaned form data
      const cleanedFormData = prepareFormDataForSubmission(formData);

      // Debug log to check final data being sent
      console.log("Data being sent to server:", cleanedFormData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/${formData._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cleanedFormData),
        }
      );
      const data = await response.json();

      if (data.status === "success") {
        showSuccess("محصول با موفقیت ایجاد شد");
        setFormData(initialFormData);
        closeModal();
      } else {
        throw new Error(data.message || "خطا در ایجاد محصول");
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : "خطا در ارسال اطلاعات");
    } finally {
      setIsSubmitting(false);
      fetchProducts();
    }
  };

  const handleCategorySelect = (parentId: string, childId: string) => {
    setFormData((prev) => ({
      ...prev,
      id_categories: childId ? [parentId, childId] : [parentId],
    }));
  };
  // const [isModalOpenDetails, setIsModalOpenDetails] = useState(false);

  // const openModalDetails = (data: ProductFormData) => {
  //   setSelectedUser(data);
  //   setIsModalOpenDetails(true);
  // };
  const openModal = (data: ProductFormData) => {
    setIsModalOpen(true);
    setFormData(data);
  };
  const closeModal = () => setIsModalOpen(false);
  const disableProduct = async (productId: string | unknown) => {
    try {
      const { message, status } = await authenticatedFetch(`/product/${productId}`, {
        method: "POST",
      });
      if (status === "success") {
        showSuccess(message);
      }
      closeModal();
      // router.reload();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (isMobile) {
    return (
      <div className="w-full mt-5">
        <div className="w-full flex flex-row justify-between items-center px-4 mb-5">
          <p className="text-[#898F96] font-light text-xs">شناسه کالا / عنوان / دسته‌بندی </p>
          <p className="text-[#898F96] font-light text-xs">قیمت (تومان)</p>
        </div>
        <ul className="overflow-x-hidden relative flex flex-col-reverse">
          {Array.isArray(data) && data.length > 0 ? (
            data.map((item, index) => (
              <li key={index} className="bg-white relative" onClick={() => openModal(item)}>
                <div className="absolute top-0 left-0 right-0 border-t border-gray-300"></div>

                <div className="flex flex-row justify-between px-4 py-3 items-center">
                  <div>
                    <p className="text-sm text-gray-700 line-clamp-1">
                      <span className="mr-2 text-gray-500 text-xs">{item.stock}x</span>
                      {item?._id?.slice(5, 10)}
                    </p>
                    <h3 className="text-sm text-gray-700">{item.title}</h3>
                    <p className="text-gray-500 text-xs mt-1">
                      {/* {item.service}/{item.category} */}
                    </p>
                  </div>
                  <p className="text-gray-700 text-sm">{item.price.toLocaleString()}</p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500 mb-3">هیچ محصولی موجود نیست</p>
          )}
          <div className="absolute bottom-0 left-0 right-0 border-b border-gray-300"></div>
        </ul>

        <DashboardModal isOpen={isModalOpen} onClose={closeModal}>
          <>
            <Modal isOpen={isModalOpen} onClose={closeModal} customStyle="mt-4" title="ویرایش کالا">
              <div className="bg-gray-100">
                <div className="px-4 py-5">
                  <div className="flex items-center justify-between my-3 px-1">
                    <span className="text-sm font-medium">سینی مزه</span>
                    <Switch
                      checked={formData.TastingTray}
                      onCheckedChange={handleTastingTrayChange}
                      // disabled={formData.id_categories.length > 0 || isSubmitting}
                    />
                  </div>
                  {!formData.TastingTray && (
                    <CategorySelector
                      onCategorySelect={handleCategorySelect}
                      selectedParentId={
                        formData.id_categories?.[0]?._id && formData.id_categories[0]?.isParent
                          ? formData.id_categories[0]._id
                          : ""
                      }
                      selectedChildId={
                        formData.id_categories?.[1]?._id &&
                        formData.id_categories[1]?.isParent === false
                          ? formData.id_categories[1]._id
                          : ""
                      }
                    />
                  )}
                  <DashboardInput
                    label="عنوان کالا"
                    className="mt-3"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    disabled={isSubmitting}
                  />
                  <DashboardInput
                    label="توضیحات"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    variant="textarea"
                    disabled={isSubmitting}
                  />
                  <DashboardInput
                    label="موجودی"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    type="number"
                    disabled={isSubmitting}
                  />
                  <div className="flex flex-row gap-x-4 justify-between items-center">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                      <DashboardInput
                        label="قیمت (تومان)"
                        value={formData?.price}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            price: (e.target.value || 0) as number,
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
                      <div></div>

                      {formData.price && formData.globalDiscount && (
                        <div className="w-full flex flex-col items-end justify-center">
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
                  </div>
                </div>
                <div className="mx-4 border-b h-2 border-gray-300"></div>
                <div className="space-y-4 px-4 mt-4 mb-12">
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
                      <div key={file._id} className="flex gap-4 items-center justify-between p-3">
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
                <div className="relative mt-[5.2rem]">
                  <div className="absolute bottom-0 w-full p-4 bg-white border-t-2 border-gray-200 flex flex-row justify-between items-center">
                    <p className="p-4 text-sm" onClick={() => closeModal()}>
                      انصراف
                    </p>
                    <div className="flex flex-row gap-x-4 items-center">
                      <DashboardButton
                        className={`border-[1.5px]!h-[3rem] text-nowrap text-sm w-full ${
                          formData?.active ? "" : "border-red-500 "
                        }`}
                        variant="tertiary"
                        isError
                        onXsIsText
                        onClick={() => disableProduct(formData?._id)}
                        type="button"
                      >
                        {!formData?.active ? "فعال کردن" : "غیر فعال کردن"}
                      </DashboardButton>
                      <DashboardButton
                        className="w-full !h-[3rem]"
                        onXsIsText
                        onClick={handleSubmit}
                      >
                        ویرایش
                      </DashboardButton>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </>
        </DashboardModal>
      </div>
    );
  }

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">Name</th>
          <th className="py-2 px-4 border-b">Email</th>
        </tr>
      </thead>
      {/* <tbody>use Phone Responsive. F12 and click Phone icon</tbody> */}
    </table>
  );
};

export default ResponsiveTableProduct;
