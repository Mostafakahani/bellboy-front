import { Address } from "@/app/profile/address/types";
import React from "react";

interface AddressListProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onSelect: (addressId: string) => void;
}

const AddressList: React.FC<AddressListProps> = ({
  addresses,
  selectedAddressId,
  onEdit,
  onDelete,
  onSelect,
}) => {
  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <div
          key={address.id}
          className={`border rounded-lg p-4 flex justify-between items-center cursor-pointer ${
            selectedAddressId === address.id ? "bg-blue-100 border-blue-500" : ""
          }`}
          onClick={() => onSelect(address.id!)}
        >
          <div className="flex items-center">
            <input
              type="radio"
              checked={selectedAddressId === address.id}
              onChange={() => onSelect(address.id!)}
              className="mr-3"
            />
            <div>
              <h3 className="font-semibold">{address.title}</h3>
              <p className="text-sm text-gray-600">{`${address.province}، ${address.city}، ${address.street}`}</p>
              <p className="text-sm text-gray-600">{`کد پستی: ${address.postalCode}`}</p>
            </div>
          </div>
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address);
              }}
              className="text-blue-500 hover:text-blue-700 mr-2"
            >
              ویرایش
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(address.id!);
              }}
              className="text-red-500 hover:text-red-700"
            >
              حذف
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;
