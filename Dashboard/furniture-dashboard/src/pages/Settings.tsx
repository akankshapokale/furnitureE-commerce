import { useState, type FormEvent } from "react";
import { Save, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api, { apiError } from "../services/api";

const Settings = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await api.put("/users/me", { name: name.trim(), phone: phone.trim() || null });
      setName(response.data.data.name);
      setPhone(response.data.data.phone || "");
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(apiError(err, "Could not save your profile. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
    <div><h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Settings</h1><p className="mt-1 text-sm text-slate-500">Manage your staff profile</p></div>
    <form onSubmit={saveProfile} className="mt-6 max-w-3xl rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 sm:px-6"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50"><UserRound className="h-5 w-5 text-green-700"/></div><div><h2 className="font-bold text-slate-900">Profile information</h2><p className="mt-1 text-sm text-slate-500">Changes are saved to your staff account.</p></div></div>
      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <label className="text-sm font-medium text-slate-700">Full name<input required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-gray-200 px-3 font-normal outline-none focus:border-green-500"/></label>
        <label className="text-sm font-medium text-slate-700">Email address<input type="email" value={user?.email || ""} readOnly className="mt-2 h-10 w-full rounded-lg border border-gray-200 bg-slate-50 px-3 font-normal text-slate-500"/><span className="mt-1 block text-xs text-slate-400">Contact an administrator to change your email.</span></label>
        <label className="text-sm font-medium text-slate-700">Phone number<input type="tel" maxLength={30} value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-gray-200 px-3 font-normal outline-none focus:border-green-500"/></label>
        <label className="text-sm font-medium text-slate-700">Role<input value={user?.role === "admin" ? "Administrator" : user?.designation || "Employee"} readOnly className="mt-2 h-10 w-full rounded-lg border border-gray-200 bg-slate-50 px-3 font-normal text-slate-500"/></label>
      </div>
      {(message || error) && <p role={error ? "alert" : "status"} className={`mx-5 mb-4 rounded-lg px-3 py-2 text-sm sm:mx-6 ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{error || message}</p>}
      <div className="flex justify-end border-t border-gray-100 p-5 sm:px-6"><button type="submit" disabled={saving || !name.trim()} className="inline-flex h-10 items-center gap-2 rounded-lg bg-green-600 px-5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"><Save className="h-4 w-4"/>{saving ? "Saving…" : "Save profile"}</button></div>
    </form>
  </div>;
};

export default Settings;
