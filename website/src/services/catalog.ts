import { API_URL } from "../auth/authContext";
import { resolveCmsImage } from "./media";

export interface ProductImage {
  id: number;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
}

export interface ProductVariant {
  id: number;
  variant_name: string;
  price: string | number | null;
  stock_quantity: number;
  attributes: Record<string, string>;
  is_active: boolean;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  category_name: string | null;
  sub_category_name: string | null;
  short_description: string | null;
  description: string | null;
  price: string | number;
  discount_price: string | number | null;
  sku: string | null;
  stock_quantity: number;
  status: string;
  badge: string | null;
  specifications: { label: string; value: string }[];
  highlights: string[];
  info_sections: { title: string; content: string }[];
  variants: ProductVariant[];
  rating_avg: string | null;
  rating_count: number;
  images: ProductImage[];
}

export interface RelatedProduct {
  id: number;
  name: string;
  price: string | number;
  discount_price: string | number | null;
  category_name: string | null;
  image_url: string | null;
  rating_avg: string | null;
  rating_count: number;
}

const hiddenProductNames = new Set([
  "corporate reception desk",
  "round stainless stool",
  "rund stainless stool",
  "padded swivel lab & workshop stool",
  "height-adjustable utility stool",
  "compact round cushioned stool",
  "modern multipurpose seating stool",
  "executive 3-seater leatherette office sofa",
  "modern office sofa",
  "premium executive waiting sofa",
  "contemporary office lounge sofa",
]);
const hiddenProductIds = new Set([204, 216, 217, 218]);

const isVisibleProduct = (product: { id: number; name: string }) =>
  !hiddenProductIds.has(product.id) &&
  !hiddenProductNames.has(product.name.trim().toLowerCase());

export interface ProductListing {
  id: number;
  slug: string;
  category_id: number;
  sub_category_id: number | null;
  name: string;
  category_name: string | null;
  sub_category_name: string | null;
  short_description: string | null;
  description: string | null;
  price: string | number;
  discount_price: string | number | null;
  image_url: string | null;
  is_featured: boolean;
  stock_quantity: number;
  status: string;
  badge: string | null;
  rating_avg: string | number | null;
  rating_count: number;
  specifications: { label: string; value: string }[];
  highlights: string[];
  images: ProductImage[];
  variants: {
    id: number;
    variant_name: string;
    price: string | number | null;
    stock_quantity: number;
    attributes: Record<string, unknown>;
    is_active: boolean;
  }[];
}

export interface Review {
  id: number;
  reviewer_name: string;
  rating: number;
  title: string | null;
  comment: string | null;
  image_url?: string | null;
  is_verified_purchase: boolean;
  created_at: string;
}

export interface ReviewSummary {
  average: number;
  count: number;
  distribution: Record<number, number>;
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  // Append timestamp to bust any browser memory/disk cache
  const sep = path.includes("?") ? "&" : "?";
  const bustPath = `${path}${sep}_t=${Date.now()}`;
  const response = await fetch(`${API_URL}/api${bustPath}`, {
    ...init,
    cache: init?.cache ?? "no-store",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw Object.assign(new Error(body.message || "Something went wrong"), {
      status: response.status,
    });
  }

  return body.data !== undefined ? body.data : body;
};

export const fetchProduct = (id: string | number) =>
  request<ProductDetail>(`/products/${id}`).then((response) => {
    const product = response as ProductDetail;
    if (!isVisibleProduct(product)) throw new Error("Product unavailable");
    return {
      ...product,
      specifications: Array.isArray(product.specifications) ? product.specifications : [],
      highlights: Array.isArray(product.highlights) ? product.highlights : [],
      info_sections: Array.isArray(product.info_sections) ? product.info_sections : [],
      variants: Array.isArray(product.variants) ? product.variants : [],
      images: (Array.isArray(product.images) ? product.images : []).map((image) => ({
        ...image,
        image_url: resolveCmsImage(image.image_url) ?? image.image_url,
      })),
    };
  });

export const fetchProducts = () =>
  request<ProductListing[]>("/products").then((products) =>
    products.filter(isVisibleProduct).map((product) => ({
      ...product,
      image_url: resolveCmsImage(product.image_url),
      images: product.images.map((image) => ({
        ...image,
        image_url: resolveCmsImage(image.image_url) ?? image.image_url,
      })),
    }))
  );

export const fetchRelated = (id: string | number) =>
  request<RelatedProduct[]>(`/products/${id}/related?limit=12`).then((products) =>
    products.filter(isVisibleProduct).map((product) => ({
      ...product,
      image_url: resolveCmsImage(product.image_url),
    }))
  );

export const fetchReviews = (id: string | number) =>
  request<{ summary: ReviewSummary; reviews: Review[] }>(`/products/${id}/reviews`);

export const submitReview = (
  id: string | number,
  token: string,
  review: { rating: number; title: string; comment: string }
) =>
  request<{ message: string }>(`/products/${id}/reviews`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(review),
  }).then(() => "Thanks! Your review will appear once it has been approved.");

export const inr = (value: string | number) =>
  `₹${Math.round(Number(value)).toLocaleString("en-IN")}`;
