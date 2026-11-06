const INDIA_TIME_ZONE = "Asia/Kolkata";

export const formatOrderDateTime = (
  value?: string | null,
  fallback = "—",
  orderNumber?: string | null,
) => {
  if (!value && !orderNumber) return fallback;

  // Website order numbers contain the exact millisecond timestamp generated at checkout.
  const orderTimestamp = orderNumber?.match(/^ORD[-_](\d{13})$/i)?.[1];
  const timestamp = value?.trim();
  const hasTimezone = timestamp ? /(?:Z|[+-]\d{2}:?\d{2})$/i.test(timestamp) : false;
  const normalized = timestamp?.includes(" ") && !timestamp.includes("T")
    ? timestamp.replace(" ", "T")
    : timestamp;
  const date = orderTimestamp
    ? new Date(Number(orderTimestamp))
    : timestamp
      ? new Date(hasTimezone ? normalized! : `${normalized}Z`)
      : null;

  if (!date || !Number.isFinite(date.getTime())) return fallback;

  return date.toLocaleString("en-IN", {
    timeZone: INDIA_TIME_ZONE,
    dateStyle: "medium",
    timeStyle: "short",
  });
};
