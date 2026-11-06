import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { API_URL, useAuth } from "../auth/authContext";
import AccountLayout from "../components/AccountLayout";
import "./account.css";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: string;
  total_price: string;
}

interface Order {
  id: number;
  order_number: string;
  total_amount: string;
  delivery_charge?: string | number;
  delivery_fee?: string | number;
  shipping_fee?: string | number;
  status: string;
  shipment_status?: string | null;
  payment_status: string;
  created_at: string;
  address_line1: string | null;
  address_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  items: OrderItem[];
}

const money = (value: string | number) =>
  `₹${Number(value).toLocaleString("en-IN")}`;

const date = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getOrderStage = (order: Order) => {
  const orderStatus = order.status.toLowerCase().replace(/[_-]+/g, " ");
  if (["cancelled", "canceled", "returned", "rto", "returned to origin"].includes(orderStatus)) {
    return { label: orderStatus.replace(/\b\w/g, (letter) => letter.toUpperCase()), badge: orderStatus.includes("return") || orderStatus === "rto" ? "returned" : "cancelled" };
  }

  const status = (order.shipment_status || order.status || "order_placed").toLowerCase().replace(/[_-]+/g, " ");
  const stages: Record<string, { label: string; badge: string }> = {
    pending: { label: "Order Placed", badge: "pending" },
    placed: { label: "Order Placed", badge: "pending" },
    "order placed": { label: "Order Placed", badge: "pending" },
    confirmed: { label: "Order Confirmed", badge: "processing" },
    accepted: { label: "Order Confirmed", badge: "processing" },
    "order confirmed": { label: "Order Confirmed", badge: "processing" },
    processing: { label: "Processing", badge: "processing" },
    packaging: { label: "Packaging", badge: "processing" },
    packed: { label: "Packaging", badge: "processing" },
    "ready to ship": { label: "Ready to Ship", badge: "shipped" },
    dispatched: { label: "Ready to Ship", badge: "shipped" },
    shipped: { label: "In Transit", badge: "shipped" },
    "in transit": { label: "In Transit", badge: "shipped" },
    "out for delivery": { label: "Out for Delivery", badge: "shipped" },
    "out of delivery": { label: "Out for Delivery", badge: "shipped" },
    delivered: { label: "Delivered", badge: "delivered" },
  };
  return stages[status] || { label: status.replace(/\b\w/g, (letter) => letter.toUpperCase()), badge: "pending" };
};

export default function Orders() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    fetch(`${API_URL}/api/orders/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.message || "Failed to load orders");
        if (!cancelled) setOrders(body.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <AccountLayout>
      <div className="acct-card">
        <h1 className="acct-title">Your orders</h1>
        <p className="acct-subtitle">Track and review everything you've ordered.</p>

        {error && <div className="acct-msg error">{error}</div>}

        {!error && orders === null && <p className="acct-empty">Loading orders…</p>}

        {orders?.length === 0 && (
          <div className="acct-empty">
            You haven't placed any orders yet.
            <br />
            <Link to="/shop" className="acct-btn">
              START SHOPPING
            </Link>
          </div>
        )}

        {orders?.map((order) => {
          const isOpen = openId === order.id;
          const orderStage = getOrderStage(order);

          const shipTo = [
            order.address_line1,
            order.address_line2,
            order.shipping_city,
            order.shipping_state,
            order.shipping_postal_code,
          ]
            .filter(Boolean)
            .join(", ");

          // Calculate subtotal from items
          const itemsSubtotal = order.items.reduce(
            (sum, item) => sum + Number(item.total_price || 0),
            0
          );

          const totalNum = Number(order.total_amount || 0);

          // Get delivery charge from order object or calculate from difference
          const explicitDelivery =
            order.delivery_charge !== undefined
              ? Number(order.delivery_charge)
              : order.delivery_fee !== undefined
              ? Number(order.delivery_fee)
              : order.shipping_fee !== undefined
              ? Number(order.shipping_fee)
              : null;

          const deliveryCharge =
            explicitDelivery !== null
              ? explicitDelivery
              : itemsSubtotal > 0 && totalNum > itemsSubtotal
              ? totalNum - itemsSubtotal
              : totalNum >= 50000 || totalNum === 0
              ? 0
              : 499;

          const displaySubtotal =
            itemsSubtotal > 0
              ? itemsSubtotal
              : Math.max(0, totalNum - deliveryCharge);

          return (
            <div className="order-card" key={order.id}>
              <button
                type="button"
                className="order-head"
                onClick={() => setOpenId(isOpen ? null : order.id)}
                aria-expanded={isOpen}
              >
                <div className="order-meta">
                  <small>Order</small>
                  <span>#{order.order_number}</span>
                </div>
                <div className="order-meta">
                  <small>Placed</small>
                  <span>{date(order.created_at)}</span>
                </div>
                <div className="order-meta">
                  <small>Total</small>
                  <span>{money(order.total_amount)}</span>
                </div>
                <div className="order-meta">
                  <small>Status</small>
                  <span className={`badge ${orderStage.badge}`}>{orderStage.label}</span>
                </div>
                <div className="order-meta">
                  <small>Payment</small>
                  <span className={`badge ${order.payment_status}`}>
                    {order.payment_status}
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="order-body">
                  <div className="order-track-action">
  <button
    type="button"
    className="order-track-btn"
    onClick={() =>
      navigate(
        `/track-order?orderId=${encodeURIComponent(
          order.order_number
        )}`
      )
    }
  >
    Track Order →
  </button>
</div>
                  {order.items.length === 0 && (
                    <p style={{ margin: "12px 0", color: "#666" }}>
                      No items recorded for this order.
                    </p>
                  )}

                  {order.items.map((item) => (
                    <div className="order-item" key={item.id}>
                      <div>
                        {item.product_name}
                        <br />
                        <small>
                          {item.quantity} × {money(item.unit_price)}
                        </small>
                      </div>
                      <div>{money(item.total_price)}</div>
                    </div>
                  ))}

                  {/* Order Financial Breakdown */}
                  <div
                    style={{
                      marginTop: "16px",
                      paddingTop: "14px",
                      borderTop: "1px solid #e5e5e5",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {/* Items Subtotal */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        color: "#555555",
                      }}
                    >
                      <span>Items Subtotal</span>
                      <span>{money(displaySubtotal)}</span>
                    </div>

                    {/* Delivery Charge */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        color: "#555555",
                      }}
                    >
                      <span>Delivery Charge</span>
                      <span
                        style={{
                          fontWeight: 600,
                          color: deliveryCharge === 0 ? "#16a34a" : "#111111",
                        }}
                      >
                        {deliveryCharge === 0 ? "FREE" : money(deliveryCharge)}
                      </span>
                    </div>

                    {/* Total Amount */}
                    <div
                      className="order-total"
                      style={{
                        borderTop: "1px dashed #e5e5e5",
                        paddingTop: "10px",
                        marginTop: "4px",
                      }}
                    >
                      <span>Order Total</span>
                      <span>{money(order.total_amount)}</span>
                    </div>
                  </div>

                  {shipTo && <p className="order-ship">Shipping to: {shipTo}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AccountLayout>
  );
}
