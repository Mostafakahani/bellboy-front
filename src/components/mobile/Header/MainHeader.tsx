"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import DrawerMenu from "./DrawerMenu";
import Image from "next/image";
import { LogoIcon, MenuIcon } from "@/icons/Icons";
const links = [
  { name: "پرسش های شما", href: "/" },
  { name: "شعبه های ما", href: "/about" },
  { name: "درباره میزبانو", href: "/contact" },
  { name: "شرایط و قوانین استفاده", href: "/contact" },
  { name: "حریم خصوصی", href: "/contact" },
];
interface MainHeaderProps {
  noBorder?: boolean;
}
const MainHeader: React.FC<MainHeaderProps> = ({ noBorder }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 500);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 bg-white z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${!noBorder && "border-b"}  border-black pb-2`}
    >
      <div className="flex items-center justify-between px-4 py-2 mx-1 mt-2">
        {/* Drawer toggle button */}
        <button onClick={toggleDrawer} className="text-2xl">
          {/* <Image
            src={"/images/icons/menu.svg"}
            width={20}
            height={20}
            alt="menu میزبانو | menu Bell Boy"
          /> */}
          <MenuIcon />
        </button>

        {/* Logo */}
        <div className="flex items-center ml-3">
          <LogoIcon />
          {/* <Image
            src={"/images/logo.svg"}
            width={120}
            height={100}
            alt="لوگو میزبانو | Logo Bell Boy"
          /> */}
        </div>

        {/* Phone link */}
        <Link href="tel:+1234567890" className="text-2xl">
          <Image
            src={"/images/icons/phone.svg"}
            width={20}
            height={20}
            alt="phone میزبانو | phone Bell Boy"
          />
        </Link>
      </div>

      {/* Full-Width Drawer */}
      <DrawerMenu isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} links={links} />
    </header>
  );
};

export default MainHeader;
