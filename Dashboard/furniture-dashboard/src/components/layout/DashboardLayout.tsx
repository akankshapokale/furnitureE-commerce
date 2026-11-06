import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-white">

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:z-30 lg:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <Sidebar onClose={() => setMobileOpen(false)} />
      </div>

      {/* Right Side */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Mobile Top Bar */}
        <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center border-b border-gray-200 bg-white px-4 lg:hidden">

          {location.pathname !== "/" && (
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mr-2 flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Back to Dashboard"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="ml-3 flex items-center gap-2.5">
            <img
              src="/logo-mark-dark.png"
              alt="Staging Spaces"
              className="h-9 w-9 object-contain"
            />
            <div className="flex flex-col gap-1 leading-none">
              <span className="whitespace-nowrap text-[14px] font-extrabold tracking-[1.5px] text-[#172033]">
                STAGING SPACES
              </span>
              <span className="h-px w-full bg-gradient-to-r from-[#c18b45] via-[#e8d3ae] to-transparent" />
              <span className="whitespace-nowrap text-[6px] font-bold tracking-[1px] text-[#8b642f]">
                BY NARESH STEEL CORPORATION
              </span>
            </div>
          </div>

        </div>

        {/* Desktop Header */}
        <div className="sticky top-0 z-40 hidden lg:block">
          <Header />
        </div>

        {/* Page Content */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
