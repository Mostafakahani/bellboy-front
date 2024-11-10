"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { loadState } from "@/utils/localStorage";

interface MenuItem {
  icon?: React.ReactNode;
  iconActive: string;
  iconInactive: string;
  label: string;
  href: string;
  action?: "link" | "drawer";
  drawerId?: string;
}

interface MenuConfig {
  [key: string]: MenuItem[];
}

// const iconComponents = {
//   Home,
//   ShoppingBag,
//   Clipboard,
//   User,
//   Settings,
//   BarChart,
//   Users,
// };

const menuConfigs: MenuConfig = {
  main: [
    {
      iconActive: "/images/icons/home-active.svg",
      iconInactive: "/images/icons/home.svg",
      label: "خانه",
      href: "/",
      action: "link",
    },
    {
      iconActive: "/images/icons/services-active.svg",
      iconInactive: "/images/icons/services.svg",
      label: "خدمات بِل‌بوی",
      href: "/service",
      action: "drawer",
      drawerId: "bellService",
    },
    {
      iconActive: "/images/icons/shop-active.svg",
      iconInactive: "/images/icons/shop.svg",
      label: "سبدخرید",
      href: "/cart",
      action: "drawer",
      drawerId: "cartDrawer",
    },
    {
      iconActive: "/images/icons/user-active.svg",
      iconInactive: "/images/icons/user.svg",
      label: "حساب من",
      href: "/profile",
      action: "link",
    },
  ],
  adminDashboard: [
    {
      iconActive: "/images/icons/admin/orders-active.svg",
      iconInactive: "/images/icons/admin/orders.svg",
      label: "سفارش ها",
      href: "/dashboard/orders",
      action: "link",
    },
    {
      iconActive: "/images/icons/admin/guid-active.svg",
      iconInactive: "/images/icons/admin/guid.svg",
      label: "بل‌گاید",
      href: "/dashboard/bellguid",
      action: "link",
    },
    {
      iconActive: "/images/icons/admin/products-active.svg",
      iconInactive: "/images/icons/admin/products.svg",
      label: "کالاها",
      href: "/dashboard/products",
      action: "link",
    },
    {
      iconActive: "/images/icons/admin/users-active.svg",
      iconInactive: "/images/icons/admin/users.svg",
      label: "کاربران",
      href: "/dashboard/users",
      action: "link",
    },
    {
      iconActive: "/images/icons/home-active.svg",
      iconInactive: "/images/icons/home.svg",
      label: "داشبورد",
      href: "/dashboard/main",
      action: "drawer",
      drawerId: "dashboard",
    },
  ],
  adminPanel: [
    {
      iconActive: "/images/icons/home-active.svg",
      iconInactive: "/images/icons/home.svg",
      label: "آمار",
      href: "/admin",
      action: "link",
    },
    {
      iconActive: "/images/icons/home-active.svg",
      iconInactive: "/images/icons/home.svg",
      label: "کاربران",
      href: "/admin/users",
      action: "link",
    },
    {
      iconActive: "/images/icons/home-active.svg",
      iconInactive: "/images/icons/home.svg",
      label: "محصولات",
      href: "/admin/products",
      action: "drawer",
      drawerId: "products",
    },
    {
      iconActive: "/images/icons/home-active.svg",
      iconInactive: "/images/icons/home.svg",
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
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cartItems = loadState("cart");
        setCartItemsCount(cartItems.length);
      } catch (error) {
        console.log(error);
        setCartItemsCount(0);
      }
    };

    updateCartCount(); // Initial check

    // Set up interval to run every 2 seconds (2000 milliseconds)
    const interval = setInterval(updateCartCount, 2000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (pathname.startsWith("/dashboard")) {
      setActiveConfig(menuConfigs.adminDashboard);
    } else if (pathname.startsWith("/admin")) {
      setActiveConfig(menuConfigs.adminPanel);
    } else {
      setActiveConfig(menuConfigs.main);
    }
  }, [pathname]);

  const isActive = (itemHref: string) => {
    if (itemHref === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(itemHref);
  };

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
          const isCartItem = item.href === "/cart";

          // const IconComponent = iconComponents[item.icon as keyof typeof iconComponents];
          return (
            <li key={item.href} className="flex-1">
              <button
                onClick={() => handleItemClick(item)}
                className="w-full flex flex-col items-center justify-center h-full"
              >
                {isActive(item.href) ? (
                  <div
                    className={`transition-all duration-300 ease-in-out text-blue-500 scale-110`}
                  >
                    <div className="relative h-[80px]">
                      <div className="flex flex-col items-center justify-center w-[70px] absolute top-[-10px] px-3 py-5 -left-9 bg-white border-[5px] border-black rounded-t-full">
                        {/* {isCartItem && cartItemsCount > 0 && (
                          <div className="absolute top-2 mr-[25px] bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {cartItemsCount}
                          </div>
                        )} */}
                        <Image
                          src={item.iconActive}
                          alt={item.label}
                          width={24}
                          height={24}
                          priority
                        />
                        <span className="text-[11px] mt-1 text-nowrap text-black font-black">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`transition-all duration-300 ease-in-out flex flex-col items-center justify-center`}
                  >
                    {isCartItem && cartItemsCount > 0 && (
                      <div className="absolute top-2 mr-[25px] bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemsCount}
                      </div>
                    )}
                    <Image
                      src={item.iconInactive}
                      alt={item.label}
                      width={24}
                      height={24}
                      priority
                    />
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
