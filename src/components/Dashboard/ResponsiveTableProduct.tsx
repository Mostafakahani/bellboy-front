import { useWindowSize } from "@/hooks/useWindowSize";
import React, { useState } from "react";
import { DashboardModal } from "./DashboardModal";
import { DashboardInput } from "./DashboardInput";
import { Modal } from "../BellMazeh/Modal";
import DashboardButton from "../ui/Button/DashboardButton";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showSuccess } from "@/lib/toastService";

interface DataItem {
  _id: string;
  title: string;
  stock: number;
  service: string;
  category: string;
  photo: string;
  description: string;
  price: number;
  disable?: boolean;
  globalDiscount: number;
  file: any[];
}

interface ResponsiveTableProductProps {
  data: DataItem[];
}

const ResponsiveTableProduct: React.FC<ResponsiveTableProductProps> = ({ data }) => {
  // const router = useRouter();

  const { width } = useWindowSize();
  const isMobile = width ? width < 1024 : false;
  const authenticatedFetch = useAuthenticatedFetch();

  const [selectedUser, setSelectedUser] = useState<DataItem>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isModalOpenDetails, setIsModalOpenDetails] = useState(false);

  // const openModalDetails = (data: DataItem) => {
  //   setSelectedUser(data);
  //   setIsModalOpenDetails(true);
  // };
  const openModal = (data: DataItem) => {
    setSelectedUser(data);
    setIsModalOpen(true);
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
        <ul className="overflow-x-hidden relative">
          {data.map((item, index) => (
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
                    {item.service}/{item.category}
                  </p>
                </div>
                <p className="text-gray-700 text-sm">{item.price.toLocaleString("fa-IR")}</p>
              </div>
            </li>
          ))}
          <div className="absolute bottom-0 left-0 right-0 border-b border-gray-300"></div>
        </ul>

        <DashboardModal isOpen={isModalOpen} onClose={closeModal}>
          <>
            <Modal isOpen={isModalOpen} onClose={closeModal} customStyle="mt-4" title="ویرایش کالا">
              <div className="bg-gray-100">
                <div className="px-4 py-5">
                  <DashboardInput label="سرویس" value={selectedUser?.service} variant="dropdown" />
                  <DashboardInput
                    label="دسته بندی"
                    value={selectedUser?.category}
                    variant="dropdown"
                  />
                  <DashboardInput label="عنوان کالا" value={selectedUser?.title} />
                  <DashboardInput
                    label="توضیحات کالا"
                    value={selectedUser?.description}
                    variant="textarea"
                  />
                  <DashboardInput label="موجودی" value={selectedUser?.stock} />
                  <div className="flex flex-row gap-x-4 justify-between items-center">
                    <DashboardInput
                      label="قیمت (تومان)"
                      value={selectedUser?.price.toLocaleString("fa-IR")}
                    />

                    <DashboardInput label="تخفیف" value={10} />
                    {selectedUser?.price && selectedUser?.globalDiscount ? (
                      <div className="flex flex-col items-end justify-center">
                        <span className="text-gray-400 line-through text-sm">
                          {Number(selectedUser?.price).toLocaleString()}
                        </span>
                        <span className="text-sm">
                          {Math.round(
                            Number(selectedUser?.price) *
                              (1 - Number(selectedUser?.globalDiscount) / 100)
                          ).toLocaleString()}{" "}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="mx-4 border-b h-2 border-gray-300"></div>
                <div className="mt-4 px-4">
                  <div className="mt-6 w-full flex flex-row justify-between items-center my-4">
                    <p className="text-sm">بارگذاری تصاویر کالا</p>
                    <div className="w-1/3">
                      <button className="w-full text-sm py-3 rounded-xl border border-gray-300 outline-none hover:bg-gray-300 transition-all focus:outline-none ">
                        انتخاب فایل
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-6 pb-4">
                    {selectedUser?.file?.map((x) => (
                      <div className="flex gap-x-4 items-center justify-between" key={x.id}>
                        <div>
                          <div className="bg-gray-200 rounded-lg w-12 h-12"></div>
                        </div>
                        <div className="w-full">
                          <p className="text-right line-clamp-1 max-w-[200px]">
                            {x.name}.{x.format}
                          </p>
                          <span className="text-gray-400 text-xs">545kb</span>
                        </div>
                        <div className="">
                          <DashboardButton
                            variant="tertiary"
                            className="border-[1.5px] border-red-500 rounded-2xl !px-3 !py-6"
                            icon="trash"
                          />
                        </div>
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
                        className={`border-[1.5px]!h-[3rem] w-full ${
                          selectedUser?.disable ? "" : "border-red-500 "
                        }`}
                        variant="tertiary"
                        isError
                        onXsIsText
                        onClick={() => disableProduct(selectedUser?._id)}
                        type="button"
                      >
                        {selectedUser?.disable ? "فعال کردن" : "غیر فعال کردن"}
                      </DashboardButton>
                      <DashboardButton className="w-full !h-[3rem]" onXsIsText>
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
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td className="py-2 px-4 border-b">{item.title}</td>
            <td className="py-2 px-4 border-b">{item.stock}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResponsiveTableProduct;
