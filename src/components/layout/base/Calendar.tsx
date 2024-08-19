import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
const NoSSRCalendar = dynamic(() => import("react-calendar"), { ssr: false });

function SimpleCalendar() {
  const [date, setDate] = useState(new Date());

  const onChange: CalendarProps["onChange"] = (newDate) => {
    setDate(newDate as Date);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <NoSSRCalendar onChange={onChange} value={date} locale="ko-KR" />
      <p>Selected Date: {date.toDateString()}</p>
    </div>
  );
}

export default SimpleCalendar;
