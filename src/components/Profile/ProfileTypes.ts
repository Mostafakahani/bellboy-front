export interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthDate: string;
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface PhoneNumberEditDialogProps extends DialogProps {
  onSave: (newNumber: string) => void;
  currentPhoneNumber: string;
  handlePhoneEdit: () => void;
}

export enum Step {
  PHONE,
  OTP,
  NEW_PHONE,
}
