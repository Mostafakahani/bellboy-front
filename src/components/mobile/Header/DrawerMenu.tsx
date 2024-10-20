import { InstagramIcon, LinkedinIcon, TelegramIcon, WhatsAppIcon, XIcon } from "@/icons/Icons";
import Link from "next/link";
import React from "react";

interface DrawerMenuProps {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  links: { name: string; href: string }[];
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ isDrawerOpen, toggleDrawer, links }) => {
  return (
    <div
      className={`fixed z-40 top-0 left-0 h-dvh overflow-y-hidden w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isDrawerOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button onClick={toggleDrawer} className="mx-4 text-5xl mb-4">
        ×
      </button>
      <div className="p-4 mx-4 flex flex-col gap-2">
        <div className="w-full mb-12">
          <Link href={"/profile/auth"}>
            <button className="bg-[#69ffc3] text-black border-[2px] py-3 font-bold w-full border-black hover:bg-primary-300 active:bg-black rounded-full active:text-white disabled:bg-primary-100 disabled:text-emerald-300 disabled:border-black/30">
              ورود به حساب / ثبت نام
            </button>
          </Link>
        </div>
        <nav>
          <ul className="flex flex-col gap-10">
            {links.map((link, index) => (
              <li key={index}>
                <Link href={link.href} className="block text-md font-normal text-black">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="w-full flex flex-col gap-3 mt-20">
          <div className="w-full">
            <p className="text-center font-bold">ما را دنبال کنید</p>
          </div>
          <div className="w-full flex flex-row justify-between mt-5">
            <InstagramIcon />
            <TelegramIcon />
            <LinkedinIcon />
            <XIcon />
            <WhatsAppIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawerMenu;
