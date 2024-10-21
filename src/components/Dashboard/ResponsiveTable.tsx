import { useWindowSize } from "@/hooks/useWindowSize";
import React, { useState } from "react";
import { DashboardModal } from "./DashboardModal";
import TabNavigation from "./Tab";
import { DashboardInput } from "./DashboardInput";
import { UserIcon } from "@/icons/Icons";

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
            <TabNavigation>
              <div>
                <div>
                  <div className="flex flex-row justify-center items-center">
                    <div className="flex flex-row justify-center items-center w-20 h-20 rounded-full bg-gray-50 p-3">
                      <UserIcon className="w-12 h-12 text-black"/>
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
                <h2>Dashboard Content</h2>
                <p>This is the content for the Dashboard tab.</p>
              </div>
              <div>
                <h2>Settings Content</h2>
                <p>This is the content for the Settings tab.</p>
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
