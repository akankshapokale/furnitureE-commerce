// Dashboard pages that can be granted to an employee. Keep in sync with
// Dashboard/furniture-dashboard/src/config/permissions.ts.
// "people" is intentionally absent: only admins manage staff.
export const PAGE_KEYS = [
  "dashboard",
  "orders",
  "products",
  "customers",
  "payments",
  "shipments",
  "sales",
  "reports",
  "settings",
  "website-control",
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

export const sanitizePermissions = (value: unknown): PageKey[] => {
  if (!Array.isArray(value)) return [];

  return PAGE_KEYS.filter((key) => value.includes(key));
};
