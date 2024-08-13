import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DogInfo = () => {
  const today = new Date();
  const [date, setDate] = useState(today);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  // Helper functions to format the dates
  const formatDay = (date) => date.getDate().toString();
  const formatYear = (date) => date.getFullYear().toString();
  const formatMonthYear = (date) => `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="flex justify-center w-full">
      <Calendar
        value={date}
        onChange={handleDateChange}
        formatDay={(locale, date) => formatDay(date)} // Format day without moment.js
        formatYear={(locale, date) => formatYear(date)} // Format year without moment.js
        formatMonthYear={(locale, date) => formatMonthYear(date)} // Format month and year without moment.js
        calendarType="gregory"
        showNeighboringMonth={false}
        next2Label={null}
        prev2Label={null}
        minDetail="year"
        className="w-full bg-gray-100 p-4 shadow-lg rounded-lg border-none"
        tileClassName={({ date, view }) =>
          view === "month" && (date.getDay() === 0 || date.getDay() === 6) ? "text-red-500" : "text-gray-700"
        }
        tileContent={({ date, view }) =>
          view === "month" && date.getDate() === new Date().getDate() ? (
            <div className="text-blue-500 font-bold">{date.getDate()}</div>
          ) : null
        }
      />
    </div>
  );
};

export default DogInfo;
