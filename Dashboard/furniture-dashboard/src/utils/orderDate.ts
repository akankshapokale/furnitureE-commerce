const INDIA_TIME_ZONE = "Asia/Kolkata";

export const getOrderTimestamp = (value?: string | null, orderNumber?: string | null) => {
  const orderTimestamp = orderNumber?.match(/^ORD[-_](\d{13})$/i)?.[1];
  if (orderTimestamp) return Number(orderTimestamp);
  if (!value?.trim()) return Number.NaN;
  const timestamp = value.trim();
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(timestamp);
  const normalized = timestamp.includes(" ") && !timestamp.includes("T") ? timestamp.replace(" ", "T") : timestamp;
  return new Date(hasTimezone ? normalized : `${normalized}Z`).getTime();
};

export const formatOrderDateTime = (
  value?: string | null,
  fallback = "—",
  orderNumber?: string | null,
) => {
  if (!value && !orderNumber) return fallback;
  const timestamp = getOrderTimestamp(value, orderNumber);
  const date = Number.isFinite(timestamp) ? new Date(timestamp) : null;
  if (!date) return fallback;
  return date.toLocaleString("en-IN", {
    timeZone: INDIA_TIME_ZONE,
    dateStyle: "medium",
    timeStyle: "short",
  });
};
