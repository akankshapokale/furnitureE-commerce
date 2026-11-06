import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  RotateCcw,
  Search,
  Truck,
  X,
} from "lucide-react";
import { getOrders } from "../services/api";
import DateRangeCalendar from "../components/common/DateRangeCalendar";

interface ReturnItem {
  product_name?: string;
  quantity?: number | string;
  unit_price?: number | string;
  total_price?: number | string;
}

interface ReturnOrder {
  id: number;
  order_number?: string;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  status: string;
  payment_status?: string;
  total_amount: number | string;
  created_at: string;
  notes?: string | null;
  shipment_status?: string | null;
  courier_name?: string | null;
  items?: ReturnItem[];
}

const RETURN_STATUSES = ["returned", "rto", "returned_to_origin", "cancelled", "canceled", "approved", "pending_review", "return_requested"];
const inr = (value: number) => `?${Math.round(value).toLocaleString("en-IN")}`;
const normalizeStatus = (status?: string | null) => (status || "").toLowerCase().replace(/\s+/g, "_");
const isReturnOrder = (order: ReturnOrder) => RETURN_STATUSES.includes(normalizeStatus(order.status));
const formatStatus = (status?: string | null) => (status || "Pending").replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const returnValue = (order: ReturnOrder) => order.items?.length
  ? order.items.reduce((sum, item) => sum + Number(item.total_price ?? Number(item.quantity || 1) * Number(item.unit_price || 0)), 0)
  : Number(order.total_amount || 0);

const Returns = () => {
  const [allOrders, setAllOrders] = useState<ReturnOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [productFilter, setProductFilter] = useState("All Products");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));
  const [rangeAnchor, setRangeAnchor] = useState<Date | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ReturnOrder | null>(null);

  const chooseCalendarDate = (day: Date) => {
    const selected = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const dateValue = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    if (!rangeAnchor || Math.abs(selected.getTime() - rangeAnchor.getTime()) / 86_400_000 >= 62) {
      setRangeAnchor(selected);
      setFromDate(dateValue(selected));
      setToDate(dateValue(selected));
      return;
    }
    const start = selected < rangeAnchor ? selected : rangeAnchor;
    const end = selected < rangeAnchor ? rangeAnchor : selected;
    setFromDate(dateValue(start));
    setToDate(dateValue(end));
    setRangeAnchor(null);
  };

  useEffect(() => {
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!datePickerRef.current?.contains(event.target as Node)) setShowDatePicker(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowDatePicker(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getOrders();
      setAllOrders(response.data.data || []);
    } catch {
      setError("Could not load returns. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const returnOrders = useMemo(() => allOrders.filter(isReturnOrder), [allOrders]);
  const products = useMemo(() => Array.from(new Set(returnOrders.flatMap((order) => (order.items || []).map((item) => item.product_name).filter((name): name is string => Boolean(name))))).sort(), [returnOrders]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const from = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : null;
    const to = toDate ? new Date(`${toDate}T23:59:59.999`).getTime() : null;
    return returnOrders.filter((order) => {
      const status = normalizeStatus(order.status);
      const matchesStatus = statusFilter === "All Statuses" || (statusFilter === "Cancelled" ? ["cancelled", "canceled"].includes(status) : statusFilter === "Returned (RTO / Refunded)" ? ["returned", "rto", "returned_to_origin"].includes(status) : statusFilter === "Pending Review" ? ["pending_review", "return_requested"].includes(status) : status === statusFilter.toLowerCase().replace(/\s+/g, "_"));
      const matchesProduct = productFilter === "All Products" || order.items?.some((item) => item.product_name === productFilter);
      const createdAt = new Date(order.created_at).getTime();
      const matchesDate = Number.isFinite(createdAt) && (from === null || createdAt >= from) && (to === null || createdAt <= to);
      const matchesSearch = !query || [order.order_number, order.id, order.customer_name, ...(order.items || []).map((item) => item.product_name), order.notes].some((value) => String(value ?? "").toLowerCase().includes(query));
      return matchesStatus && matchesProduct && matchesDate && matchesSearch;
    });
  }, [returnOrders, search, statusFilter, productFilter, fromDate, toDate]);

  const cancelledCount = returnOrders.filter((order) => ["cancelled", "canceled"].includes(normalizeStatus(order.status))).length;
  const returnedCount = returnOrders.filter((order) => ["returned", "rto", "returned_to_origin"].includes(normalizeStatus(order.status))).length;
  const pendingReviewCount = returnOrders.filter((order) => ["pending_review", "return_requested"].includes(normalizeStatus(order.status))).length;
  const approvedCount = returnOrders.filter((order) => normalizeStatus(order.status) === "approved").length;

  const exportCsv = () => {
    const columns = ["Order ID", "Customer", "Products Returned", "Return Price", "Status", "Shipment", "Order Date", "Return Reason"];
    const rows = filtered.map((order) => [
      order.order_number || `ORD-${order.id}`,
      order.customer_name || "",
      (order.items || []).map((item) => `${item.product_name || "Product"} x ${item.quantity || 1}`).join("; "),
      returnValue(order),
      formatStatus(order.status),
      order.shipment_status ? `${formatStatus(order.shipment_status)}${order.courier_name ? ` - ${order.courier_name}` : ""}` : "Not created",
      order.created_at,
      order.notes || "",
    ]);
    const csv = [columns, ...rows].map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "returns.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: "Total", value: returnOrders.length, icon: RotateCcw, color: "text-green-700" },
    { label: "Pending Review", value: pendingReviewCount, icon: Clock3, color: "text-amber-600" },
    { label: "Approved", value: approvedCount, icon: CheckCircle2, color: "text-green-600" },
    { label: "Cancelled", value: cancelledCount, icon: X, color: "text-red-600" },
    { label: "Returned (RTO / Refunded)", value: returnedCount, icon: Truck, color: "text-rose-600" },
  ];

  const reasonFor = (order: ReturnOrder) => order.notes?.match(/Return reason:\s*([^\n]+)/i)?.[1] || "-";
  const shipmentFor = (order: ReturnOrder) => order.shipment_status ? `${formatStatus(order.shipment_status)}${order.courier_name ? ` - ${order.courier_name}` : ""}` : "Not created";

  return (
    <div className="min-h-screen min-w-0 bg-white">
      <div className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">Returns</h1>
          <p className="mt-1 text-sm text-slate-500">Return requests, cancelled orders and parcels returned by the courier</p>
        </header>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <article key={label} className="min-w-0 border border-gray-200 bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0"><p className="truncate text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className={`mt-2 text-2xl font-bold ${color}`}>{loading ? "?" : value.toLocaleString("en-IN")}</p></div>
                <Icon className={`h-5 w-5 shrink-0 ${color}`} />
              </div>
            </article>
          ))}
        </section>

        <section className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <label className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Search order, customer, product or reason..." className="h-11 w-full rounded-none border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-green-500" /></label>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 min-w-48 border border-gray-200 bg-white px-3 text-sm text-slate-700">{["All Statuses", "Pending Review", "Approved", "Cancelled", "Returned (RTO / Refunded)"].map((status) => <option key={status}>{status}</option>)}</select>
          <select value={productFilter} onChange={(event) => setProductFilter(event.target.value)} className="h-11 min-w-52 border border-gray-200 bg-white px-3 text-sm text-slate-700">{["All Products", ...products].map((product) => <option key={product}>{product}</option>)}</select>
          <div className="relative">
            <button type="button" onClick={() => setShowDatePicker((open) => !open)} className="inline-flex h-11 items-center gap-2 border border-gray-200 bg-white px-4 text-sm text-slate-700 hover:bg-gray-50"><CalendarDays className="h-4 w-4" />{fromDate || toDate ? `${fromDate || "Any"} to ${toDate || "Today"}` : "All dates"}</button>
            {showDatePicker && <div className="absolute right-0 top-full z-40 mt-2 flex w-[min(94vw,600px)] border border-gray-200 bg-white shadow-xl">
              <DateRangeCalendar
                calendarMonth={calendarMonth}
                dateRange={{ start: fromDate ? new Date(`${fromDate}T00:00:00`) : null, end: toDate ? new Date(`${toDate}T23:59:59.999`) : null }}
                rangeAnchor={rangeAnchor}
                onMonthChange={setCalendarMonth}
                onChooseDate={chooseCalendarDate}
                onClear={() => { setFromDate(""); setToDate(""); setRangeAnchor(null); setShowDatePicker(false); }}
                onApply={() => { setRangeAnchor(null); setShowDatePicker(false); }}
              />
            </div>}
          </div>
          <button type="button" onClick={exportCsv} disabled={!filtered.length} className="inline-flex h-11 items-center justify-center gap-2 bg-green-700 px-4 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"><Download className="h-4 w-4" /> Export CSV</button>
        </section>

        {error && <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}<button type="button" onClick={() => void load()} className="ml-3 font-semibold underline">Retry</button></div>}

        <section className="overflow-hidden border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h2 className="text-lg font-bold text-slate-900">Return List</h2><p className="mt-1 text-sm text-slate-500">Returned and cancelled orders</p></div><span className="w-fit bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">{filtered.length} returns</span></div>
          {loading ? <p className="p-10 text-center text-sm text-slate-500">Loading returns...</p> : filtered.length === 0 ? <p className="p-10 text-center text-sm text-slate-500">{returnOrders.length ? "No returns match your filters." : "There are no returned or cancelled orders."}</p> : (
            <div className="overflow-x-auto"><table className="w-full min-w-[1250px] text-left">
              <thead><tr className="border-b border-gray-200 text-[11px] uppercase tracking-wide text-slate-400"><th className="px-5 py-4">Order ID</th><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Product Returned</th><th className="px-5 py-4">Return Price</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Shipment</th><th className="px-5 py-4">Order Date</th><th className="px-5 py-4">Return Reason</th><th className="px-5 py-4 text-right"> </th></tr></thead>
              <tbody>{filtered.map((order) => {
                const status = normalizeStatus(order.status);
                const cancelled = ["cancelled", "canceled"].includes(status);
                return <tr key={order.id} className="border-b border-gray-100 last:border-0 hover:bg-slate-50/50"><td className="px-5 py-4 text-sm font-semibold text-slate-800">{order.order_number || `ORD-${order.id}`}</td><td className="px-5 py-4 text-sm text-slate-700">{order.customer_name || "Guest"}</td><td className="px-5 py-4 text-sm text-slate-700">{(order.items || []).map((item) => `${item.product_name || "Product"} x ${item.quantity || 1}`).join(", ") || "-"}</td><td className="px-5 py-4 text-sm font-semibold text-slate-800">{inr(returnValue(order))}</td><td className="px-5 py-4"><span className={`inline-flex px-2.5 py-1 text-xs font-semibold ${cancelled ? "bg-red-50 text-red-700" : status === "approved" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{formatStatus(order.status)}</span>{order.payment_status && <p className="mt-1 text-[10px] uppercase text-slate-400">{formatStatus(order.payment_status)}</p>}</td><td className="px-5 py-4 text-sm text-slate-600">{shipmentFor(order)}</td><td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString("en-IN")}</td><td className="max-w-56 truncate px-5 py-4 text-sm text-slate-500" title={reasonFor(order)}>{reasonFor(order)}</td><td className="px-5 py-4 text-right"><button type="button" aria-label={`View ${order.order_number || order.id}`} onClick={() => setSelectedOrder(order)} className="inline-flex h-8 w-8 items-center justify-center text-slate-400 hover:text-slate-800"><Eye className="h-4 w-4" /></button></td></tr>;
              })}</tbody>
            </table></div>
          )}
        </section>
      </div>

      {selectedOrder && <div className="fixed inset-0 z-[100] flex justify-end"><button type="button" aria-label="Close return details" onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-slate-900/30" /><aside role="dialog" aria-modal="true" aria-labelledby="return-details-title" className="relative flex h-full w-full max-w-[620px] flex-col border-l border-gray-200 bg-white shadow-2xl"><header className="flex h-[68px] shrink-0 items-center justify-between border-b border-gray-200 px-5"><div><h2 id="return-details-title" className="text-lg font-bold text-slate-900">Return Details</h2><p className="text-xs text-slate-500">{selectedOrder.order_number || `ORD-${selectedOrder.id}`}</p></div><button type="button" onClick={() => setSelectedOrder(null)} aria-label="Close" className="p-2 text-slate-400 hover:text-slate-800"><X className="h-5 w-5" /></button></header><div className="flex-1 space-y-5 overflow-y-auto p-5"><section className="border border-gray-200 p-4"><p className="text-[11px] font-semibold uppercase text-slate-400">Customer</p><p className="mt-1 font-semibold text-slate-900">{selectedOrder.customer_name || "Guest"}</p><p className="mt-1 text-sm text-slate-600">{selectedOrder.customer_phone || ""}</p><p className="text-sm text-slate-600">{selectedOrder.customer_email || ""}</p></section><section className="border border-gray-200 p-4"><p className="text-[11px] font-semibold uppercase text-slate-400">Products Returned</p><div className="mt-2 space-y-2">{(selectedOrder.items || []).map((item, index) => <div key={`${item.product_name}-${index}`} className="flex justify-between gap-3 text-sm"><span>{item.product_name || "Product"} x {item.quantity || 1}</span><span className="font-medium">{inr(Number(item.total_price ?? Number(item.quantity || 1) * Number(item.unit_price || 0)))}</span></div>)}</div><p className="mt-4 border-t border-gray-100 pt-3 text-right font-bold">{inr(returnValue(selectedOrder))}</p></section><section className="border border-gray-200 p-4"><p className="text-[11px] font-semibold uppercase text-slate-400">Return</p><p className="mt-2 text-sm"><strong>Status:</strong> {formatStatus(selectedOrder.status)}</p><p className="mt-2 text-sm"><strong>Shipment:</strong> {shipmentFor(selectedOrder)}</p><p className="mt-2 text-sm"><strong>Reason:</strong> {reasonFor(selectedOrder)}</p><p className="mt-2 text-sm"><strong>Order date:</strong> {new Date(selectedOrder.created_at).toLocaleString("en-IN")}</p></section></div></aside></div>}
    </div>
  );
};

export default Returns;
