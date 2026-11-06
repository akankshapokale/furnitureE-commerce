import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ImageOff,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
} from "lucide-react";

import {
  apiError,
  deleteProduct,
  getMediaUrl,
  getProducts,
  updateProductStatus,
  type ProductRecord,
} from "../services/api";
import { formatINR, discountPercent, stockState, availableStock } from "../components/products/helpers";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  draft: "bg-yellow-50 text-yellow-700",
  archived: "bg-slate-100 text-slate-600",
};

const STOCK_STYLES = {
  in: "text-green-700",
  low: "text-amber-600",
  out: "text-red-600",
};

const Products = () => {
  const location = useLocation();

  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(() => (location.state as { notice?: string } | null)?.notice || "");

  const [search, setSearch] = useState("");
  const [categoryFilter] = useState("all");
  const [statusFilter] = useState("all");
  const [stockFilter] = useState("all");


  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const productsRes = await getProducts();
      setProducts(productsRes.data.data || []);
    } catch (err) {
      setError(apiError(err, "Failed to load products"));
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = window.setInterval(() => void load(true), 30_000);
    return () => window.clearInterval(interval);
  }, [load]);

  const refreshInventory = async () => {
    setRefreshing(true);
    await load(true);
    setRefreshing(false);
  };

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };

  useEffect(() => {
    const message = (location.state as { notice?: string } | null)?.notice;
    if (!message) return;
    const showTimer = window.setTimeout(() => setNotice(message), 0);
    const clearTimer = window.setTimeout(() => setNotice(""), 3500);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(clearTimer);
    };
  }, [location.key, location.state]);

  const stats = useMemo(
    () => {
      return {
        total: products.length,
        availableUnits: products.reduce((sum, product) => sum + availableStock(product), 0),
        lowStock: products.filter((product) => stockState(availableStock(product)) === "low").length,
        outOfStock: products.filter((product) => stockState(availableStock(product)) === "out").length,
      };
    },
    [products]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      if (categoryFilter !== "all" && String(product.category_id) !== categoryFilter) return false;
      if (statusFilter !== "all" && product.status !== statusFilter) return false;
      if (stockFilter !== "all" && stockState(availableStock(product)) !== stockFilter) return false;

      return (
        term === "" ||
        product.name.toLowerCase().includes(term) ||
        (product.sku ?? "").toLowerCase().includes(term)
      );
    });
  }, [products, search, categoryFilter, statusFilter, stockFilter]);

  const changeStatus = async (product: ProductRecord, status: string) => {
    try {
      await updateProductStatus(product.id, status);
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id ? { ...item, status: status as ProductRecord["status"] } : item
        )
      );
      flash(`"${product.name}" is now ${status}`);
    } catch (err) {
      setError(apiError(err, "Failed to update status"));
    }
  };

  const remove = async (product: ProductRecord) => {
    if (!window.confirm(`Delete "${product.name}"? Products linked to existing records will be archived to preserve those records.`)) return;

    try {
      const response = await deleteProduct(product.id);
      if (response.data.data?.archived) {
        setProducts((current) => current.map((item) => item.id === product.id ? { ...item, status: "archived" } : item));
        flash(response.data.message || `"${product.name}" was archived to preserve order history`);
      } else {
        setProducts((current) => current.filter((item) => item.id !== product.id));
        flash(`"${product.name}" was deleted`);
      }
    } catch (err) {
      setError(apiError(err, "Failed to delete product"));
    }
  };

  const cards = [
    { label: "Total products", value: stats.total.toLocaleString("en-IN"), note: "Including all products" },
    { label: "Available units", value: stats.availableUnits.toLocaleString("en-IN"), note: "Parent stock and active variants" },
    { label: "Low stock", value: stats.lowStock.toLocaleString("en-IN"), note: "Products with 10 units or fewer" },
    { label: "Out of stock", value: stats.outOfStock.toLocaleString("en-IN"), note: "Products needing restock" },
  ];


  return (
    <div className="min-h-screen min-w-0 bg-white">
      <div className="min-w-0 space-y-5 p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Products &amp; Inventory</h1>
            <p className="mt-1 text-sm text-slate-500">
              Live stock from orders and variants; refreshed every 30 seconds
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
          </div>
        </div>

        {notice && (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{notice}</div>
        )}
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {/* Stats */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
          {cards.map(({ label, value, note }) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold text-green-800">{value}</p>
              <p className="mt-1 text-xs text-slate-500">{note}</p>
            </div>
          ))}
        </section>

        {/* Filters */}
        <section className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-green-500"
            />
          </div>
          <button type="button" onClick={() => void refreshInventory()} disabled={refreshing} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50 disabled:opacity-60">
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh stock
          </button>
          <Link to="/products/new" state={{ backgroundLocation: location }} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800">
            <Plus size={16} /> Add product
          </Link>
        </section>

        {/* Product cards */}
        <section>
          {loading ? (
            <p className="py-20 text-center text-sm text-slate-400">Loading products...</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
              <Package size={36} className="mx-auto text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-600">
                {products.length === 0 ? "No products yet" : "No products match your filters"}
              </p>
              {products.length === 0 && (
                <Link to="/products/new" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                  <Plus size={16} /> Add your first product
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
              {filtered.map((product) => {
                const stock = availableStock(product);
                const state = stockState(stock);
                const off = discountPercent(product.price, product.discount_price);
                const rating = Number(product.catalog_rating || 0);
                const ratingCount = Number(product.catalog_rating_count || 0);

                return (
                  <article key={product.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-green-300 hover:shadow-md">
                    <div className="flex min-h-[88px] items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-slate-50">
                          {product.image_url ? <img src={getMediaUrl(product.image_url)} alt={product.name} loading="lazy" className="h-full w-full object-cover" /> : <ImageOff size={20} className="text-slate-300" />}
                        </div>
                        <div className="min-w-0">
                          <Link to={`/products/${product.id}`} state={{ backgroundLocation: location }} className="block truncate text-base font-semibold text-slate-900 hover:text-green-700">{product.name}</Link>
                          <p className="truncate text-xs text-slate-500">{product.category_name || "Uncategorised"}{product.sub_category_name ? ` · ${product.sub_category_name}` : ""}</p>
                        </div>
                      </div>
                      {(product.badge || product.category_name) && <span className="max-w-32 shrink-0 truncate rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-green-800">{product.badge || product.category_name}</span>}
                    </div>

                    <div className="px-4 py-4">
                      <p className="line-clamp-2 min-h-10 text-sm leading-5 text-slate-600">{product.short_description || product.description || "No product description provided."}</p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-green-800">{formatINR(product.discount_price ?? product.price)}</span>
                          {off > 0 && <><span className="text-xs text-slate-500 line-through">{formatINR(product.price)}</span><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">-{off}%</span></>}
                        </div>
                        <div className="inline-flex items-center gap-1 text-sm text-slate-600" title={`${ratingCount.toLocaleString("en-IN")} ratings`}>
                          <Star size={15} className="fill-green-700 text-green-700" />
                          <span className="font-medium">{rating ? rating.toFixed(1) : "—"}</span>
                          {ratingCount > 0 && <span className="text-xs text-slate-400">({ratingCount.toLocaleString("en-IN")})</span>}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <select value={product.status} onChange={(event) => changeStatus(product, event.target.value)} aria-label={`Status for ${product.name}`} className={`rounded-full border border-transparent px-3 py-1 text-[10px] font-semibold uppercase outline-none ${STATUS_STYLES[product.status]}`}>
                          <option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option>
                        </select>
                        <span className={`rounded-full border border-gray-200 bg-slate-50 px-3 py-1 text-[10px] font-medium uppercase tracking-wide ${STOCK_STYLES[state]}`}>
                          {state === "out" ? "Out of stock" : `Stock: ${stock.toLocaleString("en-IN")}`}{state === "low" ? " · Low" : ""}
                        </span>
                        {(product.variant_count ?? 0) > 0 && <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[10px] text-slate-500">{product.variant_count} variants</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-4 py-3">
                      <div className="flex shrink-0 items-center gap-2">
                        <Link to={`/products/${product.id}`} state={{ backgroundLocation: location }} className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50" aria-label={`Edit ${product.name}`}><Pencil size={13} /> Edit</Link>
                        <button type="button" onClick={() => remove(product)} className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${product.name}`}><Trash2 size={13} /> Delete</button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

    </div>
  );
};

export default Products;
