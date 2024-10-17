import Image from "next/image";
import React, { useState } from "react";
import { InputRadio } from "./ui/Input/Radio";

type TimeSlot = {
  start: string;
  end: string;
};

type DaySchedule = {
  date: string;
  dayName: string;
  timeSlots: TimeSlot[];
};

interface DateTimeSelectorProps {
  weekSchedule: DaySchedule[];
  selectedTime: TimeSlot | null;
  setSelectedTime: React.Dispatch<React.SetStateAction<TimeSlot | null>>;
  onSelect: (selectedDate: string, selectedTime: TimeSlot) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  weekSchedule,
  selectedTime,
  setSelectedTime,
  onSelect,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    // setSelectedTime(null); // Reset time when date is changed
  };

  const handleTimeSelect = (time: TimeSlot) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSelect(selectedDate, time); // Call the onSelect function when both date and time are selected
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-right mb-4">برای دریافت خدمت، یک زمان انتخاب کنید</h2>
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
              {`${day.dayName} ${day.date}`}
            </button>
            {selectedDate === day.date && (
              <div className="bg-gray-50 mt-4 pr-10 space-y-5">
                {day.timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`w-full flex flex-row text-right py-3 px-4 rounded-xl text-black font-bold border-2 border-black ${
                      selectedTime?.start === slot.start && selectedTime.end === slot.end
                        ? "bg-primary-100"
                        : "bg-white"
                    }`}
                    onClick={() => handleTimeSelect(slot)}
                  >
                    <InputRadio
                      darkMode={selectedTime?.start === slot.start && selectedTime.end === slot.end}
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
