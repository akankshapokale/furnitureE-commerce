import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export default function AccountMenu() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (loading) return null;

  const handleLogin = () => {
    setIsOpen(false);
    navigate("/login");
  };

  const handleProfile = () => {
    setIsOpen(false);
    navigate("/profile");
  };

  const handleOrders = () => {
    setIsOpen(false);
    navigate("/orders");
  };

  const handleAddresses = () => {
    setIsOpen(false);
    navigate("/address");
  };

  const handleContact = () => {
    setIsOpen(false);
    navigate("/contact");
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate("/");
  };

  return (
    <>
      <div
        ref={menuRef}
        className="account-menu"
      >
        {/* User Icon */}
        <button
          type="button"
          className="account-trigger"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Account"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name || "User"}
              referrerPolicy="no-referrer"
              className="account-trigger-avatar"
            />
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
            </svg>
          )}
          <span className="account-trigger-label">
            {user ? (user.name?.split(" ")[0] || "Account") : "Account"}
          </span>
        </button>

        {/* Account Dropdown */}
        {isOpen && (
          <div className="account-dropdown">
            {!user ? (
              <>
                {/* Welcome */}
                <div className="account-welcome">
                  <h3>Welcome</h3>
                  <p>To access account and manage orders</p>
                </div>

                {/* Login / Signup */}
                <div className="account-login-section">
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="account-login-button"
                  >
                    LOGIN / SIGN UP
                  </button>
                </div>

                {/* Guest Menu */}
                <div className="account-menu-links">
                  <button type="button" onClick={handleProfile} style={menuItemStyle}>
                    Profile
                  </button>
                  <button type="button" onClick={handleOrders} style={menuItemStyle}>
                    Your Orders
                  </button>
                  <button type="button" onClick={handleAddresses} style={menuItemStyle}>
                    Saved Addresses
                  </button>
                  <button type="button" onClick={handleContact} style={menuItemStyle}>
                    Contact Us
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Logged In User */}
                <div className="account-user-info">
                  <p className="account-welcome-back">Welcome back</p>
                  <h3>{user.name}</h3>

                  {user.email && (
                    <p className="account-user-email">{user.email}</p>
                  )}
                </div>

                {/* Logged In Menu */}
                <div className="account-menu-links">
                  <button type="button" onClick={handleProfile} style={menuItemStyle}>
                    Profile
                  </button>
                  <button type="button" onClick={handleOrders} style={menuItemStyle}>
                    Your Orders
                  </button>
                  <button type="button" onClick={handleAddresses} style={menuItemStyle}>
                    Saved Addresses
                  </button>
                  <button type="button" onClick={handleContact} style={menuItemStyle}>
                    Contact Us
                  </button>

                  <div className="account-logout-section">
                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        ...menuItemStyle,
                        color: "#b42318",
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        .account-menu {
          position: relative;
          display: inline-flex;
          flex-shrink: 0;
        }

        .account-trigger {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          min-width: 56px;
          padding: 8px 14px;
          border: none;
          background: transparent;
          color: #111827;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.12s;
          font-family: inherit;
        }
        .account-trigger:hover {
          background: #f3f4f6;
        }
        .account-trigger svg {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
        }
        .account-trigger-label {
          font-size: 11px;
          font-weight: 600;
          color: #374151;
          white-space: nowrap;
          letter-spacing: 0.1px;
        }
        .account-trigger:focus-visible {
          outline: 2px solid #1a1a2e;
          outline-offset: 2px;
        }
        .account-trigger-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          object-fit: cover;
        }

        .account-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 300px;
          max-width: calc(100vw - 24px);
          background: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 4px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.10);
          z-index: 1000;
          overflow: hidden;
          box-sizing: border-box;
          color: #1f1f1f;
        }

        .account-welcome {
          padding: 24px 24px 20px;
        }

        .account-welcome h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          line-height: 1.4;
          color: #1f1f1f;
        }

        .account-welcome p {
          margin: 8px 0 0;
          font-size: 14px;
          line-height: 1.6;
          color: #777777;
        }

        .account-login-section {
          padding: 0 24px 20px;
        }

        .account-login-button {
          width: 100%;
          min-height: 46px;
          padding: 10px 12px;
          border: 1px solid #1f1f1f;
          background: #ffffff;
          color: #1f1f1f;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.3px;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .account-login-button:hover {
          background: #1f1f1f;
          color: #ffffff;
        }

        .account-menu-links {
          border-top: 1px solid #eeeeee;
          padding: 8px 0;
        }

        .account-user-info {
          padding: 22px 24px;
          border-bottom: 1px solid #eeeeee;
        }

        .account-welcome-back {
          margin: 0;
          font-size: 13px;
          color: #777777;
        }

        .account-user-info h3 {
          margin: 5px 0 0;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.4;
          overflow-wrap: anywhere;
          color: #1f1f1f;
        }

        .account-user-email {
          margin: 4px 0 0;
          font-size: 13px;
          line-height: 1.5;
          color: #777777;
          overflow-wrap: anywhere;
        }

        .account-logout-section {
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px solid #eeeeee;
        }

        @media (max-width: 480px) {
          .account-dropdown {
            top: calc(100% + 8px);
            width: 290px;
            max-width: calc(100vw - 20px);
          }

          .account-welcome {
            padding: 20px 18px 16px;
          }

          .account-welcome h3 {
            font-size: 18px;
          }

          .account-welcome p {
            font-size: 13px;
          }

          .account-login-section {
            padding: 0 18px 16px;
          }

          .account-user-info {
            padding: 18px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .account-login-button {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}

const menuItemStyle: CSSProperties = {
  display: "block",
  width: "100%",
  padding: "11px 24px",
  border: "none",
  background: "transparent",
  textAlign: "left",
  color: "#444444",
  fontSize: 14,
  lineHeight: 1.5,
  cursor: "pointer",
};