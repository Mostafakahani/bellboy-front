import React from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import moment from "jalali-moment";
import { Input } from "./ui/Input/Input";

function CustomInput({ openCalendar, value, handleValueChange }: any) {
  return (
    <Input
      onFocus={openCalendar}
      value={value || ""} // مدیریت مقدار خالی
      onChange={handleValueChange}
      label="تاریخ تولد"
      readOnly
    />
  );
}

export function DatePickerDemo({
  value,
  onChange,
  readOnly,
}: {
  value: string | null | undefined;
  onChange: (date: string | null) => void;
  readOnly: boolean;
}) {
  const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

  // تبدیل تاریخ میلادی به شمسی برای نمایش
  const initialValue = React.useMemo(() => {
    if (!value) return undefined;

    try {
      if (moment(value).isValid()) {
        return new DateObject({
          calendar: persian,
          locale: persian_fa,
          date: new Date(value),
        });
      }
      return undefined;
    } catch {
      return undefined;
    }
  }, [value]);

  const handleDateChange = (selectedDate: DateObject | null | undefined) => {
    if (!selectedDate) {
      onChange(null);
      return;
    }

    try {
      // تبدیل تاریخ شمسی به میلادی
      const gregorianDate = selectedDate.format("YYYY-MM-DD");

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
      render={<CustomInput />}
      weekDays={weekDays}
      format="YYYY/MM/DD"
      inputClass="w-full"
    />
  );
}
