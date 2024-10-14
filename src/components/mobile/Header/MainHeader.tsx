"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import DrawerMenu from "./DrawerMenu";
import Image from "next/image";
const links = [
  { name: "پرسش های شما", href: "/" },
  { name: "شعبه های ما", href: "/about" },
  { name: "درباره بل‌بوی", href: "/contact" },
  { name: "شرایط و قوانین استفاده", href: "/contact" },
  { name: "حریم خصوصی", href: "/contact" },
];

const MainHeader: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50">
      <div className="flex items-center justify-between px-4 py-2 mx-1 mt-2">
        {/* Drawer toggle button */}
        <button onClick={toggleDrawer} className="text-2xl">
          <Image
            src={"/images/icons/menu.svg"}
            width={20}
            height={20}
            alt="menu بل بوی | menu Bell Boy"
          />
        </button>

        {/* Logo */}
        <div className="flex items-center ml-3">
          <Image
            src={"/images/logo.svg"}
            width={120}
            height={100}
            alt="لوگو بل بوی | Logo Bell Boy"
          />
        </div>

        {/* Phone link */}
        <Link href="tel:+1234567890" className="text-2xl">
          <Image
            src={"/images/icons/phone.svg"}
            width={20}
            height={20}
            alt="phone بل بوی | phone Bell Boy"
          />
        </Link>
      </div>

      {/* Full-Width Drawer */}
      <DrawerMenu isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} links={links} />
    </header>
  );
};

export default MainHeader;
