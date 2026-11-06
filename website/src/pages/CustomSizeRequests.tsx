import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import AccountLayout from "../components/AccountLayout";
import {
  decideCustomSizeQuotation,
  getMyCustomSizeRequests,
  type CustomSizeRequest,
} from "../services/customSizeRequests";

const STATUS_BADGES: Record<
  string,
  { label: string; bg: string; color: string; border: string }
> = {
  Pending: { label: "Pending", bg: "#fef3c7", color: "#92400e", border: "#fde68a" },
  "Under Review": { label: "Under Review", bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
  "Quotation Sent": { label: "Quotation Sent", bg: "#e0e7ff", color: "#3730a3", border: "#c7d2fe" },
  Approved: { label: "Approved", bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
  Rejected: { label: "Rejected", bg: "#ffe4e6", color: "#9f1239", border: "#fecdd3" },
};

const formatPrice = (val: string | number | null | undefined) => {
  if (val == null || val === "") return "—";
  const num = Number(val);
  return Number.isFinite(num) ? `₹${num.toLocaleString("en-IN")}` : "—";
};

const formatDate = (val?: string | null) => {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return val;
  }
};

export default function CustomSizeRequests() {
  const navigate = useNavigate();
  const { user, token, loading } = useAuth();
  const [requests, setRequests] = useState<CustomSizeRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<CustomSizeRequest | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Rejection modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingRequest, setRejectingRequest] = useState<CustomSizeRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const loadRequests = useCallback(async () => {
    if (!token) return;
    try {
      setError("");
      const response = await getMyCustomSizeRequests(token);
      setRequests(response.data);
      if (selectedRequest) {
        const refreshed = response.data.find((r) => r.id === selectedRequest.id);
        if (refreshed) setSelectedRequest(refreshed);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your requests.");
    }
  }, [token, selectedRequest]);

  useEffect(() => {
    void loadRequests();
  }, [token]);

  const handleDecide = async (
    request: CustomSizeRequest,
    decision: "Accepted" | "Rejected",
    reason?: string
  ) => {
    if (!token) return;
    setBusyId(request.id);
    setError("");
    setMessage("");
    try {
      const response = await decideCustomSizeQuotation(token, request.id, decision, reason);
      setRequests((current) =>
        current.map((item) => (item.id === request.id ? response.data : item))
      );
      if (selectedRequest && selectedRequest.id === request.id) {
        setSelectedRequest(response.data);
      }
      setMessage(response.message);
      if (decision === "Rejected") {
        setRejectModalOpen(false);
        setRejectingRequest(null);
        setRejectionReason("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your decision.");
    } finally {
      setBusyId(null);
    }
  };

  const openRejectDialog = (request: CustomSizeRequest) => {
    setRejectingRequest(request);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace state={{ returnTo: "/my-custom-size-requests" }} />;

  return (
    <AccountLayout>
      <div className="acct-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 className="acct-title">My Custom Size Requests</h1>
            <p className="acct-subtitle">Track custom dimensions, view quotations, and accept or reject offers.</p>
          </div>
          <button
            type="button"
            className="acct-btn-secondary"
            onClick={() => void loadRequests()}
            style={{ fontSize: 13, padding: "6px 14px", border: "1px solid #d1d5db", borderRadius: 6, background: "#fff", cursor: "pointer" }}
          >
            Refresh
          </button>
        </div>

        {error && <p className="acct-msg error" role="alert" style={{ marginTop: 16 }}>{error}</p>}
        {message && <p className="acct-msg ok" role="status" style={{ marginTop: 16 }}>{message}</p>}

        {requests.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#6b7280" }}>
            <p style={{ fontSize: 16, fontWeight: 500 }}>You have no custom size requests yet.</p>
            <p style={{ fontSize: 14, marginTop: 4 }}>
              Select &quot;Custom Size&quot; on any product page to request tailored dimensions.
            </p>
            <Link to="/" style={{ display: "inline-block", marginTop: 12, color: "#111827", fontWeight: 600 }}>
              Browse Furniture Catalog →
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 20, marginTop: 20 }}>
            {requests.map((request) => {
              const badge = STATUS_BADGES[request.status] || STATUS_BADGES.Pending;
              const isBusy = busyId === request.id;
              const canDecide = request.status === "Quotation Sent" && !request.customer_decision;

              return (
                <article
                  key={request.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: 20,
                    background: "#ffffff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#4f46e5" }}>
                        {request.request_id}
                      </span>
                      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "4px 0 0" }}>
                        {request.product_name}
                      </h2>
                      <span style={{ fontSize: 12, color: "#6b7280" }}>
                        Submitted: {formatDate(request.created_at)}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                        }}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>

                  {/* Dimensions & Product Info */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      margin: "16px 0",
                      padding: 12,
                      background: "#f9fafb",
                      borderRadius: 8,
                    }}
                  >
                    {request.product_image && (
                      <img
                        src={request.product_image}
                        alt={request.product_name}
                        style={{ width: 64, height: 64, objectFit: "contain", background: "#fff", borderRadius: 6, border: "1px solid #e5e7eb" }}
                      />
                    )}
                    <div>
                      <div style={{ fontSize: 13, color: "#6b7280" }}>Requested Dimensions:</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", marginTop: 2 }}>
                        {request.length_cm} × {request.width_cm} × {request.height_cm} CM
                      </div>
                      {request.reference_image && (
                        <a
                          href={request.reference_image}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: 12, color: "#4f46e5", textDecoration: "underline", display: "inline-block", marginTop: 4 }}
                        >
                          View Reference Image / Blueprint
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Quotation Details (if Sent / Approved / Rejected) */}
                  {request.quotation_amount != null && (
                    <div
                      style={{
                        margin: "16px 0",
                        padding: 16,
                        borderRadius: 8,
                        background: "#f5f3ff",
                        border: "1px solid #e0e7ff",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#6b7280" }}>
                            Official Quotation
                          </span>
                          <div style={{ fontSize: 22, fontWeight: 800, color: "#312e81" }}>
                            {formatPrice(request.quotation_amount)}
                          </div>
                        </div>

                        {request.validity_date && (
                          <div style={{ fontSize: 12, color: "#4b5563" }}>
                            <strong>Valid until:</strong> {request.validity_date.slice(0, 10)}
                          </div>
                        )}
                      </div>

                      {request.additional_charges && Number(request.additional_charges) > 0 && (
                        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#4b5563" }}>
                          Additional Charges: {formatPrice(request.additional_charges)}
                        </p>
                      )}

                      {request.quotation_details && (
                        <div style={{ marginTop: 10, borderTop: "1px solid #e0e7ff", paddingTop: 8 }}>
                          <strong style={{ fontSize: 12, color: "#4b5563" }}>Quotation Specifications:</strong>
                          <p style={{ whiteSpace: "pre-wrap", fontSize: 13, color: "#1f2937", margin: "4px 0 0" }}>
                            {request.quotation_details}
                          </p>
                        </div>
                      )}

                      {request.terms_and_conditions && (
                        <div style={{ marginTop: 8, borderTop: "1px dashed #e0e7ff", paddingTop: 8 }}>
                          <strong style={{ fontSize: 12, color: "#4b5563" }}>Terms & Conditions:</strong>
                          <p style={{ whiteSpace: "pre-wrap", fontSize: 12, color: "#4b5563", margin: "4px 0 0" }}>
                            {request.terms_and_conditions}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Admin Remarks */}
                  {request.admin_remarks && (
                    <div style={{ margin: "12px 0", fontSize: 13, color: "#374151" }}>
                      <strong>Admin Update:</strong> {request.admin_remarks}
                    </div>
                  )}

                  {/* Customer Decision Info */}
                  {request.customer_decision && (
                    <div
                      style={{
                        margin: "12px 0",
                        padding: 10,
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        background: request.customer_decision === "Accepted" ? "#ecfdf5" : "#fff1f2",
                        color: request.customer_decision === "Accepted" ? "#065f46" : "#9f1239",
                      }}
                    >
                      You {request.customer_decision.toLowerCase()} this quotation on {formatDate(request.customer_decided_at)}.
                      {request.customer_rejection_reason && (
                        <div style={{ fontWeight: 400, marginTop: 4 }}>
                          Reason: {request.customer_rejection_reason}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
                    {/* Quotation Sent: Accept or Reject */}
                    {canDecide ? (
                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          type="button"
                          className="acct-btn"
                          disabled={isBusy}
                          onClick={() => void handleDecide(request, "Accepted")}
                          style={{
                            background: "#059669",
                            borderColor: "#059669",
                            color: "#fff",
                            fontWeight: 600,
                            padding: "8px 16px",
                            borderRadius: 6,
                            cursor: "pointer",
                          }}
                        >
                          {isBusy ? "Processing..." : "✓ Accept Quotation"}
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => openRejectDialog(request)}
                          style={{
                            background: "#fff",
                            border: "1px solid #ef4444",
                            color: "#ef4444",
                            fontWeight: 600,
                            padding: "8px 16px",
                            borderRadius: 6,
                            cursor: "pointer",
                          }}
                        >
                          ✕ Reject Quotation
                        </button>
                      </div>
                    ) : (
                      <div />
                    )}

                    {/* Approved & Not Ordered: Continue to Checkout */}
                    {request.customer_decision === "Accepted" && !request.order_id && request.quotation_amount !== null && request.product_id !== null && (
                      <button
                        type="button"
                        className="acct-btn"
                        onClick={() =>
                          navigate("/checkout", {
                            state: {
                              buyNowItem: {
                                id: request.product_id!,
                                name: request.product_name,
                                category: "Custom Furniture",
                                price: Number(request.quotation_amount),
                                quantity: 1,
                                variantName: `Custom size request ${request.request_id}: ${request.length_cm} × ${request.width_cm} × ${request.height_cm} CM`,
                                image: request.product_image || "",
                                customSizeRequestId: request.id,
                              },
                            },
                          })
                        }
                        style={{
                          background: "#111827",
                          color: "#fff",
                          fontWeight: 600,
                          padding: "8px 18px",
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                      >
                        Continue to Checkout →
                      </button>
                    )}

                    {/* Order Placed */}
                    {request.order_id && (
                      <span style={{ fontSize: 13, color: "#059669", fontWeight: 600 }}>
                        ✓ Order #{request.order_id} placed.{" "}
                        <Link to="/orders" style={{ textDecoration: "underline", color: "#111827" }}>
                          View in Your Orders
                        </Link>
                      </span>
                    )}

                    {/* View Complete Status History toggle */}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRequest(selectedRequest?.id === request.id ? null : request)
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: "#4f46e5",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      {selectedRequest?.id === request.id ? "Hide History ▲" : "View History & Audit ▼"}
                    </button>
                  </div>

                  {/* Collapsible Status History */}
                  {selectedRequest?.id === request.id && (
                    <div style={{ marginTop: 16, borderTop: "1px solid #e5e7eb", paddingTop: 14 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 10px" }}>
                        Status History & Audit Trail
                      </h4>
                      {!request.status_history || request.status_history.length === 0 ? (
                        <p style={{ fontSize: 12, color: "#6b7280" }}>No audit history recorded.</p>
                      ) : (
                        <div style={{ display: "grid", gap: 10 }}>
                          {request.status_history.map((h, i) => (
                            <div
                              key={h.id || i}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 10,
                                fontSize: 12,
                                borderLeft: "2px solid #6366f1",
                                paddingLeft: 10,
                              }}
                            >
                              <div>
                                <span style={{ fontWeight: 700, color: "#111827" }}>{h.to_status}</span>
                                <span style={{ color: "#9ca3af", marginLeft: 8 }}>{formatDate(h.created_at)}</span>
                                <div style={{ color: "#4b5563" }}>
                                  By {h.action_by_name || h.action_by_type}
                                </div>
                                {h.remarks && <div style={{ color: "#6b7280", marginTop: 2 }}>{h.remarks}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Rejection Confirmation Modal */}
      {rejectModalOpen && rejectingRequest && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              maxWidth: 480,
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
              Reject Quotation
            </h3>
            <p style={{ fontSize: 13, color: "#4b5563", marginTop: 8 }}>
              Are you sure you want to reject this quotation for <strong>{rejectingRequest.product_name}</strong>?
            </p>

            <label style={{ display: "block", marginTop: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                Reason for Rejection (Optional)
              </span>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Budget constraints, dimensions changed..."
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: 8,
                  fontSize: 13,
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  boxSizing: "border-box",
                }}
              />
            </label>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                disabled={busyId === rejectingRequest.id}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busyId === rejectingRequest.id}
                onClick={() => void handleDecide(rejectingRequest, "Rejected", rejectionReason)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {busyId === rejectingRequest.id ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
}
