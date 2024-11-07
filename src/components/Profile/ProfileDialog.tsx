import React, { useEffect, useState } from "react";
import Image from "next/image";
import moment from "jalali-moment";
import { Input } from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import { PhoneNumberDisplay } from "./PhoneNumberDisplay";
import { PhoneNumberEditDialog } from "./PhoneNumberEditDialog";
import { DialogProps, FormData } from "./ProfileTypes";
import { ProfileData } from "@/app/profile/(main)/ProfileMainPageClient";
import { DatePickerDemo } from "../DatePicker";
import { ApiResponse, useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError, showSuccess } from "@/lib/toastService";

interface ExtendedDialogProps extends DialogProps {
  profileData: ProfileData;
}

// تبدیل تاریخ شمسی به میلادی با فرمت ISO
const convertJalaliToIso = (jalaliDate: string): string => {
  if (!jalaliDate) return "";
  try {
    return moment.from(jalaliDate, "fa", "YYYY/MM/DD").locale("en").format("YYYY-MM-DD");
  } catch (error) {
    console.error("Error converting Jalali to ISO:", error);
    return "";
  }
};

// تبدیل تاریخ میلادی به شمسی
const convertIsoToJalali = (isoDate: string): string => {
  if (!isoDate) return "";
  try {
    return moment(isoDate).locale("fa").format("YYYY/MM/DD");
  } catch (error) {
    console.error("Error converting ISO to Jalali:", error);
    return "";
  }
};

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
    phoneNumber: "09123456789",
    birthDate: "", // این در فرمت ISO ذخیره می‌شود
  });
  const [displayDate, setDisplayDate] = useState(""); // این در فرمت شمسی نمایش داده می‌شود
  const [loading, setLoading] = useState<boolean>(false);
  const [dateError, setDateError] = useState<string>("");

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
      }));
      // تبدیل تاریخ ISO به شمسی برای نمایش
      if (profileData.birthDate) {
        setDisplayDate(convertIsoToJalali(profileData.birthDate));
      }
    }
  }, [profileData]);

  const handleDateChange = (jalaliDate: string | null) => {
    setDateError("");

    if (!jalaliDate) {
      setFormData((prev) => ({ ...prev, birthDate: "" }));
      setDisplayDate("");
      return;
    }

    // const isoDate = convertJalaliToIso(jalaliDate);

    // if (!isValidIsoFormat(isoDate)) {
    //   setDateError("فرمت تاریخ تولد وارد شده صحیح نیست. لطفا تاریخ معتبری را انتخاب کنید.");
    //   return;
    // }

    setDisplayDate(jalaliDate);
    setFormData((prev) => ({ ...prev, birthDate: jalaliDate }));
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
          body: JSON.stringify({ ...formData, birthDate: convertJalaliToIso(formData.birthDate) }), // تاریخ بصورت ISO ارسال می‌شود
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneEdit = () => {
    setShowPhoneEdit(true);
  };

  const handlePhoneSave = (newNumber: string) => {
    setFormData((prev) => ({ ...prev, phoneNumber: newNumber }));
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white w-full p-6 transform transition-all duration-300 ease-out ${
            isOpen
              ? "translate-y-0 scale-100 opacity-100 h-[93vh]"
              : "translate-y-full scale-95 opacity-0 h-0"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">مشخصات حساب من</h2>
            <button onClick={onClose}>
              <Image width={24} height={24} src="/images/icons/close.svg" alt="close" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col justify-between h-[78vh] mt-12">
            <div className="flex flex-col gap-4">
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                type="text"
                label="نام"
              />
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                type="text"
                label="نام خانوادگی"
              />
              <PhoneNumberDisplay phoneNumber={formData.phoneNumber} onEdit={handlePhoneEdit} />
              <DatePickerDemo
                label="تاریخ تولد"
                value={displayDate} // نمایش تاریخ شمسی
                onChange={handleDateChange}
                readOnly={false}
              />
              {dateError && <p className="text-red-500 text-sm mt-1">{dateError}</p>}
            </div>
            <Button onXsIsText type="submit" disabled={loading || !!dateError}>
              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
          </form>
        </div>
      </div>
      <PhoneNumberEditDialog
        isOpen={showPhoneEdit}
        onClose={() => setShowPhoneEdit(false)}
        onSave={handlePhoneSave}
        currentPhoneNumber={formData.phoneNumber}
      />
    </>
  );
};
