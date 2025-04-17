import DatePicker from "@/components/base/DatePicker";
import React, { useState, useEffect } from "react";

interface DatePickerNewProps {
  label: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
  disabled: boolean;
}

const DatePickerNew: React.FC<DatePickerNewProps> = ({
  label,
  value,
  onChange,
  disabled,
}) => {
  const today = new Date();

  // Use today's date when value is null or undefined
  const initialYear = value?.substring(0, 4) || String(today.getFullYear());
  const initialMonth =
    value?.substring(5, 7) || String(today.getMonth() + 1).padStart(2, "0");
  const initialDay =
    value?.substring(8, 10) || String(today.getDate()).padStart(2, "0");
  const initialHour =
    value?.substring(11, 13) || String(today.getHours()).padStart(2, "0");
  const initialMinute =
    value?.substring(14, 16) || String(today.getMinutes()).padStart(2, "0");

  const [year, setYear] = useState<string>(initialYear);
  const [month, setMonth] = useState<string>(initialMonth);
  const [day, setDay] = useState<string>(initialDay);
  const [hour, setHour] = useState<string>(initialHour);
  const [minute, setMinute] = useState<string>(initialMinute);

  useEffect(() => {
    const newDate = `${year}-${month}-${day} ${hour}:${minute}:00`;
    onChange(newDate);
  }, [year, month, day, hour, minute, onChange]);

  const years = Array.from(
    { length: 10 },
    (_, i) => `${new Date().getFullYear() + i}`,
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );
  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );
  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0"),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0"),
  );

  return (
    <div className="flex w-fit flex-col rounded-lg bg-gray-200 p-[8px]">
      <label className="pb-[5px] text-[12px] text-gray-500">{label}</label>
      <div className="flex flex-col items-center gap-[5px] rounded-md bg-white p-[8px]">
        <div className="flex h-full items-center gap-[5px] bg-white">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={disabled}
            className="rounded-md border border-gray-300 p-[4px]"
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
            className="rounded-md border border-gray-300 p-[4px]"
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
            className="rounded-md border border-gray-300 p-[4px]"
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          일
        </div>
        <div className="flex h-full items-center gap-[5px] bg-white">
          <select
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            disabled={disabled}
            className="rounded-md border border-gray-300 p-[4px]"
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
            className="rounded-md border border-gray-300 p-[4px]"
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

export default DatePickerNew;
