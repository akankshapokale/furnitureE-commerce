import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Loader2, Save, Trash2 } from "lucide-react";
import { API_BASE_URL, TOKEN_KEY } from "../../services/api";
import ConfirmDialog from "../common/ConfirmDialog";

type Row = { content_key: string; content: Record<string, unknown>; is_published: boolean };
const sections = [
  ["home_content", "Homepage copy and showcase"],
  ["about_content", "About page"],
  ["contact_content", "Contact details"],
  ["footer_content", "Footer content and links"],
  ["seo_content", "SEO metadata"],
] as const;
const initial: Record<string, Record<string, unknown>> = {
  home_content: { promo_eyebrow: "", promo_title: "", promo_description: "", promo_image: "", promo_button_text: "", promo_button_link: "", testimonials: [] },
  about_content: { eyebrow: "", heading: "", lead: "", image: "", story_title: "", story_paragraphs: [], values: [], stats: [] },
  contact_content: { email: "", phone: "", address: "", response_time: "", delivery_note: "" },
  footer_content: { description: "", instagram_url: "", categories: [], quick_links: [] },
  seo_content: { home_title: "", home_description: "", about_title: "", about_description: "", contact_title: "", contact_description: "" },
};
const input = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100";

export default function ContentPagesManager({ onToast }: { onToast: (msg: string, type: "success" | "error") => void }) {
  const [rows, setRows] = useState<Record<string, Row>>({});
  const [key, setKey] = useState<string>(sections[0][0]);
  const [json, setJson] = useState(JSON.stringify(initial.home_content, null, 2));
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE_URL}/website-content/admin`, { headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) ?? ""}` } });
      const d = await r.json();
      if (!r.ok || !d.success) throw new Error(d.message || "Failed to load content");
      const map = Object.fromEntries((d.data as Row[]).map((row) => [row.content_key, row]));
      setRows(map);
      setJson(JSON.stringify(map[key]?.content ?? initial[key], null, 2));
      setPublished(map[key]?.is_published ?? false);
      setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "Failed to load content"); }
    finally { setLoading(false); }
  }, [key]);
  useEffect(() => {
    // This starts an asynchronous request; state updates happen after the response.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);
  useEffect(() => {
    // Keep the editor draft in sync with the selected content row.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJson(JSON.stringify(rows[key]?.content ?? initial[key], null, 2));
    setPublished(rows[key]?.is_published ?? false);
  }, [key, rows]);

  const save = async () => {
    let content: Record<string, unknown>;
    try {
      content = JSON.parse(json);
      if (!content || Array.isArray(content) || typeof content !== "object") throw new Error("Content must be a JSON object");
    } catch (e) { setError(e instanceof Error ? e.message : "Invalid JSON"); return; }
    setSaving(true); setError("");
    try {
      const r = await fetch(`${API_BASE_URL}/website-content/${key}`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) ?? ""}` },
        body: JSON.stringify({ content, is_published: published }),
      });
      const d = await r.json();
      if (!r.ok || !d.success) throw new Error(d.message || "Failed to save");
      setRows((old) => ({ ...old, [key]: d.data }));
      onToast("Website content saved", "success");
    } catch (e) { const message = e instanceof Error ? e.message : "Failed to save content"; setError(message); onToast(message, "error"); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    try {
      const r = await fetch(`${API_BASE_URL}/website-content/${key}`, { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) ?? ""}` } });
      const d = await r.json();
      if (!r.ok || !d.success) throw new Error(d.message || "Failed to delete");
      setRows((old) => { const next = { ...old }; delete next[key]; return next; });
      onToast("Content deleted", "success");
    } catch (e) { onToast(e instanceof Error ? e.message : "Failed to delete content", "error"); }
  };
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-green-600" /></div>;
  return <section className="max-w-4xl space-y-4">
    {confirmDelete && <ConfirmDialog title="Delete content section?" message="It will no longer appear on the storefront." onCancel={() => setConfirmDelete(false)} onConfirm={() => { setConfirmDelete(false); void remove(); }} />}
    <p className="text-sm text-slate-600">Manage publishable page copy and links. Edit each section as a JSON object; arrays hold repeated items such as testimonials and footer links. The preview below shows the saved structure.</p>
    <label className="block text-sm font-semibold text-slate-700">Section<select className={input + " mt-1"} value={key} onChange={(e) => setKey(e.target.value)}>{sections.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    {error && <p role="alert" className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={16} />{error}</p>}
    <label className="block text-sm font-semibold text-slate-700">Content JSON<textarea className={input + " mt-1 font-mono text-xs"} rows={20} spellCheck={false} value={json} onChange={(e) => setJson(e.target.value)} /></label>
    <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Published on storefront</label>
    <div className="flex flex-wrap gap-2"><button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}Save changes</button>{rows[key] && <button onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"><Trash2 size={16} />Delete section</button>}</div>
    <div className="rounded-xl border border-gray-200 bg-white p-4"><h2 className="text-sm font-semibold text-slate-800">Content preview</h2><pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words text-xs text-slate-600">{json}</pre></div>
  </section>;
}
