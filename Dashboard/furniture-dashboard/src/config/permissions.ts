// Pages an admin can grant to an employee. Keep keys in sync with
// Backend/src/config/permissions.ts. "people" is admin-only and not listed here.
export type PageKey =
  | "dashboard"
  | "orders"
  | "products"
  | "customers"
  | "payments"
  | "shipments"
  | "sales"
  | "reports"
  | "settings"
  | "website-control";

export const PAGES: { key: PageKey; label: string; path: string; description: string }[] = [
  { key: "dashboard", label: "Dashboard", path: "/", description: "Business overview and stats" },
  { key: "orders", label: "Orders", path: "/orders", description: "All orders, pending, processing, dispatched, delivered, returns" },
  { key: "products", label: "Products", path: "/products", description: "Product catalogue" },
  { key: "customers", label: "Customers", path: "/customers", description: "Customer list" },
  { key: "payments", label: "Payments", path: "/payments", description: "Payment records" },
  { key: "shipments", label: "Shipments", path: "/shipments", description: "Shipment tracking" },
  { key: "sales", label: "Sales", path: "/sales", description: "Sales analytics" },
  { key: "reports", label: "Reports", path: "/reports", description: "Business reports" },
  { key: "settings", label: "Settings", path: "/settings", description: "Account and store settings" },
  { key: "website-control", label: "Website Control", path: "/website-control", description: "Hero banners, carousel slides, and website CMS" },
];

// Maps a URL to the permission key that guards it (null = admin only / unknown).
export const permissionForPath = (pathname: string): PageKey | "people" | null => {
  if (pathname === "/") return "dashboard";
  if (pathname === "/custom-size-requests" || pathname.startsWith("/custom-size-requests/")) return "orders";
  if (pathname === "/categories" || pathname.startsWith("/categories/")) return "website-control";
  if (pathname === "/refunds" || pathname.startsWith("/refunds/")) return "payments";
  if (pathname === "/people" || pathname.startsWith("/people/") || pathname === "/hr-leave") return "people";

  const match = PAGES.find(
    (page) => page.path !== "/" && (pathname === page.path || pathname.startsWith(`${page.path}/`))
  );

  return match ? match.key : null;
};
