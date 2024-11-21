"use client";

import React, { useState } from "react";
import BottomMenu from "../Menu/BottomMenu";
import SettingsDrawer from "./SettingsDrawer";
import ServicesDrawer from "./ServicesDrawer";
import CartDrawer from "./CartDrawer";
import DashboardDrawer from "./DashboardDrawer";
import Head from "next/head";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  const handleOpenDrawer = (drawerId: string) => {
    setActiveDrawer(drawerId);
  };

  const handleCloseDrawer = () => {
    setActiveDrawer(null);
  };

  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      {children}
      <BottomMenu onOpenDrawer={handleOpenDrawer} />

      {/* Drawer components */}
      {/* <ServicesDrawer isOpen={activeDrawer === "services"} onClose={handleCloseDrawer} />
      <AccountDrawer isOpen={activeDrawer === "account"} onClose={handleCloseDrawer} /> */}
      <SettingsDrawer isOpen={activeDrawer === "settings"} onClose={handleCloseDrawer} />
      <ServicesDrawer isOpen={activeDrawer === "bellService"} onClose={handleCloseDrawer} />
      <DashboardDrawer isOpen={activeDrawer === "dashboard"} onClose={handleCloseDrawer} />
      <CartDrawer isOpen={activeDrawer === "cartDrawer"} onClose={handleCloseDrawer} />
      {/* <ProfileDrawer isOpen={activeDrawer === "profile"} onClose={handleCloseDrawer} />
      <ProductsDrawer isOpen={activeDrawer === "products"} onClose={handleCloseDrawer} />
      <AdminSettingsDrawer isOpen={activeDrawer === "adminSettings"} onClose={handleCloseDrawer} /> */}
    </div>
  );
};

export default Layout;
