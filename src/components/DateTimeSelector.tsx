import Image from "next/image";
import React, { useState, useEffect } from "react";
import { InputRadio } from "./ui/Input/Radio";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import moment from "jalali-moment";

interface DeliveryTimeSlot {
  _id: string;
  date: string;
  startHour: string;
  endHour: string;
  type: string;
}

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
  type?: string;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedTime,
  setSelectedTime,
  onSelect,
  type = "shop",
}) => {
  const authenticatedFetch = useAuthenticatedFetch();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getPersianDayName = (dateStr: string): string => {
    const jalaliDate = moment(dateStr).locale("fa");
    return jalaliDate.format("dddd");
  };

  const formatPersianDate = (dateStr: string): string => {
    const jalaliDate = moment(dateStr).locale("fa");
    return jalaliDate.format("D MMMM");
  };

  const isTimeSlotValid = (date: string, startHour: string): boolean => {
    const now = moment();
    const slotDateTime = moment(date)
      .hours(parseInt(startHour.split(":")[0]))
      .minutes(parseInt(startHour.split(":")[1]));
    return slotDateTime.isAfter(now);
  };

  const sortTimeSlots = (slots: TimeSlot[]): TimeSlot[] => {
    return slots.sort((a, b) => {
      const timeA = a.start.split(":").map(Number);
      const timeB = b.start.split(":").map(Number);
      return timeA[0] * 60 + (timeA[1] || 0) - (timeB[0] * 60 + (timeB[1] || 0));
    });
  };

  const transformApiData = (apiData: DeliveryTimeSlot[]): DaySchedule[] => {
    // const now = moment();

    const groupedByDate = apiData.reduce((acc: { [key: string]: TimeSlot[] }, slot) => {
      // Only process if the slot is in the future
      if (isTimeSlotValid(slot.date, slot.startHour)) {
        if (!acc[slot.date]) {
          acc[slot.date] = [];
        }
        acc[slot.date].push({
          _id: slot._id,
          start: slot.startHour,
          end: slot.endHour,
        });
      }
      return acc;
    }, {});

    // Filter out dates with no valid time slots
    return Object.entries(groupedByDate)
      .filter(([_, timeSlots]) => timeSlots.length > 0) // eslint-disable-line @typescript-eslint/no-unused-vars
      .map(([date, timeSlots]) => ({
        date,
        dayName: getPersianDayName(date),
        timeSlots: sortTimeSlots(timeSlots),
      }))
      .sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
  };

  const fetchDeliveryTimes = async () => {
    try {
      setIsLoading(true);
      const { data } = await authenticatedFetch("/delivery-time/" + type);
      const transformedData = transformApiData(Array.isArray(data) ? data : []);
      setWeekSchedule(transformedData);

      // Reset selection if the currently selected time is no longer valid
      if (selectedTime && selectedDate) {
        if (!isTimeSlotValid(selectedDate, selectedTime.start)) {
          setSelectedTime(null);
          setSelectedDate(null);
        }
      }
    } catch (error) {
      console.error("Error fetching delivery times:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryTimes();
    // Refresh data every minute to keep the available times current
    const intervalId = setInterval(fetchDeliveryTimes, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: TimeSlot) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSelect(selectedDate, time);
    }
  };

  const formatTimeSlot = (start: string, end: string) => {
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(":");
      return minutes === "00" ? hours : `${hours}:${minutes}`;
    };
    return `ساعت ${formatTime(start)} تا ${formatTime(end)}`;
  };

  if (isLoading) {
    return <div className="p-4">در حال بارگذاری...</div>;
  }

  if (weekSchedule.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4 text-right text-sm">
          در حال حاضر هیچ زمان آزادی برای رزرو وجود ندارد.
        </div>
      </div>
    );
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
                    {formatTimeSlot(slot.start, slot.end)}
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
