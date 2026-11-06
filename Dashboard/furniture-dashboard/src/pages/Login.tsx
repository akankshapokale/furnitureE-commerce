import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Shield, Briefcase } from "lucide-react";
import { apiError } from "../services/api";
import { useAuth, type Portal } from "../context/AuthContext";

const portals: { key: Portal; label: string; icon: typeof Shield; hint: string }[] = [
  { key: "admin", label: "Admin", icon: Shield, hint: "Full access to the dashboard" },
  { key: "employee", label: "Employee", icon: Briefcase, hint: "Access to the pages assigned to you" },
];

const Login = () => {
  const { user, loading, login } = useAuth();
  const location = useLocation();

  const [portal, setPortal] = useState<Portal>("admin");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && user) {
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from || "/"} replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(identifier.trim(), password, portal);
    } catch (err) {
      setError(apiError(err, "Unable to sign in. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-center gap-3">
          <img
            src="/logo-mark-dark.png"
            alt="Staging Spaces"
            className="h-12 w-12 shrink-0 object-contain"
          />
          <div className="flex flex-col gap-1.5 text-left leading-none">
            <h1 className="whitespace-nowrap text-xl font-extrabold tracking-[1.5px] text-[#172033]">
              STAGING SPACES
            </h1>
            <span className="h-px w-full bg-gradient-to-r from-[#c18b45] via-[#e8d3ae] to-transparent" />
            <p className="whitespace-nowrap text-[8px] font-bold uppercase tracking-[1.1px] text-[#8b642f]">
              BY NARESH STEEL CORPORATION
            </p>
          </div>
        </div>

        {/* Portal switch */}
        <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
          {portals.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setPortal(key);
                setError("");
              }}
              className={`flex h-11 items-center justify-center gap-2 rounded-lg text-base font-semibold transition-all ${
                portal === key
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <p className="mt-3 text-center text-sm font-medium text-gray-500">
          {portals.find((p) => p.key === portal)?.hint}
        </p>

        <form onSubmit={handleSubmit} autoComplete="off" className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Email or phone number
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@company.com or 9876543210"
              autoComplete="off"
              required
              className="h-12 w-full rounded-lg border border-gray-200 px-3 text-base font-medium outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="off"
                required
                className="h-12 w-full rounded-lg border border-gray-200 pl-3 pr-11 text-base font-medium outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="h-12 w-full rounded-lg bg-green-600 text-base font-bold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
          >
            {submitting ? "Signing in..." : `Sign in as ${portal === "admin" ? "Admin" : "Employee"}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
