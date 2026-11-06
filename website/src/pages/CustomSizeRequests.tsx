import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import AccountLayout from "../components/AccountLayout";
import { decideCustomSizeQuotation, getMyCustomSizeRequests, type CustomSizeRequest } from "../services/customSizeRequests";

export default function CustomSizeRequests() {
  const navigate = useNavigate();
  const { user, token, loading } = useAuth();
  const [requests, setRequests] = useState<CustomSizeRequest[]>([]);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadRequests = useCallback(async () => {
    if (!token) return;
    try {
      setError("");
      const response = await getMyCustomSizeRequests(token);
      setRequests(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your requests.");
    }
  }, [token]);

  useEffect(() => { void loadRequests(); }, [loadRequests]);

  const decide = async (request: CustomSizeRequest, decision: "Accepted" | "Rejected") => {
    if (!token) return;
    setBusyId(request.id);
    setError("");
    setMessage("");
    try {
      const response = await decideCustomSizeQuotation(token, request.id, decision);
      setRequests((current) => current.map((item) => item.id === request.id ? response.data : item));
      setMessage(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your decision.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace state={{ returnTo: "/my-custom-size-requests" }} />;

  return (
    <AccountLayout>
      <div className="acct-card">
        <h1 className="acct-title">My Custom Size Requests</h1>
        <p className="acct-subtitle">Review your submitted dimensions and respond to quotations.</p>
        {error && <p className="acct-msg error" role="alert">{error}</p>}
        {message && <p className="acct-msg ok" role="status">{message}</p>}
        {requests.length === 0 ? (
          <p>You have no custom size requests yet. <Link to="/">Browse products</Link></p>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {requests.map((request) => (
              <article key={request.id} style={{ border: "1px solid #e5e5e5", borderRadius: 8, padding: 16, background: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <strong>{request.product_name}</strong>
                  <span>{request.status}</span>
                </div>
                <p style={{ margin: "8px 0 4px" }}>Request ID: {request.request_id}</p>
                <p style={{ margin: "4px 0" }}>Dimensions: {request.length_cm} × {request.width_cm} × {request.height_cm} cm</p>
                <p style={{ margin: "4px 0" }}>Submitted: {new Date(request.created_at).toLocaleString("en-IN")}</p>
                {request.quotation_sent_at && request.quotation_amount !== null && <p style={{ margin: "8px 0 4px" }}><strong>Quotation: ₹{Number(request.quotation_amount).toLocaleString("en-IN")}</strong></p>}
                {request.quotation_sent_at && request.quotation_details && <p style={{ whiteSpace: "pre-wrap", margin: "4px 0" }}>{request.quotation_details}</p>}
                {request.admin_remarks && <p style={{ whiteSpace: "pre-wrap", margin: "8px 0 4px" }}>Update: {request.admin_remarks}</p>}
                {request.status === "Quotation Sent" && (
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button className="acct-btn" disabled={busyId === request.id} onClick={() => void decide(request, "Accepted")}>Accept quotation</button>
                    <button className="acct-btn" disabled={busyId === request.id} onClick={() => void decide(request, "Rejected")}>Reject quotation</button>
                  </div>
                )}
                {request.customer_decision === "Accepted" && !request.order_id && <p style={{ margin: "10px 0 0" }}>Your quotation is accepted. Continue to checkout to confirm the order and pay.</p>}
                {request.order_id && <p style={{ margin: "10px 0 0" }}>Order placed. You can follow it under <Link to="/orders">Your Orders</Link>.</p>}
                {request.customer_decision === "Accepted" && !request.order_id && request.quotation_amount !== null && request.product_id !== null && (
                  <button
                    type="button"
                    className="acct-btn"
                    style={{ marginTop: 10 }}
                    onClick={() => navigate("/checkout", { state: { buyNowItem: {
                      id: request.product_id!,
                      name: request.product_name,
                      category: "Custom Furniture",
                      price: Number(request.quotation_amount),
                      quantity: 1,
                      variantName: `Custom size request ${request.request_id}: ${request.length_cm} × ${request.width_cm} × ${request.height_cm} cm`,
                      image: request.product_image || "",
                      customSizeRequestId: request.id,
                    } } })}
                  >Continue to checkout</button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
