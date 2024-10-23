import { useWindowSize } from "@/hooks/useWindowSize";
import React, { useState } from "react";
import { DashboardModal } from "./DashboardModal";
import TabNavigation from "./Tab";
import { DashboardInput } from "./DashboardInput";
import { UserIcon } from "@/icons/Icons";
import { Modal } from "../BellMazeh/Modal";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";

interface DataItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  orders: object[];
}

interface ResponsiveTableProps {
  data: DataItem[];
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ data }) => {
  const { width } = useWindowSize();
  const isMobile = width ? width < 1024 : false;

  const [selectedUser, setSelectedUser] = useState<DataItem>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDetails, setIsModalOpenDetails] = useState(false);

  // const openModalDetails = (data: DataItem) => {
  //   setSelectedUser(data);
  //   setIsModalOpenDetails(true);
  // };
  const openModal = (data: DataItem) => {
    setSelectedUser(data);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  if (isMobile) {
    return (
      <div className="w-full mt-5">
        <div className="w-full flex flex-row justify-between items-center px-4 mb-5">
          <p className="text-[#898F96] font-light text-xs">شناسه کاربری / نام / نام خانوادگی</p>
          <p className="text-[#898F96] font-light text-xs">شماره تلفن همراه</p>
        </div>
        <ul className="overflow-x-hidden relative">
          {data.map((item, index) => (
            <li key={index} className="bg-white relative" onClick={() => openModal(item)}>
              <div className="absolute top-0 left-0 right-0 border-t border-gray-300"></div>

              <div className="flex flex-row justify-between px-4 py-3 items-center">
                <div>
                  <p className="text-sm text-gray-700">{item.id}</p>
                  <h3 className="text-sm text-gray-700">
                    {item.firstName} {item.lastName}
                  </h3>
                </div>
                <p className="text-gray-700 text-sm">{item.phone}</p>
              </div>
            </li>
          ))}
          <div className="absolute bottom-0 left-0 right-0 border-b border-gray-300"></div>
        </ul>

        <DashboardModal isOpen={isModalOpen} onClose={closeModal}>
          <>
            <TabNavigation onClose={closeModal}>
              <div>
                <div>
                  <div className="flex flex-row justify-center items-center">
                    <div className="flex flex-row justify-center items-center w-20 h-20 rounded-full bg-gray-50 p-3">
                      <UserIcon className="w-12 h-12 text-black" />
                    </div>
                  </div>
                  <DashboardInput label="نام" value={selectedUser?.firstName} disabled />
                  <DashboardInput label="نام خانوادگی" value={selectedUser?.lastName} disabled />
                  <DashboardInput label="شماره تلفن همراه" value={selectedUser?.phone} disabled />
                  <DashboardInput label="ایمیل" value={selectedUser?.email} disabled />
                  <DashboardInput label="تاریخ تولد" value={selectedUser?.date} disabled />
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-4 justify-center">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
                    <div
                      key={index}
                      className="w-full flex flex-row justify-between p-5 border border-gray-300 rounded-xl bg-white"
                      onClick={() => setIsModalOpenDetails(true)}
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-md line-clamp-2 max-w-[170px]">سفارش ۱۳۲۱۵۴۸</p>
                        <p className="text-xs text-gray-500">۱۴۰۳/۰۲/۲۸ - ۱۴:۲۵</p>
                      </div>

                      <div className="flex items-center">
                        <p className="text-sm">۲۴٬۵۰۰٬۰۰۰ تومان</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Modal
                  isOpen={isModalOpenDetails}
                  onClose={() => setIsModalOpenDetails(false)}
                  title={"سفارش فلان"}
                >
                  <div className="flex flex-col">
                    <div className="border-b border-gray-200 py-4">
                      <div className="flex flex-row justify-between items-center px-5">
                        <p className="text-sm text-[#344054]">تاریخ تحویل</p>
                        <p className="text-sm text-[#344054]">سه‌شنبه 17 آبان 1403</p>
                      </div>
                    </div>
                    <div className="border-b border-gray-500 py-4">
                      <div className="flex flex-row justify-between items-center px-5">
                        <p className="text-sm text-[#344054]">وضعیت سفارش</p>
                        <p className="text-sm text-[#344054]">در حال تأمین </p>
                      </div>
                    </div>
                    <div className="border-b border-gray-200 py-4">
                      <div className="flex flex-row justify-between items-center px-5">
                        <p className="text-sm text-[#344054] flex flex-col gap-1">
                          هرم مزه سفارشی
                          <span className="py-1 px-2 text-xs bg-gray-100 rounded-full w-fit h-fit font-bold">
                            2x
                          </span>
                        </p>
                        <div className="flex flex-col justify-between items-end gap-1">
                          <span className="font-black text-sm">{formatCurrency(5244110)}</span>
                          <div className="flex flex-row items-center gap-3">
                            <span className="py-1.5 px-2 text-[11px] bg-red-500 text-white rounded-full w-fit h-fit text-left">
                              %20
                            </span>
                            <span className="line-through text-sm text-gray-400">3,000,000</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-gray-500 py-4">
                      <div className="flex flex-row justify-between items-center px-5">
                        <p className="text-sm text-[#344054] flex flex-col gap-1">
                          سینی مزه 1504
                          <span className="py-1 px-2 text-xs bg-gray-100 rounded-full w-fit h-fit font-bold">
                            1x
                          </span>
                        </p>
                        <div className="flex flex-col justify-between items-end gap-1">
                          <span className="font-black text-sm">{formatCurrency(720000)}</span>
                          {/* <div className="flex flex-row items-center gap-3">
                            <span className="py-1.5 px-2 text-[11px] bg-red-500 text-white rounded-full w-fit h-fit text-left">
                              %20
                            </span>
                            <span className="line-through text-sm text-gray-400">3,000,000</span>
                          </div> */}
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-gray-200 py-4">
                      <div className="flex flex-row justify-between items-center px-5">
                        <p className="text-sm text-[#344054]">وضعیت سفارش</p>
                        <p className="text-sm text-[#344054]">{formatCurrency(3150000)} </p>
                      </div>
                    </div>
                    <div className="border-b border-gray-200 py-4">
                      <div className="flex flex-row justify-between items-center px-5">
                        <p className="text-sm text-[#344054]">مالیات بر ارزش افزوده </p>
                        <p className="text-sm text-[#344054]">{formatCurrency(36000)} </p>
                      </div>
                    </div>
                    <div className="border-b border-gray-200 py-4">
                      <div className="flex flex-row justify-between items-center px-5">
                        <p className="text-sm text-[#344054]">هزینه رفت و آمد </p>
                        <p className="text-sm text-[#344054]">رایگان</p>
                      </div>
                    </div>
                    <div className="border-b border-gray-500 py-4">
                      <div className="flex flex-row justify-between items-center px-5">
                        <p className="text-sm text-[#344054]">مبلغ قابل پرداخت</p>
                        <p className="text-sm text-[#344054]">{formatCurrency(36000)}</p>
                      </div>
                    </div>
                    <div className="border-b border-gray-200 py-4">
                      <div className="flex flex-row justify-between items-center px-5">
                        <p className="text-sm text-[#344054]">زمان ثبت سفارش </p>
                        <p className="text-sm text-[#344054]">سه‌شنبه 17 آبان 1403 ساعت ۱۲:۳۰</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 bg-gray-100 py-4 mt-20">
                      <div className="flex flex-row gap-4 justify-center items-center">
                        <div
                          className={`px-2.5 py-1.5 text-sm rounded-xl border border-gray-300 bg-primary-700 text-white`}
                        >
                          تامین
                        </div>
                        <div
                          className={`px-2.5 py-1.5 text-sm rounded-xl border border-gray-300 bg-white`}
                        >
                          ارسال
                        </div>
                        <div
                          className={`px-2.5 py-1.5 text-sm rounded-xl border border-gray-300 bg-white`}
                        >
                          تحویل
                        </div>
                        <div
                          className={`px-2.5 py-1.5 text-sm rounded-xl border border-gray-300 bg-white`}
                        >
                          لغو
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
              <div className="flex flex-col gap-4 justify-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
                  <div
                    key={index}
                    className={`border-2 border-gray-200 rounded-xl p-7 flex justify-between items-center cursor-pointer ${
                      false ? "bg-primary-400/10" : "bg-white"
                    }`}
                    // onClick={() => onSelect(address.id!)}
                  >
                    <div className="flex items-center">
                      <div className="flex flex-col gap-3">
                        <div className="w-full flex flex-row gap-3">
                          <h3 className="font-semibold mr-2">ویلای بابا</h3>
                          <p className="py-1 px-1.5 bg-gray-100 rounded-full text-[11px] font-bold line-clamp-1">
                            شناسه 455545
                          </p>
                        </div>
                        <div className="flex flex-row items-start">
                          <Image
                            width={30}
                            height={30}
                            src={"/images/icons/gps.svg"}
                            alt="gps icon"
                          />
                          <p className="text-sm text-gray-600 line-clamp-2">{`تهران، اوشون پشن، خیابان نسترن، خیابان شکوفه 52، سر فلکه، کوچه ۲۰، پلاک ۱۲`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h2>Contacts Content</h2>
                <p>This is the content for the Contacts tab.</p>
              </div>
            </TabNavigation>
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
            <td className="py-2 px-4 border-b">{item.lastName}</td>
            <td className="py-2 px-4 border-b">{item.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResponsiveTable;
