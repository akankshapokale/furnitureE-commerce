import { ChevronLeft, ChevronRight } from "lucide-react";
import { calendarDayKey } from "./calendarDate";

export interface CalendarDateRange {
  start: Date | null;
  end: Date | null;
}

interface DateRangeCalendarProps {
  calendarMonth: Date;
  dateRange: CalendarDateRange;
  rangeAnchor: Date | null;
  onMonthChange: (month: Date) => void;
  onChooseDate: (day: Date) => void;
  onClear: () => void;
  onApply: () => void;
  orderCounts?: Map<string, number>;
  selectionMode?: "range" | "single";
  disableFutureDates?: boolean;
  compact?: boolean;
}

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const calendarDays = (month: Date) => {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(month.getFullYear(), month.getMonth(), 1 - firstDay.getDay());
  return Array.from({ length: 42 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
};

const DateRangeCalendar = ({
  calendarMonth,
  dateRange,
  rangeAnchor,
  onMonthChange,
  onChooseDate,
  onClear,
  onApply,
  orderCounts,
  selectionMode = "range",
  disableFutureDates = true,
  compact = false,
}: DateRangeCalendarProps) => {
  const months = compact ? [calendarMonth] : [calendarMonth, new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)];
  const today = startOfDay(new Date()).getTime();

  const renderMonth = (month: Date) => (
    <div key={`${month.getFullYear()}-${month.getMonth()}`} className={compact ? "" : "hidden sm:block"}>
      <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-slate-400">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day} className="py-2">{day}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {calendarDays(month).map((day) => {
          const dayTime = startOfDay(day).getTime();
          const rangeStart = dateRange.start ? startOfDay(dateRange.start).getTime() : null;
          const rangeEnd = dateRange.end ? startOfDay(dateRange.end).getTime() : rangeStart;
          const inRange = rangeStart !== null && rangeEnd !== null && dayTime >= Math.min(rangeStart, rangeEnd) && dayTime <= Math.max(rangeStart, rangeEnd);
          const isBoundary = dayTime === rangeStart || dayTime === rangeEnd;
          const disabled = disableFutureDates && dayTime > today;
          const count = orderCounts?.get(calendarDayKey(day)) ?? 0;
          return (
            <button key={day.toISOString()} type="button" disabled={disabled} onClick={() => onChooseDate(day)} aria-label={`${day.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}${count ? `, ${count} orders` : ""}`} className={`relative h-8 text-xs ${day.getMonth() !== month.getMonth() ? "text-slate-300" : "text-slate-700"} ${inRange ? "bg-green-50" : ""} ${isBoundary ? "bg-green-700 font-semibold text-white" : "hover:bg-gray-100"} disabled:cursor-not-allowed disabled:opacity-40`}>
              {day.getDate()}{count > 0 && <span aria-hidden="true" className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${isBoundary ? "bg-white" : "bg-green-600"}`} />}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-w-0 flex-1 p-2 sm:p-3">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" aria-label="Previous month" onClick={() => onMonthChange(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} className="flex h-8 w-8 items-center justify-center border border-gray-200 text-slate-600 hover:bg-gray-50"><ChevronLeft className="h-3.5 w-3.5" /></button>
        <div className={`grid flex-1 ${compact ? "grid-cols-1" : "grid-cols-2"} text-center text-sm font-semibold text-slate-800`}>
          <span>{calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
          {!compact && <span className="hidden sm:block">{months[1].toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>}
        </div>
        <button type="button" aria-label="Next month" onClick={() => onMonthChange(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} className="flex h-8 w-8 items-center justify-center border border-gray-200 text-slate-600 hover:bg-gray-50"><ChevronRight className="h-3.5 w-3.5" /></button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {months.map(renderMonth)}
        <div className={compact ? "hidden" : "sm:hidden"}>
          <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-slate-400">{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day} className="py-2">{day}</span>)}</div>
          <div className="grid grid-cols-7 gap-y-1">
            {calendarDays(calendarMonth).map((day) => {
              const dayTime = startOfDay(day).getTime();
              const rangeStart = dateRange.start ? startOfDay(dateRange.start).getTime() : null;
              const rangeEnd = dateRange.end ? startOfDay(dateRange.end).getTime() : rangeStart;
              const inRange = rangeStart !== null && rangeEnd !== null && dayTime >= Math.min(rangeStart, rangeEnd) && dayTime <= Math.max(rangeStart, rangeEnd);
              const isBoundary = dayTime === rangeStart || dayTime === rangeEnd;
              const disabled = disableFutureDates && dayTime > today;
              const count = orderCounts?.get(calendarDayKey(day)) ?? 0;
              return <button key={day.toISOString()} type="button" disabled={disabled} onClick={() => onChooseDate(day)} aria-label={`${day.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}${count ? `, ${count} orders` : ""}`} className={`relative h-8 text-xs ${day.getMonth() !== calendarMonth.getMonth() ? "text-slate-300" : "text-slate-700"} ${inRange ? "bg-green-50" : ""} ${isBoundary ? "bg-green-700 font-semibold text-white" : "hover:bg-gray-100"} disabled:cursor-not-allowed disabled:opacity-40`}>{day.getDate()}{count > 0 && <span aria-hidden="true" className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${isBoundary ? "bg-white" : "bg-green-600"}`} />}</button>;
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <p className="text-xs text-slate-500">{selectionMode === "single" ? "Choose a date, then apply." : rangeAnchor ? "Choose an end date, or apply this single day." : "Select a day, or choose start and end dates."}</p>
        <div className="flex gap-2">
          <button type="button" onClick={onClear} className="border border-gray-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-gray-50">Clear</button>
          <button type="button" onClick={onApply} className="border border-green-700 bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800">Apply</button>
        </div>
      </div>
    </div>
  );
};

export default DateRangeCalendar;
