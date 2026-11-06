import { useState } from "react";
import { CalendarDays } from "lucide-react";
import DateRangeCalendar from "./DateRangeCalendar";
import type { CalendarDateRange } from "./DateRangeCalendar";

interface DateTimeCalendarFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const DateTimeCalendarField = ({ label, value, onChange }: DateTimeCalendarFieldProps) => {
  const initialDate = value ? new Date(value) : new Date();
  const [open, setOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? initialDate : null);
  const [selectedTime, setSelectedTime] = useState(value && value.includes("T") ? value.split("T")[1].slice(0, 5) : "09:00");
  const dateRange: CalendarDateRange = { start: selectedDate, end: selectedDate };

  const chooseDate = (date: Date) => setSelectedDate(date);
  const clear = () => {
    setSelectedDate(null);
    onChange("");
    setOpen(false);
  };
  const apply = () => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      onChange(`${year}-${month}-${day}T${selectedTime || "09:00"}`);
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex gap-2">
        <button type="button" onClick={() => setOpen((current) => !current)} className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-gray-200 px-3 text-left text-sm text-slate-700 hover:bg-gray-50">
          <CalendarDays className="h-4 w-4 shrink-0 text-slate-500" />
          <span className="truncate">{selectedDate ? selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Choose date"}</span>
        </button>
        <input aria-label={`${label} time`} type="time" value={selectedTime} onChange={(event) => setSelectedTime(event.target.value)} className="h-10 w-28 rounded-lg border border-gray-200 px-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
      </div>
      {open && <div className="absolute right-0 top-full z-50 mt-2 flex w-[min(42rem,calc(100vw-2rem))] flex-col rounded-lg border border-gray-200 bg-white shadow-xl sm:flex-row">
        <DateRangeCalendar calendarMonth={calendarMonth} dateRange={dateRange} rangeAnchor={null} onMonthChange={setCalendarMonth} onChooseDate={chooseDate} onClear={clear} onApply={apply} selectionMode="single" disableFutureDates={false} />
      </div>}
    </div>
  );
};

export default DateTimeCalendarField;
