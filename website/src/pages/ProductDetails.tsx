import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";

import Gallery from "../components/product/Gallery";
import Reviews from "../components/product/Reviews";
import Stars from "../components/product/Stars";
import LazyImage from "../components/common/LazyImage";
import { PageSkeleton } from "../components/common/Skeleton";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../auth/authContext";
import {
  fetchProduct,
  fetchRelated,
  inr,
  type ProductDetail,
  type RelatedProduct,
  type ProductVariant,
} from "../services/catalog";
import { createCustomSizeRequest } from "../services/customSizeRequests";
import type { CategoryProduct } from "../data/categoriesData";
import "../components/product/product-details.css";

const LOW_STOCK = 10;
const DELIVERY_DAYS = 8;
const correctEdgeBanding = (value: string) =>
  value.replace(/\bedge\s+binding\b/gi, "Edge Banding");

const toFallbackDetail = (item: CategoryProduct): ProductDetail => ({
  id: item.id,
  name: item.name,
  slug: String(item.id),
  category_name: item.category,
  sub_category_name: item.subcategoryName,
  short_description: item.description || null,
  description: item.description || null,
  price: item.oldPrice ?? item.price,
  discount_price: item.oldPrice ? item.price : null,
  sku: null,
  stock_quantity: 1,
  status: "active",
  badge: item.badge ?? null,
  specifications: item.specifications || [],
  highlights: [],
  info_sections: [],
  variants: [],
  rating_avg: item.rating == null ? null : String(item.rating),
  rating_count: item.ratingCount ?? 0,
  images: [
    ...(item.images?.length ? item.images : [item.image])
      .filter(Boolean)
      .map((image_url, index) => ({
        id: item.id * 100 + index,
        image_url,
        alt_text: item.name,
        is_primary: index === 0,
      })),
    ...(item.cmsDimensionImage ? [{
      id: item.id * 100 + 99,
      image_url: item.cmsDimensionImage,
      alt_text: "Product Dimensions",
      is_primary: false,
    }] : []),
  ],
});

const getSizeVariantLabel = (variant: ProductVariant) => {
  const attributes = variant.attributes || {};
  const sizeAttribute = Object.entries(attributes).find(([key]) => /size|dimension/i.test(key));
  const label = attributes.label == null ? "" : String(attributes.label).trim();
  const sizeLabel = sizeAttribute?.[1] == null ? "" : String(sizeAttribute[1]).trim();
  return correctEdgeBanding(label || sizeLabel || variant.variant_name);
};

const isSizeVariant = (variant: ProductVariant) => {
  const attributes = variant.attributes || {};
  const values = Object.values(attributes).join(" ");
  return Object.keys(attributes).some((key) => /size|dimension/i.test(key)) ||
    /\b(size|dimension|dimensions)\b/i.test(values) ||
    /\d+(?:\.\d+)?\s*[x\u00d7*]\s*\d+/i.test(`${variant.variant_name} ${values}`);
};

const normalizeDimensionLabel = (value: string) =>
  (value.match(/\d+(?:\.\d+)?/g) || []).slice(0, 3).join("x");

const getVariantSellingPrice = (variant: ProductVariant | undefined, baseSellingPrice: number) => {
  if (!variant) return null;
  const directPrice = variant.price == null ? null : Number(variant.price);
  if (directPrice !== null && Number.isFinite(directPrice)) return directPrice;

  const priceDiff = variant.attributes?.price_diff == null ? null : Number(variant.attributes.price_diff);
  return priceDiff !== null && Number.isFinite(priceDiff) ? baseSellingPrice + priceDiff : null;
};

const getVariantMrp = (variant: ProductVariant | undefined) => {
  const entry = Object.entries(variant?.attributes || {}).find(([key]) => /^(?:old[\s_-]*price|mrp)$/i.test(key.trim()));
  if (!entry) return null;
  const amount = Number(String(entry[1]).replace(/[^\d.-]/g, ""));
  return Number.isFinite(amount) ? amount : null;
};
const renderDescriptionPoint = (point: string) => {
  const labelEnd = point.indexOf(":");

  if (labelEnd <= 0) return point;

  return (
    <>
      <strong>{point.slice(0, labelEnd + 1)}</strong>
      {point.slice(labelEnd + 1)}
    </>
  );
};

const renderDescription = (description: string) =>
  correctEdgeBanding(description)
    .trim()
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((block, blockIndex) => {
      const lines = block.split(/\n+/).map((line) => line.trim()).filter(Boolean);
      const bulletLines = lines.map((line) => line.replace(/^[-*•–—]\s*/, ""));
      const hasLineBullets = lines.length > 1 && lines.some((line) => /^[-*•–—]\s+/.test(line));

      if (hasLineBullets) {
        return (
          <ul className="pd-description-list" key={blockIndex}>
            {bulletLines.map((line, index) => <li key={index}>{renderDescriptionPoint(line)}</li>)}
          </ul>
        );
      }

      const dashParts = lines.join(" ").split(/\s+-\s+/).map((part) => part.trim()).filter(Boolean);
      if (dashParts.length > 1) {
        const firstPart = dashParts[0];
        const hasHeading = /(?:key\s+features?|highlights?|product\s+details|overview)\s*$/i.test(firstPart);
        const points = dashParts.slice(1);

        return (
          <div className="pd-description-group" key={blockIndex}>
            {hasHeading ? <h3>{firstPart}</h3> : <p className="pd-prose">{firstPart}</p>}
            <ul className="pd-description-list">
              {points.map((point, index) => <li key={index}>{renderDescriptionPoint(point)}</li>)}
            </ul>
          </div>
        );
      }

      return <p key={blockIndex} className="pd-prose">{lines.join(" ")}</p>;
    });

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, token } = useAuth();
  const fallbackProduct = (location.state as { fallbackProduct?: CategoryProduct } | null)?.fallbackProduct;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "error">("loading");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [selectedDimension, setSelectedDimension] = useState("");
  const [customSizeSelected, setCustomSizeSelected] = useState(false);
  const [customDimensions, setCustomDimensions] = useState({ length: "", width: "", height: "" });
  const [customUnit, setCustomUnit] = useState<"CM">("CM");
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [customRequestState, setCustomRequestState] = useState({ loading: false, message: "", error: false });

  useEffect(() => {
    setSelectedVariantId(null);
    setSelectedDimension("");
    setCustomSizeSelected(false);
    setCustomDimensions({ length: "", width: "", height: "" });
    setCustomUnit("CM");
    setAdditionalRequirements("");
    setFieldErrors({});
    setQuantity(1);
  }, [id]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("customSizeRequestDraft");
      if (!saved) return;
      const draft = JSON.parse(saved) as { productId?: string | number; dimensions?: typeof customDimensions };
      if (String(draft.productId) === String(id) && draft.dimensions) {
        setCustomDimensions(draft.dimensions);
        setCustomSizeSelected(true);
      }
    } catch {
      sessionStorage.removeItem("customSizeRequestDraft");
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    fetchProduct(id!)
      .then((data) => {
        if (cancelled) return;

        if (data.status !== "active") {
          if (fallbackProduct) {
            setProduct(toFallbackDetail(fallbackProduct));
            setStatus("ready");
            return;
          }
          setStatus("missing");
          return;
        }

        const fallbackImages = fallbackProduct
          ? (fallbackProduct.images?.length ? fallbackProduct.images : [fallbackProduct.image])
              .filter(Boolean)
              .map((image_url, index) => ({
                id: fallbackProduct.id * 100 + index,
                image_url,
                alt_text: fallbackProduct.name,
                is_primary: false,
              }))
          : [];
        const images = data.images.length > 0 ? data.images : fallbackImages;
        setProduct({ ...data, images });
        setStatus("ready");
        document.title = `${data.name} | Staging Spaces`;
      })
      .catch((err) => {
        if (cancelled) return;
        if (fallbackProduct) {
          setProduct(toFallbackDetail(fallbackProduct));
          setStatus("ready");
        } else {
          setStatus(err?.status === 404 ? "missing" : "error");
        }
      });

    fetchRelated(id!)
      .then((data) => !cancelled && setRelated(data))
      .catch(() => undefined);

    return () => {
      cancelled = true;
      document.title = "Staging Spaces";
    };
  }, [id, fallbackProduct]);

  if (status === "loading") return <PageSkeleton variant="detail" />;

  if (status !== "ready" || !product) {
    return (
      <section className="pd-page pd-empty">
        <div className="pd-container">
          <p className="pd-eyebrow">Product</p>
          <h1>{status === "error" ? "We couldn't load this product" : "Product not found"}</h1>
          <p>
            {status === "error"
              ? "Please check your connection and try again."
              : "The product you are looking for does not exist or may have been removed."}
          </p>
          <Link to="/shop" className="pd-dark-btn">
            <ArrowLeft size={17} /> Back to shop
          </Link>
        </div>
      </section>
    );
  }

  const dimensions = correctEdgeBanding(product.specifications.find(
    (spec) => /^(?:dimensions?|size|available sizes?)(?:\b|\s*\()/i.test(spec.label.trim()),
  )?.value ?? "");
  const aboutProductText = product.description?.trim() || product.short_description?.trim() || "";
  const dimensionSizeOptions = [...new Set((dimensions || "").split(/[|;\n]+/).map((size) => size.trim()).filter(Boolean))];
  const sizeVariants = product.variants.filter((variant) => variant.is_active && isSizeVariant(variant));
  const customSizeIsValid = [customDimensions.length, customDimensions.width, customDimensions.height]
    .every((value) => value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) > 0);
  const customDimensionLabel = `${customDimensions.length} x ${customDimensions.width} x ${customDimensions.height}`;
  const selectedDimensionOption = dimensionSizeOptions.length > 0
    ? selectedDimension || dimensionSizeOptions[0]
    : undefined;
  const selectedDimensionIndex = selectedDimensionOption
    ? dimensionSizeOptions.findIndex((size) => normalizeDimensionLabel(size) === normalizeDimensionLabel(selectedDimensionOption))
    : -1;
  const dimensionPriceOffset = Math.max(0, selectedDimensionIndex) * 2000;
  const matchingSizeVariant = (label: string | undefined) => label
    ? sizeVariants.find((variant) => normalizeDimensionLabel(getSizeVariantLabel(variant)) === normalizeDimensionLabel(label))
    : undefined;
  const matchingDimensionVariant = matchingSizeVariant(selectedDimensionOption);
  const matchingCustomVariant = customSizeIsValid ? matchingSizeVariant(customDimensionLabel) : undefined;
  const selectedVariant = customSizeSelected
    ? matchingCustomVariant
    : dimensionSizeOptions.length > 0
      ? matchingDimensionVariant
      : sizeVariants.find((variant) => variant.id === selectedVariantId) ?? sizeVariants[0];
  const hasSizeChoices = true; // Always offer custom dimensions, even when no standard sizes are configured.
  const customSizeLabel = `Custom: ${customDimensions.length || "—"} × ${customDimensions.width || "—"} × ${customDimensions.height || "—"} cm`;
  const productRegular = Number(product.price);
  const productSelling = product.discount_price ? Number(product.discount_price) : productRegular;
  const variantPriceDiff = selectedVariant?.attributes?.price_diff == null
    ? null
    : Number(selectedVariant.attributes.price_diff);
  const configuredVariantSelling = getVariantSellingPrice(selectedVariant, productSelling);
  const variantSelling = configuredVariantSelling ?? (!customSizeSelected && dimensionSizeOptions.length > 0
    ? productSelling + dimensionPriceOffset
    : null);
  const variantMrp = getVariantMrp(selectedVariant);
  const regular = variantSelling === null
    ? productRegular
    : variantMrp !== null && Number.isFinite(variantMrp)
      ? Math.max(variantSelling, variantMrp)
      : variantPriceDiff !== null && Number.isFinite(variantPriceDiff)
        ? Math.max(variantSelling, productRegular + variantPriceDiff)
        : Math.max(productRegular + (!customSizeSelected && dimensionSizeOptions.length > 0 ? dimensionPriceOffset : 0), variantSelling);
  const selling = variantSelling ?? productSelling;
  const hasDiscount = selling < regular;
  const percentOff = hasDiscount ? Math.round(((regular - selling) / regular) * 100) : 0;
  const canPurchaseSelection = !customSizeSelected || customSizeIsValid;
  const estimatedDeliveryDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(Date.now() + DELIVERY_DAYS * 24 * 60 * 60 * 1000));
  const dimensionsImage = product.images.find((image) =>
    /dimension|measurement|size\s*chart/i.test(image.alt_text || ""),
  );
  const galleryImages = product.images.filter((image) => image.id !== dimensionsImage?.id);
  const primary = product.images.find((image) => image.is_primary) ?? product.images[0];
  const availableStock = selectedVariant?.stock_quantity ?? product.stock_quantity;
  const wishlistActive = isInWishlist(product.id);
  const outOfStock = availableStock <= 0;
  const lowStock = !outOfStock && availableStock <= LOW_STOCK;
  const maxQuantity = Math.max(1, availableStock);

  const cartItem = {
    id: product.id,
    name: product.name,
    category: product.category_name ?? "Furniture",
    price: selling,
    oldPrice: hasDiscount ? regular : undefined,
    variantId: selectedVariant?.id,
    variantName: customSizeSelected
      ? customSizeLabel
      : selectedVariant ? getSizeVariantLabel(selectedVariant) : selectedDimensionOption,
    image: primary?.image_url ?? "",
  };

  const handleAddToCart = () => {
    if (!canPurchaseSelection || outOfStock) return;
    addToCart(cartItem, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const validateCustomSizeForm = () => {
    const errors: Record<string, string> = {};

    // 1. Length, Width, Height – Required, numeric, greater than 0
    (["length", "width", "height"] as const).forEach((dim) => {
      const val = customDimensions[dim]?.trim();
      if (!val) {
        errors[dim] = `${dim.charAt(0).toUpperCase() + dim.slice(1)} is required.`;
      } else {
        const num = Number(val);
        if (!Number.isFinite(num) || num <= 0) {
          errors[dim] = `${dim.charAt(0).toUpperCase() + dim.slice(1)} must be a positive number greater than 0.`;
        } else if (num > 10000) {
          errors[dim] = `${dim.charAt(0).toUpperCase() + dim.slice(1)} exceeds maximum limit (10,000 cm).`;
        }
      }
    });

    // 2. Unit – Required; validate against existing available options
    if (!customUnit || customUnit !== "CM") {
      errors.unit = "Unit must be CM.";
    }

    // 3. Additional Requirements – Optional, maximum character limit (1,000 chars)
    if (additionalRequirements && additionalRequirements.length > 1000) {
      errors.additional_requirements = `Additional requirements cannot exceed 1,000 characters (currently ${additionalRequirements.length}).`;
    }



    // 5. Product ID check
    if (!product?.id) {
      errors.productId = "Product is unavailable.";
    }

    setFieldErrors(errors);
    return errors;
  };

  const handleSubmitCustomSize = async () => {
    setCustomRequestState({ loading: false, message: "", error: false });

    const errors = validateCustomSizeForm();
    if (Object.keys(errors).length > 0) {
      setCustomRequestState({
        loading: false,
        message: "Please resolve the highlighted field errors below.",
        error: true,
      });
      return;
    }

    if (!user || !token) {
      sessionStorage.setItem("customSizeRequestDraft", JSON.stringify({
        productId: id,
        dimensions: customDimensions,
        unit: customUnit,
        additionalRequirements,
      }));
      sessionStorage.setItem("customSizeReturnTo", location.pathname);
      navigate("/login", { state: { returnTo: location.pathname } });
      return;
    }

    // 9. Disable submit button while submitting to prevent duplicate requests
    setCustomRequestState({ loading: true, message: "", error: false });

    try {
      const response = await createCustomSizeRequest(token, {
        productId: product.id,
        ...customDimensions,
        unit: customUnit,
        additional_requirements: additionalRequirements || undefined,
      });

      sessionStorage.removeItem("customSizeRequestDraft");
      sessionStorage.removeItem("customSizeReturnTo");
      setFieldErrors({});
      setAdditionalRequirements("");
      setCustomRequestState({
        loading: false,
        message: `Request submitted successfully! Your Request ID is ${response.data.request_id}. You can track it under My Custom Size Requests.`,
        error: false,
      });
    } catch (error: any) {
      if (error?.errors && typeof error.errors === "object") {
        setFieldErrors(error.errors);
      }
      setCustomRequestState({
        loading: false,
        message: error instanceof Error ? error.message : "Could not submit the request. Please try again.",
        error: true,
      });
    }
  };

  const handleBuyNow = () => {
    if (outOfStock || !canPurchaseSelection) return;
    navigate("/checkout", {
      state: { buyNowItem: { ...cartItem, quantity } },
    });
  };

  const jumpTo = (sectionId: string) =>
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section className="pd-page">
      <div className="pd-container">

        <button
          type="button"
          className="pd-back-link"
          onClick={() => {
            const historyIndex = window.history.state?.idx;
            if (typeof historyIndex === "number" && historyIndex > 0) {
              if (fallbackProduct) sessionStorage.setItem("furniture:return-product-card", String(product.id));
              navigate(-1);
            } else navigate("/shop");
          }}
        >
          <ArrowLeft size={16} /> Back to products
        </button>

        <nav className="pd-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          {product.category_name && <><span>/</span><Link className="pd-category-link" to={`/category/${product.category_name.toLowerCase().replaceAll(" ", "-")}`}>{product.category_name}</Link></>}
          <span>/</span>
          <strong>{correctEdgeBanding(product.name)}</strong>
        </nav>

        {/* Top: gallery + buy box */}
        <div className="pd-top">
          <Gallery
            images={galleryImages.length > 0 ? galleryImages : product.images}
            name={product.name}
            badge={percentOff > 0 ? `${percentOff}% OFF` : undefined}
            wishlisted={wishlistActive}
            onToggleWishlist={() => toggleWishlist({
              id: product.id,
              name: product.name,
              category: product.category_name ?? "Furniture",
              price: selling,
              oldPrice: hasDiscount ? regular : undefined,
              image: primary?.image_url ?? "",
            })}
          />

          <div className="pd-buy">
            {product.category_name && <p className="pd-eyebrow"><Link className="pd-category-link" to={`/category/${product.category_name.toLowerCase().replaceAll(" ", "-")}`}>{product.category_name}</Link></p>}
            <h1>{correctEdgeBanding(product.name)}</h1>

            {Number(product.rating_count) > 0 && (
              <button
                type="button"
                className="pd-product-rating pd-rating-link"
                aria-label={`${product.rating_avg} out of 5, ${product.rating_count} reviews. Read customer reviews.`}
                onClick={() => jumpTo("reviews")}
              >
                <Stars value={Number(product.rating_avg)} size={17} />
                <span>{Number(product.rating_avg).toFixed(1)} / 5 ({product.rating_count})</span>
                <span className="pd-read-reviews">Read reviews</span>
              </button>
            )}

            {hasSizeChoices ? (
              <div className="pd-size-options pd-size-options-inline">
                <strong>Choose a standard size or customize it (cm)</strong>
                <div className="pd-size-options-row">
                  <div>
                    {dimensionSizeOptions.length > 0
                    ? dimensionSizeOptions.map((size) => {
                        const variant = sizeVariants.find((item) => normalizeDimensionLabel(getSizeVariantLabel(item)) === normalizeDimensionLabel(size));
                        const selected = normalizeDimensionLabel(size) === normalizeDimensionLabel(selectedDimensionOption ?? "");
                        return (
                          <button
                            key={size}
                            type="button"
                            className={selected ? "selected" : ""}
                            aria-pressed={selected}
                            disabled={Boolean(variant && variant.stock_quantity <= 0)}
                            onClick={() => {
                              setCustomSizeSelected(false);
                              setSelectedDimension(size);
                              setSelectedVariantId(variant?.id ?? null);
                              setQuantity(1);
                            }}
                          >
                            <span>{size}</span>
                          </button>
                        );
                      })
                    : sizeVariants.map((variant) => {
                        const variantPrice = getVariantSellingPrice(variant, productSelling);
                        const selected = variant.id === selectedVariant?.id;
                        return (
                          <button
                            key={variant.id}
                            type="button"
                            className={selected ? "selected" : ""}
                            aria-pressed={selected}
                            disabled={variant.stock_quantity <= 0}
                            onClick={() => { setCustomSizeSelected(false); setSelectedVariantId(variant.id); setSelectedDimension(""); setQuantity(1); }}
                          >
                            <span>{getSizeVariantLabel(variant)}</span>
                            {variantPrice != null && Number.isFinite(variantPrice) && <small>{inr(variantPrice)}</small>}
                          </button>
                        );
                      })}
                  </div>
                  <button
                    type="button"
                    className={`pd-custom-size-toggle ${customSizeSelected ? "selected" : ""}`}
                    aria-pressed={customSizeSelected}
                    onClick={() => setCustomSizeSelected(true)}
                  >
                    Customize size
                  </button>
                </div>
                {customSizeSelected && (
                  <>
                  <div className="pd-custom-size-fields">
                    {(["length", "width", "height"] as const).map((dimension) => (
                      <label key={dimension}>
                        <span>{dimension[0].toUpperCase() + dimension.slice(1)} (cm) *</span>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          inputMode="decimal"
                          placeholder={`Enter ${dimension}`}
                          value={customDimensions[dimension]}
                          onChange={(event) => {
                            const val = event.target.value;
                            setCustomDimensions((current) => ({ ...current, [dimension]: val }));
                            if (fieldErrors[dimension]) {
                              setFieldErrors((curr) => {
                                const next = { ...curr };
                                delete next[dimension];
                                return next;
                              });
                            }
                          }}
                          aria-invalid={Boolean(fieldErrors[dimension])}
                          style={fieldErrors[dimension] ? { borderColor: "#b42318" } : undefined}
                        />
                        {fieldErrors[dimension] && (
                          <span style={{ color: "#b42318", fontSize: 11, fontWeight: 500, marginTop: 2 }}>
                            {fieldErrors[dimension]}
                          </span>
                        )}
                      </label>
                    ))}

                    <label style={{ gridColumn: "1 / -1" }}>
                      <span>Additional Requirements (Optional, max 1,000 characters)</span>
                      <textarea
                        rows={2}
                        maxLength={1000}
                        placeholder="Mention any specific details (e.g. edge style, cut-outs, cable grommet position)..."
                        value={additionalRequirements}
                        onChange={(e) => {
                          setAdditionalRequirements(e.target.value);
                          if (fieldErrors.additional_requirements) {
                            setFieldErrors((curr) => {
                              const next = { ...curr };
                              delete next.additional_requirements;
                              return next;
                            });
                          }
                        }}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          border: fieldErrors.additional_requirements ? "1px solid #b42318" : "1px solid #d9d5ce",
                          font: "inherit",
                          fontSize: 13,
                          boxSizing: "border-box",
                        }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                        {fieldErrors.additional_requirements ? (
                          <span style={{ color: "#b42318", fontSize: 11, fontWeight: 500 }}>
                            {fieldErrors.additional_requirements}
                          </span>
                        ) : <span />}
                        <span style={{ fontSize: 11, color: "#8a857e" }}>{additionalRequirements.length}/1000</span>
                      </div>
                    </label>

                    <p>Enter your required dimensions in centimeters. We’ll include them with your order.</p>
                  </div>
                  <button type="button" className="pd-dark-btn pd-submit-custom-size" onClick={handleSubmitCustomSize} disabled={customRequestState.loading}>
                    {customRequestState.loading ? "Submitting..." : "Submit Custom Size"}
                  </button>
                  {customRequestState.message && <p role="status" style={{ color: customRequestState.error ? "#b42318" : "#18794e", marginTop: 8 }}>{customRequestState.message}</p>}
                  </>
                )}
              </div>
            ) : dimensions ? (
              <p className="pd-dimensions">
                <strong>Dimensions</strong>
                <span>{dimensions}</span>
              </p>
            ) : null}

            <div className="pd-price">
              <strong>{inr(selling)}</strong>
              {hasDiscount && <s>{inr(regular)}</s>}
              {hasDiscount && <span className="pd-save">You save {inr(regular - selling)}</span>}
            </div>
            <p className="pd-tax-note">Inclusive of all taxes</p>

            {!outOfStock && (
              <div className="pd-delivery-estimate">
                <Truck size={19} aria-hidden="true" />
                <div>
                  <strong>Estimated delivery by {estimatedDeliveryDate}</strong>
                  <span>Order today for delivery in {DELIVERY_DAYS} days</span>
                </div>
              </div>
            )}

            {product.highlights.length > 0 && (
              <ul className="pd-highlights">
                {product.highlights.map((highlight) => (
                  <li key={highlight}>
                    <Check size={16} />
                    {correctEdgeBanding(highlight)}
                  </li>
                ))}
              </ul>
            )}

            <p className={`pd-stock ${outOfStock ? "out" : lowStock ? "low" : "in"}`}>
              {outOfStock
                ? "Currently out of stock"
                : lowStock
                ? `Only ${availableStock} left in stock`
                : "In stock"}
            </p>

            {/* Quantity + primary purchase action */}
            <div className="pd-primary-row">
              <div className="pd-quantity">
                <span>Quantity</span>
                <div>
                  <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" disabled={outOfStock}>
                    <Minus size={16} />
                  </button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))} aria-label="Increase quantity" disabled={outOfStock}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="pd-quantity-total" aria-live="polite">
                <span>Total</span>
                <strong>{inr(selling * quantity)}</strong>
              </div>

              <div className="pd-purchase-buttons">
                <button type="button" className="pd-dark-btn pd-buy-now" onClick={handleAddToCart} disabled={outOfStock || !canPurchaseSelection}>
                  <ShoppingCart size={18} /> {added ? "Added to cart" : "Add to cart"}
                </button>
                <button type="button" className="pd-buy-now-secondary" onClick={handleBuyNow} disabled={outOfStock || !canPurchaseSelection}>
                  Buy Now
                </button>
              </div>
            </div>

            <div className="pd-product-facts">
              <div className="pd-product-fact pd-warranty-fact">
                <ShieldCheck size={19} />
                <strong>2-year warranty</strong>
              </div>
              {product.sku && (
                <div className="pd-product-fact"><span>SKU</span><strong>{product.sku}</strong></div>
              )}
              {product.category_name && (
                <div className="pd-product-fact"><span>Category</span><strong><Link className="pd-category-link" to={`/category/${product.category_name.toLowerCase().replaceAll(" ", "-")}`}>{product.category_name}</Link></strong></div>
              )}
              <div className="pd-product-fact"><span>Return Policy</span><strong>No returns</strong></div>
            </div>

            {(aboutProductText || product.info_sections.length > 0) && (
              <section id="description" className="pd-buy-description">
                <h2>About this product</h2>
                {aboutProductText && renderDescription(aboutProductText)}
                {product.info_sections.length > 0 && (
                  <div id="information" className="pd-title-information">
                    {product.info_sections.map((section) => (
                      <section className="pd-title-information-item" key={section.title}>
                        <h3>{correctEdgeBanding(section.title)}</h3>
                        {renderDescription(section.content)}
                      </section>
                    ))}
                  </div>
                )}
              </section>
            )}

            {!dimensionsImage && product.specifications.length > 0 && (
              <section id="specifications" className="pd-section pd-data-panel pd-buy-specifications">
                <h2>Product Specifications</h2>
                <div className="pd-spec-table-wrap">
                  <table className="pd-spec-table">
                    <tbody>
                      {product.specifications.map((spec) => (
                        <tr key={spec.label}>
                          <th scope="row">{correctEdgeBanding(spec.label)}</th>
                          <td>{correctEdgeBanding(spec.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

          </div>
        </div>

        {/* Product dimensions and specifications */}
        {dimensionsImage && (
          <div className="pd-product-data-grid">
            <section id="dimensions" className="pd-section pd-data-panel pd-dimensions-panel">
              <img
                className="pd-dimensions-image"
                src={dimensionsImage.image_url}
                alt={dimensionsImage.alt_text || `${product.name} dimensions`}
                loading="lazy"
              />
            </section>
            {product.specifications.length > 0 && (
              <section id="specifications" className="pd-section pd-data-panel pd-specifications-panel">
                <h2>Product Specifications</h2>
                <div className="pd-spec-table-wrap">
                  <table className="pd-spec-table">
                    <tbody>
                      {product.specifications.map((spec) => (
                        <tr key={spec.label}>
                          <th scope="row">{correctEdgeBanding(spec.label)}</th>
                          <td>{correctEdgeBanding(spec.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        )}

        <section id="reviews" className="pd-section pd-reviews-section">
          <h2>Customer reviews</h2>
          <Reviews productId={product.id} />
        </section>

        {/* Similar products */}
        {related.length > 0 && (
          <section className="pd-section">
            <div className="pd-related-heading">
              <h2>You may also like</h2>
            </div>
            <div
              className="pd-related"
              aria-label="You may also like products"
            >
              {related.slice(0, 4).map((item) => {
                const itemRegular = Number(item.price);
                const itemSelling = item.discount_price ? Number(item.discount_price) : itemRegular;

                return (
                  <Link key={item.id} to={`/product/${item.id}`} className="pd-related-card">
                    <div className="pd-related-image">
                      {item.image_url && <LazyImage src={item.image_url} alt={item.name} width={600} />}
                      {itemSelling < itemRegular && (
                        <span className="pd-badge small">
                          {Math.round(((itemRegular - itemSelling) / itemRegular) * 100)}% OFF
                        </span>
                      )}
                    </div>
                    <p className="pd-eyebrow small">{item.category_name}</p>
                    <h3>{item.name}</h3>
                    <div className="pd-related-rating">
                      {item.rating_count > 0 && <>
                        <Stars value={Number(item.rating_avg)} size={13} />
                        <span>({item.rating_count})</span>
                      </>}
                    </div>
                    <p className="pd-related-price">
                      <strong>{inr(itemSelling)}</strong>
                      {itemSelling < itemRegular && <s>{inr(itemRegular)}</s>}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </section>
  );
};

export default ProductDetails;

