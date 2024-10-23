import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

const tabs: Tab[] = [
  { label: "مشخصات", id: "UserDetails" },
  { label: "سفارش ها", id: "UserOrders" },
  { label: "آدرس ها", id: "UserAddress" },
  { label: "پشتیبانی", id: "UserTickets", disabled: true },
  // Uncomment this if you want a disabled tab
  //   { id: "disabled", label: "Disabled", disabled: true },
];

interface TabNavigationProps {
  children: React.ReactNode[];
  onClose?: any;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ children, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>("UserDetails");

  const handleTabClick = (id: string) => {
    if (!tabs.find((tab) => tab.id === id)?.disabled) {
      setActiveTab(id);
    }
  };

  return (
    <div>
      <div className="sticky top-0 bg-white text-sm font-medium text-center text-gray-500 border-b-2 border-gray-200 pt-4">
        <ul className="flex flex-wrap justify-center flex-row -mb-px">
          {tabs.map((tab) => (
            <li className="me-2" key={tab.id}>
              <div
                onClick={() => handleTabClick(tab.id)}
                className={`inline-block p-3 border-b-[3px] font-bold transition-all ${
                  tab.disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : activeTab === tab.id
                    ? "text-slate-800 border-slate-600"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300 text-gray-400"
                }`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.label}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 bg-gray-100 min-h-screen">
        {children.map((child, index) => (
          <div
            key={tabs[index].id}
            className={activeTab === tabs[index].id ? "block overflow-y-auto" : "hidden"}
          >
            {child}
          </div>
        ))}
      </div>
      <div
        onClick={() => onClose()}
        className="sticky bottom-0 p-4 bg-white border-t-2 border-gray-200 flex flex-row justify-center items-center"
      >
        <p>بستن</p>
      </div>
    </div>
  );
};

export default TabNavigation;
