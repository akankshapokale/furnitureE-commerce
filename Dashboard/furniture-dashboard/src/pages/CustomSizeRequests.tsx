import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Clock3,
  FileCheck2,
  SendHorizontal,
  CheckCircle2,
  XCircle,
  Inbox,
        ExternalLink,
      AlertCircle,
    RefreshCw,
  X,
  User,
  Phone,
  Mail,
  Box,
} from "lucide-react";
import {
  apiError,
  getCustomSizeRequests,
  getMediaUrl,
  reviewCustomSizeRequest,
  sendCustomSizeQuotation,
  type CustomSizeRequestRecord,
  } from "../services/api";

type StatusKey = CustomSizeRequestRecord["status"];

const STATUS_CONFIG: Record<
  StatusKey,
  {
    label: string;
    badgeClass: string;
    bgClass: string;
    textClass: string;
    icon: typeof Clock3;
  }
> = {
  Pending: {
    label: "Pending",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    bgClass: "bg-amber-50",
    textClass: "text-amber-600",
    icon: Clock3,
  },
  "Under Review": {
    label: "Under Review",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    bgClass: "bg-blue-50",
    textClass: "text-blue-600",
    icon: FileCheck2,
  },
  "Quotation Sent": {
    label: "Quotation Sent",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    bgClass: "bg-indigo-50",
    textClass: "text-indigo-600",
    icon: SendHorizontal,
  },
  Approved: {
    label: "Approved",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-600",
    icon: CheckCircle2,
  },
  Rejected: {
    label: "Rejected",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    bgClass: "bg-rose-50",
    textClass: "text-rose-600",
    icon: XCircle,
  },
};

const formatCurrency = (val: string | number | null | undefined) => {
  if (val == null || val === "") return "—";
  const num = Number(val);
  return Number.isFinite(num) ? `₹${num.toLocaleString("en-IN")}` : "—";
};

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return dateString;
  }
};

export default function CustomSizeRequests() {
  const [requests, setRequests] = useState<CustomSizeRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal / drawer states
  const [selectedRequest, setSelectedRequest] = useState<CustomSizeRequestRecord | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  // Review form
  const [reviewRemarks, setReviewRemarks] = useState("");

  // Quotation form
  const [quoteForm, setQuoteForm] = useState({
    quotation_amount: "",
    additional_charges: "",
    quotation_details: "",
    terms_and_conditions:
      "1. Standard production time is 7-10 business days upon confirmation.\n2. Dimensions and finishes are manufactured strictly to client specifications.\n3. Custom pieces are tailored specifically for you and are non-cancellable once in production.",
    validity_date: "",
    admin_remarks: "",
  });

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getCustomSizeRequests();
      const rows = (response.data.data || []) as CustomSizeRequestRecord[];
      setRequests(rows);

      // Refresh selected request if it's currently open
      if (selectedRequest) {
        const refreshed = rows.find((r) => r.id === selectedRequest.id);
        if (refreshed) setSelectedRequest(refreshed);
      }
    } catch (err) {
      setError(apiError(err, "Failed to load custom size requests."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRequests();
  }, []);

  useEffect(() => {
    const modalIsOpen = Boolean(selectedRequest || reviewModalOpen || quoteModalOpen);
    if (!modalIsOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [selectedRequest, reviewModalOpen, quoteModalOpen]);

  // Summary counts
  const summary = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "Pending").length;
    const underReview = requests.filter((r) => r.status === "Under Review").length;
    const quotationSent = requests.filter((r) => r.status === "Quotation Sent").length;
    const approved = requests.filter((r) => r.status === "Approved").length;
    const rejected = requests.filter((r) => r.status === "Rejected").length;
    return { total, pending, underReview, quotationSent, approved, rejected };
  }, [requests]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests.filter((r) => {
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      const matchesQuery =
        !q ||
        [r.request_id, r.customer_name, r.customer_email, r.customer_phone, r.product_name]
          .some((val) => String(val || "").toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [requests, search, statusFilter]);

  // Actions
  const handleOpenReview = (request: CustomSizeRequestRecord) => {
    setSelectedRequest(request);
    setReviewRemarks(request.admin_remarks || "");
    setActionError("");
    setReviewModalOpen(true);
  };

  const handleOpenQuote = (request: CustomSizeRequestRecord) => {
    setSelectedRequest(request);
    // Set 14 days default validity if not set
    const defaultValidity = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    setQuoteForm({
      quotation_amount: request.quotation_amount ? String(request.quotation_amount) : "",
      additional_charges: request.additional_charges ? String(request.additional_charges) : "0",
      quotation_details:
        request.quotation_details ||
        `Custom manufacturing of ${request.product_name} (${request.length_cm} × ${request.width_cm} × ${request.height_cm} CM) using premium grade materials and finishes.`,
      terms_and_conditions:
        request.terms_and_conditions ||
        "1. Standard production time is 7-10 business days upon confirmation.\n2. Dimensions and finishes are manufactured strictly to client specifications.\n3. Custom pieces are tailored specifically for you and are non-cancellable once in production.",
      validity_date: request.validity_date ? request.validity_date.slice(0, 10) : defaultValidity,
      admin_remarks: request.admin_remarks || "",
    });
    setActionError("");
    setQuoteModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedRequest) return;
    setActionBusy(true);
    setActionError("");
    try {
      const res = await reviewCustomSizeRequest(selectedRequest.id, {
        admin_remarks: reviewRemarks,
      });
      const updated = res.data.data as CustomSizeRequestRecord;
      setRequests((curr) => curr.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedRequest(updated);
      setSuccess(`${updated.request_id} has been moved to Under Review.`);
      setReviewModalOpen(false);
    } catch (err) {
      setActionError(apiError(err, "Failed to update review status."));
    } finally {
      setActionBusy(false);
    }
  };

  const handleSubmitQuotation = async () => {
    if (!selectedRequest) return;
    setActionBusy(true);
    setActionError("");

    const amount = Number(quoteForm.quotation_amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setActionError("Please enter a valid positive quotation amount.");
      setActionBusy(false);
      return;
    }

    if (!quoteForm.quotation_details.trim()) {
      setActionError("Please enter detailed quotation information.");
      setActionBusy(false);
      return;
    }

    try {
      const res = await sendCustomSizeQuotation(selectedRequest.id, {
        quotation_amount: amount,
        additional_charges: Number(quoteForm.additional_charges || 0),
        quotation_details: quoteForm.quotation_details,
        terms_and_conditions: quoteForm.terms_and_conditions,
        validity_date: quoteForm.validity_date || undefined,
        admin_remarks: quoteForm.admin_remarks,
      });
      const updated = res.data.data as CustomSizeRequestRecord;
      setRequests((curr) => curr.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedRequest(updated);
      setSuccess(`Quotation has been sent to customer for ${updated.request_id}.`);
      setQuoteModalOpen(false);
    } catch (err) {
      setActionError(apiError(err, "Failed to send quotation."));
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <div className="min-w-0 space-y-6 p-4 sm:p-5 lg:p-6 xl:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Custom Size Requests
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review custom customer dimensions, send official quotations, and monitor customer approvals.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadRequests()}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Global Alerts */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{success}</span>
          <button
            onClick={() => setSuccess("")}
            className="ml-auto text-emerald-600 hover:text-emerald-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 1. Summary Cards (Total, Pending, Under Review, Quotation Sent, Approved, Rejected) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* Total */}
        <div
          onClick={() => setStatusFilter("All")}
          className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-sm ${
            statusFilter === "All"
              ? "border-slate-900 bg-slate-900 text-white shadow"
              : "border-gray-200 bg-white text-slate-800 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                statusFilter === "All" ? "text-slate-300" : "text-slate-500"
              }`}
            >
              Total
            </span>
            <Inbox className={`h-4 w-4 ${statusFilter === "All" ? "text-slate-300" : "text-slate-400"}`} />
          </div>
          <div className="mt-2 text-2xl font-bold">{summary.total}</div>
          <div
            className={`mt-1 text-[11px] ${
              statusFilter === "All" ? "text-slate-400" : "text-slate-400"
            }`}
          >
            All requests
          </div>
        </div>

        {/* Pending */}
        <div
          onClick={() => setStatusFilter("Pending")}
          className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-sm ${
            statusFilter === "Pending"
              ? "border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-400"
              : "border-gray-200 bg-white text-slate-800 hover:border-amber-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Pending
            </span>
            <Clock3 className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-900">{summary.pending}</div>
          <div className="mt-1 text-[11px] text-amber-600">Awaiting review</div>
        </div>

        {/* Under Review */}
        <div
          onClick={() => setStatusFilter("Under Review")}
          className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-sm ${
            statusFilter === "Under Review"
              ? "border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-400"
              : "border-gray-200 bg-white text-slate-800 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Under Review
            </span>
            <FileCheck2 className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-900">{summary.underReview}</div>
          <div className="mt-1 text-[11px] text-blue-600">Feasibility check</div>
        </div>

        {/* Quotation Sent */}
        <div
          onClick={() => setStatusFilter("Quotation Sent")}
          className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-sm ${
            statusFilter === "Quotation Sent"
              ? "border-indigo-500 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-400"
              : "border-gray-200 bg-white text-slate-800 hover:border-indigo-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
              Quotation Sent
            </span>
            <SendHorizontal className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-900">{summary.quotationSent}</div>
          <div className="mt-1 text-[11px] text-indigo-600">Customer decision</div>
        </div>

        {/* Approved */}
        <div
          onClick={() => setStatusFilter("Approved")}
          className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-sm ${
            statusFilter === "Approved"
              ? "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400"
              : "border-gray-200 bg-white text-slate-800 hover:border-emerald-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Approved
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-900">{summary.approved}</div>
          <div className="mt-1 text-[11px] text-emerald-600">Accepted by customer</div>
        </div>

        {/* Rejected */}
        <div
          onClick={() => setStatusFilter("Rejected")}
          className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-sm ${
            statusFilter === "Rejected"
              ? "border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-400"
              : "border-gray-200 bg-white text-slate-800 hover:border-rose-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
              Rejected
            </span>
            <XCircle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-900">{summary.rejected}</div>
          <div className="mt-1 text-[11px] text-rose-600">Declined by customer</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Request ID, customer name, email, phone, or product..."
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400"
          >
            <option value="All">All Statuses ({summary.total})</option>
            <option value="Pending">Pending ({summary.pending})</option>
            <option value="Under Review">Under Review ({summary.underReview})</option>
            <option value="Quotation Sent">Quotation Sent ({summary.quotationSent})</option>
            <option value="Approved">Approved ({summary.approved})</option>
            <option value="Rejected">Rejected ({summary.rejected})</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-slate-50/50 px-5 py-3 text-xs font-medium text-slate-500">
          Showing <span className="font-semibold text-slate-700">{filteredRequests.length}</span>{" "}
          custom size requests
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-slate-400" />
            <p className="mt-3 text-sm text-slate-500">Loading custom size requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 text-center">
            <Inbox className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 font-semibold text-slate-700">No custom size requests found</p>
            <p className="mt-1 text-xs text-slate-400">
              {search || statusFilter !== "All"
                ? "Try adjusting your search criteria or status filter."
                : "Customer requests submitted via product details will appear here."}
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3.5">Request Details</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Dimensions (L × W × H)</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Quotation</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.map((row) => {
                  const cfg = STATUS_CONFIG[row.status] || STATUS_CONFIG.Pending;
                  const Icon = cfg.icon;

                  return (
                    <tr
                      key={row.id}
                      className="transition-colors hover:bg-slate-50/80 cursor-pointer"
                      onClick={() => setSelectedRequest(row)}
                    >
                      {/* Product / Request ID */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {row.product_image ? (
                            <img
                              src={getMediaUrl(row.product_image)}
                              alt={row.product_name}
                              className="h-11 w-11 shrink-0 rounded-lg border border-gray-100 bg-white object-contain"
                            />
                          ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                              <Box className="h-5 w-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-mono text-xs font-semibold text-indigo-700">
                              {row.request_id}
                            </span>
                            <div className="truncate font-semibold text-slate-900">
                              {row.product_name}
                            </div>
                            <span className="text-[11px] text-slate-400">
                              Product ID: #{row.product_id ?? "—"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-900">{row.customer_name}</div>
                        <div className="text-xs text-slate-500">{row.customer_email}</div>
                        {row.customer_phone && (
                          <div className="text-xs text-slate-400">{row.customer_phone}</div>
                        )}
                      </td>

                      {/* Dimensions */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
                          {row.length_cm} × {row.width_cm} × {row.height_cm} CM
                        </span>
                        {row.reference_image && (
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-indigo-600">
                            <span>Has reference image</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.badgeClass}`}
                        >
                          <Icon className="h-3 w-3" />
                          {row.status}
                        </span>
                        {row.customer_decision && (
                          <div className="mt-1 text-[11px] text-slate-500">
                            Customer:{" "}
                            <span
                              className={`font-semibold ${
                                row.customer_decision === "Accepted"
                                  ? "text-emerald-700"
                                  : "text-rose-700"
                              }`}
                            >
                              {row.customer_decision}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Quotation */}
                      <td className="px-5 py-4">
                        {row.quotation_amount != null ? (
                          <div>
                            <div className="font-bold text-slate-900">
                              {formatCurrency(row.quotation_amount)}
                            </div>
                            {row.additional_charges && Number(row.additional_charges) > 0 && (
                              <div className="text-[11px] text-slate-400">
                                +{formatCurrency(row.additional_charges)} extras
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Not quoted</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-5 py-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          {/* Workflow Button: Pending -> Under Review */}
                          {row.status === "Pending" && (
                            <button
                              type="button"
                              onClick={() => handleOpenReview(row)}
                              className="inline-flex h-8 items-center gap-1 rounded-md bg-blue-600 px-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                            >
                              <FileCheck2 className="h-3.5 w-3.5" />
                              Review Request
                            </button>
                          )}

                          {/* Workflow Button: Under Review -> Quotation Sent */}
                          {row.status === "Under Review" && (
                            <button
                              type="button"
                              onClick={() => handleOpenQuote(row)}
                              className="inline-flex h-8 items-center gap-1 rounded-md bg-indigo-600 px-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                            >
                              <SendHorizontal className="h-3.5 w-3.5" />
                              Send Quotation
                            </button>
                          )}

                          {/* View details button */}
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(row)}
                            className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Request Details Drawer / Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-600">
                  {selectedRequest.request_id}
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Custom Size Request Details
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-[auto_auto_auto_minmax(0,1fr)] gap-3 overflow-hidden p-4 max-sm:grid-cols-1 max-sm:grid-rows-none max-sm:overflow-y-auto">
              {/* Status Header Banner */}
              <div
                className={`col-span-2 flex flex-col gap-3 rounded-xl p-3 sm:flex-row sm:items-center sm:justify-between max-sm:col-span-1 ${
                  (STATUS_CONFIG[selectedRequest.status] || STATUS_CONFIG.Pending).bgClass
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Current Status:
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                        (STATUS_CONFIG[selectedRequest.status] || STATUS_CONFIG.Pending).badgeClass
                      }`}
                    >
                      {selectedRequest.status}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Submitted: {formatDate(selectedRequest.created_at)}
                    </span>
                  </div>
                  {selectedRequest.status === "Approved" && (
                    <p className="mt-1 text-xs text-emerald-800">
                      Customer accepted the quotation on {formatDate(selectedRequest.customer_decided_at)}.
                      {selectedRequest.order_id && ` Converted to Order #${selectedRequest.order_id}.`}
                    </p>
                  )}
                  {selectedRequest.status === "Rejected" && (
                    <p className="mt-1 text-xs text-rose-800">
                      Customer rejected the quotation on {formatDate(selectedRequest.customer_decided_at)}.
                      {selectedRequest.customer_rejection_reason && (
                        <span> Reason: &quot;{selectedRequest.customer_rejection_reason}&quot;</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Workflow Action Triggers */}
                <div className="flex items-center gap-2">
                  {selectedRequest.status === "Pending" && (
                    <button
                      type="button"
                      onClick={() => handleOpenReview(selectedRequest)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow transition hover:bg-blue-700"
                    >
                      <FileCheck2 className="h-4 w-4" />
                      Review Request
                    </button>
                  )}
                  {selectedRequest.status === "Under Review" && (
                    <button
                      type="button"
                      onClick={() => handleOpenQuote(selectedRequest)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 text-xs font-semibold text-white shadow transition hover:bg-indigo-700"
                    >
                      <SendHorizontal className="h-4 w-4" />
                      Send Quotation
                    </button>
                  )}
                </div>
              </div>

              {/* Product and Dimensions Details */}
              <div className="col-span-2 min-h-0 overflow-hidden rounded-xl border border-gray-200 p-3 max-sm:col-span-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Product & Dimensions
                </h3>
                <div className="mt-2 flex items-start gap-3">
                  {selectedRequest.product_image ? (
                    <img
                      src={getMediaUrl(selectedRequest.product_image)}
                      alt={selectedRequest.product_name}
                      className="h-16 w-16 shrink-0 rounded-lg border border-gray-100 bg-white object-contain"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                      <Box className="h-8 w-8" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-bold text-slate-900">
                      {selectedRequest.product_name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Product ID: #{selectedRequest.product_id ?? "—"}
                    </p>

                    <div className="mt-2 grid grid-cols-3 gap-3 rounded-lg bg-slate-50 p-2 text-center">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Length</div>
                        <div className="font-bold text-slate-900">{selectedRequest.length_cm} CM</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Width</div>
                        <div className="font-bold text-slate-900">{selectedRequest.width_cm} CM</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Height</div>
                        <div className="font-bold text-slate-900">{selectedRequest.height_cm} CM</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reference Image */}
                {(selectedRequest.additional_requirements || selectedRequest.reference_image) && (
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-2">
                    {selectedRequest.additional_requirements && (
                      <p className="min-w-0 flex-1 text-xs text-slate-600">
                        <strong className="text-slate-700">Additional requirements:</strong> {selectedRequest.additional_requirements}
                      </p>
                    )}
                    {selectedRequest.reference_image && (
                      <a
                        href={getMediaUrl(selectedRequest.reference_image)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Reference Image / Drawing
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div className="col-span-2 min-h-0 overflow-hidden rounded-xl border border-gray-200 p-3 max-sm:col-span-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Customer Information
                </h3>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)]">
                  <div className="flex min-w-0 items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <div className="min-w-0">
                      <div className="text-[11px] text-slate-400">Name</div>
                      <div className="break-words font-semibold text-slate-900">{selectedRequest.customer_name}</div>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <div className="min-w-0">
                      <div className="text-[11px] text-slate-400">Email</div>
                      <a
                        href={`mailto:${selectedRequest.customer_email}`}
                        className="block break-all font-semibold text-indigo-600 hover:underline"
                      >
                        {selectedRequest.customer_email}
                      </a>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <div className="min-w-0">
                      <div className="text-[11px] text-slate-400">Phone</div>
                      {selectedRequest.customer_phone ? (
                        <a
                          href={`tel:${selectedRequest.customer_phone}`}
                          className="block break-all font-semibold text-slate-900 hover:underline"
                        >
                          {selectedRequest.customer_phone}
                        </a>
                      ) : (
                        <span className="text-slate-400">Not provided</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quotation & Admin Remarks */}
              <div className="col-start-2 row-start-4 min-h-0 overflow-hidden rounded-xl border border-gray-200 p-3 max-sm:col-start-1 max-sm:row-start-auto">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quotation Details
                </h3>

                {selectedRequest.quotation_amount != null ? (
                  <div className="mt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-3 rounded-lg bg-indigo-50/50 p-2 sm:grid-cols-4">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500">
                          Quotation Amount
                        </div>
                        <div className="text-lg font-bold text-indigo-900">
                          {formatCurrency(selectedRequest.quotation_amount)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500">
                          Additional Charges
                        </div>
                        <div className="text-sm font-semibold text-slate-800">
                          {formatCurrency(selectedRequest.additional_charges || 0)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500">
                          Validity Date
                        </div>
                        <div className="text-sm font-semibold text-slate-800">
                          {selectedRequest.validity_date
                            ? selectedRequest.validity_date.slice(0, 10)
                            : "No expiry"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500">
                          Sent On
                        </div>
                        <div className="text-xs font-semibold text-slate-700">
                          {formatDate(selectedRequest.quotation_sent_at)}
                        </div>
                      </div>
                    </div>

                    {selectedRequest.quotation_details && (
                      <div>
                        <span className="text-xs font-semibold text-slate-600">
                          Specifications / Details:
                        </span>
                        <p className="mt-1 line-clamp-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-2 text-xs font-sans text-slate-800">
                          {selectedRequest.quotation_details}
                        </p>
                      </div>
                    )}

                    {selectedRequest.terms_and_conditions && (
                      <div>
                        <span className="text-xs font-semibold text-slate-600">
                          Terms & Conditions:
                        </span>
                        <p className="mt-1 line-clamp-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-2 text-xs font-sans text-slate-600">
                          {selectedRequest.terms_and_conditions}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-slate-400 italic">
                    No quotation has been sent for this request yet.
                  </p>
                )}

                {selectedRequest.admin_remarks && (
                  <div className="mt-2 border-t border-gray-100 pt-2">
                    <span className="text-xs font-semibold text-slate-600">Admin Remarks:</span>
                    <p className="mt-1 text-xs text-slate-700">
                      {selectedRequest.admin_remarks}
                    </p>
                  </div>
                )}
              </div>

              {/* Complete Status History */}
              <div className="col-start-1 row-start-4 min-h-0 overflow-hidden rounded-xl border border-gray-200 p-3 max-sm:col-start-1 max-sm:row-start-auto">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Status History & Audit Trail
                </h3>
                <div className="mt-2">
                  {!selectedRequest.status_history || selectedRequest.status_history.length === 0 ? (
                    <div className="text-xs text-slate-400">
                      No status transitions recorded yet.
                    </div>
                  ) : (
                    <ol className="relative ml-3 space-y-2 border-l border-slate-200">
                      {selectedRequest.status_history.slice(-3).map((hist, idx) => {
                        const cfg =
                          STATUS_CONFIG[hist.to_status as StatusKey] || STATUS_CONFIG.Pending;
                        return (
                          <li key={hist.id || idx} className="ml-4">
                            <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-slate-400"></span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-bold ${cfg.badgeClass}`}
                              >
                                {hist.to_status}
                              </span>
                              <span className="text-xs text-slate-400">
                                {formatDate(hist.created_at)}
                              </span>
                            </div>
                            <p className="mt-1 text-xs font-medium text-slate-700">
                              By {hist.action_by_name || hist.action_by_type} ({hist.action_by_type})
                            </p>
                            {hist.remarks && (
                              <p className="mt-0.5 text-xs text-slate-500 whitespace-pre-wrap">
                                {hist.remarks}
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Request Modal (Pending -> Under Review) */}
      {reviewModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Review Custom Size Request
              </h3>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-xs text-slate-500">
                Marking this request as <strong>Under Review</strong> signals that engineering/production is assessing design feasibility and material costs.
              </p>

              <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700 space-y-1">
                <div><strong>Product:</strong> {selectedRequest.product_name}</div>
                <div><strong>Customer:</strong> {selectedRequest.customer_name} ({selectedRequest.customer_email})</div>
                <div><strong>Requested:</strong> {selectedRequest.length_cm} × {selectedRequest.width_cm} × {selectedRequest.height_cm} CM</div>
              </div>

              {actionError && (
                <p className="rounded-md bg-red-50 p-2 text-xs text-red-600">{actionError}</p>
              )}

              <label className="block">
                <span className="text-xs font-semibold text-slate-700">
                  Admin Remarks / Notes (Optional)
                </span>
                <textarea
                  rows={3}
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  placeholder="e.g. Dimensions checked with factory engineer; preparing quotation..."
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  disabled={actionBusy}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleSubmitReview()}
                  disabled={actionBusy}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
                >
                  {actionBusy ? "Saving..." : "Confirm: Mark Under Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Quotation Modal (Under Review -> Quotation Sent) */}
      {quoteModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-600">
                  {selectedRequest.request_id}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Send Quotation to Customer
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-4">
              <div className="rounded-lg bg-indigo-50/50 p-3 text-xs text-indigo-900">
                Customer <strong>{selectedRequest.customer_name}</strong> requested{" "}
                <strong>{selectedRequest.length_cm} × {selectedRequest.width_cm} × {selectedRequest.height_cm} CM</strong> for {selectedRequest.product_name}.
              </div>

              {actionError && (
                <p className="rounded-md bg-red-50 p-2.5 text-xs text-red-600">{actionError}</p>
              )}

              {/* Amount & Additional Charges */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">
                    Quotation Amount (₹) <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={quoteForm.quotation_amount}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, quotation_amount: e.target.value })
                    }
                    placeholder="e.g. 18500"
                    className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">
                    Additional Charges (₹)
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={quoteForm.additional_charges}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, additional_charges: e.target.value })
                    }
                    placeholder="0"
                    className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </label>
              </div>

              {/* Validity Date */}
              <label className="block">
                <span className="text-xs font-semibold text-slate-700">
                  Quotation Validity Date
                </span>
                <input
                  type="date"
                  value={quoteForm.validity_date}
                  onChange={(e) => setQuoteForm({ ...quoteForm, validity_date: e.target.value })}
                  className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </label>

              {/* Quotation Details */}
              <label className="block">
                <span className="text-xs font-semibold text-slate-700">
                  Quotation Details & Scope <span className="text-red-500">*</span>
                </span>
                <textarea
                  rows={3}
                  value={quoteForm.quotation_details}
                  onChange={(e) =>
                    setQuoteForm({ ...quoteForm, quotation_details: e.target.value })
                  }
                  placeholder="Specify material grades, colors, included accessories..."
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </label>

              {/* Terms and Conditions */}
              <label className="block">
                <span className="text-xs font-semibold text-slate-700">
                  Terms and Conditions
                </span>
                <textarea
                  rows={3}
                  value={quoteForm.terms_and_conditions}
                  onChange={(e) =>
                    setQuoteForm({ ...quoteForm, terms_and_conditions: e.target.value })
                  }
                  placeholder="Terms and conditions..."
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </label>

              {/* Remarks */}
              <label className="block">
                <span className="text-xs font-semibold text-slate-700">
                  Optional Admin Remarks
                </span>
                <input
                  type="text"
                  value={quoteForm.admin_remarks}
                  onChange={(e) => setQuoteForm({ ...quoteForm, admin_remarks: e.target.value })}
                  placeholder="Internal notes or quick notes to customer"
                  className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setQuoteModalOpen(false)}
                disabled={actionBusy}
                className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleSubmitQuotation()}
                disabled={actionBusy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <SendHorizontal className="h-4 w-4" />
                {actionBusy ? "Sending Quotation..." : "Send Quotation to Customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
