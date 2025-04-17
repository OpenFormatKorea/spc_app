import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
interface DatePickerComponentProps {
  label: string;
  value: Date | null;
  onChange: (value: Date) => void;
  disabled: boolean;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  label,
  value,
  onChange,
  disabled,
}) => {
  const actualDate = value ? value : new Date();
  const [dateAndTime, setDateAndTime] = useState(actualDate);

  return (
    <div className="flex flex-col gap-[5px] rounded-md bg-gray-100 p-[8px]">
      <label className="text-[12px] text-gray-500">{label}</label>
      <div className="flex h-[30px] w-full items-center justify-center rounded-md bg-white p-1">
        <DatePicker
          locale={ko}
          selected={dateAndTime}
          onChange={(date) => {
            if (date) {
              setDateAndTime(date);
              onChange(date);
            }
          }}
          showTimeSelect
          timeIntervals={15}
          timeFormat="HH:mm"
          dateFormat="yyyy-MM-dd HH:mm"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default DatePickerComponent;
