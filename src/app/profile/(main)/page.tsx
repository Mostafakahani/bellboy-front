"use client";
import React, { useState } from "react";
import { User } from "lucide-react";
import { ProfileDialog } from "@/components/Profile/ProfileDialog";
import { ProfileLink } from "@/components/Profile/ProfileLink";
import ErrorDialog from "@/components/Profile/ErrorDialog";
import { LeftArrowIcon, LineIcon } from "@/icons/Icons";

const ProfileMainPage: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogLogout, setShowDialogLogout] = useState(false);
  const handleLogout = async () => {
    setShowDialogLogout(false);
  };
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
        <LineIcon />
        {/* <Image width={1080} height={150} className="w-full" src="/images/line.svg" alt="" /> */}
      </div>
      <div className="w-full flex flex-col px-8 mt-2">
        <div className="w-full flex flex-row justify-between border-b border-black my-2 pb-4">
          <button onClick={() => setShowDialog(true)}>مشخصات حساب من</button>
          <LeftArrowIcon className="ml-2" />
          {/* <Image className="ml-2" width={6} height={6} alt="" src="/images/icons/arrowL.svg" /> */}
        </div>
        <ProfileLink href="/profile/orders" text="سفارش ها" />
        <ProfileLink href="/profile/address" text="آدرس ها" />
        <div className="w-full flex flex-row justify-between border-b border-black my-2 pb-4">
          <button onClick={() => setShowDialogLogout(true)}>خروج از حساب کاربری</button>
        </div>
      </div>
      <ProfileDialog isOpen={showDialog} onClose={() => setShowDialog(false)} />
      <ErrorDialog
        isOpen={showDialogLogout}
        onDelete={() => handleLogout()}
        onClose={() => setShowDialogLogout(false)}
        message="آیا مطمئن هستید؟"
        buttonMessage="بله از حساب خارج شو"
      />
    </div>
  );
};

export default ProfileMainPage;
