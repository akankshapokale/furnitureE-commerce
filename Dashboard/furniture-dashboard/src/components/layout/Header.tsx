import { useState, useEffect, useRef } from "react";
import { LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const initials =
    (user?.name ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "AD";

  const role =
    user?.role === "admin"
      ? "Admin"
      : user?.designation || "Employee";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmed) {
      setProfileOpen(false);
      logout();
    }
  };

  return (
    <header className="relative z-30 h-[72px] shrink-0 border-b border-gray-200 bg-white px-4 sm:px-5 lg:px-7">
      <div className="flex h-full items-center justify-between gap-3">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-[#10243e] sm:text-[19px]">
            Operations Command Center
          </h1>

          <p className="mt-0.5 hidden text-xs text-gray-500 sm:block">
            Furniture business overview
          </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <div className="hidden h-8 w-px bg-gray-200 sm:block" />

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
              aria-haspopup="true"
              aria-label="Open profile menu"
              className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-gray-50 sm:gap-2.5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-700 text-sm font-semibold text-white">
                {initials}
              </div>

              <div className="hidden min-w-0 text-left sm:block">
                <p className="max-w-32 truncate text-xs font-semibold text-gray-900">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[10px] text-gray-500">{role}</p>
              </div>

              <ChevronDown
                className={`hidden h-4 w-4 text-gray-500 transition-transform sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-[min(260px,calc(100vw-24px))] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                {/* Profile Details */}
                <div className="border-b border-gray-100 px-4 py-4">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {user?.name || "Admin"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">{role}</p>
                </div>

                {/* Sign Out */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 bg-red-50 px-4 py-3.5 text-left text-sm font-medium text-[#d65b64] transition-colors hover:bg-red-100"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
