import React, { useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import DrawerMenu from "./DrawerMenu";
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
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Drawer toggle button */}
        <button onClick={toggleDrawer} className="text-2xl">
          ☰
        </button>

        {/* Logo */}
        <div className="flex items-center">LOGO</div>

        {/* Phone link */}
        <Link href="tel:+1234567890" className="text-2xl">
          <Phone />
        </Link>
      </div>

      {/* Full-Width Drawer */}
      <DrawerMenu isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} links={links} />
    </header>
  );
};

export default MainHeader;
