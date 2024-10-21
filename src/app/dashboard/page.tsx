"use client";
import DashboardButton from "@/components/ui/Button/DashboardButton";
import React from "react";

export default function DashboardPage() {
  return (
    <div className="mt-16">
      <DashboardButton onXsIsText>ذخیره</DashboardButton>
      <DashboardButton variant="secondary" onXsIsText>
        ذخیره
      </DashboardButton>
      <DashboardButton variant="tertiary" onXsIsText>
        ذخیره
      </DashboardButton>
      <DashboardButton variant="primary" isError onXsIsText>
        ذخیره
      </DashboardButton>
      <DashboardButton variant="primary" isError icon="trash">
        ذخیره
      </DashboardButton>
      <DashboardButton variant="oneIcon" onXsIsText icon="edit" iconClassname="w-4 h-4">
        دریافت
      </DashboardButton>
      <DashboardButton variant="twoIcons" onXsIsText icon="edit" iconClassname="w-4 h-4">
        دریافت
      </DashboardButton>
      <DashboardButton variant="primaryIsIcon" onXsIsText icon="trash">
        دریافت
      </DashboardButton>
    </div>
  );
}
