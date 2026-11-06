import { useState, useMemo, useEffect } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Search,
  Check,
  Star,
  X,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Palette,
  SlidersHorizontal,
  ArrowLeft,
  Eye,
  ExternalLink,
  Truck,
} from "lucide-react";

import {
  categoriesData,

  getCategoryHeadings,
  type CategoryProduct,
  type CategoryItem,
  type ColorVariant,
  type VariantChoice,
  STANDARD_STEEL_COLORS,
  CUPBOARD_STEEL_COLORS,
  getSubcategoryVariants,
  getProductColorImage,
} from "../data/categoriesData";
import { fetchProducts, type ProductListing } from "../services/catalog";
import { ProductGridSkeleton } from "../components/common/Skeleton";
import { resolveCmsImage } from "../services/media";
import LazyImage from "../components/common/LazyImage";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import "./category-detail.css";

// Helper to determine exact color variant image for THAT specific cupboard/model
const getCardColorImage = (
  product: CategoryProduct,
  color: ColorVariant | null
): string => {
  // Most catalog products do not have generated steel color variants. Keep
  // their original image when the quick view opens with its default swatch.
  if (!color || !isRecolorableProduct(product)) return product.image;
  if (color.image) return color.image;
  return getProductColorImage(product.image, color.key);
};

// Helper to determine if a product actually supports steel powder-coat finishes
const isRecolorableProduct = (product: CategoryProduct): boolean => {
  if ([706, 708].includes(product.id)) return false;
  const productText = `${product.name} ${product.image} ${product.subcategoryName}`.toLowerCase();

  // Mirror products should not have color customization
  if (productText.includes("mirror") && product.id !== 735) return false;

  return Boolean(
    (product.colors && product.colors.length > 0) ||
      (product.image &&
        product.image.includes("/images-webp/") &&
        (product.image.includes("cupboard") ||
          product.image.includes("metal-drawer") ||
          product.image.includes("library")))
  );
};

const hasBuiltInCupboardFinishes = (product: CategoryProduct) =>
  /\/images-webp\/cupboard[1-5]\.webp(?:\?.*)?$/i.test(product.image);

// These catalog photos do not have reliable color variants. Keep their
// original product and background photos unchanged instead of previewing
// generated recolors that alter the scene or misrepresent the finish.
const FIXED_FINISH_CUPBOARD_IDS = new Set([706, 708]);
const ORIGINAL_PINK_FINISH: ColorVariant = {
  key: "pink",
  name: "Original Pink",
  colorCode: "#ec4899",
  image: "/images-webp/cupboard4.webp",
};
const CLASSIC_ALMIRAH_COLORS = [
  ORIGINAL_PINK_FINISH,
  ...CUPBOARD_STEEL_COLORS.map((color) => ({
    ...color,
    image: `/images-webp/cupboard4_${color.key}.png`,
  })),
];
const getCupboardColorOptions = (product: CategoryProduct) => {
  if (FIXED_FINISH_CUPBOARD_IDS.has(product.id)) return [];
  if (product.id === 705) return CLASSIC_ALMIRAH_COLORS;
  if (product.colors?.length) return product.colors.filter((color) => color.image).slice(0, 4);
  return hasBuiltInCupboardFinishes(product) ? CUPBOARD_STEEL_COLORS : [];
};

const CMS_CATEGORY_IDS: Record<string, number> = {
  "office-furniture": 10,
  "home-furniture": 13,
  "seating-solutions": 18,
  "cupboards-almirahs": 8,
  "outdoor-furniture": 19,
  "bunk-beds": 15,
};

const HIDDEN_OFFICE_SUBCATEGORY_IDS = new Set(["height-storage"]);
const HIDDEN_OUTDOOR_SUBCATEGORY_IDS = new Set(["planter-rack"]);
const HIDDEN_OFFICE_PRODUCT_NAME_PARTS = [
  "premium front desk design view",
  "circular conference table",
  "circular modern table",
  "premium front office desk",
  "contemporary reception counter",
  "corporate reception desk",
];

const CMS_SUBCATEGORY_IDS: Record<number, string> = {
  1: "storewell", 3: "almirah", 4: "unit-cupboard", 5: "filing-cabinet",
  7: "library-cupboard", 40: "table-employee", 42: "wooden-pedestal",
  43: "boss-table", 44: "reception-table", 45: "workstation",
  46: "conference-table", 48: "metal-office-table",
  49: "metal-pedestal", 50: "metal-table", 51: "living-sofas",
  55: "chair-set", 56: "stool", 57: "executive-chair", 58: "workstation-back-chair", 102: "workstation-back-chair",
  59: "office-sofa", 60: "metal-planter", 62: "garden-chair",
  63: "steel-storage-unit", 65: "planter-stand", 66: "planter-rack",
  67: "planter-trolley-wheels", 68: "commercial-bunk-bed", 69: "home",
  70: "kids", 71: "hostel",
  76: "tv-unit", 77: "bar-unit", 78: "foldable-table", 82: "podium-table",
  79: "three-door-steel-storage", 80: "corporate-storage", 81: "side-table",
  83: "metal-table",
  84: "wooden-pedestal", 85: "wooden-pedestal", 86: "wooden-pedestal",
  90: "industrial-locker", 91: "bookcase", 92: "metal-sofa",
  93: "kitchen-unit", 94: "sofas",
  72: "low-height-storage", 75: "side-runner", 73: "full-height-storage",
};

const STOOL_FALLBACK_IMAGES: Record<number, string> = {
  204: "/images-webp/stool1.webp",
  216: "/images-webp/stool2.webp",
  217: "/images-webp/stool3.webp",
  218: "/images-webp/stool4.webp",
};

const asText = (value: unknown) => typeof value === "string" ? value : "";

const resolveCatalogImage = (value: string) => resolveCmsImage(value) ?? value;

const toCategoryProduct = (row: ProductListing): CategoryProduct => {
  const attributes = (variant: ProductListing["variants"][number]) => variant.attributes || {};
  const colors = row.variants
    .filter((variant) => asText(attributes(variant).type) === "color")
    .map((variant) => {
      const option = attributes(variant);
      return {
        key: asText(option.color_key),
        name: asText(option.color),
        colorCode: asText(option.color_code),
        image: option.image ? resolveCatalogImage(asText(option.image)) : undefined,
        badge: asText(option.badge) || undefined,
      };
    })
    .filter((color) => color.key && color.name);
  const sizes = row.variants
    .filter((variant) => asText(attributes(variant).type) === "size" && !attributes(variant).group)
    .map((variant) => ({
      label: asText(attributes(variant).label),
      price: Number(variant.price ?? row.discount_price ?? row.price),
      oldPrice: attributes(variant).old_price == null ? undefined : Number(attributes(variant).old_price),
    }))
    .filter((size) => size.label);
  const groups = new Map<string, { type: string; name: string; options: { label: string; priceDiff?: number; isDefault?: boolean }[] }>();
  row.variants.forEach((variant) => {
    const option = attributes(variant);
    const type = asText(option.type);
    if (type === "color" || (type === "size" && !option.group)) return;
    const name = asText(option.group) || type;
    const label = asText(option.label);
    if (!name || !label) return;
    const group = groups.get(name) || { type, name, options: [] };
    group.options.push({
      label,
      priceDiff: Number(option.price_diff ?? 0),
      isDefault: option.is_default === true,
    });
    groups.set(name, group);
  });
  const dimensionCmsImage = row.images.find((image) =>
    /dimension|measurement|size\s*chart/i.test(image.alt_text || ""),
  );
  const cardCmsImages = row.images.filter((image) =>
    !/dimension|measurement|size\s*chart/i.test(image.alt_text || ""),
  );
  const images = cardCmsImages.map((image) => image.image_url).filter(Boolean).map(resolveCatalogImage);
  const regularPrice = Number(row.price);
  const sellingPrice = row.discount_price == null ? regularPrice : Number(row.discount_price);
  const category = categoriesData.find((item) => CMS_CATEGORY_IDS[item.id] === row.category_id);
  const cmsSubcategoryName = (row.sub_category_name || "").trim().toLowerCase();
  const categorySubcategories = category?.subcategories.flatMap((item) => [item, ...(item.children || [])]) || [];
  const exactSubcategory = categorySubcategories.find(
    (item) => item.name.trim().toLowerCase() === cmsSubcategoryName
  );
  const subcategoryId = exactSubcategory?.id ||
    (row.sub_category_id == null ? "" : CMS_SUBCATEGORY_IDS[row.sub_category_id] || "") ||
    categorySubcategories.find((item) => {
      const name = item.name.trim().toLowerCase();
      return name.includes(cmsSubcategoryName) || cmsSubcategoryName.includes(name);
    })?.id || "";
  const subcategoryName =
    categorySubcategories.find((item) => item.id === subcategoryId)?.name ||
    row.sub_category_name ||
    "";
  const displayName = subcategoryId === "boss-chair"
    ? row.name
        .replace(/\bExecutive\s+Boss\s+Chair\b/gi, "Executive Chair")
        .replace(/\bBoss Chair\b/gi, "Executive Chair")
        .replace(/\bBoss\b/gi, "")
        .replace(/\bManager\b/gi, "Executive")
        .replace(/\s{2,}/g, " ")
        .trim()
    : row.id === 728
      ? row.name.replace(/\bcabinet\b/gi, "").replace(/\s{2,}/g, " ").trim()
    : row.name;
  const description = row.short_description || "";
  const displayDescription = subcategoryId === "boss-chair"
    ? description.replace(/\bboss\b/gi, "").replace(/\s{2,}/g, " ").trim()
    : description;

  const localItem = category?.products.find((item) => item.id === row.id);
  const orderedImages = row.id === 729 && images.length > 1
    ? [images[1], images[0], ...images.slice(2)]
    : images;
  const primaryCmsImage = cardCmsImages.find((image) => image.is_primary)?.image_url || cardCmsImages[0]?.image_url;
  const primaryImage = row.id === 729 && orderedImages.length > 0
    ? orderedImages[0]
    : primaryCmsImage
      ? resolveCatalogImage(primaryCmsImage)
      : row.image_url
        ? resolveCatalogImage(row.image_url)
        : orderedImages[0] || localItem?.image ||
        (subcategoryId === "stool"
          ? STOOL_FALLBACK_IMAGES[row.id] || "/images-webp/stool1.webp"
          : category?.id === "office-furniture"
            ? "/workstation1.jpeg"
            : "/images-webp/cupboard1.webp");

  return {
    id: row.id,
    name: displayName,
    category: row.category_name || category?.name || "Furniture",
    subcategoryId,
    subcategoryName,
    cmsSubcategoryName: row.sub_category_name?.trim() || undefined,
    price: sellingPrice,
    oldPrice: sellingPrice < regularPrice ? regularPrice : undefined,
    discount: sellingPrice < regularPrice ? Math.round((1 - sellingPrice / regularPrice) * 100) : undefined,
    image: primaryImage,
    images: orderedImages.length ? orderedImages : undefined,
    cmsDimensionImage: dimensionCmsImage ? resolveCatalogImage(dimensionCmsImage.image_url) : undefined,
    cmsHoverImage: orderedImages.find((image) => image && image !== primaryImage),
    rating: row.rating_avg == null ? localItem?.rating : Number(row.rating_avg),
    ratingCount: row.rating_count ?? localItem?.ratingCount,
    badge: row.badge || localItem?.badge || undefined,
    description: displayDescription,
    specifications: row.specifications,
    colors: colors.length ? colors : undefined,
    variants: [...groups.values()].filter((group) => group.options.length),
    sizes: sizes.length ? sizes : undefined,
  };
};


const CategoryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const subParam = searchParams.get("sub");
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Redirect Metal Furniture directly to Cupboards & Almirahs per requirement 8
  useEffect(() => {
    if (slug?.toLowerCase() === "metal-furniture" || subParam === "metal-furniture") {
      navigate("/category/cupboards-almirahs", { replace: true });
    }
  }, [slug, subParam, navigate]);

  // Find if slug directly points to a subcategory
  const matchedSubcategoryFromSlug = useMemo(() => {
    if (!slug) return null;
    const sLower = slug.toLowerCase();
    for (const cat of categoriesData) {
      const found = cat.subcategories.find(
        (s) =>
          s.id.toLowerCase() === sLower ||
          s.path.toLowerCase().includes(`sub=${sLower}`)
      );
      if (found) return { category: cat, subcategory: found };
    }
    return null;
  }, [slug]);

  // Find matching category; if slug matches a subcategory directly, map to parent
  const currentCategory: CategoryItem = useMemo(() => {
    if (!slug) return categoriesData[6]; // default to Cupboards & Almirahs

    // 1. Direct match by category id
    const exact = categoriesData.find(
      (c) => c.id.toLowerCase() === slug.toLowerCase()
    );
    if (exact) return exact;

    // 2. Subcategory slug match
    if (matchedSubcategoryFromSlug) {
      return matchedSubcategoryFromSlug.category;
    }

    // Default to cupboards-almirahs
    return (
      categoriesData.find((c) => c.id === "cupboards-almirahs") ||
      categoriesData[0]
    );
  }, [slug, matchedSubcategoryFromSlug]);

  const [activeSubcategory, setActiveSubcategory] = useState<string>(
    ["wooden-pedestal-3-drawer", "wooden-pedestal-2-drawer", "wooden-pedestal-1-drawer"].includes(subParam || "")
      ? "wooden-pedestal"
      : subParam || matchedSubcategoryFromSlug?.subcategory.id || "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [subcategoryMenuOpen, setSubcategoryMenuOpen] = useState(false);
  const [expandedSubcategoryGroup, setExpandedSubcategoryGroup] = useState<string | null>(null);
  const [sortBy] = useState("featured");
  const [catalogRows, setCatalogRows] = useState<ProductListing[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(false);
  const [catalogReload, setCatalogReload] = useState(0);

  useEffect(() => {
    // Clear stale data immediately so old products don't flash while loading
    setCatalogRows([]);
    setCatalogLoading(true);
    setCatalogError(false);
    let active = true;
    fetchProducts()
      .then((rows) => {
        if (!active) return;
        setCatalogRows(rows);
        setCatalogError(false);
      })
      .catch(() => {
        if (active) setCatalogError(true);
      })
      .finally(() => {
        if (active) setCatalogLoading(false);
      });
    return () => { active = false; };
  }, [catalogReload, slug]);

  const categoryProducts = useMemo(() => {
    const categoryId = CMS_CATEGORY_IDS[currentCategory.id];
    const liveProducts = catalogRows
      .filter((row) =>
        row.category_id === categoryId &&
        !(currentCategory.id === "office-furniture" && HIDDEN_OFFICE_PRODUCT_NAME_PARTS.some((name) => row.name.trim().toLowerCase().includes(name))) &&
        !(currentCategory.id === "office-furniture" && row.sub_category_id === 72 && !row.image_url && !row.images.some((image) => image.image_url)) &&
        !(currentCategory.id === "office-furniture" && row.id === 125) &&
        !(currentCategory.id === "seating-solutions" && [204, 213, 214, 216, 217, 218].includes(row.id)) &&
        !(currentCategory.id === "seating-solutions" && row.sub_category_id === 59) &&
        !(currentCategory.id === "outdoor-furniture" && row.id === 515)
      )
      .map(toCategoryProduct);
    const storageCabinetCards = liveProducts.flatMap((product) => {
      if (
        currentCategory.id !== "office-furniture" ||
        product.id !== 728 ||
        product.subcategoryId !== "low-height-storage" ||
        (product.images?.length || 0) < 3
      ) {
        return [product];
      }

      // Omit photo 2 and show photos 1 and 3 as individual cards.
      return [product.images![0], product.images![2]].map((image) => ({
        ...product,
        image,
        images: [image],
      }));
    });
    return catalogError ? currentCategory.products : storageCabinetCards;
  }, [catalogRows, currentCategory, catalogError]);

  const categorySubcategoryOptions = useMemo(() => {
    const customHeadingIds = new Set(getCategoryHeadings(currentCategory).map((heading) => heading.id));
    const seatingBossChair = currentCategory.id === "seating-solutions"
      ? currentCategory.subcategories.find((subcategory) => subcategory.id === "boss-chair")
      : undefined;
    const nestedSeatingIds = new Set(seatingBossChair?.children?.map((child) => child.id) || []);
    const subcategories = currentCategory.subcategories.flatMap((subcategory) => [
      subcategory,
      ...(currentCategory.id === "seating-solutions" && subcategory.id === "boss-chair" ? [] : subcategory.children || []),
    ]);
    const distinct = new Map<string, { id: string; name: string; group?: string; children?: { id: string; name: string }[] }>();

    subcategories.forEach((subcategory) => {
      if (currentCategory.id === "office-furniture" && HIDDEN_OFFICE_SUBCATEGORY_IDS.has(subcategory.id)) return;
      if (currentCategory.id === "outdoor-furniture" && HIDDEN_OUTDOOR_SUBCATEGORY_IDS.has(subcategory.id)) return;
      if (currentCategory.id !== "bunk-beds" && customHeadingIds.has(subcategory.id)) return;
      if (nestedSeatingIds.has(subcategory.id)) return;
      const products = categoryProducts.filter((product) => product.subcategoryId === subcategory.id);
      const cmsName = products.find((product) => product.cmsSubcategoryName)?.cmsSubcategoryName;
      const nestedChildren = currentCategory.id === "seating-solutions" && subcategory.id === "boss-chair"
        ? (subcategory.children || []).map((child) => {
            const childProducts = categoryProducts.filter((product) => product.subcategoryId === child.id);
            return {
              id: child.id,
              name: child.id === "executive-chair" ? "Executive Chair" : (childProducts.find((product) => product.cmsSubcategoryName)?.cmsSubcategoryName || child.name),
            };
          })
        : undefined;
      distinct.set(subcategory.id, {
        id: subcategory.id,
        name: currentCategory.id === "office-furniture" && subcategory.id === "wooden-pedestal"
          ? "Pedestal"
          : currentCategory.id === "office-furniture" && subcategory.id === "full-height-storage"
            ? "File Cabinet"
            : cmsName || subcategory.name,
        group: subcategory.group,
        children: nestedChildren,
      });
    });

    categoryProducts.forEach((product) => {
      if (currentCategory.id === "office-furniture" && HIDDEN_OFFICE_SUBCATEGORY_IDS.has(product.subcategoryId)) return;
      if (currentCategory.id === "outdoor-furniture" && HIDDEN_OUTDOOR_SUBCATEGORY_IDS.has(product.subcategoryId)) return;
      if (!product.subcategoryId || currentCategory.id !== "bunk-beds" && customHeadingIds.has(product.subcategoryId) || nestedSeatingIds.has(product.subcategoryId) || distinct.has(product.subcategoryId)) return;
      distinct.set(product.subcategoryId, {
        id: product.subcategoryId,
        name: product.cmsSubcategoryName || product.subcategoryName || product.subcategoryId,
        group: currentCategory.subcategories.find((subcategory) => subcategory.id === product.subcategoryId)?.group,
      });
    });

    return Array.from(distinct.values());
  }, [categoryProducts, currentCategory]);

  const categoryMenuGroups = useMemo(() => {
    const groups = new Map<string, typeof categorySubcategoryOptions>();
    categorySubcategoryOptions.forEach((subcategory) => {
      const groupName = subcategory.group?.trim() || "Browse";
      groups.set(groupName, [...(groups.get(groupName) || []), subcategory]);
    });
    return Array.from(groups, ([name, items]) => ({ name, items }));
  }, [categorySubcategoryOptions]);

  const subcategoryCards = useMemo(() => categorySubcategoryOptions.flatMap((subcategory) => {
    const relatedIds = new Set([subcategory.id, ...(subcategory.children || []).map((child) => child.id)].map((id) => id.toLowerCase()));
    const relatedProducts = categoryProducts.filter((product) => relatedIds.has(product.subcategoryId.toLowerCase()));
    const productWithImage = relatedProducts.find((product) => product.image || product.images?.length);
    const image = productWithImage?.image || productWithImage?.images?.[0];
    return image ? [{ id: subcategory.id, name: subcategory.name, image }] : [];
  }), [categorySubcategoryOptions, categoryProducts]);

  const bossChairChildCards = useMemo(() => {
    if (currentCategory.id !== "seating-solutions") return [];

    const bossChair = currentCategory.subcategories.find((subcategory) => subcategory.id === "boss-chair");
    return (bossChair?.children || []).flatMap((child) => {
      const product = child.id === "premium-chair"
        ? categoryProducts.find((item) => item.id === 868 && (item.image || item.images?.length)) ||
          categoryProducts.find((item) => item.subcategoryId === child.id && (item.image || item.images?.length))
        : categoryProducts.find((item) => item.subcategoryId === child.id && (item.image || item.images?.length));
      const image = product?.image || product?.images?.[0];
      return image
        ? [{ id: child.id, name: child.name, image }]
        : [];
    });
  }, [categoryProducts, currentCategory]);

  // Live Color Swatch States
  const [productColors, setProductColors] = useState<Record<number, ColorVariant>>({});
  const [hoveredColors, setHoveredColors] = useState<Record<number, ColorVariant | null>>({});

  // Dynamic Product Size and Multi-Photo Gallery States (Requirement 6)
  const [productSizes, setProductSizes] = useState<
    Record<number, { label: string; price: number; oldPrice?: number }>
  >({});
  const [conferencePopupSelections, setConferencePopupSelections] = useState<Record<number, boolean>>({});
  const [activeTouchCardId, setActiveTouchCardId] = useState<number | null>(null);

  useEffect(() => {
    const handleResetTouch = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".product-image-container")) {
        setActiveTouchCardId(null);
      }
    };
    window.addEventListener("click", handleResetTouch);
    window.addEventListener("touchstart", handleResetTouch, { passive: true });
    return () => {
      window.removeEventListener("click", handleResetTouch);
      window.removeEventListener("touchstart", handleResetTouch);
    };
  }, []);



  // Modal Customizer Studio States
  const [selectedProduct, setSelectedProduct] = useState<CategoryProduct | null>(null);
  const [modalColor, setModalColor] = useState<ColorVariant>(STANDARD_STEEL_COLORS[0]);
  const [modalVariants, setModalVariants] = useState<Record<string, VariantChoice>>({});
  const [modalSelectedSize, setModalSelectedSize] = useState<{
    label: string;
    price: number;
    oldPrice?: number;
  } | null>(null);
  const [modalGalleryIndex, setModalGalleryIndex] = useState<number>(0);

  const [addedId, setAddedId] = useState<number | null>(null);

  // Active subcategory object
  const activeSubObj = useMemo(() => {
    if (activeSubcategory === "all") return null;
    return (
      currentCategory.subcategories.find((s) => s.id === activeSubcategory) ||
      currentCategory.subcategories.flatMap((s) => s.children || []).find((s) => s.id === activeSubcategory) ||
      currentCategory.subcategories.find(
        (s) => s.name.toLowerCase() === activeSubcategory.toLowerCase()
      ) ||
      currentCategory.subcategories.flatMap((s) => s.children || []).find(
        (s) => s.name.toLowerCase() === activeSubcategory.toLowerCase()
      ) ||
      null
    );
  }, [currentCategory, activeSubcategory]);

  const subcategoryName = activeSubObj ? activeSubObj.name : activeSubcategory;

  // Sync subParam or slug from URL
  useEffect(() => {
    if (subParam === "metal-furniture" || slug?.toLowerCase() === "metal-furniture") {
      navigate("/category/cupboards-almirahs", { replace: true });
      return;
    }
    if (subParam) {
      setActiveSubcategory(
        ["wooden-pedestal-3-drawer", "wooden-pedestal-2-drawer", "wooden-pedestal-1-drawer"].includes(subParam)
          ? "wooden-pedestal"
          : subParam
      );
    } else if (matchedSubcategoryFromSlug) {
      setActiveSubcategory(matchedSubcategoryFromSlug.subcategory.id);
    } else {
      setActiveSubcategory("all");
    }
  }, [subParam, slug, matchedSubcategoryFromSlug, navigate]);

  // Update page title
  useEffect(() => {
    const title =
      activeSubcategory !== "all"
        ? `${subcategoryName} | ${currentCategory.name}`
        : `${currentCategory.name} | Staging Spaces`;
    document.title = title;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentCategory, activeSubcategory, subcategoryName]);

  // When opening a product in modal, set initial color, size and variant defaults
  useEffect(() => {
    if (selectedProduct) {
      const selectedColorOptions = currentCategory.id === "cupboards-almirahs"
        ? getCupboardColorOptions(selectedProduct)
        : selectedProduct.colors || STANDARD_STEEL_COLORS;
      const activeCol = selectedColorOptions.length
        ? productColors[selectedProduct.id] ||
          selectedColorOptions[0]
        : undefined;
      setModalColor(activeCol || (selectedProduct.id === 705 ? ORIGINAL_PINK_FINISH : STANDARD_STEEL_COLORS[0]));

      const activeSz =
        productSizes[selectedProduct.id] ||
        (selectedProduct.sizes ? selectedProduct.sizes[0] : null);
      setModalSelectedSize(activeSz);
      setModalGalleryIndex(0);

      const subVariants = selectedProduct.variants?.length
        ? selectedProduct.variants
        : getSubcategoryVariants(selectedProduct.subcategoryId);
      const defaults: Record<string, VariantChoice> = {};
      subVariants.forEach((v) => {
        const def = v.options.find((o) => o.isDefault) || v.options[0];
        defaults[v.type] = def;
      });
      setModalVariants(defaults);
    }
  }, [selectedProduct, productColors, productSizes, currentCategory.id]);

  const handleSubSelect = (subId: string) => {
    if (subId === "metal-furniture") {
      navigate("/category/cupboards-almirahs");
      return;
    }
    setActiveSubcategory(subId);
    if (subId === "all") {
      searchParams.delete("sub");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ sub: subId });
    }
  };

  // Helper to get active color for a card (only for products that support color finishing)
  const getCardActiveColor = (product: CategoryProduct): ColorVariant | null => {
    if (!isRecolorableProduct(product)) return null;
    if (hoveredColors[product.id]) return hoveredColors[product.id]!;
    if (productColors[product.id]) return productColors[product.id];
    if (product.id === 705) return null;
    const colors = currentCategory.id === "cupboards-almirahs"
      ? getCupboardColorOptions(product)
      : product.colors || STANDARD_STEEL_COLORS;
    if (!colors.length) return null;
    return colors[0];
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...categoryProducts];

    // This almirah was incorrectly assigned to Seating Solutions in the CMS.
    if (currentCategory.id === "seating-solutions") {
      list = list.filter((product) => {
        const productName = product.name.toLowerCase();
        const charcoalFinish = productName.includes("charcoal") || productName.includes("charcol");
        return !(charcoalFinish && productName.includes("almir") && productName.includes("mirror"));
      });
    }

    // Filter by subcategory
    if (activeSubcategory !== "all") {
      const activeParent = currentCategory.subcategories.find((sub) => sub.id === activeSubcategory);
      const includedSubcategoryIds = [
        activeSubcategory,
        ...(activeParent?.children || []).map((child) => child.id),
        ...(activeParent?.includedSubcategoryIds || []),
      ];
      list = list.filter(
        (p) =>
          includedSubcategoryIds.some((id) => p.subcategoryId.toLowerCase() === id.toLowerCase()) ||
          p.subcategoryName.toLowerCase() === activeSubcategory.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter((product) => {
        const searchableText = [
          product.name,
          product.category,
          product.subcategoryName,
          product.description,
          ...(product.specifications || []).flatMap(({ label, value }) => [label, value]),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(q);
      });
    }

    // Sort
    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    if (activeSubcategory === "boss-chair") {
      const lastChairIndex = list.findIndex((product) =>
        product.name.toLowerCase().includes("modern high-back executive chair")
      );
      if (lastChairIndex !== -1) {
        list.push(list.splice(lastChairIndex, 1)[0]);
      }
    }

    return list;
  }, [categoryProducts, activeSubcategory, searchTerm, sortBy]);

  const displayProducts = useMemo(() => {
    if (currentCategory.id !== "office-furniture") return filteredProducts;

    const employeeDeskNames = [
      "contemporary employee desk",
      "corporate employee desk",
      "classic wooden employee desk",
      "compact employee office desk",
    ];
    const employeeDesks = filteredProducts.filter((product) => {
      const name = product.name.trim().toLowerCase();
      return employeeDeskNames.some((target) => name.includes(target));
    });
    if (employeeDesks.length < 2) return filteredProducts;

    const primary = employeeDesks.find((product) => product.name.trim().toLowerCase().includes("contemporary employee desk")) || employeeDesks[0];
    const orderedDesks = [primary, ...employeeDesks.filter((product) => product.id !== primary.id)];
    const images = Array.from(new Set(orderedDesks.flatMap((product) => product.images?.length ? product.images : [product.image]).filter(Boolean)));
    const combined: CategoryProduct = {
      ...primary,
      image: images[0] || primary.image,
      images,
    };
    const firstIndex = filteredProducts.findIndex((product) => employeeDeskNames.some((name) => product.name.trim().toLowerCase().includes(name)));
    const remaining = filteredProducts.filter((product) => !employeeDeskNames.some((name) => product.name.trim().toLowerCase().includes(name)));
    return [...remaining.slice(0, firstIndex), combined, ...remaining.slice(firstIndex)];
  }, [currentCategory.id, filteredProducts]);

  useEffect(() => {
    if (catalogLoading) return;
    const productId = sessionStorage.getItem("furniture:return-product-card");
    if (!productId) return;

    const card = document.getElementById(`product-card-${productId}`);
    if (!card) {
      sessionStorage.removeItem("furniture:return-product-card");
      return;
    }

    sessionStorage.removeItem("furniture:return-product-card");
    card.scrollIntoView({ behavior: "instant", block: "center" });
    card.focus({ preventScroll: true });
  }, [catalogLoading, displayProducts]);
  const handleAddToCart = (product: CategoryProduct) => {
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const openWhatsAppEnquiry = (product: CategoryProduct, activeCol?: ColorVariant | null) => {
    const colorTxt = activeCol ? ` in ${activeCol.name} finish` : "";
    const text = encodeURIComponent(
      `Hello! I would like to enquire about: "${product.name}"${colorTxt} (Price: ₹${product.price.toLocaleString(
        "en-IN"
      )}) on Staging Spaces.`
    );
    window.open(`https://wa.me/918669944932?text=${text}`, "_blank");
  };

  const openCustomWhatsAppEnquiry = (
    product: CategoryProduct,
    color: ColorVariant,
    variants: Record<string, VariantChoice>,
    totalPrice: number
  ) => {
    const variantParts = Object.values(variants)
      .map((v) => v.label)
      .join(", ");
    const text = encodeURIComponent(
      `Hello! I would like to enquire about custom order:\n- Product: ${product.name}\n- Color Finish: ${
        color.name
      }\n- Configuration: ${variantParts}\n- Estimated Price: ₹${totalPrice.toLocaleString(
        "en-IN"
      )}\non Staging Spaces.`
    );
    window.open(`https://wa.me/918669944932?text=${text}`, "_blank");
  };

  // Modal computed price & details
  const modalVariantOptions = useMemo(() => {
    if (!selectedProduct) return [];
    return selectedProduct.variants?.length
      ? selectedProduct.variants
      : getSubcategoryVariants(selectedProduct.subcategoryId);
  }, [selectedProduct]);

  const modalPriceDiff = useMemo(() => {
    return Object.values(modalVariants).reduce(
      (sum, v) => sum + (v?.priceDiff || 0),
      0
    );
  }, [modalVariants]);

  const computedModalPrice = useMemo(() => {
    if (!selectedProduct) return 0;
    const basePrice = modalSelectedSize ? modalSelectedSize.price : selectedProduct.price;
    return Math.max(0, basePrice + modalPriceDiff);
  }, [selectedProduct, modalPriceDiff, modalSelectedSize]);

  const modalImage = useMemo(() => {
    if (!selectedProduct) return "";
    const allImages =
      selectedProduct.images && selectedProduct.images.length > 0
        ? selectedProduct.images
        : [selectedProduct.image];
    if (modalGalleryIndex > 0 && allImages[modalGalleryIndex]) {
      return allImages[modalGalleryIndex];
    }
    return getCardColorImage(selectedProduct, modalColor);
  }, [selectedProduct, modalColor, modalGalleryIndex]);

  // Clean, reusable Product Card renderer (used everywhere without duplicate code)
  const renderProductCard = (product: CategoryProduct) => {
    const inWishlist = isInWishlist(product.id);
    const isAdded = addedId === product.id;
    const activeColor = getCardActiveColor(product);
    const baseCardImage = product.id === 705 && !productColors[product.id]
      ? "/images-webp/cupboard4.webp"
      : activeColor ? getCardColorImage(product, activeColor) : product.image;
    const localFallbackImage = currentCategory.products.find((item) => item.id === product.id)?.image ||
      (product.subcategoryId === "office-chair" ? "/images-webp/officechair1.webp" :
        product.subcategoryId === "boss-chair" ? "/images-webp/bosschair1.webp" :
          product.category === "Seating Solutions" ? "/images-webp/chair1.webp" :
            currentCategory.id === "office-furniture" ? "/workstation1.jpeg" : "/images-webp/cupboard1.webp");

    const allImages =
      product.images && product.images.length > 0
        ? product.images
        : [baseCardImage];
    const hoveredColor = hoveredColors[product.id];
    const primaryImage = hoveredColor
      ? getCardColorImage(product, hoveredColor)
      : baseCardImage || allImages[0];
    const secondaryImage = !hoveredColor && (product.cmsHoverImage || (allImages.length > 1
      ? (allImages.find((img) => img && img !== primaryImage) || (allImages[1] !== primaryImage ? allImages[1] : null))
      : null));

    const activeSize =
      productSizes[product.id] ||
      (product.sizes ? product.sizes[0] : null);
    const conferenceName = product.name.toLowerCase();
    const conferenceSeats = conferenceName.includes("team meeting table")
      ? 8
      : conferenceName.includes("boardroom")
        ? 4
        : null;
    const hasPopupBox = conferencePopupSelections[product.id] || false;
    const currentPrice = (activeSize ? activeSize.price : product.price) +
      (conferenceSeats && hasPopupBox ? 3000 : 0);
    const currentOldPrice = activeSize?.oldPrice || product.oldPrice;
    const cardSpecification = product.specifications?.find((spec) =>
      ["dimensions", "size"].includes(spec.label.trim().toLowerCase()),
    );

    const showColors = isRecolorableProduct(product);
    // Cupboards and almirahs only show real CMS color variants with matching photos.
    const availableColors = currentCategory.id === "cupboards-almirahs"
      ? getCupboardColorOptions(product)
      : product.colors || (showColors ? STANDARD_STEEL_COLORS : []);

    return (
      <article id={`product-card-${product.id}`} key={`${product.id}-${product.image}`} tabIndex={-1} className="product-card">
        {/* Product Image & Gallery Dots */}
        <div
          className={`product-image-container${secondaryImage ? " has-hover-image" : ""}${activeTouchCardId === product.id ? " is-touch-active" : ""}`}
          role="link"
          tabIndex={0}
          aria-label={`View ${product.name}`}
          onTouchStart={() => {
            if (secondaryImage) {
              setActiveTouchCardId(product.id);
            }
          }}
          onClick={(event) => {
            const isTouchScreen =
              window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
              ("ontouchstart" in window && window.innerWidth <= 1024);

            if (isTouchScreen && secondaryImage) {
              if (activeTouchCardId !== product.id) {
                event.preventDefault();
                event.stopPropagation();
                setActiveTouchCardId(product.id);
                return;
              }
            }
            navigate(`/product/${product.id}`, { state: { fallbackProduct: product } });
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              navigate(`/product/${product.id}`, { state: { fallbackProduct: product } });
            }
          }}
        >
          <div className="product-img-wrapper">
            {primaryImage && (
              <LazyImage
                key={`primary-${primaryImage}`}
                src={primaryImage}
                width={800}
                alt={activeColor ? `${product.name} in ${activeColor.name}` : product.name}
                className={`product-img product-img-primary ${secondaryImage ? "has-hover-image" : ""}`}
                loading="lazy"
                onError={(event) => {
                  const fallbackUrl = new URL(localFallbackImage, window.location.href).href;
                  if (event.currentTarget.src !== fallbackUrl) event.currentTarget.src = localFallbackImage;
                }}
              />
            )}
            {secondaryImage && (
              <LazyImage
                key={`hover-${secondaryImage}`}
                src={secondaryImage}
                width={800}
                alt={`${product.name} alternate view`}
                className="product-img product-img-hover"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>


          {product.badge && <span className="card-badge">{product.badge}</span>}

          <button
            type="button"
            className={`card-wishlist-btn ${inWishlist ? "active" : ""}`}
            aria-label="Wishlist"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist({
                id: product.id,
                name: product.name,
                category: product.category,
                price: currentPrice,
                oldPrice: currentOldPrice,
                image: primaryImage,
              });
            }}
          >
            <Heart size={17} fill={inWishlist ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Card Body */}
        <div className="product-card-body">
          <div className="product-card-meta-top">
            <span className="product-subcat-tag">{product.subcategoryName}</span>
            {isRecolorableProduct(product) && (
  <button
    type="button"
    className="customize-view-btn"
    onClick={() => navigate(`/product/${product.id}`, { state: { fallbackProduct: product } })}
  >
    <SlidersHorizontal size={12} /> Customize
  </button>
)}
          </div>

          <h3 className="product-card-title">
            <Link to={`/product/${product.id}`} state={{ fallbackProduct: product }}>{product.name}</Link>
          </h3>

          {cardSpecification?.value && (
            <p className="product-card-dimensions">
              <strong>{cardSpecification.label}:</strong>{" "}
              {cardSpecification.value}
            </p>
          )}

          {conferenceSeats && (
            <div className="conference-card-options">
              <span className="conference-seat-count">{conferenceSeats} Seater</span>
              <span className="conference-options-label">Pop-up box</span>
              <div className="conference-option-list" role="group" aria-label="Pop-up box option">
                {[false, true].map((withPopup) => (
                  <button
                    key={String(withPopup)}
                    type="button"
                    className={`conference-option ${hasPopupBox === withPopup ? "active" : ""}`}
                    aria-pressed={hasPopupBox === withPopup}
                    onClick={(event) => {
                      event.stopPropagation();
                      setConferencePopupSelections((prev) => ({ ...prev, [product.id]: withPopup }));
                    }}
                  >
                    <span className="conference-option-radio" />
                    <span>{withPopup ? "With pop-up box" : "Without pop-up box"}</span>
                    <strong>{withPopup ? "+₹3,000" : "Included"}</strong>
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.subcategoryId === "conference-table" && (
            <button
              type="button"
              className="customize-view-btn"
              style={{ marginTop: "8px" }}
              onClick={() => navigate(`/product/${product.id}`, { state: { fallbackProduct: product } })}
            >
              <Eye size={13} /> Quick view
            </button>
          )}

          {/* Interactive Color Switcher - Only shown when product genuinely supports finishes */}
          {showColors && availableColors.length > 1 && (
            <div className="product-color-selector">
              <div className="color-selector-header">
                <span className="color-label">Finish:</span>
                <span className="color-active-name">{activeColor?.name || "Original Pink"}</span>
              </div>
              <div className={`color-swatches-row${currentCategory.id === "cupboards-almirahs" ? " cupboard-color-swatches" : ""}`}>
                {availableColors.map((col) => {
                  const isCurrent = activeColor?.name === col.name;
                  const swatch = (
                    <button
                      key={col.name}
                      type="button"
                      className={`color-swatch-circle ${
                        isCurrent ? "active" : ""
                      }`}
                      style={{ backgroundColor: col.colorCode }}
                      onMouseEnter={() =>
                        setHoveredColors((prev) => ({
                          ...prev,
                          [product.id]: col,
                        }))
                      }
                      onMouseLeave={() =>
                        setHoveredColors((prev) => ({
                          ...prev,
                          [product.id]: null,
                        }))
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        setProductColors((prev) => ({
                          ...prev,
                          [product.id]: col,
                        }));
                      }}
                      title={`Preview ${col.name} finish`}
                      aria-label={`Select ${col.name}`}
                    />
                  );
                  return currentCategory.id === "cupboards-almirahs" ? (
                    <div className="cupboard-color-option" key={col.name}>
                      {swatch}
                      <span>{col.name}</span>
                    </div>
                  ) : swatch;
                })}
              </div>
            </div>
          )}

          {/* Size Selector with Rates (Requirement 6: 3×2, 5×2) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="card-size-selector">
              <span className="card-size-label">Select Size &amp; Rate:</span>
              <div className="card-size-pills">
                {product.sizes.map((sz) => {
                  const isSel = activeSize?.label === sz.label;
                  return (
                    <button
                      key={sz.label}
                      type="button"
                      className={`card-size-pill ${isSel ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setProductSizes((prev) => ({
                          ...prev,
                          [product.id]: sz,
                        }));
                      }}
                    >
                      <strong>{sz.label}</strong>
                      <span>₹{sz.price.toLocaleString("en-IN")}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {product.rating ? (
            <div
              className="product-rating"
              aria-label={`Rated ${product.rating} out of 5 from ${product.ratingCount ?? 0} reviews`}
            >
              <span className="product-rating-stars" aria-hidden="true">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    size={15}
                    fill={index < Math.round(Number(product.rating)) ? "currentColor" : "none"}
                  />
                ))}
              </span>
              <span className="product-rating-count">({product.ratingCount ?? 0} reviews)</span>
            </div>
          ) : (
            <div className="product-rating">
              <span>No reviews yet</span>
            </div>
          )}

          <p className="product-card-desc">{product.description}</p>

          <div className="product-pricing">
            <span className="price-current">
              ₹{currentPrice.toLocaleString("en-IN")}
            </span>
            {currentOldPrice && (
              <span className="price-old">
                ₹{currentOldPrice.toLocaleString("en-IN")}
              </span>
            )}
            {product.discount && (
              <span className="price-discount">{product.discount}% OFF</span>
            )}
          </div>

          <p className="product-card-delivery">
            <Truck size={16} aria-hidden="true" />
            Delivery in 8 days
          </p>

          <div className="product-card-actions">
            <button
              type="button"
              className="add-cart-btn"
              onClick={() =>
                handleAddToCart({
                  ...product,
                  name: `${product.name}${activeColor ? ` (${activeColor.name}` : ""}${activeSize ? ` • ${activeSize.label}` : ""}${conferenceSeats ? ` • ${conferenceSeats} seater • ${hasPopupBox ? "With pop-up box" : "Without pop-up box"}` : ""}${activeColor ? ")" : ""}`,
                  price: currentPrice,
                  oldPrice: currentOldPrice,
                  image: primaryImage,
                })
              }
            >
              {isAdded ? (
                <>
                  <Check size={16} /> Added!
                </>
              ) : (
                <>
                  <ShoppingCart size={16} /> Add to Cart
                </>
              )}
            </button>

            <button
              type="button"
              className="whatsapp-enquiry-btn"
              title="Enquire on WhatsApp"
              aria-label="Enquire on WhatsApp"
              onClick={() =>
                openWhatsAppEnquiry(
                  {
                    ...product,
                    name: conferenceSeats
                      ? `${product.name} (${conferenceSeats} seater, ${hasPopupBox ? "with" : "without"} pop-up box)`
                      : product.name,
                    price: currentPrice,
                  },
                  activeColor
                )
              }
            >
              <MessageCircle size={18} />
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className={`category-detail-page ${
  currentCategory.id === "office-furniture" ? "office-furniture-page" : ""
}`}>
      {/* Breadcrumbs */}
      <nav className="category-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <Link to="/categories">Categories</Link>
        <ChevronRight size={14} />
        {activeSubcategory !== "all" ? (
          <>
            <Link to={`/category/${currentCategory.id}`}>{currentCategory.name}</Link>
            <ChevronRight size={14} />
            <span className="current">{subcategoryName}</span>
          </>
        ) : (
          <span className="current">{currentCategory.name}</span>
        )}
      </nav>

      {/* Header Section with Integrated Horizontal Dropdown & Search (No Sort By) */}
      <header className="subcategory-hero-clean">
        <div className="subcat-hero-inner">
          <div className="subcat-hero-main">
            <div className="subcat-hero-left">
              {activeSubcategory !== "all" && (
                <div className="subcat-hero-top">
                  <button
                    type="button"
                    className="subcat-back-btn"
                    onClick={() => handleSubSelect("all")}
                  >
                    <ArrowLeft size={14} /> {currentCategory.name}
                  </button>
                  {activeSubObj?.group && (
                    <span className="subcat-group-pill">{activeSubObj.group}</span>
                  )}
                </div>
              )}

              <h1 className="subcat-title">
                {activeSubcategory !== "all" ? subcategoryName : currentCategory.name}
              </h1>
              <p className="subcat-desc">
                Browse premium {(activeSubcategory !== "all" ? subcategoryName : currentCategory.name).toLowerCase()} crafted for superior comfort and durability.
              </p>
            </div>

            <div className="subcat-hero-controls">
              <div
                className="subcategory-dropdown"
                onMouseEnter={() => setSubcategoryMenuOpen(true)}
                onMouseLeave={() => setSubcategoryMenuOpen(false)}
                onFocus={() => setSubcategoryMenuOpen(true)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setSubcategoryMenuOpen(false);
                  }
                }}
              >
                <button
                  type="button"
                  className="subcategory-select-trigger"
                  aria-haspopup="true"
                  aria-expanded={subcategoryMenuOpen}
                  onClick={() => setSubcategoryMenuOpen(true)}
                >
                  <span>{activeSubObj?.name || currentCategory.name}</span>
                  <ChevronDown size={16} />
                </button>
                {subcategoryMenuOpen && (
                  <div className={`subcategory-dropdown-menu${currentCategory.id === "home-furniture" ? " home-furniture-subcategory-menu" : ""}`}>
                    {(["office-furniture", "outdoor-furniture", "cupboards-almirahs", "bunk-beds"].includes(currentCategory.id)
                      ? getCategoryHeadings(currentCategory).map((heading) => {
                        const groupKey = `heading:${heading.id}`;
                        const expanded = expandedSubcategoryGroup === groupKey;
                        const headingSubcategories = categorySubcategoryOptions.filter((subcategory) =>
                          heading.includedSubcategoryIds?.includes(subcategory.id),
                        );
                        return (
                          <section className="subcategory-dropdown-section subcategory-dropdown-accordion" key={heading.id}>
                            <button
                              type="button"
                              className={`subcategory-dropdown-option subcategory-dropdown-parent ${currentCategory.id === "bunk-beds" ? "bunk-bed-main-category" : ""} ${currentCategory.id === "bunk-beds" && activeSubcategory === heading.id || expanded ? "selected" : ""}`}
                              aria-expanded={currentCategory.id === "bunk-beds" ? undefined : expanded}
                              onClick={() => {
                                if (currentCategory.id === "bunk-beds") {
                                  handleSubSelect(heading.id);
                                  setSubcategoryMenuOpen(false);
                                } else {
                                  setExpandedSubcategoryGroup(expanded ? null : groupKey);
                                }
                              }}
                            >
                              <span>{heading.name}</span>
                              {currentCategory.id !== "bunk-beds" && <ChevronRight className={expanded ? "open" : ""} size={15} />}
                            </button>
                            {expanded && currentCategory.id !== "bunk-beds" && <div className="subcategory-dropdown-children">
                              {headingSubcategories.map((subcategory) => (
                                <button
                                  key={subcategory.id}
                                  type="button"
                                  className={`subcategory-dropdown-option ${activeSubcategory === subcategory.id ? "selected" : ""}`}
                                  onClick={() => { handleSubSelect(subcategory.id); setSubcategoryMenuOpen(false); setExpandedSubcategoryGroup(null); }}
                                >
                                  <span>{subcategory.name}</span>
                                </button>
                              ))}
                            </div>}
                          </section>
                        );
                      })
                      : categoryMenuGroups.map((group) => (
                        <section className="subcategory-dropdown-section" key={group.name}>
                          {group.name !== "Browse" && <h3>{group.name}</h3>}
                          {group.items.map((subcategory) => {
                      if (subcategory.children?.length) {
                        const expanded = expandedSubcategoryGroup === subcategory.id;
                        return (
                          <div className="subcategory-option-group" key={subcategory.id}>
                            <button
                              type="button"
                              className={`subcategory-dropdown-option subcategory-dropdown-parent ${currentCategory.id === "bunk-beds" ? "bunk-bed-main-category" : ""} ${expanded ? "selected" : ""}`}
                              aria-expanded={expanded}
                              onClick={() => setExpandedSubcategoryGroup(expanded ? null : subcategory.id)}
                            >
                              <span>{subcategory.name}</span>
                              <ChevronRight className={expanded ? "open" : ""} size={15} />
                            </button>
                            {expanded && <div className="subcategory-dropdown-children">
                              {subcategory.children.map((child) => (
                                <button
                                  key={child.id}
                                  type="button"
                                  className={`subcategory-dropdown-option ${activeSubcategory === child.id ? "selected" : ""}`}
                                  onClick={() => { handleSubSelect(child.id); setSubcategoryMenuOpen(false); setExpandedSubcategoryGroup(null); }}
                                >
                                  <span>{child.name}</span>
                                </button>
                              ))}
                            </div>}
                          </div>
                        );
                      }
                      return (
                        <button
                          key={subcategory.id}
                          type="button"
                          className={`subcategory-dropdown-option ${activeSubcategory === subcategory.id ? "selected" : ""}`}
                          onClick={() => { handleSubSelect(subcategory.id); setSubcategoryMenuOpen(false); }}
                        >
                          <span>{subcategory.name}</span>
                        </button>
                      );
                          })}
                        </section>
                      )))
                    }
                  </div>
                )}
              </div>

              {categorySubcategoryOptions.length > 0 && (
                <span className="subcategory-select-count">
                  {categorySubcategoryOptions.length} categories
                </span>
              )}

              <div className="toolbar-search">
                <Search size={15} />
                <input
                  type="text"
                  placeholder={`Search in ${activeSubcategory !== "all" ? subcategoryName : currentCategory.name}...`}
                  aria-label={`Search in ${activeSubcategory !== "all" ? subcategoryName : currentCategory.name}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Products Image Grid */}
      <main className="category-products-container">
        {catalogLoading && categoryProducts.length === 0 ? (
          <div className="category-loading-skeleton" aria-live="polite" aria-label="Loading products">
            <ProductGridSkeleton count={3} />
          </div>
        ) : catalogError && categoryProducts.length === 0 ? (
          <div className="empty-products-view" role="status">
            <h3>Products are temporarily unavailable</h3>
            <p>Please try again in a moment.</p>
            <button type="button" className="reset-filter-btn" onClick={() => { setCatalogError(false); setCatalogLoading(true); setCatalogReload((value) => value + 1); }}>Try again</button>
          </div>
        ) : !searchTerm.trim() && (
          activeSubcategory === "all" && subcategoryCards.length > 0 ||
          activeSubcategory === "boss-chair" && bossChairChildCards.length > 0
        ) ? (
          <div className="subcategory-categories-grid" aria-label={`${currentCategory.name} categories`}>
            {(activeSubcategory === "boss-chair" ? bossChairChildCards : subcategoryCards).map((subcategory) => (
              <button
                key={subcategory.id}
                type="button"
                className="subcategory-category-card"
                onClick={() => handleSubSelect(subcategory.id)}
                aria-label={`View ${subcategory.name} products`}
              >
                <span className="subcategory-category-image">
                  <img src={subcategory.image} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="subcategory-category-name">{subcategory.name}</span>
              </button>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-products-view">
            <h3>No designs found</h3>
            <p>
              We couldn't find any designs matching your selected filters or search.
            </p>
            <button
              type="button"
              className="reset-filter-btn"
              onClick={() => {
                setActiveSubcategory("all");
                setSearchTerm("");
                setSearchParams({});
              }}
            >
              Show {currentCategory.name}
            </button>
          </div>
        ) : currentCategory.id === "office-furniture" &&
          activeSubcategory === "all" &&
          !searchTerm.trim() ? (
          /* Office Furniture Distinct A/B Section Structure (Requirement 5) */
          <div className="office-ab-container">
            {/* A. Modular Furniture */}
            <section
              className="office-ab-section section-a"
              id="modular-wooden-section"
            >
              <div className="office-section-header">
          
                <h2>Modular Furniture</h2>
               <p className="modular-description">
  Modern employee tables, executive boss desks, multi-cluster workstations, reception counters, and modular wooden storage credenzas.
</p>
              </div>

              <div className="products-grid">
                {displayProducts
                  .filter((p) =>
                    [
                      "table-employee",
                      "podium-table",
                      "wooden-pedestal",
                      "low-height-storage",
                      "side-runner",
                      "full-height-storage",
                      "boss-table",
                      "reception-table",
                      "workstation",
                      "conference-table",
                    ].includes(p.subcategoryId)
                  )
                  .map(renderProductCard)}
              </div>
            </section>

            {/* B. Metal Furniture */}
            <section
              className="office-ab-section section-b"
              id="metal-furniture-section"
            >
              <div className="office-section-header">
                <h2>Metal Furniture</h2>
                <p>
                  Heavy-duty steel office tables, lockable mobile metal pedestals,
                  and industrial workshop desks.
                </p>
                <div className="office-subcat-chips">
                  {[
                    { id: "metal-office-table", name: "Metal Office Table" },
                    { id: "metal-pedestal", name: "Metal Pedestal" },
                    { id: "metal-table", name: "Metal Table" },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      className="office-chip-btn"
                      onClick={() => handleSubSelect(sub.id)}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="products-grid">
                {filteredProducts
                  .filter((p) =>
                    [
                      "metal-office-table",
                      "metal-pedestal",
                      "metal-table",
                    ].includes(p.subcategoryId)
                  )
                  .map(renderProductCard)}
              </div>
            </section>
          </div>
        ) : (
          /* Subcategory or Standard Grid */
          <div
            className={`products-grid ${
              displayProducts.length === 1 ? "single-item-grid" : ""
            }`}
          >
            {displayProducts.map(renderProductCard)}
          </div>
        )}
      </main>

      {/* Lightbox / Customizer Studio Modal */}
      {selectedProduct && (
        <div
          className="image-lightbox-modal"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "940px" }}
          >
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close Preview"
            >
              <X size={18} />
            </button>

            {/* Left Column: Image with dynamic color tint and multiple photo gallery */}
            <div className="lightbox-img-col">
              <div
                className="product-img-wrapper"
                style={{
                  position: "relative",
                  minHeight: "380px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "10px",
                }}
              >
                {modalImage && (
                  <img
                    src={modalImage}
                    alt={
                      isRecolorableProduct(selectedProduct)
                        ? `${selectedProduct.name} in ${modalColor.name}`
                        : selectedProduct.name
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      padding: "16px",
                    }}
                  />
                )}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="lightbox-gallery-arrow lightbox-gallery-arrow-prev"
                      aria-label="Previous product photo"
                      onClick={() => setModalGalleryIndex((index) => (index - 1 + selectedProduct.images!.length) % selectedProduct.images!.length)}
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      type="button"
                      className="lightbox-gallery-arrow lightbox-gallery-arrow-next"
                      aria-label="Next product photo"
                      onClick={() => setModalGalleryIndex((index) => (index + 1) % selectedProduct.images!.length)}
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}
              </div>

              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <p className="lightbox-gallery-count">
                  {modalGalleryIndex + 1} / {selectedProduct.images.length}
                </p>
              )}

              {isRecolorableProduct(selectedProduct) && (
                <div style={{ textAlign: "center", marginTop: "12px" }}>
                  <span className="modal-color-preview-tag">
                    <Palette size={14} /> Live Finish: {modalColor.name}
                  </span>
                </div>
              )}
            </div>

            {/* Right Column: Interactive Studio & Variant Configuration */}
            <div className="lightbox-info-col">
              <span className="product-subcat-tag">
                {selectedProduct.subcategoryName}
              </span>
              <h2 className="lightbox-title">{selectedProduct.name}</h2>

              {/* Dynamic Price Calculation */}
              <div className="product-pricing">
                <span className="price-current">
                  ₹{computedModalPrice.toLocaleString("en-IN")}
                </span>
                {selectedProduct.oldPrice && (
                  <span className="price-old">
                    ₹{modalSelectedSize ? (modalSelectedSize.oldPrice || selectedProduct.oldPrice).toLocaleString("en-IN") : (selectedProduct.oldPrice + modalPriceDiff).toLocaleString("en-IN")}
                  </span>
                )}
                {selectedProduct.discount && (
                  <span className="price-discount">
                    {selectedProduct.discount}% OFF
                  </span>
                )}
              </div>

              {/* Variant Studio Section */}
              <div className="modal-variant-section">
                {/* 1. Size Selection with Dynamic Rates (Requirement 6) */}
                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="variant-group">
                    <div className="variant-group-header">
                      <span className="variant-group-label">
                        Select Dimensions / Table Size:
                      </span>
                      <span className="variant-group-selected">
                        {modalSelectedSize?.label} (₹{modalSelectedSize?.price.toLocaleString("en-IN")})
                      </span>
                    </div>
                    <div className="variant-pills-wrap">
                      {selectedProduct.sizes.map((sz) => {
                        const isSel = modalSelectedSize?.label === sz.label;
                        return (
                          <button
                            key={sz.label}
                            type="button"
                            className={`variant-pill-option ${isSel ? "active" : ""}`}
                            onClick={() => setModalSelectedSize(sz)}
                          >
                            <span>{sz.label}</span>
                            <span className="variant-diff-badge">
                              ₹{sz.price.toLocaleString("en-IN")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Color Swatches Selection (only for recolorable steel products) */}
                {isRecolorableProduct(selectedProduct) && (
                  <div className="variant-group">
                    <div className="variant-group-header">
                      <span className="variant-group-label">
                        Choose Powder-Coat Color Finish:
                      </span>
                      <span className="variant-group-selected">{modalColor.name}</span>
                    </div>
                    <div className={`color-swatches-row${currentCategory.id === "cupboards-almirahs" ? " cupboard-color-swatches" : ""}`} style={{ marginTop: "4px" }}>
                      {(currentCategory.id === "cupboards-almirahs"
                        ? getCupboardColorOptions(selectedProduct)
                        : selectedProduct.colors || STANDARD_STEEL_COLORS).map((c) => (
                        currentCategory.id === "cupboards-almirahs" ? (
                          <div className="cupboard-color-option" key={c.name}>
                            <button
                              type="button"
                              className={`color-swatch-circle ${modalColor.name === c.name ? "active" : ""}`}
                              style={{ backgroundColor: c.colorCode, width: "28px", height: "28px" }}
                              onClick={() => setModalColor(c)}
                              title={c.name}
                              aria-label={`Select ${c.name}`}
                            />
                            <span>{c.name}</span>
                          </div>
                        ) : (
                          <button
                            key={c.name}
                            type="button"
                            className={`color-swatch-circle ${modalColor.name === c.name ? "active" : ""}`}
                            style={{ backgroundColor: c.colorCode, width: "28px", height: "28px" }}
                            onClick={() => setModalColor(c)}
                            title={c.name}
                          />
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Subcategory Options (Locker, Door, Mirror, Shelves) */}
                {modalVariantOptions.map((v) => (
                  <div key={v.type} className="variant-group">
                    <div className="variant-group-header">
                      <span className="variant-group-label">{v.name}:</span>
                      <span className="variant-group-selected">
                        {modalVariants[v.type]?.label || v.options[0].label}
                      </span>
                    </div>
                    <div className="variant-pills-wrap">
                      {v.options.map((opt) => {
                        const isActive =
                          (modalVariants[v.type]?.label || v.options[0].label) ===
                          opt.label;
                        return (
                          <button
                            key={opt.label}
                            type="button"
                            className={`variant-pill-option ${isActive ? "active" : ""}`}
                            onClick={() =>
                              setModalVariants((prev) => ({
                                ...prev,
                                [v.type]: opt,
                              }))
                            }
                          >
                            <span>{opt.label}</span>
                            {opt.priceDiff ? (
                              <span className="variant-diff-badge">
                                {opt.priceDiff > 0
                                  ? `+₹${opt.priceDiff}`
                                  : `-₹${Math.abs(opt.priceDiff)}`}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <p className="product-card-desc" style={{ WebkitLineClamp: "unset" }}>
                {selectedProduct.description}
              </p>

              {/* Dynamic Specifications */}
              {selectedProduct.specifications && (
                <div className="product-specs-list">
                  {isRecolorableProduct(selectedProduct) && (
                    <div className="spec-item">
                      <span>Selected Finish:</span>
                      <span>{modalColor.name} Multi-Stage Powder Coated</span>
                    </div>
                  )}
                  {modalSelectedSize && (
                    <div className="spec-item">
                      <span>Selected Dimensions:</span>
                      <span>
                        {modalSelectedSize.label} (Rate: ₹{modalSelectedSize.price.toLocaleString("en-IN")})
                      </span>
                    </div>
                  )}
                  {Object.entries(modalVariants).map(([type, choice]) => (
                    <div key={type} className="spec-item">
                      <span style={{ textTransform: "capitalize" }}>{type}:</span>
                      <span>{choice.label}</span>
                    </div>
                  ))}
                  {selectedProduct.specifications.map((s) => (
                    <div key={s.label} className="spec-item">
                      <span>{s.label}:</span>
                      <span>{s.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="product-card-actions" style={{ marginTop: "14px" }}>
                {selectedProduct.subcategoryId === "conference-table" && (
                  <button
                    type="button"
                    className="add-cart-btn"
                    style={{ backgroundColor: "#334155" }}
                    onClick={() => window.open(`${window.location.origin}/product/${selectedProduct.id}`, "_blank", "noopener,noreferrer")}
                  >
                    <ExternalLink size={16} /> Open product page
                  </button>
                )}
                <button
                  type="button"
                  className="add-cart-btn"
                  onClick={() => {
                    const sizeTxt = modalSelectedSize ? ` • ${modalSelectedSize.label}` : "";
                    const configTxt = Object.values(modalVariants)
                      .map((v) => v.label)
                      .join(", ");
                    handleAddToCart({
                      ...selectedProduct,
                      name: `${selectedProduct.name}${
                        isRecolorableProduct(selectedProduct)
                          ? ` (${modalColor.name}${sizeTxt}${configTxt ? ` • ${configTxt}` : ""})`
                          : `${sizeTxt ? ` (${sizeTxt.slice(3)})` : ""}`
                      }`,
                      price: computedModalPrice,
                      image: modalImage,
                    });
                    setSelectedProduct(null);
                  }}
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>

                <button
                  type="button"
                  className="add-cart-btn"
                  style={{ backgroundColor: "#25d366" }}
                  onClick={() => {
                    const allConfigs = {
                      ...(modalSelectedSize
                        ? { size: { label: modalSelectedSize.label, priceDiff: 0 } }
                        : {}),
                      ...modalVariants,
                    };
                    openCustomWhatsAppEnquiry(
                      selectedProduct,
                      modalColor,
                      allConfigs,
                      computedModalPrice
                    );
                  }}
                >
                  <MessageCircle size={16} /> Enquire on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;
