import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import CategoryManager from "../components/products/CategoryManager";
import {
  Globe,
  Image as ImageIcon,
  Megaphone,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Trash2,
  Plus,
  Tag,
  Package,
  Star,
  Pencil,
  ChevronLeft,
  Upload,
  X,
  ShoppingBag,
  ToggleLeft,
  ToggleRight,
  Search,
  BookOpen,
  LogIn,
  Truck,
  Flame,
  Leaf,
} from "lucide-react";

import {
  getMediaUrl,
  API_ORIGIN,
  getProducts,
  getCategories,
  getSubCategories,
  deleteProduct,
  updateProductStatus,
  type ProductRecord,
  type Category,
  type SubCategory,
} from "../services/api";

// â”€â”€â”€ constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const API_URL = `${API_ORIGIN}/api/website-control`;
const staffHeaders = (json = false): Record<string, string> => {
  const token = localStorage.getItem("staff_token");
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// â”€â”€â”€ types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface WebsiteSetting {
  id?: number;
  section_key: string;
  heading: string;
  description: string;
  image_url: string;
  button_text: string;
  button_link: string;
  is_active: boolean;
}

interface HeroBannerItem {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  image_url: string;
  button_text: string;
  button_link: string;
  is_active: boolean;
}

type Module =
  | "products"
  | "best-seller"
  | "blogs"
  | "marquee"
  | "banners"
  | "login-page-media"
  | "find-solution-page"
  | "homepage-ingredient-cards"
  | "delivery-charges"
  // kept for backward compat
  | "home"
  | "categories"
  | "offers"
  | "settings";

// â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const formatINR = (v: number | string | null | undefined) => {
  const n = Number(v);
  if (v === null || v === undefined || v === "" || !Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
};

const discountPct = (
  price: number | string | null | undefined,
  dp: number | string | null | undefined
) => {
  const p = Number(price);
  const d = Number(dp);
  if (!p || !d || d >= p) return 0;
  return Math.round(((p - d) / p) * 100);
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-gray-100 text-gray-500 border-gray-200",
};

// â”€â”€â”€ sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Pill badge */
const Badge = ({
  label,
  color,
}: {
  label: string;
  color: string;
}) => (
  <span
    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${color}`}
  >
    {label}
  </span>
);

/** Feedback toast */
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => (
  <div
    className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${
      type === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : "border-red-200 bg-red-50 text-red-800"
    }`}
  >
    {type === "success" ? (
      <CheckCircle className="h-4 w-4 shrink-0" />
    ) : (
      <AlertCircle className="h-4 w-4 shrink-0" />
    )}
    <span className="text-sm font-medium">{message}</span>
    <button
      onClick={onClose}
      className="ml-2 rounded-lg p-0.5 hover:bg-black/10"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  </div>
);

// â”€â”€â”€ CMS module cards (landing grid) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CMS_MODULES = [
  {
    id: "products" as Module,
    label: "Products",
    description: "Add, edit, and manage your furniture catalogue",
    icon: Package,
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "categories" as Module,
    label: "Categories Master",
    description: "Add, rename, and remove product categories and subcategories",
    icon: Tag,
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    id: "banners" as Module,
    label: "Banners",
    description: "Manage homepage hero slides and banners",
    icon: ImageIcon,
    bg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    id: "login-page-media" as Module,
    label: "Login Page Media",
    description: "Set the background image/video for login page",
    icon: LogIn,
    bg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  {
    id: "delivery-charges" as Module,
    label: "Delivery Charges",
    description: "Set delivery fees, free delivery thresholds",
    icon: Truck,
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PRODUCTS MODULE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const ProductsModule = ({
  onToast,
}: {
  onToast: (msg: string, type: "success" | "error") => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterStatus] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pr, cr, sr] = await Promise.all([
        getProducts(),
        getCategories(),
        getSubCategories(),
      ]);
      setProducts(pr.data.data || []);
      setCategories(cr.data.data || []);
      setSubCategories(sr.data.data || []);
    } catch {
      onToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  useEffect(() => {
    // load performs an asynchronous fetch; its state updates follow the response.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || String(p.category_id) === filterCat;
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const ratedProducts = products.filter((product) => Number(product.catalog_rating) > 0);
  const averageRating = ratedProducts.length ? (ratedProducts.reduce((sum, product) => sum + Number(product.catalog_rating), 0) / ratedProducts.length).toFixed(1) : "—";
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"? Products linked to existing records will be archived to preserve those records.`)) return;
    try {
      const response = await deleteProduct(id);
      if (response.data.data?.archived) {
        setProducts((items) => items.map((item) => item.id === id ? { ...item, status: "archived" } : item));
        onToast(response.data.message || `"${name}" archived to preserve order history`, "success");
      } else {
        onToast(`"${name}" deleted`, "success");
        await load();
      }
    } catch {
      onToast("Failed to delete product", "error");
    }
  };

  const handleStatus = async (
    id: number,
    current: string,
    name: string
  ) => {
    const next =
      current === "active"
        ? "draft"
        : current === "draft"
        ? "active"
        : "active";
    try {
      await updateProductStatus(id, next);
      onToast(`"${name}" set to ${next}`, "success");
      load();
    } catch {
      onToast("Failed to update status", "error");
    }
  };

  const catName = (id: number | null) =>
    categories.find((c) => c.id === id)?.name ?? "Uncategorized";
  const subCatName = (id: number | null) =>
    subCategories.find((s) => s.id === id)?.name ?? "";

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );

  return (
    <div>
      {/* Product overview */}
      <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        {[
          { label: "Total Products", value: products.length.toLocaleString("en-IN"), note: "All catalog items" },
          { label: "Active Products", value: products.filter((product) => product.status === "active").length.toLocaleString("en-IN"), note: "Visible in the store" },
          { label: "Categories", value: categories.length.toLocaleString("en-IN"), note: "Product groups" },
          { label: "Subcategories", value: subCategories.length.toLocaleString("en-IN"), note: "Organized under categories" },
          { label: "Average Rating", value: averageRating, note: `Across ${ratedProducts.length} rated products` },
        ].map((stat) => (
          <div key={stat.label} className="border border-gray-200 bg-white p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-500">{stat.note}</p>
          </div>
        ))}
      </section>
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="h-11 w-full border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
            placeholder="Search products or SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          value={filterCat}
          onChange={(event) => {
            setFilterCat(event.target.value);
            setPage(1);
          }}
          className="h-10 w-full border border-gray-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-500 sm:w-56"
          aria-label="Filter products by category"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={String(category.id)}>{category.name}</option>
          ))}
        </select>

        <div className="flex items-center justify-between gap-3 sm:ml-auto">
          <span className="whitespace-nowrap text-xs text-gray-500">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => navigate("/products/new", { state: { backgroundLocation: location } })}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 active:scale-95 transition"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Empty state */}
      {paginated.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No products found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Product card grid */}
      <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 2xl:grid-cols-3">
        {paginated.map((product) => {
          const thumb = getMediaUrl(product.image_url);
          const pct = discountPct(product.price, product.discount_price);
          const cat = catName(product.category_id);
          const sub = subCatName(product.sub_category_id);
          const rating = Number(product.catalog_rating);

          return (
            <article key={product.id} className="flex min-w-0 flex-col border border-gray-200 bg-white">
              <header className="flex min-h-[76px] items-center gap-3 border-b border-gray-200 px-4 py-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden border border-gray-100 bg-slate-50">
                  {thumb ? (
                    <img src={thumb} alt={product.name} className="h-full w-full object-contain p-1" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} />
                  ) : <div className="flex h-full items-center justify-center"><Package className="h-6 w-6 text-gray-300" /></div>}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-slate-900" title={product.name}>{product.name}</h3>
                  <p className="mt-1 truncate text-xs text-slate-500">{cat}{sub ? ` / ${sub}` : ""}</p>
                </div>
                <div className="flex max-w-[42%] flex-wrap justify-end gap-1">
                  {product.is_featured && <span className="inline-flex items-center gap-1 border border-amber-200 bg-amber-50 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-amber-700"><Star className="h-3 w-3 fill-current" /> Featured</span>}
                  {product.badge && <span className="border border-green-200 bg-green-50 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-green-700">{product.badge}</span>}
                </div>
              </header>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <p className="min-h-10 text-sm leading-5 text-slate-600 line-clamp-2">{product.short_description || "No description available."}</p>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-slate-900">{formatINR(product.discount_price || product.price)}</span>
                    {product.discount_price && <span className="text-xs text-slate-400 line-through">{formatINR(product.price)}</span>}
                    {pct > 0 && <span className="bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">-{pct}%</span>}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-600"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{rating > 0 ? rating.toFixed(1) : "Not rated"}{product.catalog_rating_count > 0 ? ` (${product.catalog_rating_count})` : ""}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusColors[product.status] || statusColors.archived}`}>{product.status}</span>
                  <span className="border border-gray-200 bg-gray-50 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">Stock: {product.stock_quantity}</span>
                  {product.variant_count ? <span className="border border-gray-200 bg-gray-50 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">{product.variant_count} variants</span> : null}
                </div>
              </div>

              <footer className="flex items-center justify-between gap-3 border-t border-gray-200 px-4 py-2.5">
                <span className="min-w-0 truncate font-mono text-[10px] text-slate-500" title={product.sku || product.slug}>{product.sku || product.slug}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={() => navigate(`/products/${product.id}`, { state: { backgroundLocation: location } })} className="inline-flex items-center gap-1 border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-gray-50"><Pencil className="h-3 w-3" /> Edit</button>
                  <button type="button" onClick={() => handleDelete(product.id, product.name)} className="inline-flex items-center gap-1 border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-3 w-3" /> Delete</button>
                  <button type="button" aria-label={`Change status for ${product.name}`} onClick={() => handleStatus(product.id, product.status, product.name)} className="border border-gray-200 p-1.5 text-slate-500 hover:bg-gray-50">{product.status === "active" ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}</button>
                </div>
              </footer>
            </article>
          );
        })}
      </div>
      {/* â”€â”€ Pagination â”€â”€ */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 transition"
          >
            â† Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
                n === page
                  ? "border-green-500 bg-green-600 text-white"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 transition"
          >
            Next â†’
          </button>
        </div>
      )}
    </div>
  );
};
const CategoriesModule = () => (
  <CategoryManager fullPage onChanged={() => undefined} />
);

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// BANNERS MODULE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const BannersModule = ({
  onToast,
}: {
  onToast: (msg: string, type: "success" | "error") => void;
}) => {
  const [heroBanners, setHeroBanners] = useState<HeroBannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [newBanner, setNewBanner] = useState({
    eyebrow: "HEAVY-DUTY STEEL STORAGE",
    title: "",
    description: "",
    image_url: "",
    button_text: "Shop Now",
    button_link: "/category/cupboards-almirahs",
  });

  const loadBanners = useCallback(async () => {
    try {
      const r = await fetch(`${API_URL}/hero-banners/admin`, { headers: staffHeaders(), cache: "no-store" });
      const d = await r.json();
      if (!r.ok || !d.success || !Array.isArray(d.data)) throw new Error(d.message || "Failed to load banners");
      setHeroBanners(d.data);
    } catch (error) {
      onToast(error instanceof Error ? error.message : "Failed to load banners", "error");
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  useEffect(() => {
    // loadBanners performs an asynchronous fetch; state updates follow the response.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBanners();
  }, [loadBanners]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const token = localStorage.getItem("staff_token");
      const r = await fetch(`${API_ORIGIN}/api/upload/image`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Upload failed");
      setNewBanner((b) => ({ ...b, image_url: d.url }));
      onToast("Image uploaded", "success");
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.title.trim() || !newBanner.image_url.trim()) {
      onToast("Banner title and image are required", "error");
      return;
    }
    setSaving(true);
    try {
      const r = await fetch(`${API_URL}/hero-banners${editingBannerId ? `/${editingBannerId}` : ""}`, {
        method: editingBannerId ? "PUT" : "POST",
        headers: staffHeaders(true),
        body: JSON.stringify(newBanner),
      });
      const d = await r.json();
      if (!r.ok || !d.success) throw new Error(d.message);
      onToast(editingBannerId ? "Banner updated successfully" : "Banner added successfully", "success");
      setShowAdd(false);
      setEditingBannerId(null);
      setNewBanner({
        eyebrow: "HEAVY-DUTY STEEL STORAGE",
        title: "",
        description: "",
        image_url: "",
        button_text: "Shop Now",
        button_link: "/category/cupboards-almirahs",
      });
      setPreviewUrl("");
      await loadBanners();
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Failed to add banner", "error");
    } finally {
      setSaving(false);
    }
  };

  const editBanner = (banner: HeroBannerItem) => {
    setNewBanner({
      eyebrow: banner.eyebrow ?? "",
      title: banner.title,
      description: banner.description ?? "",
      image_url: banner.image_url,
      button_text: banner.button_text ?? "",
      button_link: banner.button_link ?? "/shop",
    });
    setPreviewUrl(banner.image_url);
    setEditingBannerId(banner.id);
    setShowAdd(true);
  };

  const toggleBanner = async (banner: HeroBannerItem) => {
    try {
      const response = await fetch(`${API_URL}/hero-banners/${banner.id}`, {
        method: "PUT",
        headers: staffHeaders(true),
        body: JSON.stringify({ is_active: !banner.is_active }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to update banner");
      setHeroBanners((items) => items.map((item) => item.id === banner.id ? result.data : item));
      onToast(banner.is_active ? "Banner unpublished" : "Banner published", "success");
    } catch (error) {
      onToast(error instanceof Error ? error.message : "Failed to update banner", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      const r = await fetch(`${API_URL}/hero-banners/${id}`, {
        method: "DELETE",
        headers: staffHeaders(),
      });
      const d = await r.json();
      if (!r.ok || !d.success) throw new Error(d.message);
      onToast("Banner deleted", "success");
      await loadBanners();
    } catch {
      onToast("Failed to delete banner", "error");
    }
  };

  const inputCls =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100";

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {heroBanners.length} hero banner{heroBanners.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => { setEditingBannerId(null); setShowAdd(true); }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Banner
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="border border-green-200 bg-green-50 p-5 space-y-4"
        >
          <h3 className="font-semibold text-slate-800">{editingBannerId ? "Edit Hero Banner" : "New Hero Banner"}</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Eyebrow Label
              </label>
              <input
                className={inputCls}
                value={newBanner.eyebrow}
                onChange={(e) =>
                  setNewBanner((b) => ({ ...b, eyebrow: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Title *
              </label>
              <input
                className={inputCls}
                required
                value={newBanner.title}
                onChange={(e) =>
                  setNewBanner((b) => ({ ...b, title: e.target.value }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Description
              </label>
              <textarea
                className={inputCls}
                rows={2}
                value={newBanner.description}
                onChange={(e) =>
                  setNewBanner((b) => ({ ...b, description: e.target.value }))
                }
              />
            </div>

            {/* Image upload */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Banner Image *
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {uploading ? "Uploadingâ€¦" : "Upload Image"}
                  </button>
                  <span className="text-xs text-gray-400">or</span>
                  <input
                    className={`${inputCls} flex-1`}
                    placeholder="â€¦or paste image URL"
                    value={newBanner.image_url}
                    onChange={(e) => {
                      setNewBanner((b) => ({ ...b, image_url: e.target.value }));
                      setPreviewUrl(e.target.value);
                    }}
                  />
                </div>
                {(previewUrl || newBanner.image_url) && (
                  <img
                    src={previewUrl || getMediaUrl(newBanner.image_url)}
                    alt="preview"
                    className="h-32 w-auto rounded-lg object-cover border border-gray-200"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Button Text
              </label>
              <input
                className={inputCls}
                value={newBanner.button_text}
                onChange={(e) =>
                  setNewBanner((b) => ({ ...b, button_text: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Button Link
              </label>
              <input
                className={inputCls}
                value={newBanner.button_link}
                onChange={(e) =>
                  setNewBanner((b) => ({ ...b, button_link: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {editingBannerId ? "Save Changes" : "Save Banner"}
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Banner list */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {heroBanners.map((banner) => (
          <div
            key={banner.id}
            className="relative overflow-hidden border border-gray-200 bg-white shadow-sm"
          >
            {banner.image_url && (
              <img
                src={getMediaUrl(banner.image_url)}
                alt={banner.title}
                className="h-36 w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <div className="p-4">
              {banner.eyebrow && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">
                  {banner.eyebrow}
                </p>
              )}
              <h4 className="mt-0.5 text-sm font-bold text-slate-800 line-clamp-1">
                {banner.title}
              </h4>
              {banner.description && (
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {banner.description}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <Badge
                  label={banner.is_active ? "Active" : "Inactive"}
                  color={
                    banner.is_active
                      ? statusColors.active
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }
                />
                <div className="flex items-center gap-2">
                <button onClick={() => editBanner(banner)} className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-gray-50">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button onClick={() => void toggleBanner(banner)} className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-gray-50">
                  {banner.is_active ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {heroBanners.length === 0 && !showAdd && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <ImageIcon className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm font-medium">No banners yet</p>
            <p className="text-gray-400 text-xs mt-1">
              Click "Add Banner" to create your first hero slide
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// HOMEPAGE SECTIONS MODULE (visibility toggles)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const sectionKeys = [
  "featured_products",
  "best_sellers",
  "new_arrivals",
  "categories",
];

const HomepageModule = ({
  onToast,
}: {
  onToast: (msg: string, type: "success" | "error") => void;
}) => {
  const [sections, setSections] = useState<WebsiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(`${API_URL}/admin`, { headers: staffHeaders() });
        const d = await r.json();
        if (d.success) {
          setSections(
            d.data.filter((item: WebsiteSetting) =>
              sectionKeys.includes(item.section_key)
            )
          );
        }
      } catch {
        onToast("Failed to load homepage sections", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [onToast]);

  const toggle = (idx: number) =>
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, is_active: !s.is_active } : s))
    );

  const save = async () => {
    setSaving(true);
    try {
      await Promise.all(
        sections.map((s) =>
          fetch(API_URL, {
            method: "PUT",
            headers: staffHeaders(true),
            body: JSON.stringify(s),
          })
        )
      );
      onToast("Homepage sections updated", "success");
    } catch {
      onToast("Failed to save sections", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );

  return (
    <div className="space-y-4 max-w-lg">
      <p className="text-sm text-gray-600">
        Toggle which sections appear on your website homepage.
      </p>
      {sections.map((s, i) => (
        <div
          key={s.section_key}
          className="flex items-center justify-between border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div>
            <p className="text-sm font-semibold text-slate-800 capitalize">
              {s.section_key.replace(/_/g, " ")}
            </p>
            {s.heading && (
              <p className="text-xs text-gray-500 mt-0.5">{s.heading}</p>
            )}
          </div>
          <button
            onClick={() => toggle(i)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              s.is_active ? "bg-green-500" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                s.is_active ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      ))}
      <button
        onClick={save}
        disabled={saving}
        className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Changes
      </button>
    </div>
  );
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// WEBSITE SETTINGS MODULE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const SettingsModule = ({
  onToast,
}: {
  onToast: (msg: string, type: "success" | "error") => void;
}) => {
  const [setting, setSetting] = useState<WebsiteSetting>({
    section_key: "homepage_hero",
    heading: "",
    description: "",
    image_url: "",
    button_text: "",
    button_link: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(`${API_URL}/admin`, { headers: staffHeaders() });
        const d = await r.json();
        if (d.success) {
          const hero = d.data.find(
            (item: WebsiteSetting) => item.section_key === "homepage_hero"
          );
          if (hero) setSetting(hero);
        }
      } catch {
        onToast("Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [onToast]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await fetch(API_URL, {
        method: "PUT",
        headers: staffHeaders(true),
        body: JSON.stringify(setting),
      });
      const d = await r.json();
      if (!r.ok || !d.success) throw new Error(d.message);
      setSetting(d.data);
      onToast("Settings saved successfully", "success");
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100";

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );

  return (
    <form onSubmit={save} className="max-w-xl space-y-5">
      <div className="border border-gray-200 bg-white p-5 space-y-4 shadow-sm">
        <h3 className="font-bold text-slate-800">Homepage Hero Section</h3>
        {[
          { label: "Heading", key: "heading" },
          { label: "Description", key: "description" },
          { label: "Image URL", key: "image_url" },
          { label: "Button Text", key: "button_text" },
          { label: "Button Link", key: "button_link" },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              {label}
            </label>
            <input
              className={inputCls}
              value={(setting as unknown as Record<string, string | boolean>)[key] as string || ""}
              onChange={(e) =>
                setSetting((s) => ({ ...s, [key]: e.target.value }))
              }
            />
          </div>
        ))}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSetting((s) => ({ ...s, is_active: !s.is_active }))}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              setting.is_active ? "bg-green-500" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                setting.is_active ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-sm text-slate-700">
            Hero section is {setting.is_active ? "visible" : "hidden"}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Settings
      </button>
    </form>
  );
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// OFFERS MODULE (placeholder â€” link to existing route)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const OffersModule = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Megaphone className="h-12 w-12 text-orange-400 mb-4" />
      <h3 className="text-base font-bold text-slate-800">Offers & Promotions</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        Manage discount campaigns, coupons, and promotional offers for your
        furniture store.
      </p>
      <button
        onClick={() => navigate("/offers-promotions")}
        className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition"
      >
        Open Offers Manager
      </button>
    </div>
  );
};


// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// COMING SOON â€” generic placeholder for modules not yet built
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const ComingSoon = ({
  label,
  description,
  icon: Icon,
  iconColor,
  bg,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  bg: string;
}) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div
      className={`mb-5 flex h-20 w-20 items-center justify-center rounded-3xl ${bg} ring-4 ring-white shadow`}
    >
      <Icon className={`h-10 w-10 ${iconColor}`} />
    </div>
    <h3 className="text-base font-bold text-slate-800">{label}</h3>
    <p className="mt-2 max-w-sm text-sm text-gray-500 leading-relaxed">
      {description}
    </p>
    <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700">
      ðŸš§ Coming Soon
    </span>
  </div>
);

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MAIN WebsiteControl PAGE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const moduleLabels: Record<Module, string> = {
  products: "Products",
  "best-seller": "Best Seller",
  blogs: "Blogs",
  marquee: "Marquee",
  banners: "Banners",
  "login-page-media": "Login Page Media",
  "find-solution-page": "Find Your Solution Page",
  "homepage-ingredient-cards": "Homepage Ingredient Cards",
  "delivery-charges": "Delivery Charges",
  // backward compat
  home: "Homepage Sections",
  categories: "Categories Master",
  offers: "Offers & Promotions",
  settings: "Website Settings",
};

const WebsiteControl = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeModule, setActiveModule] = useState<Module | null>(() =>
    searchParams.get("module") === "categories" ? "categories" : null
  );
  const selectModule = (module: Module | null) => {
    setActiveModule(module);
    setSearchParams(module ? { module } : {});
  };
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = useCallback(
    (msg: string, type: "success" | "error") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 4000);
    },
    []
  );

  const renderModule = () => {
    switch (activeModule) {
      case "products":
        return <ProductsModule onToast={showToast} />;
      case "banners":
        return <BannersModule onToast={showToast} />;
      case "home":
        return <HomepageModule onToast={showToast} />;
      case "settings":
        return <SettingsModule onToast={showToast} />;
      case "categories":
        return <CategoriesModule />;
      case "offers":
        return <OffersModule />;
      // â”€â”€ New tiles (Coming Soon) â”€â”€
      case "best-seller":
        return (
          <ComingSoon
            label="Best Seller"
            description="Highlight top-selling products on your homepage to drive sales."
            icon={Flame}
            iconColor="text-orange-500"
            bg="bg-orange-50"
          />
        );
      case "blogs":
        return (
          <ComingSoon
            label="Blogs"
            description="Create, edit, and publish blog articles for your store."
            icon={BookOpen}
            iconColor="text-indigo-600"
            bg="bg-indigo-50"
          />
        );
      case "marquee":
        return (
          <ComingSoon
            label="Marquee"
            description="Edit the scrolling announcement text shown at the top of the website."
            icon={Megaphone}
            iconColor="text-yellow-600"
            bg="bg-yellow-50"
          />
        );
      case "login-page-media":
        return (
          <ComingSoon
            label="Login Page Media"
            description="Set the hero image or video shown on the login/register page."
            icon={LogIn}
            iconColor="text-sky-600"
            bg="bg-sky-50"
          />
        );
      case "find-solution-page":
        return (
          <ComingSoon
            label="Find Your Solution Page"
            description="Manage content and filters for the product solution finder page."
            icon={Search}
            iconColor="text-teal-600"
            bg="bg-teal-50"
          />
        );
      case "homepage-ingredient-cards":
        return (
          <ComingSoon
            label="Homepage Ingredient Cards"
            description="Edit the feature cards displayed in the ingredient/USP section of the homepage."
            icon={Leaf}
            iconColor="text-lime-600"
            bg="bg-lime-50"
          />
        );
      case "delivery-charges":
        return (
          <ComingSoon
            label="Delivery Charges"
            description="Set delivery fees and free-shipping thresholds by location or order value."
            icon={Truck}
            iconColor="text-amber-600"
            bg="bg-amber-50"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-full">
      {/* Page header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          {activeModule && (
            <button
              onClick={() => selectModule(null)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Globe className="h-3.5 w-3.5" />
              <span
                className={`cursor-pointer hover:text-green-600 ${
                  !activeModule ? "font-semibold text-gray-700" : ""
                }`}
                onClick={() => selectModule(null)}
              >
                Website Control
              </span>
              {activeModule && (
                <>
                  <span>/</span>
                  <span className="font-semibold text-gray-700">
                    {moduleLabels[activeModule]}
                  </span>
                </>
              )}
            </div>
            <h1 className="mt-0.5 text-lg font-bold text-slate-900">
              {activeModule ? moduleLabels[activeModule] : "Website Control"}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!activeModule ? (
          /* â”€â”€ CMS MODULE GRID â”€â”€ */
          <div>
            <p className="mb-6 text-sm text-gray-500">
              Select a section below to manage your website content.
            </p>
            <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {CMS_MODULES.map((mod) => {
                const Icon = mod.icon;
                return (
                  <button
                    key={mod.id}
                    onClick={() => selectModule(mod.id)}
                    className="group flex h-full min-h-60 flex-col items-center justify-center gap-4 border border-gray-200 bg-white p-8 text-center shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-200 active:scale-[0.98]"
                  >
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl ${mod.bg} ring-2 ring-white shadow-sm group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className={`h-8 w-8 ${mod.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-800">
                        {mod.label}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* â”€â”€ ACTIVE MODULE â”€â”€ */
          <div>{renderModule()}</div>
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default WebsiteControl;
