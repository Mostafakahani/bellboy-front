// pages/dashboard/setting.tsx
"use client";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import Setting from "@/components/Setting/Setting";
import React from "react";

export default function SettingPage() {
  return (
    <div>
      <DashboardHeader />
      <div className="mt-4 p-4">
        <Setting />
      </div>
    </div>
  );
}
