import React, { useState } from "react";
import { SearchIcon, SortIcon } from "@/icons/Icons";

export default function DashboardHeader() {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
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
      {openDrawer && <div>opened</div>}
    </header>
  );
}
