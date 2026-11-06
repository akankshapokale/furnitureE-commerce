export const SHIPMENT_STAGES = [
  { value: "order_placed", label: "Order Placed" },
  { value: "order_confirmed", label: "Order Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "packaging", label: "Packaging" },
  { value: "ready_to_ship", label: "Ready to Ship" },
  { value: "in_transit", label: "In Transit" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
] as const;

export type ShipmentStage = (typeof SHIPMENT_STAGES)[number]["value"];

const LEGACY_STAGE_ALIASES: Record<string, ShipmentStage> = {
  pending: "order_placed",
  placed: "order_placed",
  confirmed: "order_confirmed",
  accepted: "order_confirmed",
  packed: "packaging",
  dispatched: "ready_to_ship",
  shipped: "in_transit",
  "in transit": "in_transit",
  "out of delivery": "out_for_delivery",
};

export const normalizeShipmentStage = (status?: string | null): ShipmentStage => {
  const normalized = (status || "order_placed").trim().toLowerCase().replace(/[_-]+/g, " ");
  const stage = SHIPMENT_STAGES.find((item) => item.value.replace(/_/g, " ") === normalized);
  return stage?.value ?? LEGACY_STAGE_ALIASES[normalized] ?? "order_placed";
};

export const shipmentStageLabel = (status?: string | null) => {
  const stage = normalizeShipmentStage(status);
  return SHIPMENT_STAGES.find((item) => item.value === stage)?.label ?? "Order Placed";
};
