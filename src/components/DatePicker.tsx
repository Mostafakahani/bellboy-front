import React from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";
import moment from "jalali-moment";
import { Input } from "./ui/Input/Input";

function CustomInput({ openCalendar, value, handleValueChange, label }: any) {
  return (
    <Input
      onFocus={openCalendar}
      value={value || ""} // مدیریت مقدار خالی
      onChange={handleValueChange}
      label={label || "تاریخ تولد"}
      readOnly
    />
  );
}

// تابع کمکی برای تبدیل اعداد فارسی به انگلیسی
const convertToEnglishNumbers = (str: string) => {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  persianNumbers.forEach((regex, index) => {
    str = str.replace(regex, englishNumbers[index]);
  });

  return str;
};

export function DatePickerDemo({
  value,
  onChange,
  readOnly,
  label,
}: {
  value: string | null | undefined;
  onChange: (date: string | null) => void;
  readOnly: boolean;
  label: string;
}) {
  const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

  // تنظیم مقدار اولیه تاریخ
  const initialValue = React.useMemo(() => {
    if (value) {
      try {
        if (moment(value).isValid()) {
          return new DateObject({
            calendar: persian,
            locale: persian_fa,
            date: new Date(value),
          });
        }
      } catch {
        return undefined;
      }
    }

    // اگر مقدار اولیه وجود نداشت، تاریخ امروز را تنظیم می‌کنیم
    return new DateObject({
      calendar: persian,
      locale: persian_fa,
      date: new Date(),
    });
  }, [value]);

  const handleDateChange = (selectedDate: DateObject | null | undefined) => {
    if (!selectedDate) {
      onChange(null);
      return;
    }

    try {
      // تبدیل تاریخ شمسی به میلادی
      let gregorianDate = selectedDate.convert(gregorian).format("YYYY-MM-DD");
      gregorianDate = convertToEnglishNumbers(gregorianDate); // تبدیل اعداد فارسی به انگلیسی
      onChange(gregorianDate);
    } catch (error) {
      console.error("Error converting date:", error);
      onChange(null);
    }
  };

  return (
    <DatePicker
      calendar={persian}
      locale={persian_fa}
      calendarPosition="bottom-right"
      disabled={readOnly}
      value={initialValue}
      onChange={handleDateChange}
      render={<CustomInput label={label} />}
      weekDays={weekDays}
      format="YYYY/MM/DD"
      inputClass="w-full"
    />
  );
}
