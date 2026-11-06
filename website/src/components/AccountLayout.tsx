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

        <style>{`
          .acct-page {
            width: 100%;
            min-height: 60vh;
            padding: 32px 5%;
            box-sizing: border-box;
          }

          .acct-shell {
            display: grid;
            grid-template-columns: 260px minmax(0, 1fr);
            gap: 28px;
            width: 100%;
            max-width: 1280px;
            margin: 0 auto;
            align-items: start;
          }

          .acct-shell.single {
            display: block;
            max-width: 1000px;
          }

          .acct-content {
            min-width: 0;
            width: 100%;
            box-sizing: border-box;
          }

          @media (max-width: 768px) {
            .acct-page {
              padding: 24px 4%;
            }

            .acct-shell {
              grid-template-columns: minmax(0, 1fr);
              gap: 22px;
            }
          }

          @media (max-width: 480px) {
            .acct-page {
              padding: 18px 4%;
            }
          }
        `}</style>
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

      <style>{`
        .acct-page {
          width: 100%;
          min-height: 60vh;
          padding: 32px 5%;
          box-sizing: border-box;
        }

        .acct-shell {
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr);
          gap: 28px;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          align-items: start;
        }

        .acct-side {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .acct-user {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          margin-bottom: 24px;
        }

        .acct-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          background: #eeeeee;
          color: #222222;
          font-size: 18px;
          font-weight: 600;
        }

        .acct-user-text {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .acct-user-text strong,
        .acct-user-text span {
          overflow-wrap: anywhere;
        }

        .acct-user-text strong {
          font-size: 15px;
          line-height: 1.4;
        }

        .acct-user-text span {
          font-size: 12px;
          line-height: 1.5;
        }

        .acct-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }

        .acct-nav a,
        .acct-nav .logout {
          display: flex;
          align-items: center;
          width: 100%;
          min-height: 44px;
          padding: 11px 14px;
          box-sizing: border-box;
          border: none;
          border-radius: 4px;
          background: transparent;
          color: inherit;
          font: inherit;
          font-size: 14px;
          text-align: left;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .acct-nav a:hover,
        .acct-nav .logout:hover {
          background: #f3f3f3;
        }

        .acct-nav a.active {
          background: #f1f1f1;
          font-weight: 600;
        }

        .acct-nav .logout {
          margin-top: 8px;
        }

        .acct-content {
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
        }

        .acct-shell.single {
          display: block;
          max-width: 1000px;
        }

        @media (max-width: 1024px) {
          .acct-page {
            padding: 28px 4%;
          }

          .acct-shell {
            grid-template-columns: 220px minmax(0, 1fr);
            gap: 22px;
          }
        }

        @media (max-width: 768px) {
          .acct-page {
            padding: 24px 4%;
          }

          .acct-shell {
            grid-template-columns: minmax(0, 1fr);
            gap: 22px;
          }

          .acct-user {
            margin-bottom: 16px;
          }

          .acct-nav {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 8px;
            padding-bottom: 12px;
            border-bottom: 1px solid #eeeeee;
          }

          .acct-nav a,
          .acct-nav .logout {
            width: auto;
            min-height: 40px;
            padding: 10px 13px;
            border: 1px solid #eeeeee;
            border-radius: 4px;
          }

          .acct-nav .logout {
            margin-top: 0;
          }
        }

        @media (max-width: 480px) {
          .acct-page {
            padding: 18px 4%;
          }

          .acct-shell {
            gap: 18px;
          }

          .acct-avatar {
            width: 42px;
            height: 42px;
            font-size: 16px;
          }

          .acct-user-text strong {
            font-size: 14px;
          }

          .acct-user-text span {
            font-size: 11px;
          }

          .acct-nav {
            gap: 7px;
          }

          .acct-nav a,
          .acct-nav .logout {
            min-height: 38px;
            padding: 9px 11px;
            font-size: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .acct-nav a,
          .acct-nav .logout {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
