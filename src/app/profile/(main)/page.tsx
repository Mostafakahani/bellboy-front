import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ProfileMainPage() {
  return (
    <div className="mt-16 flex flex-col items-center justify-center gap-3">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex justify-center items-center">
        <User className="text-black" size={28} />
      </div>
      <div className="flex flex-col items-center justify-center gap-2 mt-3">
        <h4 className="text-lg font-bold">مریم علیخانی</h4>
        <p className="text-xs">شناسه: 1265</p>
      </div>
      <div className="w-full flex flex-col px-8 mt-10">
        <div className="w-full flex flex-row justify-between border-b border-black my-2 pb-4">
          <Link href={"#"}>مشخصات حساب من</Link>
          <ArrowLeft />
        </div>
        <div className="w-full flex flex-row justify-between border-b border-black my-2 pb-4">
          <Link href={"#"}>سفارش ها</Link>
          <ArrowLeft />
        </div>
        <div className="w-full flex flex-row justify-between border-b border-black my-2 pb-4">
          <Link href={"#"}>آدرس ها</Link>
          <ArrowLeft />
        </div>
        <div className="w-full flex flex-row justify-between border-b border-black my-2 pb-4">
          <Link href={"#"}>خروج از حساب کاربری</Link>
        </div>
      </div>
    </div>
  );
}
