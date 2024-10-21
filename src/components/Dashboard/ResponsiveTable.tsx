import { useWindowSize } from "@/hooks/useWindowSize";
import React from "react";

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

  if (isMobile) {
    return (
      <div className="w-full">
        <div className="w-full flex flex-row justify-between items-center px-4">
          <p className="text-[#898F96] font-light text-xs">شناسه کاربری / نام / نام خانوادگی</p>
          <p className="text-[#898F96] font-light text-xs">شماره تلفن همراه</p>
        </div>
        <ul className="overflow-x-hidden relative">
          {data.map((item, index) => (
            <li key={index} className="bg-white relative">
              {/* خط بالا */}
              <div className="absolute top-0 left-0 right-0 border-t border-gray-300"></div>

              {/* محتوای آیتم */}
              <div className="p-4">
                <h3 className="font-bold">
                  {item.firstName} {item.lastName}
                </h3>
                <p className="text-gray-600">{item.email}</p>
              </div>
            </li>
          ))}
          {/* خط پایانی */}
          <div className="absolute bottom-0 left-0 right-0 border-b border-gray-300"></div>
        </ul>
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
