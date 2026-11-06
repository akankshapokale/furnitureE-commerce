import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Download,
  IndianRupee,
  CheckCircle,
  Clock3,
  Eye,
  X,
  Printer,
  User,
  CreditCard,
  Package,
  MapPin,
} from "lucide-react";

import { getOrders, getPayments } from "../services/api";

interface Payment {
  id: number;
  order_id?: number;
  order_number?: string;
  transaction_id?: string | null;
  payment_method?: string | null;
  payment_status?: string | null;
  amount?: number | string;
  payment_date?: string | null;
  failure_reason?: string | null;
  created_at?: string;
}

interface InvoiceOrder {
  id: number;
  order_number?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  address_line1?: string | null;
  address_line2?: string | null;
  shipping_city?: string | null;
  shipping_state?: string | null;
  shipping_postal_code?: string | null;
  subtotal?: number | string;
  discount_amount?: number | string;
  shipping_charge?: number | string;
  tax_amount?: number | string;
  total_amount: number | string;
  status: string;
  payment_status: string;
  created_at: string;
  items?: { id?: number; product_name?: string; quantity?: number | string; unit_price?: number | string; total_price?: number | string }[];
}

const inr = (amount: number | string | undefined) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const paymentStatusStyles: Record<string, string> = {
  paid: "bg-green-50 text-green-700",
  success: "bg-green-50 text-green-700",
  completed: "bg-green-50 text-green-700",
  pending: "bg-yellow-50 text-yellow-700",
  failed: "bg-red-50 text-red-700",
  refunded: "bg-orange-50 text-orange-700",
};

const formatStatus = (status?: string | null) => {
  if (!status) return "Pending";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (date?: string | null) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<InvoiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [invoice, setInvoice] = useState<{ payment: Payment; order: InvoiceOrder } | null>(null);
  const [actionMessage, setActionMessage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter] = useState(() => new URLSearchParams(window.location.search).get("status") || "all");

  // Fetch payments from backend
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError("");
    const [paymentsResult, ordersResult] = await Promise.allSettled([getPayments(), getOrders()]);
    if (paymentsResult.status === "fulfilled") {
      setPayments(Array.isArray(paymentsResult.value.data?.data) ? paymentsResult.value.data.data : []);
    } else {
      setError("Failed to load payments. Please retry.");
    }
    if (ordersResult.status === "fulfilled") {
      setOrders(Array.isArray(ordersResult.value.data?.data) ? ordersResult.value.data.data : []);
    } else {
      setError((current) => current ? `${current} Invoices are unavailable until orders load.` : "Invoices are unavailable until orders load.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchPayments(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchPayments]);

  useEffect(() => {
    if (invoice) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [invoice]);

  const showInvoice = (payment: Payment) => {
    const order = orders.find((candidate) =>
      (payment.order_id != null && String(candidate.id) === String(payment.order_id)) ||
      (!!payment.order_number && candidate.order_number === payment.order_number)
    );
    if (!order) {
      setActionMessage("No invoice is available for this payment because its order could not be found.");
      return;
    }
    setActionMessage("");
    setInvoice({ payment, order });
  };

  // Summary calculations
  const totalRevenue = payments
    .filter((payment) => {
      const status = payment.payment_status?.toLowerCase();

      return (
        status === "paid" ||
        status === "success" ||
        status === "completed"
      );
    })
    .reduce((total, payment) => {
      return total + Number(payment.amount || 0);
    }, 0);

  const successfulPayments = payments.filter((payment) => {
    const status = payment.payment_status?.toLowerCase();

    return (
      status === "paid" ||
      status === "success" ||
      status === "completed"
    );
  }).length;

  const pendingPayments = payments.filter(
    (payment) =>
      payment.payment_status?.toLowerCase() === "pending"
  ).length;


  // Search + filters
  const filteredPayments = payments.filter((payment) => {
      const searchValue = search.toLowerCase().trim();

      const paymentId = String(payment.id || "");

      const orderId = payment.order_number
        ? payment.order_number.toLowerCase()
        : String(payment.order_id || "").toLowerCase();

      const transactionId =
        payment.transaction_id?.toLowerCase() || "";

      const method =
        payment.payment_method?.toLowerCase() || "";

      const status =
        payment.payment_status?.toLowerCase() || "pending";

      const matchesSearch =
        !searchValue ||
        paymentId.toLowerCase().includes(searchValue) ||
        orderId.includes(searchValue) ||
        transactionId.includes(searchValue) ||
        method.includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

  const handleExportPayments = () => {
  if (payments.length === 0) {
    setActionMessage("No payment data available to export.");
    return;
  }

  const headers = [
    "Payment ID",
    "Order ID",
    "Transaction ID",
    "Amount",
    "Payment Method",
    "Payment Status",
    "Payment Date",
  ];

  const rows = payments.map((payment) => [
    `PAY-${payment.id}`,
    payment.order_number
      ? payment.order_number
      : payment.order_id
      ? `ORD-${payment.order_id}`
      : "",
    payment.transaction_id || "",
    payment.amount || 0,
    payment.payment_method || "",
    payment.payment_status || "",
    payment.payment_date || payment.created_at || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `payments-${new Date()
    .toISOString()
    .split("T")[0]}.csv`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-5 lg:p-6 xl:p-8">

        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-[28px]">
              Payments
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage and track all customer payment transactions
            </p>
          </div>

          <button
  type="button"
  onClick={handleExportPayments}
  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700 sm:w-auto"
>
  <Download className="h-4 w-4" />
  Export Payments
</button>
        </div>

        {error && (
          <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button type="button" onClick={() => void fetchPayments()} className="shrink-0 font-semibold underline">Retry</button>
          </div>
        )}
        {actionMessage && (
          <div role="alert" className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <span>{actionMessage}</span>
            <button type="button" aria-label="Dismiss message" onClick={() => setActionMessage("")}><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

          {/* Total Revenue */}
          <div className="min-w-0 border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                  Total Revenue
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-[28px]">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
            </div>

            <p className="mt-2 text-xs font-medium text-green-600">
              Successful payment revenue
            </p>
          </div>

          {/* Successful Payments */}
          <div className="min-w-0 border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                  Successful Payments
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-[28px]">
                  {successfulPayments.toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Successfully completed transactions
            </p>
          </div>

          {/* Pending Payments */}
          <div className="min-w-0 border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                  Pending Payments
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-[28px]">
                  {pendingPayments.toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
                <Clock3 className="h-5 w-5 text-yellow-600" />
              </div>
            </div>

            <p className="mt-2 text-xs text-yellow-600">
              Awaiting payment confirmation
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

            {/* Search */}
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search payment, order or transaction..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* Payment Status */}

            {/* Payment Method */}
          </div>
        </div>

        {/* Payments Table */}
        <div className="mt-6 overflow-hidden border border-gray-200 bg-white">

          {/* Table Header */}
          <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Payment Transactions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest customer payment transactions
              </p>
            </div>

            <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              {filteredPayments.length.toLocaleString("en-IN")} Transactions
            </span>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1000px]">

              <thead>
                <tr className="border-b border-gray-100 bg-slate-50/70">

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Payment ID
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Order ID
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Transaction
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Amount
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Method
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Date
                  </th>

                  <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      Loading payments...
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => {

                    const status =
                      payment.payment_status?.toLowerCase() ||
                      "pending";

                    const formattedStatus =
                      formatStatus(payment.payment_status);

                    return (
                      <tr
                        key={payment.id}
                        className="border-b border-gray-100 last:border-0 transition-colors hover:bg-slate-50/60"
                      >

                        {/* Payment ID */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-slate-700">
                            #PAY-{payment.id}
                          </span>
                        </td>

                        {/* Order ID */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-700">
                            {payment.order_number
                              ? `#${payment.order_number}`
                              : payment.order_id
                              ? `#ORD-${payment.order_id}`
                              : "—"}
                          </span>
                        </td>

                        {/* Transaction */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">
                            {payment.transaction_id || "—"}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-slate-900">
                            {inr(payment.amount)}
                          </span>
                        </td>

                        {/* Method */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">
                            {payment.payment_method || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              paymentStatusStyles[status] ||
                              "bg-gray-50 text-gray-600"
                            }`}
                          >
                            {formattedStatus}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4">
                          <span className="whitespace-nowrap text-sm text-slate-500">
                            {formatDate(
                              payment.payment_date ||
                                payment.created_at
                            )}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            title="View Invoice"
                            aria-label={`View invoice for payment ${payment.id}`}
                            onClick={() => showInvoice(payment)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-green-50 hover:text-green-600"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>

                      </tr>
                    );
                  })
                )}

              </tbody>
            </table>
          </div>

        </div>
      </div>
      {invoice && (
        <div className="fixed inset-0 z-[70]">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity"
            onClick={() => setInvoice(null)}
            aria-hidden="true"
          />

          {/* Right-docked Drawer */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Order invoice"
            className="fixed inset-y-0 right-0 z-[71] flex h-full w-full max-w-[480px] sm:max-w-[500px] flex-col border-l border-gray-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4 print:hidden">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Invoice Details</h2>
                <p className="text-xs text-slate-500">Order #{invoice.order.order_number || invoice.order.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setInvoice(null)}
                aria-label="Close invoice"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Content: Sequential flow with larger, readable text and balanced spacing */}
            <div id="payment-invoice" className="flex-1 min-h-0 overflow-hidden p-4 space-y-2.5">
              {/* 1. Invoice Reference Card */}
              <div className="border border-gray-200 bg-slate-50/70 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Invoice Reference</p>
                    <p className="mt-1 font-mono text-base font-bold text-slate-900">
                      #{invoice.order.order_number || invoice.order.id}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Issued on {formatDate(invoice.order.created_at)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      paymentStatusStyles[invoice.payment.payment_status?.toLowerCase() || "pending"] ||
                      "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {formatStatus(invoice.payment.payment_status)}
                  </span>
                </div>
              </div>

              {/* 2. Customer */}
              <div className="border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <User className="h-4 w-4 text-slate-500" />
                  <span>Customer</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {invoice.order.customer_name || "Customer"}
                </p>
                {(invoice.order.customer_email || invoice.order.customer_phone) && (
                  <div className="flex flex-wrap gap-x-3 text-xs text-slate-600">
                    {invoice.order.customer_email && <span>{invoice.order.customer_email}</span>}
                    {invoice.order.customer_phone && <span>{invoice.order.customer_phone}</span>}
                  </div>
                )}
              </div>

              {/* 3. Payment Details */}
              <div className="border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <CreditCard className="h-4 w-4 text-slate-500" />
                  <span>Payment Details</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {invoice.payment.payment_method || "—"} • {inr(invoice.payment.amount)}
                </p>
                {invoice.payment.transaction_id && (
                  <p className="mt-0.5 text-xs font-mono text-slate-600 truncate" title={invoice.payment.transaction_id}>
                    TXN: {invoice.payment.transaction_id}
                  </p>
                )}
              </div>

              {/* 4. Shipping Address */}
              {(invoice.order.address_line1 || invoice.order.shipping_city) && (
                <div className="border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span>Shipping Address</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-700 leading-snug">
                    {[
                      invoice.order.address_line1,
                      invoice.order.address_line2,
                      invoice.order.shipping_city,
                      invoice.order.shipping_state,
                      invoice.order.shipping_postal_code,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}

              {/* 5. Order Items */}
              <div>
                <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Package className="h-4 w-4 text-slate-500" />
                  <span>Order Items</span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="py-2 font-semibold">Item</th>
                      <th className="py-2 text-right font-semibold">Qty</th>
                      <th className="py-2 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoice.order.items?.length ? (
                      invoice.order.items.map((item, index) => (
                        <tr key={item.id ?? index}>
                          <td className="max-w-[200px] truncate py-1 font-medium text-slate-800">
                            {item.product_name || "Product"}
                          </td>
                          <td className="py-1 text-right text-slate-600">{item.quantity || 0}</td>
                          <td className="py-1 text-right font-semibold text-slate-900">
                            {inr(item.total_price ?? Number(item.unit_price || 0) * Number(item.quantity || 0))}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-2 text-center text-xs text-slate-400">
                          No item details available for this order.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 6. Total Amount Summary Card (Flows right below Order Items) */}
              <div className="border border-gray-200 bg-slate-50/70 p-3 space-y-1 text-sm">
                {invoice.order.subtotal != null && (
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-800">{inr(invoice.order.subtotal)}</span>
                  </div>
                )}
                {Number(invoice.order.discount_amount || 0) > 0 && (
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Discount</span>
                    <span>−{inr(invoice.order.discount_amount)}</span>
                  </div>
                )}
                {Number(invoice.order.shipping_charge || 0) > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="font-medium text-slate-800">{inr(invoice.order.shipping_charge)}</span>
                  </div>
                )}
                {Number(invoice.order.tax_amount || 0) > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Tax</span>
                    <span className="font-medium text-slate-800">{inr(invoice.order.tax_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-slate-900">
                  <span>Total Amount</span>
                  <span>{inr(invoice.order.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Footer with Download Invoice Button */}
            <div className="shrink-0 border-t border-gray-200 bg-white p-4 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <Printer className="h-4 w-4" />
                Download invoice
              </button>
            </div>
          </div>

          <style>{`@page { size: A4 portrait; margin: 8mm; } @media print { body * { visibility: hidden !important; } #payment-invoice, #payment-invoice * { visibility: visible !important; } #payment-invoice { position: absolute; top: 0; left: 0; width: 100%; max-height: none !important; overflow: visible !important; padding: 0 !important; background: white; font-size: 9pt; line-height: 1.2; break-inside: avoid; page-break-inside: avoid; } #payment-invoice > div { padding-top: 8px !important; padding-bottom: 8px !important; } #payment-invoice table { font-size: 8pt; } #payment-invoice th, #payment-invoice td { padding-top: 4px !important; padding-bottom: 4px !important; } #payment-invoice h1 { font-size: 16pt !important; } }`}</style>
        </div>
      )}

    </div>
  );
};

export default Payments;
