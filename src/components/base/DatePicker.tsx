import React, { useState, useEffect } from "react";

interface DatePickerProps {
  label: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
  disabled: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange, disabled }) => {
  const today = new Date();

  // Use today's date when value is null or undefined
  const initialYear = value?.substring(0, 4) || String(today.getFullYear());
  const initialMonth = value?.substring(5, 7) || String(today.getMonth() + 1).padStart(2, "0");
  const initialDay = value?.substring(8, 10) || String(today.getDate()).padStart(2, "0");
  const initialHour = value?.substring(11, 13) || String(today.getHours()).padStart(2, "0");
  const initialMinute = value?.substring(14, 16) || String(today.getMinutes()).padStart(2, "0");

  const [year, setYear] = useState<string>(initialYear);
  const [month, setMonth] = useState<string>(initialMonth);
  const [day, setDay] = useState<string>(initialDay);
  const [hour, setHour] = useState<string>(initialHour);
  const [minute, setMinute] = useState<string>(initialMinute);

  useEffect(() => {
    const newDate = `${year}-${month}-${day} ${hour}:${minute}:00`;
    onChange(newDate);
  }, [year, month, day, hour, minute, onChange]);

  const years = Array.from({ length: 10 }, (_, i) => `${new Date().getFullYear() + i}`);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  return (
    <div className="flex flex-col w-full pb-2 ">
      <label className="text-xs py-2 text-gray-500">{label}</label>
      <div className="flex-col gap-2 items-center">
        <div className="flex gap-2 items-center pb-2">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={disabled}
            className="p-1 border border-gray-300 rounded-md"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          년
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            disabled={disabled}
            className="p-1 border border-gray-300 rounded-md"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          월
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            disabled={disabled}
            className="p-1 border border-gray-300 rounded-md"
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          일
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            disabled={disabled}
            className="p-1 border border-gray-300 rounded-md"
          >
            {hours.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          시
          <select
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            disabled={disabled}
            className="p-1 border border-gray-300 rounded-md"
          >
            {minutes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          분
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
