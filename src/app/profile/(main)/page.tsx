"use client";
import React, { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { ProfileDialog } from "@/components/Profile/ProfileDialog";
import { ProfileLink } from "@/components/Profile/ProfileLink";

const ProfileMainPage: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="mt-20 flex flex-col items-center justify-center gap-3">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex justify-center items-center">
        <User className="text-black" size={28} />
      </div>
      <div className="flex flex-col items-center justify-center gap-2 mt-3">
        <h4 className="text-lg font-bold">مریم علیخانی</h4>
        <p className="text-xs">شناسه: 1265</p>
      </div>
      <div className="w-full">
        <Image width={1080} height={150} className="w-full" src="/images/line.svg" alt="" />
      </div>
      <div className="w-full flex flex-col px-8 mt-2">
        <div className="w-full flex flex-row justify-between border-b border-black my-2 pb-4">
          <button onClick={() => setShowDialog(true)}>مشخصات حساب من</button>
          <Image className="ml-2" width={6} height={6} alt="" src="/images/icons/arrowL.svg" />
        </div>
        <ProfileLink href="/profile/orders" text="سفارش ها" />
        <ProfileLink href="#" text="آدرس ها" />
        <div className="w-full flex flex-row justify-between border-b border-black my-2 pb-4">
          <a href="#">خروج از حساب کاربری</a>
        </div>
      </div>

      <ProfileDialog isOpen={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
};

export default ProfileMainPage;
