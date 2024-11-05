import Image from "next/image";
import React, { useState, useEffect } from "react";
import { InputRadio } from "./ui/Input/Radio";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";

// API response type
interface DeliveryTimeSlot {
  _id: string;
  date: string;
  startHour: string;
  endHour: string;
  type: string;
}

// Component types
export type TimeSlot = {
  _id: string;
  start: string;
  end: string;
};

type DaySchedule = {
  date: string;
  dayName: string;
  timeSlots: TimeSlot[];
};

interface DateTimeSelectorProps {
  selectedTime: TimeSlot | null;
  setSelectedTime: React.Dispatch<React.SetStateAction<TimeSlot | null>>;
  onSelect: (selectedDate: string, selectedTime: TimeSlot) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedTime,
  setSelectedTime,
  onSelect,
}) => {
  const authenticatedFetch = useAuthenticatedFetch();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to convert API date to Persian day name
  const getPersianDayName = (dateStr: string): string => {
    const date = new Date(dateStr);
    const days = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"];
    return days[date.getDay()];
  };

  // Function to format date to Persian format
  const formatPersianDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    // You might want to use a proper Persian date formatter library here
    return date.toLocaleDateString("fa-IR");
  };

  // Transform API data to component format
  const transformApiData = (apiData: DeliveryTimeSlot[]): DaySchedule[] => {
    const groupedByDate = apiData.reduce((acc: { [key: string]: TimeSlot[] }, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }
      acc[slot.date].push({
        _id: slot._id,
        start: slot.startHour.split(":")[0],
        end: slot.endHour.split(":")[0],
      });
      return acc;
    }, {});

    return Object.entries(groupedByDate).map(([date, timeSlots]) => ({
      date,
      dayName: getPersianDayName(date),
      timeSlots: timeSlots.sort((a, b) => Number(a.start) - Number(b.start)), // مرتب‌سازی بر اساس زمان شروع
    }));
  };

  const fetchDeliveryTimes = async () => {
    try {
      setIsLoading(true);
      const { data } = await authenticatedFetch("/delivery-time/shop");
      const transformedData = transformApiData(Array.isArray(data) ? data : []);
      setWeekSchedule(transformedData);
    } catch (error) {
      console.error("Error fetching delivery times:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchDeliveryTimes();
  }, []);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: TimeSlot) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSelect(selectedDate, time);
    }
  };

  if (isLoading) {
    return <div className="p-4">در حال بارگذاری...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mt-2 mb-4">برای دریافت خدمت، یک زمان انتخاب کنید</h2>
      <p className="flex flex-row gap-2 text-sm text-black font-light text-right mb-4">
        <Image src={"/images/icons/hand.png"} width={24} height={24} alt="hand" />
        در زمان مورد نظر در منزل حاضر باشید
      </p>

      <div className="space-y-5">
        {weekSchedule.map((day) => (
          <div key={day.date}>
            <button
              className={`border-2 border-black rounded-xl overflow-hidden w-full text-black font-bold text-right py-3 px-4 ${
                selectedDate === day.date ? "bg-primary-100" : "bg-white"
              }`}
              onClick={() => handleDateSelect(day.date)}
            >
              {`${day.dayName} ${formatPersianDate(day.date)}`}
            </button>
            {selectedDate === day.date && (
              <div className="bg-gray-50 mt-4 pr-10 space-y-5">
                {day.timeSlots.map((slot) => (
                  <button
                    key={slot._id}
                    className={`w-full flex flex-row text-right py-3 px-4 rounded-xl text-black font-bold border-2 border-black ${
                      selectedTime?._id === slot._id ? "bg-primary-100" : "bg-white"
                    }`}
                    onClick={() => handleTimeSelect(slot)}
                  >
                    <InputRadio
                      darkMode={selectedTime?._id === slot._id}
                      setDarkMode={() => handleTimeSelect(slot)}
                      className="ml-2"
                    />
                    {`ساعت ${slot.start} تا ${slot.end}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DateTimeSelector;
