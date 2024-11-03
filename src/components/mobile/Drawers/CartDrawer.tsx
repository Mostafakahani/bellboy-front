import React, { useState, useEffect } from "react";
import { Modal } from "@/components/BellMazeh/Modal";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300); // مدت زمان انیمیشن
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="سبدخرید">
      <div className="p-4 overflow-y-auto h-full"></div>
    </Modal>
  );
};

export default CartDrawer;
