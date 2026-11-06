import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  CreditCard,
  Truck,
  BarChart3,
  TrendingUp,
  UserCog,
  Globe,
  ChevronDown,
  UsersRound,
  CalendarDays,
  Ruler,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { permissionForPath } from "../../config/permissions";

interface SidebarProps {
  onClose?: () => void;
}

const menuSections = [
  {
    title: "Overview",
    collapsible: true,
    items: [
      { title: "Dashboard", path: "/", icon: LayoutDashboard },
      { title: "Orders", path: "/orders", icon: ShoppingCart },
      { title: "Custom Size Requests", path: "/custom-size-requests", icon: Ruler },
    ],
  },
  {
    title: "MANAGEMENT",
    collapsible: false,
    items: [
      {
        title: "Customers",
        path: "/customers",
        icon: Users,
      },
      {
        title: "Payments",
        path: "/payments",
        icon: CreditCard,
      },
      {
        title: "Shipments",
        path: "/shipments",
        icon: Truck,
      },
      {
        title: "Sales",
        path: "/sales",
        icon: TrendingUp,
      },
      {
        title: "Reports",
        path: "/reports",
        icon: BarChart3,
      },
    ],
  },
];

const commerceSection = {
  title: "Ecommerce",
  collapsible: true,
  items: [{ title: "Website Control", path: "/website-control", icon: Globe }],
};

const peopleSection = {
  title: "People",
  collapsible: true,
  items: [
    { title: "Team Management", path: "/people", icon: UsersRound },
    { title: "Staff Management", path: "/people/staff", icon: UserCog },
    { title: "HR & Leave", path: "/hr-leave", icon: CalendarDays },
  ],
};


const Sidebar = ({ onClose }: SidebarProps) => {
  const { can } = useAuth();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Ecommerce: location.pathname === "/website-control",
    Overview: ["/", "/orders", "/orders/returns", "/payments"].includes(location.pathname),
    People: location.pathname.startsWith("/people") || location.pathname.startsWith("/hr-leave"),
  });

  const visibleSections = [...menuSections, commerceSection, peopleSection]
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (item.path === "/website-control") return true;
        if (section.title === "People") return can("people");
        const required = permissionForPath(item.path.split("?")[0]);
        return required ? can(required) : false;
      }),
    }))
    .filter((section) => section.items.length > 0);

  const isItemActive = (path: string) => {
    const currentPath = location.pathname;
    const [itemPath, itemQuery] = path.split("?");

    if (itemQuery) {
      const expected = new URLSearchParams(itemQuery);
      const current = new URLSearchParams(location.search);
      return currentPath === itemPath && [...expected.entries()].every(([key, value]) => current.get(key) === value);
    }

    if (itemPath === "/") {
      return currentPath === "/";
    }

    if (itemPath === "/orders") {
      return (
        currentPath === "/orders" ||
        (currentPath.startsWith("/orders/") &&
          !["/orders/pending", "/orders/processing", "/orders/dispatched", "/orders/delivered", "/orders/returns"].some((prefix) =>
            currentPath.startsWith(prefix)
          ))
      );
    }

    if (itemPath === "/people") {
      return currentPath === "/people";
    }

    if (itemPath === "/payments") {
      return currentPath === "/payments" && !location.search;
    }

    return currentPath === itemPath || currentPath.startsWith(itemPath + "/");
  };

  return (
    <aside
      className="
        sticky top-0
        flex h-screen shrink-0 flex-col
        border-r border-gray-200 bg-white
        w-[260px]
        xl:w-[270px]
      "
    >
      {/* Brand */}
      <div className="flex h-[72px] shrink-0 items-center border-b border-gray-200 bg-white px-3 xl:px-4">
        <NavLink to="/" className="flex items-center gap-2.5 no-underline transition hover:opacity-90">
          <img
            src="/logo-mark-dark.png"
            alt="Staging Spaces"
            className="h-[44px] w-[44px] shrink-0 object-contain"
          />
          <div className="flex min-w-0 flex-col gap-[5px] leading-none">
            <span className="whitespace-nowrap text-[16px] font-extrabold tracking-[1.5px] text-[#172033]">
              STAGING SPACES
            </span>
            <span className="h-px w-full bg-gradient-to-r from-[#c18b45] via-[#e8d3ae] to-transparent" />
            <span className="whitespace-nowrap text-[7px] font-bold tracking-[1.1px] text-[#8b642f]">
              BY NARESH STEEL CORPORATION
            </span>
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 scrollbar-thin">
        {visibleSections.map((section) => (
          <div key={section.title} className="mb-5">

            {/* Section Title */}
            {section.collapsible ? (
              <button
                type="button"
                onClick={() => setExpandedGroups((current) => ({ ...current, [section.title]: !current[section.title] }))}
                aria-expanded={Boolean(expandedGroups[section.title])}
                className="mb-2 flex h-10 w-full items-center justify-between rounded-lg px-3 text-sm font-bold text-slate-900 hover:bg-gray-50"
              >
                <span>{section.title}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedGroups[section.title] ? "rotate-180" : ""}`} />
              </button>
            ) : (
              <p className="mb-2 px-3 text-[11px] font-bold tracking-[0.12em] text-gray-400">
                {section.title}
              </p>
            )}

            {/* Navigation Items */}
            {(!section.collapsible || expandedGroups[section.title]) && <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`group flex h-11 min-w-0 items-center gap-3 rounded-lg px-3 text-sm ${section.title === "Overview" ? "font-normal" : "font-semibold"} transition-all ${
                      active
                        ? section.title === "Overview"
                          ? "bg-green-50 text-green-700"
                          : "bg-green-50 font-bold text-green-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`h-[17px] w-[17px] shrink-0 ${
                        active
                          ? "text-green-600"
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />

                    <span className="truncate">
                      {item.title}
                    </span>

                    {active && (
                      <span className="ml-auto h-5 w-1 shrink-0 rounded-full bg-green-600" />
                    )}
                  </NavLink>
                );
              })}
            </div>}
          </div>
        ))}
      </nav>

    </aside>
  );
};

export default Sidebar;
