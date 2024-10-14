"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, ShoppingBag, Clipboard, User, Settings, BarChart, Users } from "lucide-react";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  action?: "link" | "drawer";
  drawerId?: string;
}

interface MenuConfig {
  [key: string]: MenuItem[];
}

const iconComponents = {
  Home,
  ShoppingBag,
  Clipboard,
  User,
  Settings,
  BarChart,
  Users,
};

const menuConfigs: MenuConfig = {
  main: [
    { icon: "Home", label: "خانه", href: "/", action: "link" },
    {
      icon: "ShoppingBag",
      label: "خدمات بِل‌بوی",
      href: "/service",
      action: "drawer",
      drawerId: "bellService",
    },
    {
      icon: "Clipboard",
      label: "خدمات",
      href: "/s",
      action: "link",
    },
    { icon: "User", label: "حساب من", href: "/profile", action: "link" },
  ],
  userDashboard: [
    { icon: "Home", label: "داشبورد", href: "/dashboard", action: "link" },
    { icon: "Clipboard", label: "سفارش‌ها", href: "/dashboard/orders", action: "link" },
    {
      icon: "Settings",
      label: "تنظیمات",
      href: "/dashboard/settings",
      action: "drawer",
      drawerId: "settings",
    },
    {
      icon: "User",
      label: "پروفایل",
      href: "/dashboard/profile",
      action: "drawer",
      drawerId: "profile",
    },
  ],
  adminPanel: [
    { icon: "BarChart", label: "آمار", href: "/admin", action: "link" },
    { icon: "Users", label: "کاربران", href: "/admin/users", action: "link" },
    {
      icon: "ShoppingBag",
      label: "محصولات",
      href: "/admin/products",
      action: "drawer",
      drawerId: "products",
    },
    {
      icon: "Settings",
      label: "تنظیمات",
      href: "/admin/settings",
      action: "drawer",
      drawerId: "adminSettings",
    },
  ],
};

interface BottomMenuProps {
  onOpenDrawer: (drawerId: string) => void;
}

const BottomMenu: React.FC<BottomMenuProps> = ({ onOpenDrawer }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeConfig, setActiveConfig] = useState<MenuItem[]>(menuConfigs.main);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (pathname.startsWith("/dashboard")) {
      setActiveConfig(menuConfigs.userDashboard);
    } else if (pathname.startsWith("/admin")) {
      setActiveConfig(menuConfigs.adminPanel);
    } else {
      setActiveConfig(menuConfigs.main);
    }
  }, [pathname]);

  const handleItemClick = (item: MenuItem) => {
    if (item.action === "drawer" && item.drawerId) {
      onOpenDrawer(item.drawerId);
    } else {
      router.push(item.href);
    }
  };

  if (!activeConfig) return null;

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <ul className="flex justify-around items-center h-16 bg-black">
        {activeConfig.map((item) => {
          const IconComponent = iconComponents[item.icon as keyof typeof iconComponents];
          return (
            <li key={item.href} className="flex-1">
              <button
                onClick={() => handleItemClick(item)}
                className="w-full flex flex-col items-center justify-center h-full"
              >
                {pathname === item.href ? (
                  <div
                    className={`transition-all duration-300 ease-in-out text-blue-500 scale-110`}
                  >
                    <div className="relative h-[80px]">
                      <div className="flex flex-col items-center justify-center w-[70px] absolute top-[-10px] px-3 py-5 -left-9 bg-white border-[5px] border-black rounded-t-full">
                        <IconComponent size={20} />
                        <span className="text-[11px] mt-1 text-nowrap">{item.label}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`transition-all duration-300 ease-in-out flex flex-col items-center justify-center`}
                  >
                    <IconComponent className="text-white" size={20} />
                    <span className="text-xs mt-1 text-white">{item.label}</span>
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomMenu;
