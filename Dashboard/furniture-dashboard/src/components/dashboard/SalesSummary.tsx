import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

const SalesSummary = ({ payments, orders }: SalesSummaryProps) => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const { monthRevenue, monthPayments, monthOrders, chartData } = useMemo(() => {
    const monthStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const nextMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1);
    const paid = payments.filter((payment) => PAID_STATUSES.includes(payment.payment_status?.toLowerCase()));
    const inMonth = (raw?: string) => {
      if (!raw) return false;
      const date = new Date(raw);
      return Number.isFinite(date.getTime()) && date >= monthStart && date < nextMonth;
    };
    const selectedPayments = paid.filter((payment) => inMonth(payment.payment_date || payment.created_at));
    const selectedOrders = orders.filter((order) => inMonth(order.created_at) && !["cancelled", "canceled", "returned"].includes(order.status?.toLowerCase()));
    const data = Array.from({ length: 12 }, (_, index) => {
      const month = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 11 + index, 1);
      const end = new Date(month.getFullYear(), month.getMonth() + 1, 1);
      const revenue = paid.reduce((sum, payment) => {
        const raw = payment.payment_date || payment.created_at;
        if (!raw) return sum;
        const date = new Date(raw);
        return date >= month && date < end ? sum + Number(payment.amount || 0) : sum;
      }, 0);
      return { month: month.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }), revenue };
    });
    return {
      monthRevenue: selectedPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
      monthPayments: selectedPayments.length,
      monthOrders: selectedOrders.length,
      chartData: data,
    };
  }, [payments, orders, selectedMonth]);

  const summary = [
    { label: "Total Sales", value: monthPayments.toLocaleString("en-IN") },
    { label: "Total Orders", value: monthOrders.toLocaleString("en-IN") },
    { label: "Revenue", value: currency(monthRevenue) },
  ];

  return (
    <div className="flex h-full w-full min-w-0 flex-col border border-gray-200 bg-white p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Sales Summary</h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">Monthly sales and paid revenue trend</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Previous month" onClick={() => setSelectedMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="flex h-8 w-8 items-center justify-center border border-gray-200 text-slate-600 hover:bg-gray-50"><ChevronLeft size={16} /></button>
          <span className="min-w-28 text-center text-sm font-semibold text-slate-700">{selectedMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span>
          <button type="button" aria-label="Next month" disabled={selectedMonth.getFullYear() === new Date().getFullYear() && selectedMonth.getMonth() === new Date().getMonth()} onClick={() => setSelectedMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="flex h-8 w-8 items-center justify-center border border-gray-200 text-slate-600 hover:bg-gray-50 disabled:opacity-40"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {summary.map((item) => <div key={item.label} className="min-w-0 border border-gray-100 bg-slate-50 p-2.5"><p className="truncate text-[11px] font-medium text-slate-400">{item.label}</p><p className="mt-1 truncate text-sm font-bold text-slate-900 sm:text-base">{item.value}</p></div>)}
      </div>

      <div className="min-h-[190px] w-full min-w-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} dy={8} minTickGap={16} />
            <YAxis axisLine={false} tickLine={false} width={48} tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(value) => `₹${Math.round(Number(value) / 1000)}k`} />
            <Tooltip formatter={(value) => [currency(Number(value)), "Revenue"]} contentStyle={{ borderRadius: "10px", border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "12px" }} />
            <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} dot={{ r: 3, fill: "#16a34a" }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesSummary;
