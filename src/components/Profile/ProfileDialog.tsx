import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import { PhoneNumberDisplay } from "./PhoneNumberDisplay";
import { PhoneNumberEditDialog } from "./PhoneNumberEditDialog";
import { DialogProps, FormData } from "./ProfileTypes";
import { ProfileData } from "@/app/profile/(main)/ProfileMainPageClient";
import { DatePickerDemo } from "../DatePicker";
import { ApiResponse, useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError, showSuccess } from "@/lib/toastService";
import SuccessDialog from "./SuccessDialog";
import { Modal } from "../BellMazeh/Modal";

interface ExtendedDialogProps extends DialogProps {
  profileData: ProfileData;
}

// تبدیل تاریخ شمسی به میلادی با فرمت ISO
// const convertJalaliToIso = (jalaliDate: string): string => {
//   if (!jalaliDate) return "";
//   try {
//     return moment.from(jalaliDate, "fa", "YYYY/MM/DD").locale("en").format("YYYY-MM-DD");
//   } catch (error) {
//     console.error("Error converting Jalali to ISO:", error);
//     return "";
//   }
// };

// // تبدیل تاریخ میلادی به شمسی
// const convertIsoToJalali = (isoDate: string): string => {
//   if (!isoDate) return "";
//   try {
//     return moment(isoDate).locale("fa").format("YYYY/MM/DD");
//   } catch (error) {
//     console.error("Error converting ISO to Jalali:", error);
//     return "";
//   }
// };

// اعتبارسنجی فرمت ISO
// const isValidIsoFormat = (date: string): boolean => {
//   if (!date) return true; // اگر تاریخ خالی باشد، معتبر است
//   const isoFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
//   if (!isoFormatRegex.test(date)) return false;
//   return moment(date, "YYYY-MM-DD", true).isValid();
// };

export const ProfileDialog: React.FC<ExtendedDialogProps> = ({ isOpen, onClose, profileData }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    birthDate: "", // این در فرمت ISO ذخیره می‌شود
  });
  // const [displayDate, setDisplayDate] = useState(""); // این در فرمت شمسی نمایش داده می‌شود
  const [loading, setLoading] = useState<boolean>(false);
  // const [dateError, setDateError] = useState<string>("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [showPhoneEdit, setShowPhoneEdit] = useState(false);
  const authenticatedFetch = useAuthenticatedFetch();

  useEffect(() => {
    if (profileData) {
      console.log(profileData);
      setFormData((prev) => ({
        ...prev,
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        birthDate: profileData.birthDate || "",
        phoneNumber: profileData.phone || "",
      }));
      // تبدیل تاریخ ISO به شمسی برای نمایش
      // if (profileData.birthDate) {
      //   setDisplayDate(convertIsoToJalali(profileData.birthDate));
      // }
    }
  }, [profileData]);

  const handleFormChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (value: string | null) => {
    handleFormChange("birthDate", value || "");
  };
  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    onClose();
  };
  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (formData.birthDate && !isValidIsoFormat(formData.birthDate)) {
    //   setDateError("فرمت تاریخ تولد وارد شده صحیح نیست. لطفا تاریخ معتبری را انتخاب کنید.");
    //   return;
    // }

    try {
      setLoading(true);

      const { data, error, message, status } = await authenticatedFetch<ApiResponse>(
        "/users/profile",
        {
          method: "PATCH",
          body: JSON.stringify({ ...formData, birthDate: formData.birthDate }), // تاریخ بصورت ISO ارسال می‌شود
        }
      );

      if (error) {
        setLoading(false);
        throw new Error(formatErrorMessage(message));
      }

      if (data?.statusCode && data.statusCode !== 200) {
        throw new Error(formatErrorMessage(data.message));
      }

      if (status === "success") {
        showSuccess(message);
        onClose();
      } else {
        throw new Error(formatErrorMessage(data?.message) || "خطا در ارسال اطلاعات");
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  // const handleInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handlePhoneEdit = async () => {
    try {
      const { data, error, message, status } = await authenticatedFetch<ApiResponse>(
        "/users/auth",
        {
          method: "POST",
          body: JSON.stringify({ phone: profileData.phone }),
        }
      );
      if (error) {
        setLoading(false);
        throw new Error(formatErrorMessage(message));
      }

      if (data?.statusCode && data.statusCode !== 200) {
        throw new Error(formatErrorMessage(data.message));
      }

      if (status === "success") {
        showSuccess(message);
        setShowPhoneEdit(true);
      } else {
        throw new Error(formatErrorMessage(data?.message) || "خطا در ارسال کد تایید");
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSave = async (newNumber: string) => {
    // if (formData.birthDate && !isValidIsoFormat(formData.birthDate)) {
    //   setDateError("فرمت تاریخ تولد وارد شده صحیح نیست. لطفا تاریخ معتبری را انتخاب کنید.");
    //   return;
    // }

    try {
      setLoading(true);

      const { data, error, message, status } = await authenticatedFetch<ApiResponse>(
        "/users/profile",
        {
          method: "PATCH",
          body: JSON.stringify({ ...formData, phone: newNumber }),
        }
      );

      if (error) {
        setLoading(false);
        throw new Error(formatErrorMessage(message));
      }

      if (data?.statusCode && data.statusCode !== 200) {
        throw new Error(formatErrorMessage(data.message));
      }

      if (status === "success") {
        showSuccess(message);
        setShowSuccessDialog(true);
        onClose();
      } else {
        throw new Error(formatErrorMessage(data?.message) || "خطا در ارسال اطلاعات");
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="ویرایش حساب من">
        <form onSubmit={handleSubmit} className="flex flex-col justify-between mt-12 px-4 pb-5">
          <div className="flex flex-col gap-4">
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={(e) => handleFormChange("firstName", e.target.value)}
              type="text"
              label="نام"
            />
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={(e) => handleFormChange("lastName", e.target.value)}
              type="text"
              label="نام خانوادگی"
            />
            <PhoneNumberDisplay phoneNumber={formData.phoneNumber} onEdit={handlePhoneEdit} />
            <DatePickerDemo
              label="تاریخ تولد"
              value={formData.birthDate}
              onChange={handleDateChange}
              readOnly={false}
            />
            {/* {dateError && <p className="text-red-500 text-sm mt-1">{dateError}</p>} */}
          </div>
          <Button onXsIsText type="submit" disabled={loading}>
            {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </form>
      </Modal>

      <PhoneNumberEditDialog
        handlePhoneEdit={handlePhoneEdit}
        isOpen={showPhoneEdit}
        onClose={() => setShowPhoneEdit(false)}
        onSave={handlePhoneSave}
        currentPhoneNumber={formData.phoneNumber}
      />
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={handleSuccessDialogClose}
        message="با موفقیت انجام شد"
      />
    </>
  );
};
