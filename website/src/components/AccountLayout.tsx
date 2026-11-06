import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import "../pages/account.css";

const LINKS = [
  { to: "/profile", label: "Profile" },
  { to: "/orders", label: "Your Orders" },
  { to: "/my-custom-size-requests", label: "Custom Size Requests" },
  { to: "/address", label: "Saved Addresses" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/contact", label: "Contact Us" },
];

// Shared shell for account pages.
// Signed-out visitors get the content only.
export default function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <>
        <main className="acct-page">
          <div className="acct-shell single">
            <div className="acct-content">{children}</div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="acct-page">
        <div className="acct-shell">
          <aside className="acct-side">
            <div className="acct-user">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="acct-avatar"
                />
              ) : (
                <div className="acct-avatar">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>
              )}

              <div className="acct-user-text">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
            </div>

            <nav className="acct-nav">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? "active" : ""
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <button
                type="button"
                className="logout"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </nav>
          </aside>

          <div className="acct-content">{children}</div>
        </div>
      </main>
    </>
  );
}
