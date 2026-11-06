import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, CreditCard, Download, Eye, Search, X } from "lucide-react";
import { getOrders, getPayments } from "../services/api";
import DateRangeCalendar from "../components/common/DateRangeCalendar";

interface RefundPayment {
  id: number;
  order_id?: number;
  order_number?: string;
  transaction_id?: string | null;
  payment_method?: string | null;
  payment_status?: string | null;
  amount?: number | string;
  payment_date?: string | null;
  created_at?: string;
}
interface RefundOrder {
  id: number;
  order_number?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  total_amount?: number | string;
  status?: string;
  created_at?: string;
  items?: { product_name?: string; quantity?: number | string; total_price?: number | string }[];
}
const refundStatuses = new Set(["refunded", "partially_refunded", "refund_pending", "refund_processing", "refund_failed", "refund_initiated"]);
const money = (value: number | string | undefined) => `â‚¹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const statusLabel = (value?: string | null) => (value || "Unknown").replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const providerFor = (value?: string | null) => {
  if (/cod|cash on delivery/i.test(value || "")) return "COD";
  if (/payu|upi|online|card|net.?bank/i.test(value || "")) return "PayU";
  return "Unknown";
};
const methodFor = (value?: string | null) => /upi/i.test(value || "") ? "UPI" : /bank/i.test(value || "") ? "Bank Account" : "-";
const refundStatusFor = (value?: string | null) => {
  const status = (value || "").toLowerCase();
  if (["refund_pending", "refund_initiated", "pending"].includes(status)) return "pending";
  if (["refund_processing", "processing"].includes(status)) return "processing";
  if (["refunded", "partially_refunded", "success", "paid", "completed"].includes(status)) return "success";
  if (["refund_failed", "failed"].includes(status)) return "failed";
  return status.replace(/^refund_/, "");
};
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const endOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
const MAX_CUSTOM_RANGE_DAYS = 62;
const typeFor = (payment: RefundPayment, order?: RefundOrder) => {
  const amount = Number(payment.amount || 0);
  const total = Number(order?.total_amount || 0);
  return total > 0 ? (amount >= total ? "Full" : "Partial") : "Unknown";
};
const day = (value?: string | null) => value ? new Date(value).toLocaleDateString("en-IN") : "-";
const PaymentsRefunds = () => {
  const [payments, setPayments] = useState<RefundPayment[]>([]);
  const [orders, setOrders] = useState<RefundOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [provider, setProvider] = useState("all");
  const [method, setMethod] = useState("all");
  const [type, setType] = useState("all");
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [activeDatePreset, setActiveDatePreset] = useState("All dates");
  const [dateOpen, setDateOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));
  const [rangeAnchor, setRangeAnchor] = useState<Date | null>(null);
  const [selected, setSelected] = useState<RefundPayment | null>(null);

  useEffect(() => {
    let active = true;
    Promise.allSettled([getPayments(), getOrders()]).then(([paymentResult, orderResult]) => {
      if (!active) return;
      if (paymentResult.status === "fulfilled") setPayments(Array.isArray(paymentResult.value.data?.data) ? paymentResult.value.data.data : []);
      else setError("Failed to load refunds. Please retry.");
      if (orderResult.status === "fulfilled") setOrders(Array.isArray(orderResult.value.data?.data) ? orderResult.value.data.data : []);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const orderFor = (payment: RefundPayment) => orders.find((order) => (payment.order_id != null && String(order.id) === String(payment.order_id)) || (!!payment.order_number && order.order_number === payment.order_number));
  const orderIsReturn = (order?: RefundOrder) => ["cancelled", "canceled", "returned", "rto", "returned_to_origin", "return_requested"].includes((order?.status || "").toLowerCase());
  const refundPayments = useMemo(() => payments.filter((payment) => refundStatuses.has((payment.payment_status || "").toLowerCase()) || orderIsReturn(orders.find((order) => (payment.order_id != null && String(order.id) === String(payment.order_id)) || (!!payment.order_number && order.order_number === payment.order_number)))), [payments, orders]);
  const pendingCount = refundPayments.filter((payment) => ["pending", "processing"].includes(refundStatusFor(payment.payment_status))).length;
  const totalAmount = refundPayments.reduce((total, payment) => total + Number(payment.amount || 0), 0);
  const providers = [...new Set(refundPayments.map((payment) => providerFor(payment.payment_method)).filter((value) => value !== "Unknown"))];
  const filtered = refundPayments.filter((payment) => {
    const order = orderFor(payment);
    const statusValue = refundStatusFor(payment.payment_status);
    const date = new Date(payment.payment_date || payment.created_at || 0);
    const query = search.trim().toLowerCase();
    const searchMatch = !query || [payment.order_number, payment.order_id, payment.transaction_id, payment.id, order?.customer_name, order?.customer_email, order?.customer_phone].some((value) => String(value || "").toLowerCase().includes(query));
    const providerMatch = provider === "all" || providerFor(payment.payment_method) === provider;
    const refundMethod = methodFor(payment.payment_method);
    const methodMatch = method === "all" || refundMethod === method;
    const typeValue = typeFor(payment, order).toLowerCase();
    return searchMatch && (status === "all" || statusValue === status) && providerMatch && methodMatch && (type === "all" || typeValue === type) && (!dateRange.start || date >= startOfDay(dateRange.start)) && (!dateRange.end ? (!dateRange.start || date <= endOfDay(new Date())) : date <= endOfDay(dateRange.end));
  });

  const exportCsv = () => {
    const rows = [["Order #", "Source", "Customer", "Provider", "Method", "Type", "Amount", "Status", "Refund Reference", "Date"], ...filtered.map((payment) => {
      const order = orderFor(payment);
      const refundType = typeFor(payment, order);
      return [payment.order_number || (payment.order_id ? `ORD-${payment.order_id}` : ""), orderIsReturn(order) ? "Return" : "Payment", order?.customer_name || "", providerFor(payment.payment_method), methodFor(payment.payment_method), refundType, payment.amount || 0, statusLabel(refundStatusFor(payment.payment_status)), payment.transaction_id || `PAY-${payment.id}`, payment.payment_date || payment.created_at || ""];
    })];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `refunds-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url);
  };

  const applyQuickRange = (preset: string) => {
    const today = new Date();
    const end = endOfDay(today);
    let start: Date | null = null;
    if (preset === "Today") start = startOfDay(today);
    if (preset === "This Week") { start = startOfDay(today); start.setDate(start.getDate() - ((start.getDay() + 6) % 7)); }
    if (preset === "This Month") start = new Date(today.getFullYear(), today.getMonth(), 1);
    if (preset === "Last Month") { start = new Date(today.getFullYear(), today.getMonth() - 1, 1); end.setDate(0); end.setHours(23, 59, 59, 999); }
    if (preset === "Last 30 Days") start = startOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29));
    setDateRange({ start, end: preset === "All" ? null : end });
    setActiveDatePreset(preset === "All" ? "All dates" : preset);
    setRangeAnchor(null);
    setDateOpen(false);
  };
  const chooseCalendarDate = (day: Date) => {
    const selectedDay = startOfDay(day);
    setActiveDatePreset("Custom Range");
    if (!rangeAnchor) { setRangeAnchor(selectedDay); setDateRange({ start: selectedDay, end: endOfDay(selectedDay) }); return; }
    if (Math.abs(selectedDay.getTime() - rangeAnchor.getTime()) / 86_400_000 >= MAX_CUSTOM_RANGE_DAYS) { setRangeAnchor(selectedDay); setDateRange({ start: selectedDay, end: endOfDay(selectedDay) }); return; }
    const start = selectedDay < rangeAnchor ? selectedDay : rangeAnchor;
    const end = selectedDay < rangeAnchor ? rangeAnchor : selectedDay;
    setDateRange({ start, end });
    setRangeAnchor(null);
  };
  const stats = [{ title: "Total Refunds", value: refundPayments.length, icon: CreditCard, color: "text-green-700" }, { title: "Total Amount", value: money(totalAmount), icon: CheckCircle2, color: "text-slate-900" }];
  return <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
    <header><h1 className="text-2xl font-bold text-slate-900">Refunds</h1><p className="mt-1 text-sm text-slate-500">Track payment reversals and refund statuses</p></header>
    <section className="mt-6 grid gap-4 md:grid-cols-2">{stats.map(({ title, value, icon: Icon, color }) => <article key={title} className="border border-gray-200 bg-white p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p><p className={`mt-2 text-3xl font-bold ${color}`}>{loading ? "â€”" : typeof value === "number" ? value.toLocaleString("en-IN") : value}</p></div><Icon className="h-5 w-5 text-green-700" /></div></article>)}</section>
    {pendingCount > 0 && <div className="mt-6 flex items-center gap-3 border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800"><Clock3 className="h-5 w-5 shrink-0 text-amber-600" /><span>{pendingCount} refunds need review. Open a row to inspect payment and order details.</span></div>}
    <section className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-center">
      <label className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Customer name/email/phone, order or refund reference" className="h-11 w-full border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-green-600" /></label>
      <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 border border-gray-200 bg-white px-3 text-sm"><option value="all">All Statuses</option>{["pending", "processing", "success", "failed"].map((value) => <option key={value} value={value}>{value.toUpperCase()}</option>)}</select>
      <select value={provider} onChange={(event) => setProvider(event.target.value)} className="h-11 border border-gray-200 bg-white px-3 text-sm"><option value="all">All Providers</option>{providers.map((value) => <option key={value}>{value}</option>)}</select>
      <select value={method} onChange={(event) => setMethod(event.target.value)} className="h-11 border border-gray-200 bg-white px-3 text-sm"><option value="all">All Refund Methods</option><option value="Bank Account">Bank Account</option><option value="UPI">UPI</option></select>
      <select value={type} onChange={(event) => setType(event.target.value)} className="h-11 border border-gray-200 bg-white px-3 text-sm"><option value="all">Full &amp; Partial</option><option value="full">FULL</option><option value="partial">PARTIAL</option></select>
      <div ref={datePickerRef} className="relative">
        <button type="button" onClick={() => setDateOpen((open) => !open)} aria-expanded={dateOpen} className="inline-flex h-10 items-center gap-2 border border-green-200 bg-green-50 px-3 text-sm text-green-800 hover:bg-green-100">
          <CalendarDays className="h-3.5 w-3.5" /> {activeDatePreset}
        </button>
        {dateOpen && <div className="absolute right-0 top-full z-50 mt-2 flex w-[min(94vw,790px)] flex-col border border-gray-200 bg-white shadow-xl sm:flex-row">
          <aside className="w-full shrink-0 border-b border-gray-200 p-3 sm:w-36 sm:border-b-0 sm:border-r">
            <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Quick Ranges</p>
            {["Today", "This Week", "This Month", "Last Month", "Last 30 Days", "All"].map((preset) => <button key={preset} type="button" onClick={() => applyQuickRange(preset)} className={`mb-1 w-full px-2.5 py-2 text-left text-sm ${activeDatePreset === (preset === "All" ? "All dates" : preset) ? "bg-green-50 font-semibold text-green-800" : "text-slate-600 hover:bg-gray-50"}`}>{preset}</button>)}
          </aside>
          <DateRangeCalendar
            calendarMonth={calendarMonth}
            dateRange={dateRange}
            rangeAnchor={rangeAnchor}
            onMonthChange={setCalendarMonth}
            onChooseDate={chooseCalendarDate}
            onClear={() => { setDateRange({ start: null, end: null }); setRangeAnchor(null); setActiveDatePreset("All dates"); setDateOpen(false); }}
            onApply={() => { setRangeAnchor(null); setDateOpen(false); }}
          />
        </div>}
      </div>
      <button type="button" onClick={exportCsv} disabled={!filtered.length} className="inline-flex h-11 items-center justify-center gap-2 bg-green-700 px-4 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"><Download className="h-4 w-4" />Export CSV</button>
    </section>
    {error && <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    <section className="mt-6 overflow-hidden border border-gray-200 bg-white"><div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-5"><div><h2 className="text-lg font-bold text-slate-900">Refund List</h2><p className="mt-1 text-sm text-slate-500">Refund records from available payment statuses</p></div><span className="bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">{filtered.length} refunds</span></div><div className="overflow-x-auto"><table className="w-full min-w-[1200px] text-left"><thead><tr className="border-b border-gray-200 text-[11px] uppercase tracking-wide text-slate-400">{["Order #", "Source", "Customer", "Provider", "Method", "Type", "Amount", "Status", "Payout / Reference", "Date", ""].map((column, index) => <th key={`${column}-${index}`} className="px-4 py-4">{column}</th>)}</tr></thead><tbody>{loading ? <tr><td colSpan={11} className="p-10 text-center text-sm text-slate-500">Loading refunds...</td></tr> : filtered.length === 0 ? <tr><td colSpan={11} className="p-10 text-center text-sm text-slate-500">{refundPayments.length ? "No refunds match these filters." : "No refund payment records found."}</td></tr> : filtered.map((payment) => { const order = orderFor(payment); const refundType = typeFor(payment, order); const payStatus = refundStatusFor(payment.payment_status); return <tr key={payment.id} className="border-b border-gray-100 last:border-0 hover:bg-slate-50/50"><td className="px-4 py-4 text-sm font-medium text-slate-800">{payment.order_number || (payment.order_id ? `ORD-${payment.order_id}` : "-")}</td><td className="px-4 py-4 text-sm text-slate-600">{orderIsReturn(order) ? "Return" : "Payment"}</td><td className="px-4 py-4 text-sm text-slate-700">{order?.customer_name || "-"}<div className="text-xs text-slate-400">{order?.customer_email || ""}</div></td><td className="px-4 py-4 text-sm text-slate-600">{providerFor(payment.payment_method)}</td><td className="px-4 py-4 text-sm text-slate-600">{methodFor(payment.payment_method)}</td><td className="px-4 py-4 text-xs uppercase text-slate-600">{refundType}</td><td className="px-4 py-4 text-sm font-semibold text-green-700">{money(payment.amount)}</td><td className="px-4 py-4"><span className={`inline-flex px-2.5 py-1 text-xs font-semibold ${payStatus === "success" ? "bg-green-50 text-green-700" : payStatus.includes("failed") ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{statusLabel(refundStatusFor(payment.payment_status))}</span></td><td className="px-4 py-4 text-sm text-slate-500">{payment.transaction_id || `PAY-${payment.id}`}</td><td className="whitespace-nowrap px-4 py-4 text-sm text-slate-500">{day(payment.payment_date || payment.created_at)}</td><td className="px-4 py-4 text-right"><button type="button" aria-label={`View refund ${payment.id}`} onClick={() => setSelected(payment)} className="p-2 text-slate-500 hover:text-slate-900"><Eye className="h-4 w-4" /></button></td></tr>; })}</tbody></table></div></section>
    {selected && <div className="fixed inset-0 z-[100] flex justify-end"><button type="button" aria-label="Close refund details" onClick={() => setSelected(null)} className="absolute inset-0 bg-slate-900/30" /><aside role="dialog" aria-modal="true" className="relative flex h-full w-full max-w-[600px] flex-col border-l border-gray-200 bg-white shadow-2xl"><header className="flex h-[68px] items-center justify-between border-b border-gray-200 px-5"><div><h2 className="text-lg font-bold text-slate-900">Refund Details</h2><p className="text-xs text-slate-500">{selected.order_number || `ORD-${selected.order_id || "-"}`}</p></div><button type="button" onClick={() => setSelected(null)} aria-label="Close" className="p-2 text-slate-400"><X className="h-5 w-5" /></button></header><div className="flex-1 space-y-5 overflow-y-auto p-5"><section className="border border-gray-200 p-4"><p className="text-xs font-semibold uppercase text-slate-400">Customer</p><p className="mt-2 font-semibold">{orderFor(selected)?.customer_name || "-"}</p><p className="text-sm text-slate-600">{orderFor(selected)?.customer_phone || ""}</p><p className="text-sm text-slate-600">{orderFor(selected)?.customer_email || ""}</p></section><section className="border border-gray-200 p-4"><p className="text-xs font-semibold uppercase text-slate-400">Refund</p><p className="mt-2 text-sm"><strong>Amount:</strong> {money(selected.amount)}</p><p className="mt-2 text-sm"><strong>Status:</strong> {statusLabel(refundStatusFor(selected.payment_status))}</p><p className="mt-2 text-sm"><strong>Provider:</strong> {providerFor(selected.payment_method)}</p><p className="mt-2 text-sm"><strong>Refund method:</strong> {methodFor(selected.payment_method)}</p><p className="mt-2 text-sm"><strong>Reference:</strong> {selected.transaction_id || `PAY-${selected.id}`}</p><p className="mt-2 text-sm"><strong>Date:</strong> {selected.payment_date ? new Date(selected.payment_date).toLocaleString("en-IN") : day(selected.created_at)}</p></section><section className="border border-gray-200 p-4"><p className="text-xs font-semibold uppercase text-slate-400">Order items</p>{(orderFor(selected)?.items || []).map((item, index) => <p key={`${item.product_name}-${index}`} className="mt-2 text-sm text-slate-700">{item.product_name || "Product"} x {item.quantity || 1} <span className="text-slate-500">{money(item.total_price)}</span></p>)}</section></div></aside></div>}
  </div>;
};
export default PaymentsRefunds;
