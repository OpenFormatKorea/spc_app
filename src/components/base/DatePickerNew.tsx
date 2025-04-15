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
    <div className="flex w-fit flex-col rounded-lg bg-gray-200 p-[8px]"></div>
  );
};

export default DatePickerNew;
