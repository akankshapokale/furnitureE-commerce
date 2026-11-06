import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Download,
  CalendarDays,
  FileDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  IndianRupee,
  Package,
  RotateCcw,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react";

import {
  getCategories,
  getOrders,
  getPayments,
  getProducts,
} from "../services/api";
import DateRangeCalendar, { type CalendarDateRange } from "../components/common/DateRangeCalendar";
import { getOrderTimestamp } from "../utils/orderDate";
import { downloadInvoicePdf } from "../utils/invoicePdf";
import MonthlySalesChart from "../components/dashboard/MonthlySalesChart";

interface OrderItem {
  product_id?: number;
  product_name?: string;
  quantity?: number | string;
  total_price?: number | string;
  unit_price?: number | string;
}

interface Order {
  id: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  phone?: string;
  address_line1?: string | null;
  address_line2?: string | null;
  shipping_city?: string | null;
  shipping_state?: string | null;
  shipping_postal_code?: string | null;
  subtotal?: number | string;
  discount_amount?: number | string;
  total_amount: number | string;
  status: string;
  payment_status: string;
  created_at: string;
  order_number?: string;
  items?: OrderItem[];
}

interface Payment {
  payment_status: string;
  amount: number | string;
  payment_date?: string;
  created_at?: string;
}

interface Product {
  id: number;
  name: string;
  category_id?: number | null;
}

interface Category {
  id: number;
  name: string;
}

const COLORS = ["#16a34a", "#3b82f6", "#8b5cf6", "#eab308", "#ef4444", "#14b8a6"];
const PAID = ["paid", "success", "successful", "completed"];
const NOT_A_SALE = ["cancelled", "returned"];
const DAY_MS = 24 * 60 * 60 * 1000;

const inr = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

const compact = (value: number) =>
  value >= 100000
    ? `₹${(value / 100000).toFixed(1)}L`
    : value >= 1000
    ? `₹${(value / 1000).toFixed(0)}K`
    : `₹${value}`;

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const monthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const endOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
const MAX_CUSTOM_RANGE_DAYS = 62;
const Sales = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<CalendarDateRange>(() => {
    const now = new Date();
    return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: endOfDay(now) };
  });
  const [activeDatePreset, setActiveDatePreset] = useState("Monthly");
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [showDateCalendar, setShowDateCalendar] = useState(false);
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [rangeAnchor, setRangeAnchor] = useState<Date | null>(null);
  const [graphPage, setGraphPage] = useState(0);
  const [trendPage, setTrendPage] = useState(0);
  const [ordersPage, setOrdersPage] = useState(0);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    const [o, p, pr, c] = await Promise.allSettled([
      getOrders(),
      getPayments(),
      getProducts(),
      getCategories(),
    ]);

    const errors: string[] = [];
    if (o.status === "fulfilled") setOrders(o.value.data.data || []);
    else errors.push("orders");
    if (p.status === "fulfilled") setPayments(p.value.data.data || []);
    else errors.push("payments");
    if (pr.status === "fulfilled") setProducts(pr.value.data.data || []);
    else errors.push("products");
    if (c.status === "fulfilled") setCategories(c.value.data.data || []);
    else errors.push("categories");
    if (errors.length) setError(`Could not load ${errors.join(", ")}. Some sales figures may be incomplete.`);
    if (!silent) setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load(true);
    setRefreshing(false);
  }, [load]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    const interval = window.setInterval(() => void refresh(), 30_000);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, [load, refresh]);

  const applyQuickRange = (preset: string, selectedMonth = calendarMonth) => {
    const today = new Date();
    const monthStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const selectedEnd = endOfDay(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0));
    const end = selectedEnd > endOfDay(today) ? endOfDay(today) : selectedEnd;
    let start: Date | null = null;
    let rangeEnd: Date | null = null;

    if (preset === "Monthly") {
      start = monthStart;
      rangeEnd = end;
    } else if (preset === "Last 6 Months") {
      start = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 5, 1);
      rangeEnd = end;
    } else if (preset === "Custom Date Range") {
      start = dateRange.start || startOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29));
      rangeEnd = dateRange.end || endOfDay(today);
    }

    setDateRange({ start, end: rangeEnd });
    setActiveDatePreset(preset);
    setRangeAnchor(null);
    setShowDateCalendar(false);
    setShowMonthCalendar(false);
    setGraphPage(0);
    setTrendPage(0);
    setOrdersPage(0);
  };

  const dateValue = (date: Date | null, end = false) => {
    if (!date) return "";
    const value = end ? endOfDay(date) : date;
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  };

  const chooseCalendarDate = (day: Date) => {
    const selected = startOfDay(day);
    if (!rangeAnchor) {
      setRangeAnchor(selected);
      setDateRange({ start: selected, end: endOfDay(selected) });
    } else if (Math.abs(selected.getTime() - rangeAnchor.getTime()) / DAY_MS >= MAX_CUSTOM_RANGE_DAYS) {
      setRangeAnchor(selected);
      setDateRange({ start: selected, end: endOfDay(selected) });
    } else {
      const start = selected < rangeAnchor ? selected : rangeAnchor;
      const end = selected < rangeAnchor ? rangeAnchor : selected;
      setDateRange({ start, end: endOfDay(end) });
      setRangeAnchor(null);
    }
    setActiveDatePreset("Custom Date Range");
    setGraphPage(0);
    setTrendPage(0);
    setOrdersPage(0);
  };

  const clearCalendarRange = () => {
    setDateRange({ start: null, end: null });
    setRangeAnchor(null);
    setActiveDatePreset("All Time");
    setShowDateCalendar(false);
    setShowMonthCalendar(false);
    setGraphPage(0);
    setTrendPage(0);
    setOrdersPage(0);
  };

  const moveReportPeriod = (direction: -1 | 1) => {
    const step = activeDatePreset === "Last 6 Months" ? 6 : 1;
    const next = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + direction * step, 1);
    if (next > new Date(new Date().getFullYear(), new Date().getMonth(), 1)) return;
    setCalendarMonth(next);
    applyQuickRange(activeDatePreset, next);
  };

  const data = useMemo(() => {
    const now = new Date();
    const rangeEnd = dateRange.end ? endOfDay(dateRange.end).getTime() : now.getTime();
    const rangeStart = dateRange.start?.getTime() ?? 0;
    const inRange = (raw?: string) => {
      if (!raw) return false;
      const timestamp = new Date(raw).getTime();
      return Number.isFinite(timestamp) && timestamp >= rangeStart && timestamp <= rangeEnd;
    };
    const isSale = (order: Order) =>
      !NOT_A_SALE.includes(order.status?.toLowerCase());
    const isPaid = (payment: Payment) =>
      PAID.includes(payment.payment_status?.toLowerCase());

    const sales = orders.filter(
      (order) => inRange(order.created_at) && isSale(order)
    );

    const totalSales = sales.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );

    const collected = payments
      .filter(
        (payment) =>
          isPaid(payment) && inRange(payment.payment_date || payment.created_at)
      )
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    const returnedValue = orders
      .filter((order) => inRange(order.created_at) && !isSale(order))
      .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

    // Products
    const productMap = new Map<
      string,
      { name: string; units: number; revenue: number }
    >();

    sales.forEach((order) =>
      order.items?.forEach((item) => {
        const name = item.product_name || products.find((product) => product.id === item.product_id)?.name || "Unknown product";
        const entry = productMap.get(name) || { name, units: 0, revenue: 0 };
        entry.units += Number(item.quantity || 0);
        entry.revenue += Number(item.total_price ?? Number(item.quantity || 0) * Number(item.unit_price || 0));
        productMap.set(name, entry);
      })
    );

    const productList = [...productMap.values()].sort(
      (a, b) => b.units - a.units || b.revenue - a.revenue
    );

    const unitsSold = productList.reduce((sum, item) => sum + item.units, 0);

    // Categories
    const categoryOf = new Map(products.map((p) => [p.id, p.category_id]));
    const categoryName = new Map(categories.map((c) => [c.id, c.name]));
    const categoryMap = new Map<string, number>();

    sales.forEach((order) =>
      order.items?.forEach((item) => {
        const categoryId = item.product_id
          ? categoryOf.get(item.product_id)
          : undefined;
        const name =
          (categoryId && categoryName.get(categoryId)) || "Uncategorised";
        categoryMap.set(
          name,
          (categoryMap.get(name) || 0) + Number(item.total_price || 0)
        );
      })
    );

    const categoryData = [...categoryMap.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const recordDates = [
      ...orders.map((order) => getOrderTimestamp(order.created_at, order.order_number)),
      ...payments.map((payment) => new Date(payment.payment_date || payment.created_at || "").getTime()),
    ].filter((timestamp) => Number.isFinite(timestamp) && timestamp > 0);
    const firstAvailable = recordDates.length ? new Date(recordDates.reduce((earliest, value) => Math.min(earliest, value), Number.POSITIVE_INFINITY)) : now;
    const monthsStart = dateRange.start
      ? new Date(dateRange.start.getFullYear(), dateRange.start.getMonth(), 1)
      : new Date(firstAvailable.getFullYear(), firstAvailable.getMonth(), 1);
    const monthsEndDate = dateRange.end || now;
    const monthsEnd = new Date(monthsEndDate.getFullYear(), monthsEndDate.getMonth(), 1);
    const monthCount = Math.max(1, (monthsEnd.getFullYear() - monthsStart.getFullYear()) * 12 + monthsEnd.getMonth() - monthsStart.getMonth() + 1);
    const months = Array.from({ length: monthCount }, (_, i) => {
      const d = new Date(monthsStart.getFullYear(), monthsStart.getMonth() + i, 1);
      return {
        key: monthKey(d),
        month: d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
        sales: 0,
        collected: 0,
        orders: 0,
      };
    });

    sales.forEach((order) => {
      const timestamp = getOrderTimestamp(order.created_at, order.order_number);
      const row = months.find((m) => m.key === monthKey(new Date(timestamp)));
      if (row) {
        row.sales += Number(order.total_amount || 0);
        row.orders += 1;
      }
    });

    payments.filter((payment) => isPaid(payment) && inRange(payment.payment_date || payment.created_at)).forEach((payment) => {
      const raw = payment.payment_date || payment.created_at;
      if (!raw) return;
      const date = new Date(raw);
      if (!Number.isFinite(date.getTime())) return;
      const row = months.find((m) => m.key === monthKey(date));
      if (row) row.collected += Number(payment.amount || 0);
    });

    // Keep the daily chart readable for long custom ranges.
    const dailyStart = new Date(Math.max(rangeStart, rangeEnd - 89 * DAY_MS));
    const span = Math.max(1, Math.min(90, Math.floor((rangeEnd - startOfDay(dailyStart).getTime()) / DAY_MS) + 1));
    const daily = Array.from({ length: span }, (_, i) => {
      const d = new Date(
        dailyStart.getFullYear(),
        dailyStart.getMonth(),
        dailyStart.getDate() + i
      );
      return {
        key: dayKey(d),
        label: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        sales: 0,
      };
    });

    sales.forEach((order) => {
      const row = daily.find(
        (d) => d.key === dayKey(new Date(order.created_at))
      );
      if (row) row.sales += Number(order.total_amount || 0);
    });

    // Payment + status breakdown
    const paymentMap = new Map<string, number>();
    const statusMap = new Map<string, number>();

    orders
      .filter((order) => inRange(order.created_at))
      .forEach((order) => {
        const pay = (order.payment_status || "pending").toLowerCase();
        paymentMap.set(
          pay,
          (paymentMap.get(pay) || 0) + Number(order.total_amount || 0)
        );
        const st = (order.status || "pending").toLowerCase();
        statusMap.set(st, (statusMap.get(st) || 0) + 1);
      });

    // Customers
    const customerMap = new Map<
      string,
      { name: string; orders: number; spent: number }
    >();

    sales.forEach((order) => {
      const name = order.customer_name || "Guest";
      const entry = customerMap.get(name) || { name, orders: 0, spent: 0 };
      entry.orders += 1;
      entry.spent += Number(order.total_amount || 0);
      customerMap.set(name, entry);
    });

    return {
      sales,
      reportOrders: orders.filter((order) => inRange(order.created_at)),
      totalSales,
      collected,
      outstanding: Math.max(0, totalSales - collected),
      returnedValue,
      unitsSold,
      avgOrder: sales.length ? totalSales / sales.length : 0,
      productList,
      categoryData,
      months,
      daily,
      paymentData: [...paymentMap.entries()].map(([name, value]) => ({ name, value })),
      statusData: [...statusMap.entries()].map(([name, value]) => ({ name, value })),
      customers: [...customerMap.values()]
        .sort((a, b) => b.spent - a.spent)
        .slice(0, 5),
    };
  }, [orders, payments, products, categories, dateRange]);

  const graphPageCount = Math.max(1, Math.ceil(data.months.length / 6));
  const visibleMonths = data.months.slice(graphPage * 6, graphPage * 6 + 6);
  const trendPageCount = Math.max(1, Math.ceil(data.daily.length / 14));
  const visibleDaily = data.daily.slice(trendPage * 14, trendPage * 14 + 14);
  const ordersPageCount = Math.max(1, Math.ceil(data.reportOrders.length / 10));
  const visibleOrders = data.reportOrders.slice(ordersPage * 10, ordersPage * 10 + 10);

  const exportCsv = () => {
    const rows = [
      ["Order ID", "Customer", "Order Date", "Order Status", "Payment Status", "Sales Amount"],
      ...data.reportOrders.map((order) => [
        order.order_number || `ORD-${order.id}`,
        order.customer_name || "Guest",
        order.created_at ? new Date(order.created_at).toLocaleString("en-IN") : "",
        order.status || "Pending",
        order.payment_status || "Pending",
        Number(order.total_amount || 0),
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "sales-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const kpis = [
    { label: "Total Sales", value: inr(data.totalSales), hint: `${data.sales.length} orders`, icon: IndianRupee },
    { label: "Revenue Collected", value: inr(data.collected), hint: "Paid payments", icon: Wallet },
    { label: "Outstanding", value: inr(data.outstanding), hint: "Sales not yet paid", icon: TrendingUp },
    { label: "Avg. Order Value", value: inr(data.avgOrder), hint: "Per order", icon: ShoppingCart },
    { label: "Units Sold", value: data.unitsSold.toLocaleString("en-IN"), hint: `${data.productList.length} products`, icon: Package },
    { label: "Returned / Cancelled", value: inr(data.returnedValue), hint: "Excluded from sales", icon: RotateCcw },
  ];

  const card =
    "min-w-0 border border-gray-200 bg-white p-4 sm:p-5 lg:p-6";
  const tooltipMoney = (value: unknown) => inr(Number(value));
  const maxUnits = data.productList[0]?.units || 1;

  const breakdown = (
    title: string,
    subtitle: string,
    rows: { name: string; value: number }[],
    format: (value: number) => string
  ) => (
    <div className={card}>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      <ul className="mt-4 space-y-3">
        {rows.length === 0 && <li className="text-sm text-slate-400">No data</li>}
        {rows.map((row, i) => (
          <li key={row.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 capitalize text-slate-700">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              {row.name}
            </span>
            <span className="font-semibold text-slate-900">{format(row.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen min-w-0 bg-white">
      <div className="min-w-0 space-y-5 p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Sales</h1>
            <p className="mt-1 text-sm text-slate-500">
              Income, monthly revenue and product performance
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <select value={activeDatePreset} onChange={(event) => applyQuickRange(event.target.value)} aria-label="Sales date filter" className="h-11 border border-gray-200 bg-white px-3 text-sm text-slate-700">
              {["Monthly", "Last 6 Months", "Custom Date Range", "All Time"].map((option) => <option key={option}>{option}</option>)}
            </select>
            {(activeDatePreset === "Monthly" || activeDatePreset === "Last 6 Months") && <div className="flex h-11 items-center gap-1 border border-gray-200 px-1">
              <button type="button" aria-label="Previous report period" onClick={() => moveReportPeriod(-1)} className="flex h-8 w-8 items-center justify-center text-slate-600 hover:bg-gray-100"><ChevronLeft size={16} /></button>
              <div className="relative">
                <button type="button" aria-expanded={showMonthCalendar} onClick={() => setShowMonthCalendar((open) => !open)} className="inline-flex h-9 items-center gap-2 px-1 text-sm text-slate-700">
                  <CalendarDays size={15} className="text-slate-500" />
                  {calendarMonth.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </button>
                {showMonthCalendar && <div className="absolute right-0 top-full z-50 mt-2 flex w-[min(94vw,600px)] border border-gray-200 bg-white shadow-xl">
                  <DateRangeCalendar
                    calendarMonth={calendarMonth}
                    dateRange={{ start: calendarMonth, end: calendarMonth }}
                    rangeAnchor={null}
                    selectionMode="single"
                    onMonthChange={setCalendarMonth}
                    onChooseDate={(date) => { const selectedMonth = new Date(date.getFullYear(), date.getMonth(), 1); setCalendarMonth(selectedMonth); applyQuickRange(activeDatePreset, selectedMonth); setShowMonthCalendar(false); }}
                    onClear={clearCalendarRange}
                    onApply={() => { applyQuickRange(activeDatePreset, calendarMonth); setShowMonthCalendar(false); }}
                  />
                </div>}
              </div>
              <button type="button" aria-label="Next report period" disabled={calendarMonth.getFullYear() === new Date().getFullYear() && calendarMonth.getMonth() === new Date().getMonth()} onClick={() => moveReportPeriod(1)} className="flex h-8 w-8 items-center justify-center text-slate-600 hover:bg-gray-100 disabled:opacity-40"><ChevronRight size={16} /></button>
            </div>}
            {activeDatePreset === "Custom Date Range" && <div className="relative">
              <button type="button" aria-expanded={showDateCalendar} onClick={() => setShowDateCalendar((open) => !open)} className="inline-flex h-11 max-w-[min(90vw,22rem)] items-center gap-2 border border-gray-200 bg-white px-3 text-sm text-slate-700 hover:bg-gray-50">
                <CalendarDays size={15} className="shrink-0 text-slate-500" />
                <span className="truncate">{dateRange.start ? `${dateValue(dateRange.start)}${dateRange.end && dateValue(dateRange.end, true) !== dateValue(dateRange.start) ? ` – ${dateValue(dateRange.end, true)}` : ""}` : "Select dates"}</span>
              </button>
              {showDateCalendar && <div className="absolute right-0 top-full z-50 mt-2 flex w-[min(94vw,600px)] border border-gray-200 bg-white shadow-xl">
                <DateRangeCalendar
                  calendarMonth={calendarMonth}
                  dateRange={dateRange}
                  rangeAnchor={rangeAnchor}
                  onMonthChange={setCalendarMonth}
                  onChooseDate={chooseCalendarDate}
                  onClear={clearCalendarRange}
                  onApply={() => { setRangeAnchor(null); setShowDateCalendar(false); }}
                />
              </div>}
            </div>}
            <button type="button" onClick={refresh} disabled={refreshing} className="inline-flex h-11 items-center justify-center gap-2 border border-gray-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-gray-50 disabled:opacity-60">
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button type="button" onClick={exportCsv} className="inline-flex h-11 items-center gap-2 bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button type="button" onClick={() => void load()} className="shrink-0 font-semibold underline">Retry</button>
          </div>
        )}

        {loading ? (
          <p className="py-20 text-center text-sm text-slate-400">
            Loading sales data…
          </p>
        ) : (
          <>
            {/* KPIs */}
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-6">
              {kpis.map(({ label, value, hint, icon: Icon }) => (
                <div
                  key={label}
                  className="min-w-0 border border-gray-200 bg-white p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-xs font-medium text-slate-500">{label}</p>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50">
                      <Icon size={16} className="text-green-600" />
                    </div>
                  </div>
                  <p className="mt-2 truncate text-xl font-bold text-slate-900">{value}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{hint}</p>
                </div>
              ))}
            </section>

            {/* Monthly revenue */}
            <section className={card}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h2 className="text-lg font-bold text-slate-900">Monthly Revenue</h2><p className="mt-1 text-xs text-slate-500">Sales and collected revenue by month</p></div>
                <div className="flex items-center gap-2"><button type="button" disabled={graphPage <= 0} onClick={() => setGraphPage((page) => Math.max(0, page - 1))} className="border border-gray-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-gray-50 disabled:opacity-40">Previous</button><span className="text-xs text-slate-500">{graphPage + 1} / {graphPageCount}</span><button type="button" disabled={graphPage + 1 >= graphPageCount} onClick={() => setGraphPage((page) => Math.min(graphPageCount - 1, page + 1))} className="border border-gray-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-gray-50 disabled:opacity-40">Next</button></div>
              </div>
              <MonthlySalesChart data={visibleMonths} />

              <div className="mt-4 w-full overflow-x-auto">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-[10px] uppercase tracking-wide text-slate-400">
                      <th className="py-2">Month</th>
                      <th className="py-2 text-right">Orders</th>
                      <th className="py-2 text-right">Sales</th>
                      <th className="py-2 text-right">Collected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...visibleMonths].reverse().map((m) => (
                      <tr key={m.key} className="border-b border-gray-50 last:border-0">
                        <td className="py-2 text-slate-700">{m.month}</td>
                        <td className="py-2 text-right text-slate-600">{m.orders}</td>
                        <td className="py-2 text-right font-semibold text-slate-900">{inr(m.sales)}</td>
                        <td className="py-2 text-right text-slate-600">{inr(m.collected)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Daily trend */}
            <section className={card}>
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold text-slate-900">Sales Trend</h2><p className="mt-1 text-xs text-slate-500">Daily sales in the selected period</p></div><div className="flex items-center gap-2"><button type="button" disabled={trendPage <= 0} onClick={() => setTrendPage((page) => Math.max(0, page - 1))} className="border border-gray-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-gray-50 disabled:opacity-40">Previous</button><span className="text-xs text-slate-500">{trendPage + 1} / {trendPageCount}</span><button type="button" disabled={trendPage + 1 >= trendPageCount} onClick={() => setTrendPage((page) => Math.min(trendPageCount - 1, page + 1))} className="border border-gray-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-gray-50 disabled:opacity-40">Next</button></div></div>
              <div className="mt-4 h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visibleDaily} margin={{ top: 10, right: 8, left: -5, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} minTickGap={24} />
                    <YAxis axisLine={false} tickLine={false} width={50} tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={compact} />
                    <Tooltip formatter={tooltipMoney} />
                    <Line type="monotone" dataKey="sales" name="Sales" stroke="#16a34a" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className={card}>
              <h2 className="text-lg font-bold text-slate-900">Orders and Invoices</h2>
              <p className="mt-1 text-xs text-slate-500">Orders in the selected date range. Invoice PDFs use the order and customer details returned by the API.</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[680px] text-sm">
                  <thead><tr className="border-b border-gray-100 text-left text-[10px] uppercase tracking-wide text-slate-400"><th className="py-2">Order ID</th><th className="py-2">Customer</th><th className="py-2">Date</th><th className="py-2">Payment</th><th className="py-2 text-right">Total</th><th className="py-2 text-right">Invoice</th></tr></thead>
                  <tbody>{visibleOrders.map((order) => <tr key={order.id} className="border-b border-gray-50 last:border-0"><td className="py-2.5 font-medium text-slate-800">{order.order_number || `ORD-${order.id}`}</td><td className="py-2.5 text-slate-600">{order.customer_name || "Guest"}</td><td className="py-2.5 text-slate-600">{new Date(order.created_at).toLocaleDateString("en-IN")}</td><td className="py-2.5 capitalize text-slate-600">{order.payment_status || "Pending"}</td><td className="py-2.5 text-right font-semibold text-slate-800">{inr(Number(order.total_amount || 0))}</td><td className="py-2.5 text-right"><button type="button" onClick={() => downloadInvoicePdf(order)} className="inline-flex items-center gap-1.5 border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-gray-50"><FileDown size={14} /> PDF</button></td></tr>)}{visibleOrders.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-sm text-slate-400">No orders in this period</td></tr>}</tbody>
                </table>
              </div>
              {ordersPageCount > 1 && <div className="mt-3 flex items-center justify-end gap-2"><button type="button" disabled={ordersPage <= 0} onClick={() => setOrdersPage((page) => Math.max(0, page - 1))} className="border border-gray-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-gray-50 disabled:opacity-40">Previous</button><span className="text-xs text-slate-500">{ordersPage + 1} / {ordersPageCount}</span><button type="button" disabled={ordersPage + 1 >= ordersPageCount} onClick={() => setOrdersPage((page) => Math.min(ordersPageCount - 1, page + 1))} className="border border-gray-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-gray-50 disabled:opacity-40">Next</button></div>}
            </section>

            {/* Products */}
            <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-3">
              <div className={`${card} xl:col-span-2`}>
                <h2 className="text-lg font-bold text-slate-900">Products Sold</h2>
                <p className="mt-1 text-xs text-slate-500">Ranked by units sold</p>

                {data.productList.length === 0 ? (
                  <p className="py-10 text-center text-sm text-slate-400">
                    No sales in this period
                  </p>
                ) : (
                  <div className="mt-4 w-full overflow-x-auto">
                    <table className="w-full min-w-[520px] text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 text-left text-[10px] uppercase tracking-wide text-slate-400">
                          <th className="py-2">#</th>
                          <th className="py-2">Product</th>
                          <th className="py-2 text-right">Units</th>
                          <th className="py-2 text-right">Revenue</th>
                          <th className="py-2 pl-4">Volume</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.productList.map((p, i) => (
                          <tr key={p.name} className="border-b border-gray-50 last:border-0">
                            <td className="py-2.5 text-slate-400">{i + 1}</td>
                            <td className="py-2.5 font-medium text-slate-800">{p.name}</td>
                            <td className="py-2.5 text-right text-slate-700">{p.units}</td>
                            <td className="py-2.5 text-right font-semibold text-slate-900">{inr(p.revenue)}</td>
                            <td className="w-32 py-2.5 pl-4">
                              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-green-500"
                                  style={{ width: `${(p.units / maxUnits) * 100}%` }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className={card}>
                <h2 className="text-lg font-bold text-slate-900">Sales by Category</h2>
                <p className="mt-1 text-xs text-slate-500">Revenue share</p>
                {data.categoryData.length === 0 ? (
                  <p className="py-10 text-center text-sm text-slate-400">No data</p>
                ) : (
                  <div className="mt-2 w-full" style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data.categoryData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85}>
                          {data.categoryData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={tooltipMoney} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </section>

            {/* Breakdowns */}
            <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-3">
              {breakdown("Payment Status", "Order value by payment status", data.paymentData, inr)}
              {breakdown("Orders by Status", "Number of orders", data.statusData, String)}
              {breakdown(
                "Top Customers",
                "By spend",
                data.customers.map((c) => ({
                  name: `${c.name} (${c.orders})`,
                  value: c.spent,
                })),
                inr
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Sales;
