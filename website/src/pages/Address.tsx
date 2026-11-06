import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { API_URL, useAuth } from "../auth/authContext";
import AccountLayout from "../components/AccountLayout";
import "./account.css";

interface Address {
  id: number;
  full_name?: string;
  name?: string;
  customer_name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  phone_number?: string;
  address_line1?: string;
  address?: string;
  street?: string;
  address_line2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  postal_code?: string;
  pincode?: string;
  zip?: string;
  address_type?: string;
  is_default: boolean;
}

const EMPTY_FORM = {
  full_name: "",
  email: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
};

export default function Addresses() {
  const { user, token, loading } = useAuth();
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const call = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const res = await fetch(`${API_URL}/api/addresses/mine${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Something went wrong");
      return body;
    },
    [token]
  );

  const load = useCallback(async () => {
    const body = await call("");
    
    console.log("Fetched Addresses:", body.data);
    setAddresses(body.data || []);
  }, [call]);

  useEffect(() => {
    if (!token) return;
    load().catch((err) => setError(err.message));
  }, [token, load]);

  const run = async (action: () => Promise<unknown>) => {
    try {
      setError("");
      await action();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.full_name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.phone.trim() || form.phone.trim().length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!form.address_line1.trim()) {
      setError("Flat / House No. / Building is required.");
      return;
    }

    if (!form.city.trim() || !form.state.trim() || !form.postal_code.trim()) {
      setError("City, state and pincode are required.");
      return;
    }

    setSaving(true);

    
    const payload = {
      ...form,
      name: form.full_name,
      full_name: form.full_name,
      mobile: form.phone,
      phone: form.phone,
      phone_number: form.phone,
      address: form.address_line1,
      address_line1: form.address_line1,
      street: form.address_line1,
      landmark: form.address_line2,
      address_line2: form.address_line2,
      pincode: form.postal_code,
      postal_code: form.postal_code,
      zip: form.postal_code,
    };

    await run(async () => {
      await call("", { method: "POST", body: JSON.stringify(payload) });
      setForm(EMPTY_FORM);
      setShowForm(false);
    });

    setSaving(false);
  };

  // ✅ डुप्लिकेट पत्ते गाळणे (Deduplication)
  const uniqueAddresses = addresses
    ? addresses.filter(
        (addr, index, self) =>
          index === self.findIndex((item) => item.id === addr.id)
      )
    : null;

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <AccountLayout>
      <div className="acct-card">
        <h1 className="acct-title">Saved addresses</h1>
        <p className="acct-subtitle">Manage where your orders are delivered.</p>

        {error && <div className="acct-msg error">{error}</div>}

        {addresses === null && !error && <p className="acct-empty">Loading…</p>}

        {uniqueAddresses?.length === 0 && (
          <p className="acct-empty">No saved addresses yet.</p>
        )}

        <div className="addr-list">
          {uniqueAddresses?.map((a) => {
            // सर्व पर्यायी नावांची तपासणी (Fallback सह)
            const recipientName =
              a.full_name ||
              a.name ||
              a.customer_name ||
              (user as any)?.name ||
              "Customer";

            const mobileNumber =
              a.phone ||
              a.mobile ||
              a.phone_number ||
              (user as any)?.phone ||
              (user as any)?.mobile;

            const emailAddr =
              a.email ||
              (user as any)?.email;

            const line1 =
              a.address_line1 ||
              a.address ||
              a.street ||
              "";

            const line2 =
              a.address_line2 ||
              a.landmark ||
              "";

            const pincode =
              a.postal_code ||
              a.pincode ||
              a.zip ||
              "";

            return (
              <div
                className={`addr-card${a.is_default ? " default" : ""}`}
                key={a.id}
                style={{ padding: "18px 20px" }}
              >
                {/* 1. Header: Name & Default Badge */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <strong style={{ fontSize: "16px", color: "#111827", fontWeight: 700 }}>
                    {recipientName}
                  </strong>
                  {a.is_default && <span className="badge delivered">Default</span>}
                </div>

                {/* 2. Contact Details: Phone & Email */}
                <div
                  style={{
                    fontSize: "13px",
                    color: "#4b5563",
                    marginBottom: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {mobileNumber && (
                    <span style={{ fontWeight: 500 }}>
                      📞 <strong>Mobile:</strong> +91 {mobileNumber}
                    </span>
                  )}
                  {emailAddr && (
                    <span>
                      ✉️ <strong>Email:</strong> {emailAddr}
                    </span>
                  )}
                </div>

                {/* 3. Detailed Address */}
                <div
                  style={{
                    fontSize: "14px",
                    color: "#374151",
                    lineHeight: "1.5",
                    backgroundColor: "#f9fafb",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "1px solid #f3f4f6",
                  }}
                >
                  {line1 && <div style={{ fontWeight: 500 }}>{line1}</div>}
                  {line2 && <div style={{ color: "#6b7280" }}>{line2}</div>}
                  <div>
                    {a.city}, {a.state} – <strong style={{ color: "#111827" }}>{pincode}</strong>
                  </div>
                </div>

                {/* 4. Actions */}
                <div className="addr-actions" style={{ marginTop: "14px" }}>
                  {!a.is_default && (
                    <button
                      type="button"
                      className="acct-link-btn"
                      onClick={() =>
                        run(() => call(`/${a.id}/default`, { method: "PATCH" }))
                      }
                    >
                      Make default
                    </button>
                  )}
                  <button
                    type="button"
                    className="acct-link-btn danger"
                    onClick={() => {
                      if (window.confirm("Delete this address?")) {
                        run(() => call(`/${a.id}`, { method: "DELETE" }));
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {!showForm && (
          <button
            type="button"
            className="acct-btn acct-btn-outline"
            onClick={() => {
              
              setForm({
                ...EMPTY_FORM,
                full_name: (user as any)?.name || "",
                email: (user as any)?.email || "",
                phone: (user as any)?.phone || "",
              });
              setShowForm(true);
            }}
          >
            + ADD NEW ADDRESS
          </button>
        )}

        {showForm && (
          <form onSubmit={handleAdd} style={{ marginTop: "24px" }}>
            <h2 className="acct-section-title" style={{ marginTop: 0 }}>
              Add a new address
            </h2>

            {/* Name */}
            <div className="acct-field">
              <label htmlFor="full_name">Full Name *</label>
              <input
                id="full_name"
                name="full_name"
                placeholder="Receiver's full name"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email & Phone */}
            <div className="acct-row">
              <div className="acct-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Receiver's email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="acct-field">
                <label htmlFor="phone">Mobile Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </div>

            {/* Flat / House No. */}
            <div className="acct-field">
              <label htmlFor="address_line1">Flat, House No., Building, Apartment *</label>
              <input
                id="address_line1"
                name="address_line1"
                placeholder="e.g. Flat 301, Sunshine Heights"
                value={form.address_line1}
                onChange={handleChange}
                required
              />
            </div>

            {/* Landmark */}
            <div className="acct-field">
              <label htmlFor="address_line2">Area, Street, Sector, Landmark</label>
              <input
                id="address_line2"
                name="address_line2"
                placeholder="e.g. Near City Center Mall"
                value={form.address_line2}
                onChange={handleChange}
              />
            </div>

            {/* City & State */}
            <div className="acct-row">
              <div className="acct-field">
                <label htmlFor="city">Town / City *</label>
                <input
                  id="city"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="acct-field">
                <label htmlFor="state">State *</label>
                <input
                  id="state"
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Pincode */}
            <div className="acct-field" style={{ marginTop: 18 }}>
              <label htmlFor="postal_code">Pincode *</label>
              <input
                id="postal_code"
                name="postal_code"
                maxLength={6}
                placeholder="6-digit pincode"
                value={form.postal_code}
                onChange={handleChange}
                required
              />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button type="submit" className="acct-btn" disabled={saving}>
                {saving ? "SAVING..." : "SAVE ADDRESS"}
              </button>
              <button
                type="button"
                className="acct-btn acct-btn-outline"
                onClick={() => {
                  setShowForm(false);
                  setForm(EMPTY_FORM);
                  setError("");
                }}
              >
                CANCEL
              </button>
            </div>
          </form>
        )}
      </div>
    </AccountLayout>
  );
}