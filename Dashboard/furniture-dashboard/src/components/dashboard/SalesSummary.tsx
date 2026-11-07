import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import DateRangePicker, { quickRange, type DateRange } from "./DateRangePicker";

interface Payment {
  id: number;
  payment_status: string;
  amount: number | string;
  payment_date?: string;
  created_at?: string;
}

interface SalesOrder {
  total_amount: number | string;
  status: string;
  created_at?: string;
}

interface SalesSummaryProps {
  payments: Payment[];
  orders: SalesOrder[];
}

const PAID_STATUSES = ["paid", "success", "successful", "completed"];
const currency = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;
const compact = (value: number) => (value >= 100000 ? `₹${(value / 100000).toFixed(1)}L` : value >= 1000 ? `₹${Math.round(value / 1000)}k` : `₹${value}`);

const SalesSummary = ({ payments, orders }: SalesSummaryProps) => {
  const [range, setRange] = useState<DateRange>(() => quickRange("This Month"));

  const { revenue, paymentCount, orderCount, chartData, byDay } = useMemo(() => {
    const paid = payments.filter((p) => PAID_STATUSES.includes(p.payment_status?.toLowerCase()));
    const rows = paid
      .map((p) => ({ date: new Date(p.payment_date || p.created_at || ""), amount: Number(p.amount || 0) }))
      .filter((r) => Number.isFinite(r.date.getTime()));

    const startMs = range.start ? range.start.getTime() : null;
    const endMs = range.end ? new Date(range.end.getFullYear(), range.end.getMonth(), range.end.getDate() + 1).getTime() : null;
    const inRange = (d: Date) => (startMs === null || d.getTime() >= startMs) && (endMs === null || d.getTime() < endMs);

    const selected = rows.filter((r) => inRange(r.date));
    const selectedOrders = orders.filter((o) => {
      const d = new Date(o.created_at || "");
      return Number.isFinite(d.getTime()) && inRange(d) && !["cancelled", "canceled", "returned"].includes(o.status?.toLowerCase());
    });

    const first = range.start ?? (rows.length ? new Date(Math.min(...rows.map((r) => r.date.getTime()))) : new Date());
    const last = range.end ?? new Date();
    const days = Math.round((last.getTime() - first.getTime()) / 86400000) + 1;
    const daily = days <= 62;

    const buckets = new Map<string, { label: string; sort: number; revenue: number }>();
    if (daily) {
      for (let i = 0; i < days; i++) {
        const d = new Date(first.getFullYear(), first.getMonth(), first.getDate() + i);
        buckets.set(d.toDateString(), { label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), sort: d.getTime(), revenue: 0 });
      }
    } else {
      const cur = new Date(first.getFullYear(), first.getMonth(), 1);
      while (cur <= last) {
        buckets.set(`${cur.getFullYear()}-${cur.getMonth()}`, { label: cur.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }), sort: cur.getTime(), revenue: 0 });
        cur.setMonth(cur.getMonth() + 1);
      }
    }
    selected.forEach((r) => {
      const key = daily ? r.date.toDateString() : `${r.date.getFullYear()}-${r.date.getMonth()}`;
      const b = buckets.get(key);
      if (b) b.revenue += r.amount;
    });

    return {
      revenue: selected.reduce((s, r) => s + r.amount, 0),
      paymentCount: selected.length,
      orderCount: selectedOrders.length,
      chartData: [...buckets.values()].sort((a, b) => a.sort - b.sort),
      byDay: daily,
    };
  }, [payments, orders, range]);

  const summary = [
    { label: "Total Sales", value: paymentCount.toLocaleString("en-IN") },
    { label: "Total Orders", value: orderCount.toLocaleString("en-IN") },
    { label: "Revenue", value: currency(revenue) },
  ];

  return (
    <div className="flex h-full w-full min-w-0 flex-col border border-gray-200 bg-white p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Sales Summary</h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">{byDay ? "Daily" : "Monthly"} paid revenue</p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {summary.map((item) => <div key={item.label} className="min-w-0 border border-gray-100 bg-slate-50 p-2.5"><p className="truncate text-[11px] font-medium text-slate-400">{item.label}</p><p className="mt-1 truncate text-sm font-bold text-slate-900 sm:text-base">{item.value}</p></div>)}
      </div>

      <div className="min-h-[220px] w-full min-w-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} dy={8} minTickGap={16} />
            <YAxis axisLine={false} tickLine={false} width={52} tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v) => compact(Number(v))} />
            <Tooltip cursor={{ fill: "#f1f5f9" }} formatter={(value) => [currency(Number(value)), "Revenue"]} contentStyle={{ borderRadius: "10px", border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "12px" }} />
            <Bar dataKey="revenue" fill="#16a34a" radius={[3, 3, 0, 0]} maxBarSize={44} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesSummary;
