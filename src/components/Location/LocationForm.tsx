import AddressManagement from "../Profile/Address/AddressManagement";
import { Address } from "../Profile/Address/types";

interface LocationProps {
  formData: {
    addresses: Address[];
    selectedAddress: Address | null;
  };
  onFormChange: (data: { addresses: Address[]; selectedAddress: Address | null }) => void;
}

export const LocationForm: React.FC<LocationProps> = ({ formData, onFormChange }) => {
  const handleAddressChange = (updatedAddresses: Address[], selectedAddr: Address | null) => {
    onFormChange({ addresses: updatedAddresses, selectedAddress: selectedAddr });
  };

  return (
    <div className="py-4">
      <div className="container mx-auto">
        <AddressManagement
          initialAddresses={formData.addresses}
          onAddressChange={handleAddressChange}
          title="موقعیت خود را انتخاب کنید"
        />
      </div>
    </div>
  );
};
