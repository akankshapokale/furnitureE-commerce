
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  MapPin,
  Package,
  PackageCheck,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  XCircle,
  CalendarDays,
  Hash,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../auth/authContext";

type OrderItem = {
  id?: string | number;
  name?: string;
  product_name?: string;
  title?: string;
  quantity?: number;
  price?: number | string;
  unit_price?: number | string;
  price_at_purchase?: number | string;
  total_price?: number | string;
  image?: string;
  image_url?: string;
  variant?: string;
};

type Order = {
  id?: string | number;
  _id?: string;
  order_id?: string | number;
  order_number?: string;
  status?: string;
  order_status?: string;
  payment_status?: string;
  total_amount?: number | string;
  total?: number | string;
  grand_total?: number | string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  estimated_delivery?: string;
  delivery_date?: string;
  courier_name?: string;
  tracking_number?: string;
  shipment_status?: string;
  shipping_address?: Record<string, unknown>;
  shippingAddress?: Record<string, unknown>;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  pincode?: string;
  phone?: string;
  items?: OrderItem[];
  order_items?: OrderItem[];
  products?: OrderItem[];
  [key: string]: unknown;
};

type ApiResult = {
  success?: boolean;
  message?: string;
  error?: string;
  data?: unknown;
  orders?: unknown;
  order?: unknown;
  [key: string]: unknown;
};

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const ORDER_STEPS = [
  {
    label: "Order Placed",
    description: "Your order has been received.",
    icon: ShoppingBag,
  },
  {
    label: "Order Confirmed",
    description: "Your order has been confirmed.",
    icon: CheckCircle2,
  },
  {
    label: "Processing",
    description: "Your items are being prepared.",
    icon: Package,
  },
  {
    label: "Packaging",
    description: "Your items are being packed for dispatch.",
    icon: Package,
  },
  {
    label: "Ready to Ship",
    description: "Your order is packed and ready for the courier.",
    icon: PackageCheck,
  },
  {
    label: "In Transit",
    description: "Your order is on its way.",
    icon: Truck,
  },
  {
    label: "Out for Delivery",
    description: "Your order is with the local delivery partner.",
    icon: Truck,
  },
  {
    label: "Delivered",
    description: "Your order has been delivered.",
    icon: PackageCheck,
  },
];

const STATUS_ALIASES: Record<string, number> = {
  pending: 0,
  placed: 0,
  order_placed: 0,
  "order placed": 0,
  order_confirmed: 1,
  "order confirmed": 1,
  confirmed: 1,
  accepted: 1,
  processing: 2,
  packaging: 3,
  packed: 3,
  ready_to_ship: 4,
  "ready to ship": 4,
  dispatched: 4,
  shipped: 5,
  "in transit": 5,
  in_transit: 5,
  "out for delivery": 6,
  out_for_delivery: 6,
  delivered: 7,
};

function getOrderId(order: Order): string {
  return String(
    order.order_number ??
      order.order_id ??
      order.id ??
      order._id ??
      ""
  );
}

function getOrderStatus(order: Order): string {
  const orderStatus = String(order.status ?? order.order_status ?? "pending")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");
  if (["cancelled", "canceled", "returned", "rto", "returned to origin"].includes(orderStatus)) return orderStatus;
  return String(order.shipment_status ?? orderStatus)
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");
}

function getStatusIndex(status: string): number {
  return STATUS_ALIASES[status.toLowerCase().trim()] ?? 0;
}

function getStatusLabel(status: string): string {
  const normalized = status.toLowerCase().trim();
  if (["cancelled", "canceled"].includes(normalized)) return "Cancelled";
  if (["returned", "rto", "returned to origin"].includes(normalized)) return "Returned";
  const stageIndex = STATUS_ALIASES[normalized];
  if (stageIndex !== undefined) return ORDER_STEPS[stageIndex]?.label ?? "Order Placed";
  return status
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatPrice(value: unknown): string {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function formatDate(value: unknown): string {
  if (!value) return "Not available";

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getItems(order: Order): OrderItem[] {
  if (Array.isArray(order.items)) return order.items;
  if (Array.isArray(order.order_items)) return order.order_items;
  if (Array.isArray(order.products)) return order.products;
  return [];
}

function getTotal(order: Order): number {
  const value =
    order.total_amount ?? order.grand_total ?? order.total ?? 0;

  return Number(value) || 0;
}

function getShippingAddress(order: Order): string {
  const address = order.shipping_address ?? order.shippingAddress;

  if (typeof address === "string") return address;

  if (address && typeof address === "object") {
    const fields = address as Record<string, unknown>;

    return [
      fields.address_line1,
      fields.address_line2,
      fields.address,
      fields.street,
      fields.city,
      fields.state,
      fields.postal_code,
      fields.pincode,
    ]
      .filter(Boolean)
      .map(String)
      .join(", ");
  }

  return [
    order.address_line1,
    order.address_line2,
    order.city,
    order.state,
    order.postal_code ?? order.pincode,
  ]
    .filter(Boolean)
    .map(String)
    .join(", ");
}

function getAuthToken(): string | null {
  return (
    localStorage.getItem("auth_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token")
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

async function apiRequest(path: string): Promise<unknown> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  let result: unknown;

  try {
    result = await response.json();
  } catch {
    result = {};
  }

  const data = result as ApiResult;

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Please log in to view your orders.");
    }

    if (response.status === 403) {
      throw new Error("You are not authorized to view this order.");
    }

    if (response.status === 404) {
      throw new Error(
        data.message || "Order not found. Please check the order ID."
      );
    }

    throw new Error(
      data.message ||
        data.error ||
        "Unable to fetch order details. Please try again."
    );
  }

  if (data.success === false) {
    throw new Error(data.message || data.error || "Request failed.");
  }

  return result;
}

function extractOrders(result: unknown): Order[] {
  if (Array.isArray(result)) return result as Order[];

  if (!result || typeof result !== "object") return [];

  const data = result as ApiResult;

  if (Array.isArray(data.orders)) return data.orders as Order[];

  if (Array.isArray(data.data)) return data.data as Order[];

  if (data.data && typeof data.data === "object") {
    const nested = data.data as Record<string, unknown>;

    if (Array.isArray(nested.orders)) return nested.orders as Order[];
    if (Array.isArray(nested.data)) return nested.data as Order[];
  }

  return [];
}

function extractSingleOrder(result: unknown): Order | null {
  if (!result || typeof result !== "object") return null;

  const data = result as ApiResult;

  if (data.order && typeof data.order === "object") {
    return data.order as Order;
  }

  if (data.data && typeof data.data === "object") {
    const nested = data.data as Record<string, unknown>;

    if (nested.order && typeof nested.order === "object") {
      return nested.order as Order;
    }

    if (
      !Array.isArray(data.data) &&
      ("id" in nested ||
        "_id" in nested ||
        "order_number" in nested ||
        "order_id" in nested)
    ) {
      return nested as Order;
    }
  }

  if (
    "id" in data ||
    "_id" in data ||
    "order_number" in data ||
    "order_id" in data
  ) {
    return data as Order;
  }

  return null;
}

function matchesOrder(order: Order, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  return [
    getOrderId(order),
    String(order.id ?? ""),
    String(order._id ?? ""),
    String(order.order_number ?? ""),
  ].some((value) => value.toLowerCase() === normalizedQuery);
}

function getPaymentStatus(order: Order): string {
  return String(order.payment_status ?? "Not available")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const { token: authToken } = useAuth();

  const [orderId, setOrderId] = useState("");
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"track" | "orders">("track");
  useEffect(() => {
  console.log("Current activeTab:", activeTab);
}, [activeTab]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");
  const [ordersError, setOrdersError] = useState("");
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  const loadMyOrders = useCallback(async () => {
    const activeToken = authToken || getAuthToken();

    if (!activeToken) {
      setMyOrders([]);
      setOrdersLoaded(true);
      return [];
    }

    setOrdersLoading(true);
    setOrdersError("");

    try {
      const result = await apiRequest("/api/orders/my");
      const orders = extractOrders(result);

      setMyOrders(orders);
      setOrdersLoaded(true);
      return orders;
    } catch (err) {
      setOrdersError(getErrorMessage(err));
      setOrdersLoaded(true);
      return [];
    } finally {
      setOrdersLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    const activeToken = authToken || getAuthToken();
    if (activeToken) {
      void loadMyOrders();
    }
  }, [authToken, loadMyOrders]);

  useEffect(() => {
    if (activeTab === "orders") {
      void loadMyOrders();
    }
  }, [activeTab, loadMyOrders]);

  const performTracking = useCallback(
    async (query: string) => {
      const q = query.trim();

      if (!q) {
        setError("Please enter your order ID.");
        setActiveOrder(null);
        return;
      }

      setLoading(true);
      setError("");
      setActiveOrder(null);

      try {
        let orders = myOrders;

        const activeToken = authToken || getAuthToken();
        if (activeToken && (!ordersLoaded || orders.length === 0)) {
          orders = await loadMyOrders();
        }

        const matchedOrder = orders.find((order) =>
          matchesOrder(order, q)
        );

        if (matchedOrder) {
          setActiveOrder(matchedOrder);
          return;
        }

        const result = await apiRequest(
          `/api/orders/${encodeURIComponent(q)}`
        );

        const order = extractSingleOrder(result);

        if (!order) {
          throw new Error(
            "Order not found. Please check your order ID and try again."
          );
        }

        setActiveOrder(order);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [myOrders, ordersLoaded, loadMyOrders]
  );

  const initialOrderIdHandled = useRef(false);

  const activeTrackedOrderId = activeOrder ? getOrderId(activeOrder) : "";
  useEffect(() => {
    if (!activeTrackedOrderId) return;

    const refreshTrackedOrder = async () => {
      try {
        const result = await apiRequest(`/api/orders/${encodeURIComponent(activeTrackedOrderId)}`);
        const latestOrder = extractSingleOrder(result);
        if (latestOrder) setActiveOrder(latestOrder);
      } catch {
        // Keep the last known progress visible if the network is temporarily unavailable.
      }
    };

    const timer = window.setInterval(() => void refreshTrackedOrder(), 30_000);
    return () => window.clearInterval(timer);
  }, [activeTrackedOrderId]);

useEffect(() => {
  const id = searchParams.get("orderId");

  if (id && !initialOrderIdHandled.current) {
    initialOrderIdHandled.current = true;
    setOrderId(id);
    void performTracking(id);
  }
}, [searchParams, performTracking]);

  const trackOrder = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      await performTracking(orderId);
    },
    [orderId, performTracking]
  );

  const selectOrder = useCallback((order: Order) => {
    setActiveOrder(order);
    setOrderId(getOrderId(order));
    setError("");
    setActiveTab("track");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const status = activeOrder ? getOrderStatus(activeOrder) : "";
  const statusIndex = getStatusIndex(status);
  const isCancelled = status.includes("cancel");
  const isReturned = status.includes("return");
  const items = useMemo(
    () => (activeOrder ? getItems(activeOrder) : []),
    [activeOrder]
  );

  return (
    <main className="track-order-page">
      <style>{`
        .track-order-page {
         --track-ink: #252525;
--track-muted: #707070;
--track-green: #222222;
--track-green-dark: #000000;
--track-cream: #ffffff;
--track-border: #e5e5e5;
          min-height: 100vh;
          background: var(--track-cream);
          color: var(--track-ink);
          padding-bottom: 64px;
          font-family: Inter, Arial, sans-serif;
        }
        .track-order-page * { box-sizing: border-box; }
        .track-order-page button,
        .track-order-page input { font: inherit; }
        .track-order-page button { cursor: pointer; }
        .track-order-page .track-hero {
          padding: 58px 24px 52px;
          text-align: center;
          color: white;
          background: linear-gradient(130deg, #111111, #333333);
        }
        .track-order-page .track-hero-inner {
          max-width: 900px;
          margin: 0 auto;
        }
        .track-order-page .track-eyebrow {
          margin: 0 0 12px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: #e1eadf;
        }
        .track-order-page .track-hero h1 {
          margin: 0;
          font-family: inherit;
          font-size: clamp(30px, 4vw, 46px);
          font-weight: 700;
          line-height: 1.2;
        }
        .track-order-page .track-hero p {
          margin: 14px auto 0;
          max-width: 580px;
          color: #edf1e9;
          line-height: 1.7;
          font-size: 15px;
        }
        .track-order-page .track-container {
          width: min(100% - 40px, 1080px);
          margin: 0 auto;
        }
        .track-order-page .track-breadcrumb {
          display: flex;
          gap: 9px;
          align-items: center;
          padding: 24px 0;
          font-size: 13px;
          color: var(--track-muted);
        }
        .track-order-page .track-breadcrumb a {
          color: var(--track-green);
          text-decoration: none;
        }
        .track-order-page .track-breadcrumb a:hover { text-decoration: underline; }
        .track-order-page .track-tabs {
  display: flex;
  gap: 8px;
  padding: 6px;
  border: 1px solid var(--track-border);
  background: #fff;
  border-radius: 14px;
  width: fit-content;
  margin: 32px auto 28px;
}
        .track-order-page .track-tab {
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #62665d;
          padding: 12px 22px;
          font-size: 14px;
          font-weight: 600;
          transition: background .2s, color .2s;
        }
        .track-order-page .track-tab.active {
          background: var(--track-green);
          color: #fff;
        }
        .track-order-page .track-tab:hover:not(.active) {
          background: #f1f3ee;
        }
        .track-order-page .track-card {
          background: #fff;
          border: 1px solid var(--track-border);
          border-radius: 18px;
          padding: 28px;
          box-shadow: 0 8px 30px rgba(37, 40, 32, .035);
          margin-bottom: 22px;
        }
        .track-order-page .track-card h2,
        .track-order-page .track-card h3 {
          color: var(--track-ink);
          margin: 0;
          font-family: inherit;
        }
        .track-order-page .track-card h2 { font-size: 22px; }
        .track-order-page .track-card h3 { font-size: 16px; }
        .track-order-page .track-subtitle {
          color: var(--track-muted);
          font-size: 14px;
          line-height: 1.6;
          margin: 9px 0 22px;
        }
        .track-order-page .track-search-form {
          display: flex;
          gap: 12px;
        }
        .track-order-page .track-input-wrap {
          display: flex;
          align-items: center;
          gap: 11px;
          flex: 1;
          min-width: 0;
          border: 1px solid #dcded6;
          border-radius: 10px;
          padding: 0 15px;
          background: #fff;
          color: #7b8075;
        }
        .track-order-page .track-input-wrap:focus-within {
          border-color: var(--track-green);
          box-shadow: 0 0 0 3px rgba(54, 91, 69, .1);
        }
        .track-order-page .track-input {
          width: 100%;
          min-width: 0;
          height: 50px;
          border: 0;
          outline: none;
          background: transparent;
          color: var(--track-ink);
          font-size: 14px;
        }
        .track-order-page .track-input::placeholder { color: #a0a398; }
        .track-order-page .track-primary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 0;
          border-radius: 10px;
          background: var(--track-green);
          color: #fff;
          padding: 0 22px;
          min-height: 50px;
          font-size: 14px;
          font-weight: 700;
          transition: background .2s, transform .2s;
        }
        .track-order-page .track-primary-btn:hover {
          background: var(--track-green-dark);
        }
        .track-order-page .track-primary-btn:disabled {
          cursor: not-allowed;
          opacity: .65;
        }
        .track-order-page .track-error {
          margin-top: 16px;
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 13px 15px;
          border: 1px solid #f0caca;
          background: #fff5f4;
          color: #a3332b;
          border-radius: 10px;
          font-size: 13px;
          line-height: 1.5;
        }
        .track-order-page .track-order-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .track-order-page .track-order-number {
          color: var(--track-muted);
          font-size: 13px;
          margin-top: 8px;
          overflow-wrap: anywhere;
        }
        .track-order-page .track-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 13px;
          border-radius: 30px;
          background: #edf4ed;
          color: #315d3d;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }
        .track-order-page .track-status-pill.cancelled {
          color: #a3332b;
          background: #fff0ee;
        }
        .track-order-page .track-status-pill.returned {
          color: #8a5b16;
          background: #fff5e4;
        }
        .track-order-page .track-timeline {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          margin: 32px 0 10px;
          position: relative;
        }
        .track-order-page .track-step {
          position: relative;
          text-align: center;
          padding: 0 8px;
          z-index: 1;
        }
        .track-order-page .track-step:not(:last-child)::after {
          content: "";
          position: absolute;
          height: 2px;
          top: 21px;
          left: calc(50% + 22px);
          width: calc(100% - 44px);
          background: #e5e7e0;
          z-index: -1;
        }
        .track-order-page .track-step.completed:not(:last-child)::after {
          background: #52795d;
        }
        .track-order-page .track-step-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border: 1px solid #e2e4dc;
          border-radius: 50%;
          margin: 0 auto 12px;
          background: #f7f8f5;
          color: #92978b;
        }
        .track-order-page .track-step.completed .track-step-icon {
          color: white;
          background: var(--track-green);
          border-color: var(--track-green);
        }
        .track-order-page .track-step.current .track-step-icon {
          box-shadow: 0 0 0 5px #eaf0e8;
        }
        .track-order-page .track-step-label {
          font-size: 12px;
          font-weight: 700;
          color: #888d82;
          line-height: 1.5;
        }
        .track-order-page .track-step.completed .track-step-label {
          color: var(--track-green);
        }
        .track-order-page .track-step-description {
          font-size: 11px;
          line-height: 1.5;
          margin-top: 5px;
          color: #92968c;
        }
        .track-order-page .track-details-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .track-order-page .track-detail {
          border: 1px solid var(--track-border);
          border-radius: 12px;
          padding: 17px;
          min-width: 0;
        }
        .track-order-page .track-detail-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--track-muted);
          font-size: 12px;
          margin-bottom: 8px;
        }
        .track-order-page .track-detail-value {
          font-size: 14px;
          font-weight: 600;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }
        .track-order-page .track-items-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-top: 18px;
        }
        .track-order-page .track-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 16px 0;
          border-bottom: 1px solid #efefe9;
        }
        .track-order-page .track-item:last-child { border-bottom: 0; }
        .track-order-page .track-item-name {
          font-size: 14px;
          font-weight: 600;
          line-height: 1.5;
        }
        .track-order-page .track-item-meta {
          color: var(--track-muted);
          font-size: 12px;
          margin-top: 5px;
        }
        .track-order-page .track-item-price {
          font-size: 14px;
          font-weight: 700;
          white-space: nowrap;
        }
        .track-order-page .track-total {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--track-border);
          padding-top: 18px;
          margin-top: 4px;
          font-weight: 700;
        }
        .track-order-page .track-total strong {
          font-size: 19px;
          color: var(--track-green);
        }
        .track-order-page .track-order-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
        }
        .track-order-page .track-order-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 18px;
          border: 1px solid var(--track-border);
          border-radius: 12px;
          background: #fff;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
        }
        .track-order-page .track-order-row:hover {
          border-color: var(--track-green);
          background: #fcfdfb;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(38, 67, 49, 0.08);
        }
        .track-order-page .track-order-row-info {
          min-width: 0;
        }
        .track-order-page .track-order-row-id {
          font-weight: 700;
          font-size: 14px;
          overflow-wrap: anywhere;
        }
        .track-order-page .track-order-row-meta {
          color: var(--track-muted);
          font-size: 12px;
          line-height: 1.7;
          margin-top: 5px;
        }
        .track-order-page .track-order-row-right {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }
        .track-order-page .track-order-row-total {
          font-size: 14px;
          font-weight: 700;
          text-align: right;
        }
        .track-order-page .track-empty {
          text-align: center;
          padding: 36px 15px;
          color: var(--track-muted);
        }
        .track-order-page .track-empty-icon {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #f0f3ed;
          color: var(--track-green);
          margin: 0 auto 14px;
        }
        .track-order-page .track-empty p {
          font-size: 13px;
          line-height: 1.7;
          margin: 8px auto 0;
          max-width: 440px;
        }
        .track-order-page .track-help {
          background: #edf1e9;
          border: 1px solid #e1e8dd;
          border-radius: 16px;
          padding: 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: 24px;
        }
        .track-order-page .track-help h3 {
          margin: 0 0 7px;
          font-size: 17px;
          font-family: inherit;
        }
        .track-order-page .track-help p {
          color: #626a5d;
          font-size: 13px;
          line-height: 1.6;
          margin: 0;
        }
        .track-order-page .track-help a {
          color: #fff;
          background: var(--track-green);
          border-radius: 9px;
          text-decoration: none;
          padding: 12px 18px;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
        }
        .track-order-page .track-help a:hover {
          background: var(--track-green-dark);
        }
        .track-order-page .track-spinner {
          animation: track-spin 1s linear infinite;
        }
        @keyframes track-spin { to { transform: rotate(360deg); } }
        @media (max-width: 700px) {
          .track-order-page { padding-bottom: 38px; }
          .track-order-page .track-hero { padding: 42px 18px 38px; }
          .track-order-page .track-hero p { font-size: 14px; }
          .track-order-page .track-container { width: min(100% - 28px, 1080px); }
          .track-order-page .track-breadcrumb { padding: 18px 0; }
          .track-order-page .track-tabs { width: 100%; margin-bottom: 20px; }
          .track-order-page .track-tab { flex: 1; padding: 12px 8px; font-size: 12px; }
          .track-order-page .track-card { padding: 20px 16px; border-radius: 14px; }
          .track-order-page .track-card h2 { font-size: 19px; }
          .track-order-page .track-search-form { flex-direction: column; }
          .track-order-page .track-primary-btn { width: 100%; }
          .track-order-page .track-timeline { grid-template-columns: 1fr; gap: 0; margin-top: 25px; }
          .track-order-page .track-step {
            display: grid;
            grid-template-columns: 44px minmax(0, 1fr);
            text-align: left;
            gap: 13px;
            padding: 0 0 20px;
          }
          .track-order-page .track-step:last-child { padding-bottom: 0; }
          .track-order-page .track-step-icon { margin: 0; grid-row: span 2; }
          .track-order-page .track-step:not(:last-child)::after {
            top: 44px;
            left: 21px;
            width: 2px;
            height: calc(100% - 44px);
          }
          .track-order-page .track-step-label { align-self: end; font-size: 13px; }
          .track-order-page .track-step-description { margin-top: 2px; font-size: 12px; }
          .track-order-page .track-details-grid { grid-template-columns: 1fr; gap: 10px; }
          .track-order-page .track-order-row { align-items: flex-start; padding: 14px; }
          .track-order-page .track-order-row-right { flex-direction: column; align-items: flex-end; gap: 10px; }
          .track-order-page .track-order-row-total { font-size: 13px; }
          .track-order-page .track-help { align-items: flex-start; flex-direction: column; padding: 20px; }
          .track-order-page .track-help a { width: 100%; text-align: center; }
        }
        @media (min-width: 701px) and (max-width: 1050px) {
          .track-order-page .track-step-description { display: none; }
          .track-order-page .track-step-label { font-size: 10px; }
          .track-order-page .track-step { padding-inline: 3px; }
        }
        @media (max-width: 380px) {
          .track-order-page .track-order-heading { flex-direction: column; }
          .track-order-page .track-status-pill { white-space: normal; }
          .track-order-page .track-order-row { flex-direction: column; }
          .track-order-page .track-order-row-right { flex-direction: row; align-items: center; justify-content: space-between; width: 100%; }
        }
      `}</style>

      <section className="track-hero">
        <div className="track-hero-inner">
          <p className="track-eyebrow">Your order, your peace of mind</p>
          <h1>Track Your Order</h1>
          <p>
            Stay updated on your furniture order, from confirmation to
            delivery. Enter your order ID to see its latest status.
          </p>
        </div>
      </section>

      <div className="track-container">

        <div className="track-tabs" role="tablist" aria-label="Order pages">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "track"}
            className={`track-tab ${activeTab === "track" ? "active" : ""}`}
            onClick={() => setActiveTab("track")}
          >
            <Search size={15} style={{ display: "inline", marginRight: 7 }} />
            Track an Order
          </button>

         <button
  type="button"
  role="tab"
  aria-selected={activeTab === "orders"}
  className={`track-tab ${activeTab === "orders" ? "active" : ""}`}
  onClick={() => {
    setActiveTab("orders");
    setError("");
    void loadMyOrders();
  }}
>
  <ShoppingBag
    size={15}
    style={{ display: "inline", marginRight: 7 }}
  />
  My Orders ({myOrders.length})
</button>
        </div>

        {activeTab === "track" && (
          <>
            <section className="track-card">
              <h2>Where is your order?</h2>
              <p className="track-subtitle">
                Enter the order number from your confirmation to check the
                latest delivery information.
              </p>

              <form className="track-search-form" onSubmit={trackOrder}>
                <label className="track-input-wrap">
                  <Hash size={19} />
                  <input
                    className="track-input"
                    value={orderId}
                    onChange={(event) => setOrderId(event.target.value)}
                    placeholder="Enter your order ID"
                    aria-label="Order ID"
                  />
                </label>

                <button
                  className="track-primary-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw size={17} className="track-spinner" />
                  ) : (
                    <Search size={17} />
                  )}
                  {loading ? "Checking..." : "Track Order"}
                  {!loading && <ArrowRight size={17} />}
                </button>
              </form>

              {error && (
                <div className="track-error" role="alert">
                  <XCircle size={18} />
                  <span>{error}</span>
                </div>
              )}
            </section>

            {activeOrder && (
              <>
                <section className="track-card">
                  <div className="track-order-heading">
                    <div>
                      <h2>Order Tracking</h2>
                      <div className="track-order-number">
                        Order ID: <strong>{getOrderId(activeOrder) || "—"}</strong>
                      </div>
                      <div className="track-order-number">
                        Placed on {formatDate(activeOrder.created_at ?? activeOrder.createdAt)}
                      </div>
                    </div>

                    <span
                      className={`track-status-pill ${
                        isCancelled ? "cancelled" : isReturned ? "returned" : ""
                      }`}
                    >
                      {isCancelled || isReturned ? (
                        <XCircle size={15} />
                      ) : (
                        <CheckCircle2 size={15} />
                      )}
                      {getStatusLabel(status)}
                    </span>
                  </div>

                  {isCancelled || isReturned ? (
                    <div className={`track-error ${isReturned ? "" : ""}`}>
                      <XCircle size={18} />
                      <span>
                        {isCancelled
                          ? "This order has been cancelled. Please contact support if you need assistance."
                          : "This order has been marked as returned."}
                      </span>
                    </div>
                  ) : (
                    <>
                      <h3>Order progress</h3>
                      <p className="track-subtitle">
                        {statusIndex >= ORDER_STEPS.length - 1
                          ? "Your order has reached its destination."
                          : "Follow each step as your order moves toward delivery."}
                      </p>

                      <div className="track-timeline">
                        {ORDER_STEPS.map((step, index) => {
                          const StepIcon = step.icon;
                          const completed = index <= statusIndex;
                          const current = index === statusIndex;

                          return (
                            <div
                              key={step.label}
                              className={`track-step ${
                                completed ? "completed" : ""
                              } ${current ? "current" : ""}`}
                            >
                              <div className="track-step-icon">
                                {index < statusIndex ? (
                                  <Check size={21} />
                                ) : (
                                  <StepIcon size={20} />
                                )}
                              </div>
                              <div className="track-step-label">{step.label}</div>
                              <div className="track-step-description">
                                {step.description}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </section>

                <section className="track-card">
                  <h2>Order Details</h2>
                  <p className="track-subtitle">
                    Important information about your order.
                  </p>

                  <div className="track-details-grid">
                    <div className="track-detail">
                      <div className="track-detail-label">
                        <CalendarDays size={16} />
                        Order Date
                      </div>
                      <div className="track-detail-value">
                        {formatDate(activeOrder.created_at ?? activeOrder.createdAt)}
                      </div>
                    </div>

                    <div className="track-detail">
                      <div className="track-detail-label">
                        <ShieldCheck size={16} />
                        Payment Status
                      </div>
                      <div className="track-detail-value">
                        {getPaymentStatus(activeOrder)}
                      </div>
                    </div>

                    <div className="track-detail">
                      <div className="track-detail-label">
                        <MapPin size={16} />
                        Shipping Address
                      </div>
                      <div className="track-detail-value">
                        {getShippingAddress(activeOrder) || "Address not available"}
                      </div>
                    </div>

                    {(Boolean(activeOrder.tracking_number) || Boolean(activeOrder.courier_name)) && (
                      <div className="track-detail">
                        <div className="track-detail-label">
                          <Package size={16} />
                          Courier & Tracking
                        </div>
                        <div className="track-detail-value">
                          {activeOrder.courier_name ? String(activeOrder.courier_name) : "Courier"}
                          {activeOrder.tracking_number ? ` (${String(activeOrder.tracking_number)})` : ""}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <section className="track-card">
                  <h2>Items in Your Order</h2>
                  <p className="track-subtitle">
                    {items.length} {items.length === 1 ? "item" : "items"} in
                    this order.
                  </p>

                  {items.length > 0 ? (
                    <div className="track-items-list">
                      {items.map((item, index) => {
                        const name =
                          item.name ??
                          item.product_name ??
                          item.title ??
                          "Furniture item";

                        const quantity = Number(item.quantity ?? 1);
                        const unitPrice = Number(
                          item.unit_price ??
                            item.price_at_purchase ??
                            item.price ??
                            0
                        );
                        const itemTotal =
                          item.total_price !== undefined && item.total_price !== null
                            ? Number(item.total_price)
                            : unitPrice * quantity;
                        const imageUrl = item.image_url ?? item.image;

                        return (
                          <div
                            className="track-item"
                            key={item.id ?? `${name}-${index}`}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                              {imageUrl && (
                                <img
                                  src={imageUrl}
                                  alt={name}
                                  style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                    border: "1px solid #e7e6df",
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                              <div>
                                <div className="track-item-name">{name}</div>
                                {item.variant && (
                                  <div className="track-item-meta">
                                    {item.variant}
                                  </div>
                                )}
                                <div className="track-item-meta">
                                  Quantity: {quantity}
                                </div>
                              </div>
                            </div>
                            <div className="track-item-price">
                              {formatPrice(itemTotal)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="track-empty">
                      <div className="track-empty-icon">
                        <Package size={23} />
                      </div>
                      <h3>No item details available</h3>
                      <p>
                        We could not find individual product details for this
                        order.
                      </p>
                    </div>
                  )}

                  <div className="track-total">
                    <span>Order Total</span>
                    <strong>{formatPrice(getTotal(activeOrder))}</strong>
                  </div>
                </section>
              </>
            )}
          </>
        )}

        {activeTab === "orders" && (
          <section className="track-card">
            <div className="track-order-heading">
              <div>
                <h2>My Orders</h2>
                <p className="track-subtitle" style={{ marginBottom: 0 }}>
                  View your previous orders and check their delivery status.
                </p>
              </div>

              {Boolean(authToken || getAuthToken()) && (
                <button
                  type="button"
                  className="track-primary-btn"
                  onClick={() => void loadMyOrders()}
                  disabled={ordersLoading}
                >
                  <RefreshCw
                    size={16}
                    className={ordersLoading ? "track-spinner" : ""}
                  />
                  Refresh
                </button>
              )}
            </div>

            {ordersError && (
              <div className="track-error" role="alert">
                <XCircle size={18} />
                <span>{ordersError}</span>
              </div>
            )}

            {!(authToken || getAuthToken()) ? (
              <div className="track-empty">
                <div className="track-empty-icon">
                  <ShoppingBag size={24} />
                </div>
                <h3>Please log in to view your orders</h3>
                <p>
                  Sign in to your account to view your past orders and check their real-time delivery status.
                </p>
                <Link
                  to="/login"
                  className="track-primary-btn"
                  style={{
                    marginTop: 20,
                    textDecoration: "none",
                    display: "inline-flex",
                  }}
                >
                  Log In <ArrowRight size={16} />
                </Link>
              </div>
            ) : ordersLoading ? (
              <div className="track-empty">
                <RefreshCw
                  size={25}
                  className="track-spinner"
                  style={{ marginBottom: 12 }}
                />
                <h3>Loading your orders...</h3>
                <p>Please wait while we fetch your order history.</p>
              </div>
            ) : myOrders.length > 0 ? (
              <div className="track-order-list">
                {myOrders.map((order, index) => {
                  const orderStatus = getOrderStatus(order);
                  const cancelled = orderStatus.includes("cancel");
                  const returned = orderStatus.includes("return");

                  return (
                    <div
                      className="track-order-row"
                      key={order.id ?? order._id ?? getOrderId(order) ?? index}
                      onClick={() => selectOrder(order)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          selectOrder(order);
                        }
                      }}
                      title={`Click to track Order #${getOrderId(order)}`}
                    >
                      <div className="track-order-row-info">
                        <div className="track-order-row-id">
                          Order #{getOrderId(order) || "—"}
                        </div>
                        <div className="track-order-row-meta">
                          Placed on{" "}
                          {formatDate(order.created_at ?? order.createdAt)}
                        </div>
                        <div className="track-order-row-meta">
                          {getItems(order).length}{" "}
                          {getItems(order).length === 1 ? "item" : "items"}
                          {" · "}
                          {getPaymentStatus(order)}
                        </div>
                        <div
                          className={`track-status-pill ${
                            cancelled ? "cancelled" : returned ? "returned" : ""
                          }`}
                          style={{ marginTop: 10 }}
                        >
                          {getStatusLabel(orderStatus)}
                        </div>
                      </div>

                      <div className="track-order-row-right">
                        <div className="track-order-row-total">
                          {formatPrice(getTotal(order))}
                        </div>
                        <button
                          type="button"
                          className="track-primary-btn"
                          onClick={(event) => {
                            event.stopPropagation();
                            selectOrder(order);
                          }}
                        >
                          Track <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="track-empty">
                <div className="track-empty-icon">
                  <ShoppingBag size={24} />
                </div>
                <h3>No orders found</h3>
                <p>
                  Your orders will appear here after you place an order. If
                  you have already ordered, please log in with the correct
                  account and refresh this page.
                </p>
                <Link
                  to="/"
                  className="track-primary-btn"
                  style={{
                    marginTop: 20,
                    textDecoration: "none",
                    display: "inline-flex",
                  }}
                >
                  Continue Shopping <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </section>
        )}

        <section className="track-help">
          <div>
            <h3>Need help with your order?</h3>
            <p>
              If you have questions about your order or delivery, our team is
              here to help.
            </p>
          </div>
          <Link to="/contact">Contact Us <ArrowRight size={15} /></Link>
        </section>

        <div style={{ marginTop: 20 }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: "#365b45",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
