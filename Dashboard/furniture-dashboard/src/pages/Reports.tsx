import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, IndianRupee, Package, ShoppingCart, Users, Wallet } from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getOrders, getPayments, getProducts, getUsers } from "../services/api";

interface Order { id: number; order_number?: string; status: string; payment_status?: string; total_amount: number | string; created_at: string; }
interface Payment { payment_status?: string; amount: number | string; payment_date?: string; created_at?: string; }
interface ReportData { orders: Order[]; payments: Payment[]; customers: { id: number; role?: string }[]; products: { id: number }[]; }
const ranges = [{ label: "Last 7 days", days: 7 }, { label: "Last 30 days", days: 30 }, { label: "Last 3 months", days: 90 }, { label: "Last 6 months", days: 180 }, { label: "All time", days: 0 }];
const PAID = ["paid", "success", "successful", "completed"];
const EXCLUDED = ["cancelled", "canceled", "returned"];
const inr = (amount: number) => `₹${Math.round(amount).toLocaleString("en-IN")}`;

const Reports = () => {
  const [data, setData] = useState<ReportData>({ orders: [], payments: [], customers: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [days, setDays] = useState(30);
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const [orders, payments, users, products] = await Promise.allSettled([
      getOrders(), getPayments(), getUsers(), getProducts(),
    ]);
    const failed: string[] = [];
    if (orders.status === "fulfilled") setData((current) => ({ ...current, orders: orders.value.data.data || [] }));
    else failed.push("orders");
    if (payments.status === "fulfilled") setData((current) => ({ ...current, payments: payments.value.data.data || [] }));
    else failed.push("payments");
    if (users.status === "fulfilled") setData((current) => ({ ...current, customers: (users.value.data.data || []).filter((user: { role?: string }) => user.role === "customer") }));
    else failed.push("customers");
    if (products.status === "fulfilled") setData((current) => ({ ...current, products: products.value.data.data || [] }));
    else failed.push("products");
    setNow(Date.now());
    if (failed.length) setError(`Could not load ${failed.join(", ")}. Some report figures may be incomplete.`);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const report = useMemo(() => {
    const cutoff = days ? now - days * 86400000 : 0;
    const inRange = (value?: string) => {
      if (!value) return false;
      const timestamp = new Date(value).getTime();
      return Number.isFinite(timestamp) && timestamp >= cutoff && timestamp <= now;
    };
    const selected = data.orders.filter((order) => inRange(order.created_at));
    const sales = selected.filter((order) => !EXCLUDED.includes(order.status?.toLowerCase()));
    const revenue = sales.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
    const collected = data.payments
      .filter((payment) => PAID.includes(payment.payment_status?.toLowerCase() || "") && inRange(payment.payment_date || payment.created_at))
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const byMonth = new Map<string, { month: string; sales: number; collected: number; orders: number }>();
    for (const order of sales) {
      const date = new Date(order.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const row = byMonth.get(key) || { month: date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }), sales: 0, collected: 0, orders: 0 };
      row.sales += Number(order.total_amount || 0);
      row.orders += 1;
      byMonth.set(key, row);
    }
    for (const payment of data.payments) {
      const dateValue = payment.payment_date || payment.created_at;
      if (!PAID.includes(payment.payment_status?.toLowerCase() || "") || !inRange(dateValue)) continue;
      const date = new Date(dateValue!);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const row = byMonth.get(key) || { month: date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }), sales: 0, collected: 0, orders: 0 };
      row.collected += Number(payment.amount || 0);
      byMonth.set(key, row);
    }
    const statuses = new Map<string, number>();
    selected.forEach((order) => {
      const status = order.status || "unknown";
      statuses.set(status, (statuses.get(status) || 0) + 1);
    });
    const chart = [...byMonth.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([, row]) => row);
    return { selected, sales, revenue, collected, chart, statuses: [...statuses].map(([status, count]) => ({ status, count })) };
  }, [data.orders, data.payments, days, now]);

  const exportCsv = () => {
    const rows = [["Order", "Status", "Order value", "Created"], ...report.selected.map((order) => [order.order_number || order.id, order.status, order.total_amount, order.created_at])];
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "dashboard-report.csv"; link.click(); URL.revokeObjectURL(url);
  };

  const cards = [
    { label: "Sales revenue", value: inr(report.revenue), icon: IndianRupee },
    { label: "Revenue collected", value: inr(report.collected), icon: Wallet },
    { label: "Orders", value: report.sales.length.toLocaleString("en-IN"), icon: ShoppingCart },
    { label: "Customers", value: data.customers.length.toLocaleString("en-IN"), icon: Users },
    { label: "Products", value: data.products.length.toLocaleString("en-IN"), icon: Package },
  ];

  return <div className="min-h-screen bg-white p-4 sm:p-5 lg:p-6 xl:p-8">
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold text-slate-900 sm:text-[28px]">Reports</h1><p className="mt-1 text-sm text-slate-500">Business performance from your store data</p></div><div className="flex gap-3"><select value={days} onChange={(event) => setDays(Number(event.target.value))} className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm">{ranges.map((range) => <option key={range.label} value={range.days}>{range.label}</option>)}</select><button type="button" onClick={exportCsv} disabled={!report.selected.length || loading} className="inline-flex h-10 items-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"><Download size={16}/> Export</button></div></div>
    {error && <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><span>{error}</span><button type="button" onClick={() => void load()} className="shrink-0 font-semibold underline">Retry</button></div>}
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">{cards.map(({ label, value, icon: Icon }) => <div key={label} className="min-w-0 border border-gray-200 bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><p className="truncate text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">{label}</p><Icon className="h-5 w-5 text-green-600"/></div><p className="mt-2 text-2xl font-bold text-slate-900 sm:text-[28px]">{loading ? "—" : value}</p></div>)}</div>
    <div className="mt-6 grid items-stretch gap-3 lg:grid-cols-[2fr_1fr]"><div className="min-w-0 border border-gray-200 bg-white p-4 sm:p-5"><h2 className="font-bold text-slate-900">Sales, payments and orders by month</h2><p className="mt-1 text-sm text-slate-500">Order totals, successful payments, and order count for the selected period</p>{loading ? <p className="py-20 text-center text-sm text-slate-500">Loading report…</p> : report.chart.length ? <div className="mt-5 h-72"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={report.chart}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis yAxisId="money" tickFormatter={(value) => `₹${Number(value) >= 1000 ? `${Math.round(Number(value) / 1000)}k` : value}`}/><YAxis yAxisId="orders" orientation="right" allowDecimals={false}/><Tooltip formatter={(value, name) => name === "Orders" ? Number(value).toLocaleString("en-IN") : inr(Number(value))}/><Bar yAxisId="money" dataKey="sales" name="Sales" fill="#16a34a" radius={[5,5,0,0]}/><Bar yAxisId="money" dataKey="collected" name="Collected" fill="#3b82f6" radius={[5,5,0,0]}/><Line yAxisId="orders" dataKey="orders" name="Orders" stroke="#8b5cf6" strokeWidth={2} type="monotone"/></ComposedChart></ResponsiveContainer></div> : <p className="py-20 text-center text-sm text-slate-500">No orders in this period.</p>}</div>
      <div className="min-w-0 border border-gray-200 bg-white p-4 sm:p-5"><h2 className="font-bold text-slate-900">Order status</h2><p className="mt-1 text-sm text-slate-500">Selected period</p><div className="mt-4 space-y-3">{report.statuses.length ? report.statuses.map(({ status, count }) => <div key={status} className="flex items-center justify-between border-b border-gray-100 pb-3 text-sm"><span className="capitalize text-slate-600">{status.replace(/_/g, " ")}</span><span className="font-semibold text-slate-900">{count}</span></div>) : <p className="py-8 text-center text-sm text-slate-500">No orders in this period.</p>}</div></div>
    </div>
  </div>;
};

export default Reports;
