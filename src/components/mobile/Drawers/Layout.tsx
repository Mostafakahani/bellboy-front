"use client";

import React, { useState } from "react";
import BottomMenu from "../Menu/BottomMenu";
import SettingsDrawer from "./SettingsDrawer";

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
      {children}
      <BottomMenu onOpenDrawer={handleOpenDrawer} />

      {/* Drawer components */}
      {/* <ServicesDrawer isOpen={activeDrawer === "services"} onClose={handleCloseDrawer} />
      <AccountDrawer isOpen={activeDrawer === "account"} onClose={handleCloseDrawer} /> */}
      <SettingsDrawer isOpen={activeDrawer === "settings"} onClose={handleCloseDrawer} />
      {/* <ProfileDrawer isOpen={activeDrawer === "profile"} onClose={handleCloseDrawer} />
      <ProductsDrawer isOpen={activeDrawer === "products"} onClose={handleCloseDrawer} />
      <AdminSettingsDrawer isOpen={activeDrawer === "adminSettings"} onClose={handleCloseDrawer} /> */}
    </div>
  );
};

export default Layout;
