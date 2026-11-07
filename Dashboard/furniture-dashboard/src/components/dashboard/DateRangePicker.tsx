import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export interface DateRange {
  start: Date | null; // null start = "All"
  end: Date | null;
  label: string;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const sameDay = (a: Date, b: Date) => a.getTime() === b.getTime();

export const quickRange = (key: string): DateRange => {
  const today = startOfDay(new Date());
  switch (key) {
    case "Today":
      return { start: today, end: today, label: "Today" };
    case "This Week":
      return { start: addDays(today, -today.getDay()), end: today, label: "This Week" };
    case "This Month":
      return { start: new Date(today.getFullYear(), today.getMonth(), 1), end: today, label: "This Month" };
    case "Last 30 Days":
      return { start: addDays(today, -29), end: today, label: "Last 30 Days" };
    default:
      return { start: null, end: null, label: "All" };
  }
};

const QUICK = ["Today", "This Week", "This Month", "Last 30 Days", "All"];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MonthGrid = ({ month, range, onPick }: { month: Date; range: { start: Date | null; end: Date | null }; onPick: (d: Date) => void }) => {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = addDays(first, -first.getDay());
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  return (
    <div className="w-[252px]">
      <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] font-medium text-slate-500">
        {WEEKDAYS.map((w) => <span key={w} className="rounded bg-slate-100 py-1">{w}</span>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-y-1 text-center text-xs">
        {days.map((d) => {
          if (d.getMonth() !== month.getMonth()) return <span key={d.getTime()} className="h-8" />;
          const isStart = range.start && sameDay(d, range.start);
          const isEnd = range.end && sameDay(d, range.end);
          const inRange = range.start && range.end && d >= range.start && d <= range.end;
          return (
            <button
              key={d.getTime()}
              type="button"
              onClick={() => onPick(d)}
              className={`h-8 ${isStart || isEnd ? "rounded-lg bg-slate-800 font-semibold text-white" : inRange ? "bg-slate-100 text-slate-900" : "text-slate-800 hover:bg-slate-100"}`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const DateRangePicker = ({ value, onChange }: { value: DateRange; onChange: (r: DateRange) => void }) => {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const base = value.end ?? new Date();
    return new Date(base.getFullYear(), base.getMonth() - 1, 1);
  });
  const [pending, setPending] = useState<Date | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open) return;
    const place = () => {
      const r = btnRef.current?.getBoundingClientRect();
      if (!r) return;
      const width = Math.min(700, window.innerWidth - 16);
      const left = Math.max(8, Math.min(r.right - width, window.innerWidth - width - 8));
      setPos({ top: r.bottom + 8, left });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const nextMonth = useMemo(() => new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1), [viewMonth]);

  const pick = (d: Date) => {
    if (!pending) {
      setPending(d);
      return;
    }
    const [start, end] = d < pending ? [d, pending] : [pending, d];
    setPending(null);
    onChange({ start, end, label: `${start.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` });
    setOpen(false);
  };

  const title = (d: Date) => d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div ref={ref} className="relative">
      <button ref={btnRef} type="button" onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-gray-50">
        <Calendar size={15} />
        {value.label}
      </button>
      {open && (
        <div style={{ top: pos.top, left: pos.left }} className="fixed z-50 flex max-h-[calc(100vh-6rem)] max-w-[calc(100vw-1rem)] overflow-auto rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="w-40 shrink-0 border-r border-gray-100 p-3">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Quick Ranges</p>
            {QUICK.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => { onChange(quickRange(q)); setPending(null); setOpen(false); }}
                className={`block w-full rounded-lg px-2 py-2 text-left text-sm font-medium ${value.label === q ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex gap-6 p-4">
            {[viewMonth, nextMonth].map((m, i) => (
              <div key={m.getTime()}>
                <div className="mb-3 flex items-center justify-between">
                  {i === 0 ? (
                    <button type="button" aria-label="Previous month" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-slate-600 hover:bg-gray-50"><ChevronLeft size={15} /></button>
                  ) : <span className="h-8 w-8" />}
                  <span className="text-sm font-semibold text-slate-800">{title(m)}</span>
                  {i === 1 ? (
                    <button type="button" aria-label="Next month" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-slate-600 hover:bg-gray-50"><ChevronRight size={15} /></button>
                  ) : <span className="h-8 w-8" />}
                </div>
                <MonthGrid month={m} range={pending ? { start: pending, end: pending } : value} onPick={pick} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
