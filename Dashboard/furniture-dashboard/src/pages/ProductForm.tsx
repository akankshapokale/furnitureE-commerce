import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ExternalLink,
  ImageOff,
  Loader2,
  Plus,
  Save,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  apiError,
  API_ORIGIN,
  createProduct,
  deleteProduct,
  getCategories,
  getMediaUrl,
  getProduct,
  getProducts,
  getSubCategories,
  updateProduct,
  type Category,
  type InfoSection,
  type ProductPayload,
  type ProductRecord,
  type SubCategory,
} from "../services/api";
import ReviewsManager from "../components/products/ReviewsManager";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { discountPercent, formatINR, slugify, stockState } from "../components/products/helpers";

interface ImageRow {
  image_url: string;
  alt_text: string;
  is_primary: boolean;
}

interface VariantRow {
  variant_name: string;
  sku: string;
  price: string;
  stock_quantity: string;
  attributes: string; // "Color: Grey, Size: King"
  is_active: boolean;
}

interface SpecRow {
  label: string;
  value: string;
}

interface FormState {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  category_id: string;
  sub_category_id: string;
  price: string;
  discount_price: string;
  sku: string;
  stock_quantity: string;
  status: string;
  is_featured: boolean;
  badge: string;
  catalog_rating: string;
  catalog_rating_count: string;
  images: ImageRow[];
  variants: VariantRow[];
  specifications: SpecRow[];
  highlights: string[];
  info_sections: InfoSection[];
  related_product_ids: number[];
}

const EMPTY: FormState = {
  name: "",
  slug: "",
  short_description: "",
  description: "",
  category_id: "",
  sub_category_id: "",
  price: "",
  discount_price: "",
  sku: "",
  stock_quantity: "0",
  status: "draft",
  is_featured: false,
  badge: "",
  catalog_rating: "",
  catalog_rating_count: "0",
  images: [],
  variants: [],
  specifications: [],
  highlights: [],
  info_sections: [],
  related_product_ids: [],
};

const INFO_SUGGESTIONS = ["Delivery & Assembly", "Care Instructions", "Warranty", "Returns & Exchanges"];

const SPEC_SUGGESTIONS = ["Material", "Dimensions", "Color", "Weight", "Warranty", "Seating capacity"];

const parseAttributes = (value: string) => {
  const result: Record<string, string> = {};

  value.split(",").forEach((part) => {
    const [key, ...rest] = part.split(":");
    const val = rest.join(":").trim();
    if (key.trim() && val) result[key.trim()] = val;
  });

  return result;
};

const formatAttributes = (attributes: Record<string, string> | null | undefined) =>
  Object.entries(attributes || {})
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");

const field =
  "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-100";

const Card = ({ title, hint, id, tab, activeTab, drawer, children }: { title: string; hint?: string; id?: string; tab?: string; activeTab?: string; drawer?: boolean; children: ReactNode }) => (
  <section id={id} hidden={drawer && tab !== activeTab} className="scroll-mt-32 border-b border-gray-200 py-4 first:pt-0 last:border-b-0 sm:py-5">
    <h2 className="text-sm font-bold text-slate-900">{title}</h2>
    {hint && <p className="mt-1 text-xs leading-5 text-slate-500">{hint}</p>}
    <div className="mt-4 space-y-3.5">{children}</div>
  </section>
);

const Label = ({ children, htmlFor, optional }: { children: ReactNode; htmlFor?: string; optional?: boolean }) => (
  <label htmlFor={htmlFor} className="mb-1 block text-xs font-semibold text-slate-600">
    {children}
    {optional && <span className="ml-1 font-normal text-slate-400">(optional)</span>}
  </label>
);

const EDIT_TABS = [
  { id: "basic-information", label: "Basic Info" },
  { id: "website-preview", label: "Card View" },
  { id: "pricing", label: "Pricing" },
  { id: "images", label: "Images" },
  { id: "story", label: "Story" },
  { id: "reviews", label: "Reviews" },
] as const;

const ProductForm = ({ drawer = false }: { drawer?: boolean }) => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [saved, setSaved] = useState<FormState>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [allProducts, setAllProducts] = useState<ProductRecord[]>([]);
  const [similarPick, setSimilarPick] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const saveLock = useRef(false);
  const [ratingError, setRatingError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof EDIT_TABS)[number]["id"]>("basic-information");
  const [imageUrl, setImageUrl] = useState("");
  const [hoverImageUrl, setHoverImageUrl] = useState("");
  const [uploadTarget, setUploadTarget] = useState<"primary" | "hover">("primary");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dimensionImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;

    const loadReferenceData = async () => {
      try {
        const [c, s] = await Promise.all([getCategories(), getSubCategories()]);
        if (cancelled) return;
        setCategories(c.data.data || []);
        setSubCategories(s.data.data || []);
      } catch (err) {
        if (!cancelled) setError(apiError(err, "Failed to load product categories"));
      }
    };

    const loadProductList = async () => {
      if (drawer) return;
      try {
        const response = await getProducts();
        if (!cancelled) setAllProducts(response.data.data || []);
      } catch (err) {
        if (!cancelled) setError(apiError(err, "Failed to load products"));
      }
    };

    const loadProduct = async () => {
      if (isNew) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await getProduct(id!);
        if (cancelled) return;
        const p = data.data;

        const loaded: FormState = {
          name: p.name,
          slug: p.slug,
          short_description: p.short_description ?? p.description ?? "",
          description: p.description ?? "",
          category_id: String(p.category_id),
          sub_category_id: p.sub_category_id ? String(p.sub_category_id) : "",
          price: String(Number(p.price)),
          discount_price: p.discount_price ? String(Number(p.discount_price)) : "",
          sku: p.sku ?? "",
          stock_quantity: String(p.stock_quantity),
          status: p.status,
          is_featured: p.is_featured,
          badge: p.badge ?? "",
          catalog_rating: p.catalog_rating == null ? "" : String(Number(p.catalog_rating)),
          catalog_rating_count: String(p.catalog_rating_count ?? 0),
          images: (p.images || []).map((image: ImageRow) => ({
            image_url: image.image_url,
            alt_text: image.alt_text ?? "",
            is_primary: image.is_primary,
          })),
          variants: (p.variants || []).map(
            (v: { variant_name: string; sku: string | null; price: number | null; stock_quantity: number; attributes: Record<string, string>; is_active: boolean }) => ({
              variant_name: v.variant_name,
              sku: v.sku ?? "",
              price: v.price !== null && v.price !== undefined ? String(Number(v.price)) : "",
              stock_quantity: String(v.stock_quantity),
              attributes: formatAttributes(v.attributes),
              is_active: v.is_active,
            })
          ),
          specifications: p.specifications || [],
          highlights: p.highlights || [],
          info_sections: p.info_sections || [],
          related_product_ids: p.related_product_ids || [],
        };

        const loadedPrimary = loaded.images.find((image) => image.is_primary) ?? loaded.images[0];
        const loadedHover = loaded.images.find((image) => image !== loadedPrimary && !/dimension|measurement|size\s*chart/i.test(image.alt_text));
        setHoverImageUrl(loadedHover?.image_url ?? "");
        setForm(loaded);
        setSaved(loaded);
      } catch (err) {
        if (!cancelled) setError(apiError(err, "Failed to load product"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadReferenceData();
    void loadProductList();
    void loadProduct();

    return () => { cancelled = true; };
  }, [id, isNew, drawer]);

  // The full product list is only needed in the Similar products editor.
  // Load it when that section opens so editing a product card stays responsive.
  useEffect(() => {
    if (activeTab !== "story" || allProducts.length > 0) return;

    let cancelled = false;
    getProducts()
      .then((response) => {
        if (!cancelled) setAllProducts(response.data.data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(apiError(err, "Failed to load products"));
      });

    return () => { cancelled = true; };
  }, [activeTab, allProducts.length]);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(saved), [form, saved]);

  useEffect(() => {
    if (!drawer) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [drawer]);

  // Warn before closing the tab with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setNotice("");
  };

  const setName = (name: string) => {
    setForm((current) => ({
      ...current,
      name,
      slug: name === current.name ? current.slug : slugify(name),
    }));
  };

  // ---- images
  const addImage = () => {
    const url = imageUrl.trim();
    if (!url) return;

    if (!/^https?:\/\//i.test(url) && !url.startsWith("/")) {
      setError("Image address must start with http:// or https://");
      return;
    }

    setError("");
    set("images", [
      ...form.images,
      { image_url: url, alt_text: form.name, is_primary: form.images.length === 0 },
    ]);
    setImageUrl("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isDimensionsImage = e.currentTarget.dataset.imageKind === "dimensions";

    const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!ALLOWED.includes(file.type)) {
      setError("Only JPG, PNG, and WebP images are allowed.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be smaller than 8 MB.");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const token = localStorage.getItem("staff_token");
      const response = await fetch(`${API_ORIGIN}/api/upload/image`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Upload failed");
      const image = {
        image_url: data.url,
        alt_text: isDimensionsImage ? "Product Dimensions" : form.name || file.name,
        is_primary: !isDimensionsImage && (uploadTarget === "primary" || form.images.length === 0),
      };
      const existingDimensionsIndex = form.images.findIndex((item) => /dimension|measurement|size\s*chart/i.test(item.alt_text));
      const uploadedImages = isDimensionsImage && existingDimensionsIndex >= 0
        ? form.images.map((item, index) => index === existingDimensionsIndex ? image : item)
        : [...form.images, image];
      set("images", uploadTarget === "primary" && !isDimensionsImage
        ? uploadedImages.map((item) => ({ ...item, is_primary: item.image_url === data.url }))
        : uploadedImages);
      if (uploadTarget === "hover" && !isDimensionsImage) setHoverImageUrl(data.url);
      setNotice("Image uploaded successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
      // reset so same file can be re-selected
      const input = isDimensionsImage ? dimensionImageInputRef.current : fileInputRef.current;
      if (input) input.value = "";
    }
  };

  const makePrimary = (index: number) =>
    set("images", form.images.map((image, i) => ({ ...image, is_primary: i === index })));

  const chooseHoverImage = (url: string) => {
    setHoverImageUrl(url);
    setNotice("");
  };

  const removeImage = (index: number) => {
    const next = form.images.filter((_, i) => i !== index);
    if (next.length > 0 && !next.some((image) => image.is_primary)) next[0].is_primary = true;
    set("images", next);
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= form.images.length) return;

    const next = [...form.images];
    [next[index], next[target]] = [next[target], next[index]];
    set("images", next);
  };

  // ---- variants / specs
  const updateVariant = (index: number, patch: Partial<VariantRow>) =>
    set("variants", form.variants.map((v, i) => (i === index ? { ...v, ...patch } : v)));

  const updateSpec = (index: number, patch: Partial<SpecRow>) =>
    set("specifications", form.specifications.map((s, i) => (i === index ? { ...s, ...patch } : s)));

  const addInfo = (title = "") =>
    set("info_sections", [...form.info_sections, { title, content: "" }]);

  const updateInfo = (index: number, patch: Partial<InfoSection>) =>
    set("info_sections", form.info_sections.map((section, i) => (i === index ? { ...section, ...patch } : section)));

  const moveSimilar = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= form.related_product_ids.length) return;

    const next = [...form.related_product_ids];
    [next[index], next[target]] = [next[target], next[index]];
    set("related_product_ids", next);
  };

  const addSpec = (label = "") => set("specifications", [...form.specifications, { label, value: "" }]);

  // ---- derived
  const off = discountPercent(form.price, form.discount_price);
  const state = stockState(form.stock_quantity);
  const availableSubs = subCategories.filter((sub) => String(sub.category_id) === form.category_id);
  const primaryImage = form.images.find((image) => image.is_primary) ?? form.images[0];
  const categoryName = categories.find((c) => String(c.id) === form.category_id)?.name;

  const validate = () => {
    const price = Number(form.price);
    const selling = form.discount_price === "" ? null : Number(form.discount_price);

    if (!form.name.trim()) return "Product name is required";
    if (!form.category_id) return "Please choose a category";
    if (form.price === "" || Number.isNaN(price) || price < 0) return "Enter a valid regular price";
    if (selling !== null && (Number.isNaN(selling) || selling < 0)) return "Selling price is not valid";
    if (selling !== null && selling > price) return "Selling price cannot be higher than the regular price";

    if (form.catalog_rating !== "") {
      const rating = Number(form.catalog_rating);
      if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
        setRatingError("Enter a rating from 1 to 5.");
        return "Please correct the rating value.";
      }
    }
    setRatingError("");

    const stock = Number(form.stock_quantity);
    if (!Number.isInteger(stock) || stock < 0) return "Stock must be a whole number, 0 or more";

    for (const variant of form.variants) {
      if (variant.variant_name.trim() === "") return "Every variant needs a name (or remove the empty row)";
    }

    return "";
  };

  const save = async () => {
    if (saveLock.current) return;
    const problem = validate();
    if (problem) {
      setError(problem);
      setNotice("");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload: ProductPayload = {
      category_id: form.category_id,
      sub_category_id: form.sub_category_id || null,
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      short_description: form.short_description,
      description: form.description,
      price: form.price,
      discount_price: form.discount_price === "" ? null : form.discount_price,
      sku: form.sku,
      stock_quantity: form.stock_quantity,
      status: form.status,
      is_featured: form.is_featured,
      badge: form.badge,
      catalog_rating: form.catalog_rating === "" ? null : form.catalog_rating,
      catalog_rating_count: form.catalog_rating_count,
      specifications: form.specifications.filter((s) => s.label.trim() && s.value.trim()),
      highlights: form.highlights.map((h) => h.trim()).filter(Boolean),
      info_sections: form.info_sections.filter((section) => section.title.trim() && section.content.trim()),
      related_product_ids: form.related_product_ids,
      images: form.images.map((image) => ({ ...image, alt_text: image.alt_text || null })),
      variants: form.variants.map((v) => ({
        variant_name: v.variant_name,
        sku: v.sku || null,
        price: v.price === "" ? null : v.price,
        stock_quantity: v.stock_quantity === "" ? 0 : v.stock_quantity,
        attributes: parseAttributes(v.attributes),
        is_active: v.is_active,
      })),
    };

    try {
      saveLock.current = true;
      setSaving(true);
      setError("");
      setNotice("");

      if (isNew) {
        const { data } = await createProduct(payload);
        const createdId = data?.data?.id;
        if (data?.success === false || createdId === undefined || createdId === null || createdId === "") {
          throw new Error(data?.message || "Product was not created. The server did not confirm the new product.");
        }
        navigate("/products", { replace: true, state: { notice: "Product created successfully" } });
      } else {
        await updateProduct(id!, payload);
        setSaved(form);
        setNotice("Changes saved");
      }
    } catch (err) {
      setError(apiError(err, "Failed to save product"));
      setNotice("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      const response = await deleteProduct(Number(id));
      navigate("/products", { replace: true, state: { notice: response.data.message } });
    } catch (err) {
      setError(apiError(err, "Failed to delete product"));
    }
  };

  const back = () => {
    if (dirty && !window.confirm("You have unsaved changes. Leave without saving?")) return;
    if (drawer) {
      navigate(-1);
      return;
    }
    navigate("/products");
  };

  const selectTab = (tabId: (typeof EDIT_TABS)[number]["id"]) => {
    setActiveTab(tabId);
  };

  if (loading) {
    if (!drawer) return <p className="py-32 text-center text-sm text-slate-400">Loading product…</p>;

    return (
      <div className="fixed inset-0 z-[100] flex justify-end">
        <button type="button" aria-label="Close product editor" onClick={back} className="absolute inset-0 bg-slate-900/30" />
        <div className="relative flex h-full w-full max-w-[620px] flex-col items-center justify-center bg-white shadow-2xl">
          <Loader2 size={24} className="animate-spin text-green-700" />
          <p className="mt-3 text-sm text-slate-500">Loading product…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={drawer ? "fixed inset-0 z-[100] flex justify-end" : "min-h-screen min-w-0 bg-white"}>
      {confirmDelete && <ConfirmDialog title="Delete product?" message={`Delete "${form.name}"? Products linked to existing records will be archived to preserve those records.`} onCancel={() => setConfirmDelete(false)} onConfirm={() => { setConfirmDelete(false); void remove(); }} />}
      {drawer && <button type="button" aria-label="Close product editor" onClick={back} className="absolute inset-0 bg-slate-900/30" />}
      <div className={drawer ? "relative flex h-full w-full max-w-[620px] flex-col bg-white shadow-2xl" : "min-h-screen min-w-0"}>
      <div className={drawer ? "min-h-0 flex-1 overflow-y-auto" : "min-w-0"}>
      <div className="min-w-0 space-y-4 p-4 sm:p-5 lg:p-6">

        {/* Header */}
        <div className={drawer ? "sticky top-0 z-20 -mx-4 -mt-4 border-b border-gray-200 bg-white px-4 pt-4 sm:-mx-6 sm:-mt-6 sm:px-6 sm:pt-6" : ""}>
          <button
            type="button"
            onClick={back}
            className={`${drawer ? "hidden" : ""} inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900`}
          >
            <ArrowLeft size={16} /> Back to products
          </button>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                {isNew ? "Add product" : drawer ? `Edit: ${form.name || "Product"}` : form.name || "Edit product"}
              </h1>
              {!isNew && <p className="mt-1 text-xs text-slate-400">Product #{id}</p>}
            </div>
            {!isNew && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-2 self-start rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 size={15} /> Delete
              </button>
            )}
            {drawer && <button type="button" onClick={back} aria-label="Close editor" className="rounded-lg border border-gray-200 p-2 text-slate-500 hover:bg-slate-50"><X size={17} /></button>}
          </div>
        </div>

        {drawer && (
          <nav className="sticky top-[118px] z-10 -mx-4 flex overflow-x-auto border-t border-gray-100 bg-white sm:-mx-6" aria-label="Product sections">
            {EDIT_TABS.map((tab) => (
              <button key={tab.id} type="button" onClick={() => selectTab(tab.id)} className={`shrink-0 border-b-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${activeTab === tab.id ? "border-green-700 text-green-800" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
                {tab.label}
              </button>
            ))}
          </nav>
        )}

        {notice && <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{notice}</div>}
        {error && (
          <div role="alert" aria-live="assertive" className="fixed right-4 top-4 z-[220] flex max-w-[min(92vw,28rem)] items-start justify-between gap-3 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-700 shadow-lg">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} aria-label="Dismiss"><X size={16} /></button>
          </div>
        )}

        <div className={`grid min-w-0 grid-cols-1 gap-5 ${drawer ? "" : "xl:grid-cols-[minmax(0,1fr)_300px]"}`}>

          {/* ---------- Main column ---------- */}
          <div className="min-w-0 space-y-2">

            <Card id="basic-information" tab="basic-information" activeTab={activeTab} drawer={drawer} title="Basic information">
              <div>
                <Label htmlFor="name">Product name</Label>
                <input id="name" value={form.name} onChange={(e) => setName(e.target.value)} className={field} placeholder="e.g. Luna 3-Seater Sofa" />
              </div>

              <div>
                <Label htmlFor="short" optional>Description</Label>
                <textarea id="short" rows={8} value={form.description} onChange={(e) => set("description", e.target.value)} className={`${field} min-h-52 resize-y leading-6`} placeholder="Describe the product in detail (optional)" />
              </div>

              <div>
                <Label htmlFor="badge" optional>Product Badge</Label>
                <input id="badge" value={form.badge} onChange={(e) => set("badge", e.target.value)} maxLength={80} className={field} placeholder="e.g. Bestseller" />
              </div>

            </Card>

            <Card id="images" tab="images" activeTab={activeTab} drawer={drawer} title="Images" hint="Set an image alt text to Product Dimensions to show it as the product dimension diagram. The primary image is shown on product cards.">
              {form.images.length === 0 ? (
                <div className="flex flex-col items-center border border-dashed border-gray-300 py-8 text-slate-400">
                  <ImageOff size={28} />
                  <p className="mt-2 text-sm">No images yet</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {form.images.map((image, index) => (
                    <li key={`${image.image_url}-${index}`} className="flex items-center gap-3 border border-gray-100 p-3">
                      <span className="w-16 shrink-0 text-xs font-semibold text-slate-500">Image {index + 1}</span>
                      <img src={getMediaUrl(image.image_url)} alt="" className="h-16 w-16 shrink-0 rounded-lg bg-slate-100 object-cover" onError={(e) => ((e.target as HTMLImageElement).style.opacity = "0.2")} />

                      <div className="min-w-0 flex-1 space-y-1.5">
                        <p className="truncate text-xs text-slate-400">{image.image_url}</p>
                        <input
                          value={image.alt_text}
                          onChange={(e) => set("images", form.images.map((img, i) => (i === index ? { ...img, alt_text: e.target.value } : img)))}
                          placeholder="Alt text (describes the image)"
                          className={`${field} py-1.5`}
                        />
                      </div>

                      <div className="flex shrink-0 items-center gap-0.5">
                        <button type="button" onClick={() => makePrimary(index)} className={`rounded-lg p-2 ${image.is_primary ? "text-amber-500" : "text-slate-300 hover:text-amber-500"}`} aria-label="Make primary" title="Primary image">
                          <Star size={16} fill={image.is_primary ? "currentColor" : "none"} />
                        </button>
                        <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-30" aria-label="Move up"><ArrowUp size={15} /></button>
                        <button type="button" onClick={() => moveImage(index, 1)} disabled={index === form.images.length - 1} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-30" aria-label="Move down"><ArrowDown size={15} /></button>
                        <button type="button" onClick={() => removeImage(index)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove image"><Trash2 size={15} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Upload from computer */}
              <div className="flex flex-col gap-3 border border-dashed border-green-200 bg-green-50 p-4">
                <p className="text-xs font-semibold text-slate-600">Upload from computer</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 self-start rounded-lg border border-green-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-green-50 disabled:opacity-50 transition"
                >
                  {uploading ? (
                    <><Loader2 size={16} className="animate-spin" /> Uploading…</>
                  ) : (
                    <><Upload size={16} /> Choose Image File</>
                  )}
                </button>
                <p className="text-[11px] text-slate-400">Accepts JPG, PNG, WebP · Max 8 MB</p>
              </div>

              {/* OR paste URL */}
              <div className="flex gap-2">
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addImage();
                    }
                  }}
                  placeholder="…or paste https:// image URL"
                  className={field}
                />
                <button type="button" onClick={addImage} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
                  <Plus size={16} /> Add
                </button>
              </div>
            </Card>

            <section id="pricing" hidden={drawer && activeTab !== "pricing"} className="scroll-mt-32 border border-gray-200 bg-white p-4 sm:p-5">
              <div className="border-b border-gray-200 pb-3">
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-green-800">Pricing</h2>
                <p className="mt-1 text-xs text-slate-500">Set product pricing and availability. Offers and promotions are managed separately.</p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <Label htmlFor="selling">Selling price (₹)</Label>
                  <input id="selling" type="text" inputMode="numeric" value={form.discount_price} onChange={(e) => set("discount_price", e.target.value.replace(/\D/g, ""))} className={field} placeholder="24999" />
                </div>
                <div>
                  <Label htmlFor="price">Original price (₹)</Label>
                  <input id="price" type="text" inputMode="numeric" value={form.price} onChange={(e) => set("price", e.target.value.replace(/\D/g, ""))} className={field} placeholder="29999" />
                </div>
                <div>
                  <Label htmlFor="stock">Available stock</Label>
                  <input id="stock" type="text" inputMode="numeric" value={form.stock_quantity} onChange={(e) => set("stock_quantity", e.target.value.replace(/\D/g, ""))} className={field} />
                </div>
                <div>
                  <Label htmlFor="discount-rate">Discount %</Label>
                  <input id="discount-rate" type="text" inputMode="numeric" value={off} onChange={(e) => {
                    const rate = e.target.value.replace(/\D/g, "");
                    if (rate === "") { set("discount_price", ""); return; }
                    const percentage = Math.min(99, Number(rate));
                    const original = Number(form.price);
                    if (original > 0) set("discount_price", String(Math.round(original * (100 - percentage) / 100)));
                  }} className={field} />
                </div>
              </div>

              <p className={`mt-3 text-xs font-medium ${state === "in" ? "text-green-700" : state === "low" ? "text-amber-600" : "text-red-600"}`}>
                {state === "in" ? "In stock" : state === "low" ? "Low stock" : "Out of stock: customers cannot buy this"}
              </p>


              <div className="mt-5 border-t border-gray-200 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-green-800">Website rating</h3>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="rating" optional>Rating (1-5)</Label>
                    <input id="rating" type="text" inputMode="decimal" aria-invalid={Boolean(ratingError)} value={form.catalog_rating} onChange={(e) => {
                      const value = e.target.value;
                      set("catalog_rating", value);
                      setRatingError(value !== "" && (!/^\d+(\.\d+)?$/.test(value) || Number(value) < 1 || Number(value) > 5) ? "Enter a rating from 1 to 5." : "");
                    }} className={`${field} ${ratingError ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""}`} placeholder="4.8" />
                    {ratingError && <p className="mt-1 text-xs text-red-600">{ratingError}</p>}
                  </div>
                  <div>
                    <Label htmlFor="rating-count">Rating count</Label>
                    <input id="rating-count" type="text" inputMode="numeric" value={form.catalog_rating_count} onChange={(e) => set("catalog_rating_count", e.target.value.replace(/\D/g, ""))} className={field} />
                  </div>
                </div>
              </div>

            </section>

            <Card tab="pricing" activeTab={activeTab} drawer={drawer} title="Variants" hint="Use variants for options like size, colour or finish. Each can have its own SKU, price and stock.">
              {form.variants.length === 0 && <p className="text-sm text-slate-400">No variants. This product is sold as a single item.</p>}

              {form.variants.map((variant, index) => (
                <div key={index} className="border border-gray-100 p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <Label>Variant name</Label>
                      <input value={variant.variant_name} onChange={(e) => updateVariant(index, { variant_name: e.target.value })} className={field} placeholder="e.g. Grey / King" />
                    </div>
                    <div>
                      <Label optional>SKU</Label>
                      <input value={variant.sku} onChange={(e) => updateVariant(index, { sku: e.target.value })} className={field} />
                    </div>
                    <div>
                      <Label optional>Price (₹)</Label>
                      <input type="text" inputMode="numeric" value={variant.price} onChange={(e) => updateVariant(index, { price: e.target.value.replace(/\D/g, "") })} className={field} placeholder="Same as product" />
                    </div>
                    <div>
                      <Label>Stock</Label>
                      <input type="text" inputMode="numeric" value={variant.stock_quantity} onChange={(e) => updateVariant(index, { stock_quantity: e.target.value.replace(/\D/g, "") })} className={field} />
                    </div>
                  </div>

                  <div className="mt-3">
                    <Label optional>Attributes</Label>
                    <input value={variant.attributes} onChange={(e) => updateVariant(index, { attributes: e.target.value })} className={field} placeholder="Color: Grey, Size: King" />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input type="checkbox" checked={variant.is_active} onChange={(e) => updateVariant(index, { is_active: e.target.checked })} />
                      Available
                    </label>
                    <button type="button" onClick={() => set("variants", form.variants.filter((_, i) => i !== index))} className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:underline">
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => set("variants", [...form.variants, { variant_name: "", sku: "", price: "", stock_quantity: "0", attributes: "", is_active: true }])}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Plus size={16} /> Add variant
              </button>
            </Card>

            <Card id="story" tab="story" activeTab={activeTab} drawer={drawer} title="Specifications" hint="Add a Dimensions value such as 1200 x 600 x 750 mm for the left dimension panel. All specification rows appear in the right table.">
              <input
                ref={dimensionImageInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                data-image-kind="dimensions"
                onChange={handleFileUpload}
              />
              {(() => {
                const dimensionImage = form.images.find((image) => /dimension|measurement|size\s*chart/i.test(image.alt_text));
                return (
                  <div className="flex flex-col gap-3 border border-dashed border-blue-200 bg-blue-50 p-4 sm:flex-row sm:items-center">
                    {dimensionImage && <img src={getMediaUrl(dimensionImage.image_url)} alt="Dimensions diagram preview" className="h-24 w-32 object-contain bg-white" />}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700">Product dimensions image</p>
                      <p className="mt-1 text-xs text-slate-500">Upload an annotated product image. It will appear large in the Product Dimensions section.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => dimensionImageInputRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-100 disabled:opacity-50"
                    >
                      <Upload size={16} /> {dimensionImage ? "Replace image" : "Upload image"}
                    </button>
                  </div>
                );
              })()}
              {form.specifications.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <input value={spec.label} onChange={(e) => updateSpec(index, { label: e.target.value })} placeholder="Label (e.g. Material)" className={`${field} sm:max-w-[200px]`} />
                  <input value={spec.value} onChange={(e) => updateSpec(index, { value: e.target.value })} placeholder="Value (e.g. Solid sheesham wood)" className={field} />
                  <button type="button" onClick={() => set("specifications", form.specifications.filter((_, i) => i !== index))} className="shrink-0 rounded-lg p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove">
                    <X size={16} />
                  </button>
                </div>
              ))}

              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => addSpec()} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Plus size={16} /> Add specification
                </button>
                {SPEC_SUGGESTIONS.filter((label) => !form.specifications.some((s) => s.label === label)).map((label) => (
                  <button key={label} type="button" onClick={() => addSpec(label)} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200">
                    + {label}
                  </button>
                ))}
              </div>
            </Card>

            <Card tab="story" activeTab={activeTab} drawer={drawer} title="Highlights" hint="Short key features shown as a checklist next to the price.">
              {form.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={highlight}
                    onChange={(e) => set("highlights", form.highlights.map((h, i) => (i === index ? e.target.value : h)))}
                    placeholder="e.g. Solid wood frame with high-density foam"
                    className={field}
                  />
                  <button type="button" onClick={() => set("highlights", form.highlights.filter((_, i) => i !== index))} className="shrink-0 rounded-lg p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove">
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => set("highlights", [...form.highlights, ""])} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <Plus size={16} /> Add highlight
              </button>
            </Card>

            <Card tab="story" activeTab={activeTab} drawer={drawer} title="More information" hint="Expandable sections on the product page: delivery, care, warranty, returns and so on.">
              {form.info_sections.map((section, index) => (
                <div key={index} className="border border-gray-100 p-4">
                  <div className="flex gap-2">
                    <input value={section.title} onChange={(e) => updateInfo(index, { title: e.target.value })} placeholder="Section title" className={field} />
                    <button type="button" onClick={() => set("info_sections", form.info_sections.filter((_, i) => i !== index))} className="shrink-0 rounded-lg p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove section">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <textarea value={section.content} onChange={(e) => updateInfo(index, { content: e.target.value })} rows={3} placeholder="Content shown when the section is opened" className={`${field} mt-3`} />
                </div>
              ))}

              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => addInfo()} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Plus size={16} /> Add section
                </button>
                {INFO_SUGGESTIONS.filter((title) => !form.info_sections.some((section) => section.title === title)).map((title) => (
                  <button key={title} type="button" onClick={() => addInfo(title)} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200">
                    + {title}
                  </button>
                ))}
              </div>
            </Card>

            <Card tab="story" activeTab={activeTab} drawer={drawer} title="Similar products" hint="Shown under “You may also like”. Leave empty and products from the same category are suggested automatically.">
              {form.related_product_ids.length === 0 ? (
                <p className="text-sm text-slate-400">None chosen: similar products are picked automatically.</p>
              ) : (
                <ul className="space-y-2">
                  {form.related_product_ids.map((relatedId, index) => {
                    const related = allProducts.find((item) => item.id === relatedId);

                    return (
                      <li key={relatedId} className="flex items-center gap-3 border border-gray-100 p-2.5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                          {related?.image_url ? <img src={getMediaUrl(related.image_url)} alt="" className="h-full w-full object-cover" /> : <ImageOff size={16} className="text-slate-300" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900">{related?.name ?? `Product #${relatedId}`}</p>
                          <p className="text-xs text-slate-400">{related?.category_name}</p>
                        </div>
                        <button type="button" onClick={() => moveSimilar(index, -1)} disabled={index === 0} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-30" aria-label="Move up"><ArrowUp size={15} /></button>
                        <button type="button" onClick={() => moveSimilar(index, 1)} disabled={index === form.related_product_ids.length - 1} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-30" aria-label="Move down"><ArrowDown size={15} /></button>
                        <button type="button" onClick={() => set("related_product_ids", form.related_product_ids.filter((x) => x !== relatedId))} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove"><X size={15} /></button>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="flex gap-2">
                <select value={similarPick} onChange={(e) => setSimilarPick(e.target.value)} className={field}>
                  <option value="">Choose a product to add…</option>
                  {allProducts
                    .filter((item) => String(item.id) !== id && !form.related_product_ids.includes(item.id))
                    .map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
                <button
                  type="button"
                  disabled={!similarPick}
                  onClick={() => {
                    set("related_product_ids", [...form.related_product_ids, Number(similarPick)]);
                    setSimilarPick("");
                  }}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-40"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </Card>

            {!isNew && <div id="reviews" hidden={drawer && activeTab !== "reviews"} className="scroll-mt-32"><ReviewsManager productId={Number(id)} /></div>}
          </div>

          {/* ---------- Side column ---------- */}
          <aside className={`min-w-0 space-y-2 ${drawer ? "" : "xl:sticky xl:top-24 xl:self-start"}`}>

            <Card tab="basic-information" activeTab={activeTab} drawer={drawer} title="Product settings">
              <div>
                <Label htmlFor="status">Status</Label>
                <select id="status" value={form.status} onChange={(e) => set("status", e.target.value)} className={field}>
                  <option value="active">Published: visible on the website</option>
                  <option value="draft">Draft: hidden</option>
                  <option value="archived">Archived: hidden</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} />
                Feature on the home page
              </label>
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-slate-800">Category organisation</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={form.category_id}
                      onChange={(e) => setForm((current) => ({ ...current, category_id: e.target.value, sub_category_id: "" }))}
                      className={field}
                    >
                      <option value="">Select a category</option>
                      {categories.filter((c) => c.is_active || String(c.id) === form.category_id).map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="sub" optional>Sub-category</Label>
                    <select id="sub" value={form.sub_category_id} onChange={(e) => set("sub_category_id", e.target.value)} disabled={availableSubs.length === 0} className={`${field} disabled:bg-slate-50 disabled:text-slate-400`}>
                      <option value="">{availableSubs.length === 0 ? "No sub-categories" : "None"}</option>
                      {availableSubs.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.group_name ? `${sub.group_name}: ${sub.name}` : sub.name}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs text-slate-400">Add or rename categories from Website Control / Categories Master.</p>
                </div>
              </div>

            </Card>

            <Card id="website-preview" tab="website-preview" activeTab={activeTab} drawer={drawer} title="Website preview">
              <p className="text-sm text-slate-500">Controls how this product appears on storefront product cards.</p>
              <div className="grid gap-5 lg:grid-cols-2">
                {([
                  { label: "Primary image", image: primaryImage, kind: "primary" },
                  { label: "Hover image", image: form.images.find((image) => image !== primaryImage && !/dimension|measurement|size\\s*chart/i.test(image.alt_text)), kind: "hover" },
                ] as const).map(({ label, image, kind }) => (
                  <div key={kind} className="min-w-0">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
                    <button type="button" onClick={() => image ? (kind === "primary" ? makePrimary(form.images.indexOf(image)) : chooseHoverImage(image.image_url)) : (setUploadTarget(kind), fileInputRef.current?.click())} className="group flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden border border-dashed border-gray-300 bg-white text-slate-500 hover:border-green-600 hover:text-green-700">
                      {image ? <img src={getMediaUrl(image.image_url)} alt={image.alt_text || label} className="h-full w-full object-contain" /> : <><Upload size={22} /><span className="mt-2 text-[11px] font-medium uppercase tracking-wider">Upload</span></>}
                    </button>
                    <div className="mt-2 flex gap-2">
                      <input readOnly value={image?.image_url ?? ""} placeholder="Select an image below or upload" className={`${field} min-w-0 text-xs`} />
                      <button type="button" onClick={() => { setUploadTarget(kind); fileInputRef.current?.click(); }} disabled={uploading} className="shrink-0 border border-gray-200 px-3 text-xs font-semibold text-slate-600 hover:bg-gray-50 disabled:opacity-50">{uploading ? "Uploading…" : "Upload"}</button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{kind === "primary" ? "Shown by default on the card." : "Uses another product image for the card hover state."}</p>
                    {kind === "hover" && form.images.length > 1 && <select aria-label="Select hover image" value={hoverImageUrl} onChange={(event) => chooseHoverImage(event.target.value)} className={`${field} mt-2`}><option value="">Choose an image from Images</option>{form.images.filter((item) => item !== primaryImage && !/dimension|measurement|size\s*chart/i.test(item.alt_text)).map((item) => <option key={item.image_url} value={item.image_url}>{item.alt_text || item.image_url}</option>)}</select>}
                  </div>
                ))}
              </div>
              <div className="border border-gray-100 bg-slate-50 p-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Card preview</p>
                <div className="mx-auto max-w-xs overflow-hidden border border-gray-100 bg-white">
                  <div className="relative aspect-[4/3] bg-slate-100">{primaryImage ? <img src={getMediaUrl(primaryImage.image_url)} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-300"><ImageOff size={32} /></div>}{off > 0 && <span className="absolute left-3 top-3 bg-black px-2 py-1 text-[10px] font-semibold text-white">{off}% OFF</span>}</div>
                  <div className="p-4"><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{categoryName || "Category"}</p><p className="mt-1 text-sm font-semibold text-slate-900">{form.name || "Product name"}</p><p className="mt-1 text-sm"><span className="font-bold text-slate-900">{formatINR(form.discount_price || form.price)}</span>{off > 0 && <span className="ml-2 text-xs text-slate-400 line-through">{formatINR(form.price)}</span>}</p></div>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleFileUpload} />
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-slate-600">Product images</p>
                <p className="mt-1 text-xs text-slate-500">Choose an existing image above or upload one. Reorder and manage all images in the Images tab.</p>
                <div className="mt-3 flex flex-wrap gap-2">{form.images.filter((image) => !/dimension|measurement|size\s*chart/i.test(image.alt_text)).map((image, index) => <button key={`${image.image_url}-${index}`} type="button" onClick={() => makePrimary(form.images.indexOf(image))} className={`h-14 w-14 overflow-hidden border ${image === primaryImage ? "border-green-700 ring-1 ring-green-700" : "border-gray-200"}`} title={image.alt_text || "Set as primary image"}><img src={getMediaUrl(image.image_url)} alt={image.alt_text} className="h-full w-full object-cover" /></button>)}<button type="button" onClick={() => { setUploadTarget("primary"); fileInputRef.current?.click(); }} disabled={uploading} className="flex h-14 w-14 items-center justify-center border border-dashed border-gray-300 text-slate-500 hover:border-green-600 hover:text-green-700 disabled:opacity-50" aria-label="Upload product image"><Plus size={18} /></button></div>
              </div>

              {!isNew && form.status === "active" && (
                <a
                  href={`${import.meta.env.VITE_WEBSITE_URL ?? "http://localhost:5173"}/product/${id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:underline"
                >
                  View on website <ExternalLink size={14} />
                </a>
              )}
            </Card>
          </aside>
        </div>
      </div>

      {/* Sticky save bar */}
      <div className={`${drawer ? "shrink-0" : "sticky bottom-0 z-30"} border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8`}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-slate-500">
            {dirty ? <span className="font-medium text-amber-600">Unsaved changes</span> : isNew ? "Fill in the details to create the product" : "All changes saved"}
          </span>

          <div className="flex gap-3">
            <Link to="/products" onClick={(e) => { if (dirty && !window.confirm("Discard your unsaved changes?")) e.preventDefault(); }} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </Link>
            <button
              type="button"
              onClick={save}
              disabled={saving || (!isNew && !dirty)}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isNew ? "Create product" : drawer ? "Save Product" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default ProductForm;
