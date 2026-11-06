import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { apiError, getCustomSizeRequests, getMediaUrl, updateCustomSizeRequest, type CustomSizeRequestRecord } from "../services/api";

type RequestDraft = {
  status: CustomSizeRequestRecord["status"];
  admin_remarks: string;
  quotation_amount: string;
  quotation_details: string;
};

const STATUSES: CustomSizeRequestRecord["status"][] = ["Pending", "Under Review", "Quotation Sent", "Approved", "Rejected"];
const digits = (value: string | null | undefined) => (value || "").replace(/\D/g, "");
const money = (value: string | number | null) => value == null ? "—" : `₹${Number(value).toLocaleString("en-IN")}`;

export default function CustomSizeRequests() {
  const [requests, setRequests] = useState<CustomSizeRequestRecord[]>([]);
  const [drafts, setDrafts] = useState<Record<number, RequestDraft>>({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getCustomSizeRequests();
      const rows = response.data.data as CustomSizeRequestRecord[];
      setRequests(rows);
      setDrafts(Object.fromEntries(rows.map((row) => [row.id, {
        status: row.status,
        admin_remarks: row.admin_remarks || "",
        quotation_amount: row.quotation_amount == null ? "" : String(row.quotation_amount),
        quotation_details: row.quotation_details || "",
      }])));
    } catch (err) {
      setError(apiError(err, "Failed to load custom size requests."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return requests.filter((row) => {
      const matchesStatus = statusFilter === "All statuses" || row.status === statusFilter;
      const matchesQuery = !query || [row.request_id, row.customer_name, row.customer_email, row.customer_phone, row.product_name]
        .some((value) => String(value || "").toLowerCase().includes(query));
      return matchesStatus && matchesQuery;
    });
  }, [requests, search, statusFilter]);

  const updateDraft = (id: number, patch: Partial<RequestDraft>) =>
    setDrafts((current) => ({ ...current, [id]: { ...current[id], ...patch } }));

  const save = async (row: CustomSizeRequestRecord) => {
    const draft = drafts[row.id];
    setSavingId(row.id);
    setError("");
    setNotice("");
    try {
      const response = await updateCustomSizeRequest(row.id, draft);
      const updated = response.data.data as CustomSizeRequestRecord;
      setRequests((current) => current.map((item) => item.id === row.id ? updated : item));
      setDrafts((current) => ({ ...current, [row.id]: {
        status: updated.status,
        admin_remarks: updated.admin_remarks || "",
        quotation_amount: updated.quotation_amount == null ? "" : String(updated.quotation_amount),
        quotation_details: updated.quotation_details || "",
      }}));
      setNotice(`${updated.request_id} updated.`);
    } catch (err) {
      setError(apiError(err, "Could not save this request."));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-w-0 space-y-6 p-4 sm:p-5 lg:p-6 xl:p-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Custom Size Requests</h1>
        <p className="mt-1 text-sm text-slate-500">Review customer dimensions, manage quotations, and contact customers.</p>
      </header>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 md:flex-row">
        <label className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search request, customer or product" className="h-11 w-full border border-gray-200 pl-10 pr-3 text-sm outline-none focus:border-slate-500" />
        </label>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 border border-gray-200 bg-white px-3 text-sm">
          <option>All statuses</option>
          {STATUSES.map((status) => <option key={status}>{status}</option>)}
        </select>
        <button onClick={() => void load()} className="h-11 border border-gray-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">Refresh</button>
      </div>

      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{notice}</p>}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4 text-sm text-slate-500">{filtered.length} requests</div>
        {loading ? <p className="p-10 text-center text-sm text-slate-500">Loading requests...</p> : filtered.length === 0 ? <p className="p-10 text-center text-sm text-slate-500">No custom size requests found.</p> : (
          <div className="divide-y divide-gray-100">
            {filtered.map((row) => {
              const draft = drafts[row.id];
              const phone = digits(row.customer_phone);
              return (
                <article key={row.id} className="grid gap-5 p-5 xl:grid-cols-[minmax(260px,1fr)_minmax(300px,1.1fr)]">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      {row.product_image && <img src={getMediaUrl(row.product_image)} alt="" className="h-16 w-16 rounded border border-gray-200 bg-white object-contain" />}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{row.request_id}</p>
                        <h2 className="mt-1 font-semibold text-slate-900">{row.product_name}</h2>
                        <p className="text-xs text-slate-500">Product ID: {row.product_id ?? "Unavailable"}</p>
                        <p className="mt-1 text-sm text-slate-500">Submitted {new Date(row.created_at).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700"><strong>Dimensions:</strong> {row.length_cm} × {row.width_cm} × {row.height_cm} cm</p>
                    <div className="text-sm text-slate-700"><strong>{row.customer_name}</strong><div>{row.customer_email}</div><div>{row.customer_phone || "No phone number"}</div></div>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                      {phone && <a className="rounded border border-gray-200 px-3 py-2 text-slate-700" href={`tel:${row.customer_phone}`}>Call</a>}
                      <a className="rounded border border-gray-200 px-3 py-2 text-slate-700" href={`mailto:${row.customer_email}`}>Email</a>
                      {phone && <a className="rounded border border-gray-200 px-3 py-2 text-slate-700" href={`https://wa.me/${phone.length === 10 ? `91${phone}` : phone}`} target="_blank" rel="noreferrer">WhatsApp</a>}
                    </div>
                    {row.customer_decision && <p className="text-sm font-semibold text-slate-700">Customer {row.customer_decision.toLowerCase()} the quotation.</p>}
                    {row.quotation_amount != null && <p className="text-sm text-slate-700"><strong>Current quote:</strong> {money(row.quotation_amount)}</p>}
                  </div>

                  <div className="grid content-start gap-3">
                    <label className="grid gap-1 text-xs font-semibold text-slate-600">Request status
                      <select value={draft?.status || row.status} onChange={(event) => updateDraft(row.id, { status: event.target.value as RequestDraft["status"] })} className="h-10 border border-gray-200 bg-white px-3 text-sm font-normal">
                        {STATUSES.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="grid gap-1 text-xs font-semibold text-slate-600">Quotation amount (₹)
                        <input type="number" min="0" step="0.01" value={draft?.quotation_amount || ""} onChange={(event) => updateDraft(row.id, { quotation_amount: event.target.value })} className="h-10 border border-gray-200 px-3 text-sm font-normal" />
                      </label>
                      <label className="grid gap-1 text-xs font-semibold text-slate-600">Admin remarks
                        <input value={draft?.admin_remarks || ""} onChange={(event) => updateDraft(row.id, { admin_remarks: event.target.value })} className="h-10 border border-gray-200 px-3 text-sm font-normal" />
                      </label>
                    </div>
                    <label className="grid gap-1 text-xs font-semibold text-slate-600">Quotation details
                      <textarea rows={3} value={draft?.quotation_details || ""} onChange={(event) => updateDraft(row.id, { quotation_details: event.target.value })} className="border border-gray-200 p-3 text-sm font-normal" placeholder="Add quotation details for the customer" />
                    </label>
                    <button onClick={() => void save(row)} disabled={savingId === row.id} className="h-10 justify-self-start rounded-md bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-50">
                      {savingId === row.id ? "Saving..." : draft?.status === "Quotation Sent" ? "Save and share quotation" : "Save request"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
