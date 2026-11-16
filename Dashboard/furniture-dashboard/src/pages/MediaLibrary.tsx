import { useCallback, useEffect, useMemo, useState } from "react";
import { Image, RefreshCw, Search, Trash2, Upload } from "lucide-react";
import { apiError, deleteMediaAsset, getMediaAssets, replaceMediaAsset, type MediaAsset } from "../services/api";
import ConfirmDialog from "../components/common/ConfirmDialog";

const categories = ["all", "products", "categories", "banners", "reviews", "other"];
const card = "border border-gray-200 bg-white";

const MediaLibrary = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const response = await getMediaAssets({ search: search || undefined, category: category === "all" ? undefined : category });
      const data = response.data?.data;
      if (!Array.isArray(data)) throw new Error("Media API returned an unexpected response. Configure GET /api/media.");
      setAssets(data);
    } catch (err) {
      setError(apiError(err, "Could not load media. The backend must provide GET /api/media."));
    } finally {
      setBusy(false);
    }
  }, [search, category]);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => assets, [assets]);
  const updateSelected = async (file: File) => {
    if (!selected) return;
    setBusy(true);
    try {
      const response = await replaceMediaAsset(selected.public_id, file);
      const replacement = response.data?.data;
      if (replacement?.url && replacement.public_id) setSelected(replacement);
      await load();
    } catch (err) {
      setError(apiError(err, "Could not replace image. Configure the authorized media replacement endpoint."));
    } finally { setBusy(false); }
  };

  const removeSelected = async () => {
    const target = deleteTarget;
    if (!target) return;
    setDeleteTarget(null);
    setBusy(true);
    try {
      await deleteMediaAsset(target.public_id);
      setSelected(null);
      await load();
    } catch (err) { setError(apiError(err, "Could not delete Cloudinary asset.")); }
    finally { setBusy(false); }
  };

  return <div className="space-y-5">
    {deleteTarget && <ConfirmDialog title="Delete Cloudinary image?" message={`Delete the selected Cloudinary asset “${deleteTarget.public_id}”? Only explicitly selected Cloudinary assets are eligible. Local images cannot be deleted here.`} onCancel={() => setDeleteTarget(null)} onConfirm={() => void removeSelected()} />}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">Cloudinary assets only. Existing local images are not listed or managed here.</p>
      <button type="button" onClick={() => void load()} disabled={busy} className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={15} className={busy ? "animate-spin" : ""} />Refresh</button>
    </div>
    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Cloudinary images" className="w-full border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-green-600"/></label>
      <select aria-label="Filter media by category" value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-200 bg-white px-3 py-2.5 text-sm text-slate-700"><option value="all">All categories</option>{categories.slice(1).map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select>
    </div>
    {error && <div role="alert" className="border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}
    {busy && !assets.length ? <p className="py-12 text-center text-sm text-slate-500">Loading Cloudinary media…</p> : filtered.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{filtered.map((asset) => <button key={asset.public_id} type="button" onClick={() => setSelected(asset)} className={`${card} overflow-hidden text-left hover:border-green-600`}><img src={asset.url} alt={asset.public_id} loading="lazy" className="aspect-square w-full bg-slate-50 object-cover"/><span className="block truncate px-3 py-2 text-xs text-slate-600">{asset.public_id}</span></button>)}</div> : <div className={`${card} flex flex-col items-center py-14 text-center`}><Image className="mb-3 text-slate-300" size={36}/><p className="text-sm font-semibold text-slate-700">No Cloudinary images found</p><p className="mt-1 text-xs text-slate-400">New uploads appear after the backend exposes the media library API.</p></div>}
    {selected && <div className={`${card} grid gap-5 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]`}><img src={selected.url} alt={selected.public_id} className="max-h-[420px] w-full bg-slate-50 object-contain"/><div className="space-y-3"><div><h2 className="text-base font-bold text-slate-900">Image details</h2><p className="mt-2 break-all text-sm text-slate-600">{selected.public_id}</p></div><dl className="space-y-1 text-xs text-slate-500">{([["URL", selected.url], ["Format", selected.format], ["Dimensions", selected.width && selected.height ? `${selected.width} × ${selected.height}` : undefined], ["Size", selected.bytes ? `${(selected.bytes / 1024).toFixed(1)} KB` : undefined], ["Created", selected.created_at]] as const).filter((entry) => entry[1]).map(([label, value]) => <div key={label}><dt className="font-semibold text-slate-700">{label}</dt><dd className="break-all">{value}</dd></div>)}</dl><div className="flex flex-wrap gap-2 pt-2"><label className="inline-flex cursor-pointer items-center gap-2 border border-gray-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"><Upload size={15}/>Replace image<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; if (file) void updateSelected(file); }}/></label><button type="button" onClick={() => setDeleteTarget(selected)} className="inline-flex items-center gap-2 border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"><Trash2 size={15}/>Delete selected</button><button type="button" onClick={() => setSelected(null)} className="border border-gray-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">Close</button></div></div></div>}
  </div>;
};

export default MediaLibrary;
