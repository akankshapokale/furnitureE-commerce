import { useState, type ChangeEvent, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, type AuthUser } from "../auth/authContext";
import AccountLayout from "../components/AccountLayout";
import "./account.css";

function ProfileForm({ user }: { user: AuthUser }) {
  const { updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user.name ?? "",
    phone: user.phone ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await updateProfile(form);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="acct-field">
        <label htmlFor="name">Full name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} />
      </div>

      <div className="acct-row">
        <div className="acct-field">
          <label htmlFor="email">Email</label>
          <input id="email" value={user.email} readOnly />
        </div>

        <div className="acct-field">
          <label htmlFor="phone">Mobile number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={10}
            value={form.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && <div className="acct-msg error">{error}</div>}
      {saved && <div className="acct-msg ok">Profile saved.</div>}

      <button type="submit" className="acct-btn" disabled={saving}>
        {saving ? "SAVING..." : "SAVE CHANGES"}
      </button>
    </form>
  );
}

export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <AccountLayout>
      <div className="acct-card">
        <h1 className="acct-title">Your profile</h1>
        <p className="acct-subtitle">
          Update your details. Your name here is what the account menu shows.
          Manage delivery addresses under Saved Addresses.
        </p>

        {/* key remounts the form if a different account signs in */}
        <ProfileForm key={user.id} user={user} />
      </div>
    </AccountLayout>
  );
}
