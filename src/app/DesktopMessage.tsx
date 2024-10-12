"use client";

import React, { useState, useEffect } from "react";

interface DesktopMessageProps {
  children: React.ReactNode;
  allowDesktop?: boolean;
}

const DesktopMessage: React.FC<DesktopMessageProps> = ({ children, allowDesktop = false }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!isDesktop || allowDesktop) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-gray-800 text-white flex items-center justify-center z-50">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">بزودی...</h1>
        <p className="text-md font-extralight">لطفاً با یک دستگاه موبایل یا تبلت وارد شوید.</p>
      </div>
    </div>
  );
};

export default DesktopMessage;
