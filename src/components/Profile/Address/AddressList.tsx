import { ThemeSelector } from "@/app/page";
import Button from "@/components/ui/Button/Button";
import Image from "next/image";
import React from "react";
import { Address } from "./types";
import { InputRadio } from "@/components/ui/Input/Radio";

interface AddressListProps {
  addresses: Address[];
  selectedAddressId: string | null;
  clickEditButton: boolean | null;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onSelect: (addressId: string) => void;
}

const AddressList: React.FC<AddressListProps> = ({
  addresses,
  selectedAddressId,
  clickEditButton,
  onEdit,
  onDelete,
  onSelect,
}) => {
  return (
    <div className="space-y-6">
      {addresses.map((address) => (
        <div key={address.id}>
          {clickEditButton ? (
            <div className="flex space-x-2">
              <div
                className={`flex-col min-w-full border-2 border-black rounded-xl p-7 flex justify-between items-start cursor-pointer`}
              >
                <div className="flex items-center">
                  <div className="flex flex-col gap-3">
                    <div className="w-full flex flex-row gap-3">
                      <h3 className="font-semibold">{address.title}</h3>
                      <p className="py-1 px-1.5 bg-gray-100 rounded-full text-[11px] font-bold line max-w-full">
                        شناسه {address.postalCode}
                      </p>
                    </div>
                    <div className="flex flex-row items-start">
                      <Image width={30} height={30} src={"/images/icons/gps.svg"} alt="gps icon" />
                      <p className="text-sm text-gray-600 line-clamp-2">{`${address.province}، ${address.city}، ${address.street}`}</p>
                    </div>
                  </div>
                </div>
                <div className="border-b-2 border-black w-full my-4"></div>
                <div className="w-full flex flex-row justify-between ">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(address);
                    }}
                    onXsIsText
                    variant="secondary"
                  >
                    ویرایش
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(address.id!);
                    }}
                    icon="trash"
                    variant="tertiary"
                    isError
                  />
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`border-2 border-black rounded-xl p-7 flex justify-between items-center cursor-pointer ${
                selectedAddressId === address.id ? "bg-primary-400/10" : ""
              }`}
              onClick={() => onSelect(address.id!)}
            >
              <div className="flex items-center">
                <InputRadio
                  darkMode={selectedAddressId === address.id}
                  setDarkMode={() => onSelect(address.id!)}
                  className="ml-3"
                />
                <div className="flex flex-col gap-3">
                  <div className="w-full flex flex-row gap-3">
                    <h3 className="font-semibold">{address.title}</h3>
                    <p className="py-1 px-1.5 bg-gray-100 rounded-full text-[11px] font-bold line-clamp-1">
                      شناسه {address.postalCode}
                    </p>
                  </div>
                  <div className="flex flex-row items-start">
                    <Image width={30} height={30} src={"/images/icons/gps.svg"} alt="gps icon" />
                    <p className="text-sm text-gray-600 line-clamp-2">{`${address.province}، ${address.city}، ${address.street}`}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AddressList;
