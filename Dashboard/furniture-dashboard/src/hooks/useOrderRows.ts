import { useEffect, useState } from "react";

import { getOrders, getShipments } from "../services/api";

interface ApiOrderItem {
  product_name?: string;
  quantity?: number;
}

interface ApiOrder {
  id: number;
  order_number: string;
  total_amount: number | string;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at?: string;
  customer_name?: string;
  items?: ApiOrderItem[];
}

interface ApiShipment {
  order_id: number;
  shipment_status?: string | null;
  tracking_number?: string | null;
  courier_name?: string | null;
  shipped_at?: string | null;
  estimated_delivery?: string | null;
  delivered_at?: string | null;
}

// One order, formatted for display in the status pages.
export interface OrderRow {
  dbId: number;
  id: string;
  customer: string;
  product: string;
  amount: string;
  amountValue: number;
  status: string;
  payment: string;
  orderDate: string;
  createdAgeDays: number;
  createdAgeLabel: string;
  updatedAgeLabel: string;
  courier: string;
  trackingId: string;
  shipmentStatus: string;
  expectedAtMs: number | null;
  expectedSoon: boolean;
  dispatchedDate: string;
  expectedDate: string;
  deliveredDate: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const formatDate = (value?: string | null) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ageDays = (value?: string | null) => {
  if (!value) return 0;

  return Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / DAY_MS));
};

const ageLabel = (days: number) =>
  days === 0 ? "Today" : `${days} ${days === 1 ? "Day" : "Days"}`;

export const formatRupees = (value: number) =>
  `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const paymentLabel = (status?: string) => {
  const value = status?.toLowerCase();

  if (value === "paid" || value === "success" || value === "completed") return "Paid";
  if (value === "failed") return "Failed";
  if (value === "refunded") return "Refunded";

  return "Pending";
};

const productLabel = (items: ApiOrderItem[] = []) => {
  if (items.length === 0) return "-";

  const [first, ...rest] = items;

  return rest.length > 0
    ? `${first.product_name} +${rest.length} more`
    : first.product_name ?? "-";
};

const toRow = (order: ApiOrder, shipment?: ApiShipment): OrderRow => {
  const days = ageDays(order.created_at);
  const expectedAtMs = shipment?.estimated_delivery
    ? new Date(shipment.estimated_delivery).getTime()
    : null;

  return {
    dbId: order.id,
    id: `#${order.order_number}`,
    customer: order.customer_name || "Customer",
    product: productLabel(order.items),
    amount: formatRupees(Number(order.total_amount || 0)),
    amountValue: Number(order.total_amount || 0),
    status: (order.status || "pending").toLowerCase(),
    payment: paymentLabel(order.payment_status),
    orderDate: formatDate(order.created_at),
    createdAgeDays: days,
    createdAgeLabel: ageLabel(days),
    updatedAgeLabel: ageLabel(ageDays(order.updated_at ?? order.created_at)),
    courier: shipment?.courier_name || "-",
    trackingId: shipment?.tracking_number || "-",
    shipmentStatus: (shipment?.shipment_status || "").toLowerCase(),
    expectedAtMs: expectedAtMs,
    expectedSoon: expectedAtMs !== null && expectedAtMs <= Date.now() + 2 * DAY_MS,
    dispatchedDate: formatDate(shipment?.shipped_at),
    expectedDate: formatDate(shipment?.estimated_delivery),
    deliveredDate: formatDate(shipment?.delivered_at),
  };
};

// Loads live orders (plus their shipment details) and keeps only the given statuses.
export function useOrderRows(statuses: string[]) {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Stable key so callers can pass an inline array without refetching every render.
  const statusKey = statuses.join(",");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [ordersResponse, shipmentsResponse] = await Promise.all([
          getOrders(),
          getShipments(),
        ]);

        const orders: ApiOrder[] = ordersResponse.data?.data ?? [];
        const shipments: ApiShipment[] = shipmentsResponse.data?.data ?? [];

        // Shipments come newest-first, so the first one per order is the latest.
        const shipmentByOrder = new Map<number, ApiShipment>();
        for (const shipment of shipments) {
          if (!shipmentByOrder.has(shipment.order_id)) {
            shipmentByOrder.set(shipment.order_id, shipment);
          }
        }

        const wanted = statusKey.split(",");

        if (!cancelled) {
          setTotalOrders(orders.length);
          setRows(
            orders
              .filter((order) => wanted.includes((order.status || "").toLowerCase()))
              .map((order) => toRow(order, shipmentByOrder.get(order.id)))
          );
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
        if (!cancelled) {
          setRows([]);
          setError("Unable to load orders. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [statusKey]);

  return { rows, totalOrders, loading, error };
}
