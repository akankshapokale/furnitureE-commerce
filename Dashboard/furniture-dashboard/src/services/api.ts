import axios, { isAxiosError } from "axios";

// A trailing slash in VITE_API_URL would produce "//api/..." URLs, which Vercel redirects (breaking CORS).
export const API_ORIGIN: string = (
  import.meta.env.VITE_API_URL ?? "http://localhost:5000"
).replace(/\/+$/, "");

export const API_BASE_URL = `${API_ORIGIN}/api`;

export const getMediaUrl = (url?: string | null): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const clean = url.startsWith("/") ? url : `/${url}`;
  return `${API_ORIGIN}${clean}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Force no-cache on every axios request so CMS always gets fresh images/data
api.interceptors.request.use((config) => {
  config.params = { ...config.params, _t: Date.now() };
  config.headers["Cache-Control"] = "no-store";
  config.headers["Pragma"] = "no-cache";
  return config;
}, (error) => Promise.reject(error));

// Server-provided error message, or the fallback.
export const apiError = (err: unknown, fallback: string): string => {
  if (isAxiosError(err)) {
    const body = err.response?.data;
    if (typeof body?.message === "string" && body.message.trim()) return body.message;
    if (typeof body?.error === "string" && body.error.trim()) return body.error;
    if (Array.isArray(body?.errors) && body.errors.length) {
      return body.errors.map((item: unknown) => typeof item === "string" ? item : (item as { message?: string })?.message).filter(Boolean).join(" ") || fallback;
    }
  }
  return err instanceof Error && err.message ? err.message : fallback;
};

export const TOKEN_KEY = "staff_token";

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// An expired/invalid token on a request we authenticated means the session is over.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      window.dispatchEvent(new Event("auth:expired"));
    }

    return Promise.reject(error);
  }
);

// ==================== PEOPLE (admin only) ====================

export interface PersonPayload {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  designation?: string;
  department?: string;
  permissions: string[];
  is_active?: boolean;
}

export const getPeople = () => api.get("/people");

export const createPerson = (data: PersonPayload) => api.post("/people", data);

export const updatePerson = (id: number, data: PersonPayload) =>
  api.put(`/people/${id}`, data);

export const deletePerson = (id: number) => api.delete(`/people/${id}`);

// ==================== SHIPMENTS ====================

export const updateShipment = (
  id: number,
  data: {
    courier_name?: string | null;
    tracking_number?: string | null;
    shipment_status?: string;
    shipped_at?: string | null;
    estimated_delivery?: string | null;
    delivered_at?: string | null;
  }
) => {
  return api.put(`/shipments/${id}`, data);
};

// ==================== ORDERS ====================

export const getOrders = () => {
  return api.get("/orders");
};

export interface CustomSizeStatusHistory {
  id: number;
  request_id: number;
  from_status: string | null;
  to_status: string;
  action_by_type: "customer" | "admin" | "system";
  action_by_id: number | null;
  action_by_name: string | null;
  remarks: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface CustomSizeRequestRecord {
  id: number;
  request_id: string;
  customer_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  product_id: number | null;
  product_name: string;
  product_image: string | null;
  additional_requirements?: string | null;
  reference_image?: string | null;
  length_cm: string | number;
  width_cm: string | number;
  height_cm: string | number;
  measurement_unit: "CM";
  status: "Pending" | "Under Review" | "Quotation Sent" | "Approved" | "Rejected";
  admin_remarks: string | null;
  quotation_amount: string | number | null;
  quotation_details: string | null;
  additional_charges?: string | number | null;
  terms_and_conditions?: string | null;
  validity_date?: string | null;
  customer_decision: "Accepted" | "Rejected" | null;
  customer_decided_at?: string | null;
  customer_rejection_reason?: string | null;
  quotation_sent_at?: string | null;
  order_id?: number | null;
  created_at: string;
  updated_at?: string;
  status_history?: CustomSizeStatusHistory[];
}

export const getCustomSizeRequests = () => api.get("/custom-size-requests/admin");
export const reviewCustomSizeRequest = (id: number, data?: { admin_remarks?: string }) =>
  api.post(`/custom-size-requests/admin/${id}/review`, data || {});
export const sendCustomSizeQuotation = (id: number, data: {
  quotation_amount: string | number;
  quotation_details: string;
  additional_charges?: string | number;
  terms_and_conditions?: string;
  validity_date?: string;
  admin_remarks?: string;
}) => api.post(`/custom-size-requests/admin/${id}/quote`, data);
export const updateCustomSizeRequest = (id: number, data: Partial<CustomSizeRequestRecord>) =>
  api.patch(`/custom-size-requests/admin/${id}`, data);

// ==================== PRODUCTS (CMS) ====================

export interface ProductImage {
  id?: number;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
}

export interface ProductVariant {
  id?: number;
  variant_name: string;
  sku: string | null;
  price: number | string | null;
  stock_quantity: number | string;
  attributes: Record<string, string>;
  is_active: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface InfoSection {
  title: string;
  content: string;
}

export interface ProductRecord {
  id: number;
  category_id: number;
  sub_category_id: number | null;
  category_name?: string | null;
  sub_category_name?: string | null;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number | string;
  discount_price: number | string | null;
  sku: string | null;
  stock_quantity: number;
  status: "active" | "draft" | "archived";
  is_featured: boolean;
  badge: string | null;
  catalog_rating: number | string | null;
  catalog_rating_count: number;
  specifications: ProductSpec[];
  highlights: string[];
  info_sections: InfoSection[];
  related_product_ids: number[];
  image_url?: string | null;
  image_count?: number;
  variant_count?: number;
  images?: ProductImage[];
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface ProductPayload {
  category_id: number | string;
  sub_category_id: number | string | null;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: number | string;
  discount_price: number | string | null;
  sku: string;
  stock_quantity: number | string;
  status: string;
  is_featured: boolean;
  badge: string;
  catalog_rating: number | string | null;
  catalog_rating_count: number | string;
  specifications: ProductSpec[];
  highlights: string[];
  info_sections: InfoSection[];
  related_product_ids: number[];
  images: ProductImage[];
  variants: ProductVariant[];
}

export const getProducts = () => api.get("/products/admin");

export const getProduct = (id: number | string) => api.get(`/products/admin/${id}`);

export const createProduct = (data: ProductPayload) => api.post("/products", data);

export const updateProduct = (id: number | string, data: ProductPayload) =>
  api.put(`/products/${id}`, data);

export const updateProductStatus = (id: number, status: string) =>
  api.patch(`/products/${id}/status`, { status });

export const deleteProduct = (id: number) => api.delete(`/products/${id}`);

// ==================== REVIEWS ====================

export interface ProductReview {
  id: number;
  product_id: number;
  reviewer_name: string;
  rating: number;
  title: string | null;
  comment: string | null;
  image_url?: string | null;
  image_urls?: string[] | null;
  is_verified_purchase: boolean;
  status: "pending" | "approved" | "hidden";
  created_at: string;
}

export const getReviews = (params: { product_id?: number; status?: string } = {}) =>
  api.get("/reviews", { params });

export const createReview = (data: {
  product_id: number;
  reviewer_name: string;
  rating: number;
  title?: string;
  comment?: string;
  status?: string;
  is_verified_purchase?: boolean;
  image_url?: string | null;
  image_urls?: string[];
  created_at?: string;
}) => api.post("/reviews", data);

export const updateReview = (id: number, data: Partial<ProductReview>) =>
  api.put(`/reviews/${id}`, data);

export const deleteReview = (id: number) => api.delete(`/reviews/${id}`);

// ==================== CATEGORIES / SUB-CATEGORIES ====================

export interface Category {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
}

export interface SubCategory {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  group_name?: string | null;
  is_active: boolean;
}

export const getCategories = () => api.get("/categories/admin");
export const createCategory = (data: Partial<Category>) => api.post("/categories", data);
export const updateCategory = (id: number, data: Partial<Category>) =>
  api.put(`/categories/${id}`, data);
export const deleteCategory = (id: number, replacementCategoryId?: number) =>
  api.delete(`/categories/${id}`, {
    data: replacementCategoryId ? { replacement_category_id: replacementCategoryId } : {},
  });

export const getSubCategories = () => api.get("/sub-categories/admin");
export const createSubCategory = (data: Partial<SubCategory>) =>
  api.post("/sub-categories", data);
export const updateSubCategory = (id: number, data: Partial<SubCategory>) =>
  api.put(`/sub-categories/${id}`, data);
export const deleteSubCategory = (id: number) => api.delete(`/sub-categories/${id}`);

// ==================== USERS ====================

export const getUsers = () => {
  return api.get("/users");
};

export const deleteUser = (id: number) => api.delete(`/users/${id}`);
export const updateUser = (id: number, data: Partial<CustomerPayload>) => api.put(`/users/${id}`, data);

export interface CustomerPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: "customer";
  is_active: boolean;
  pincode?: string;
  flat?: string;
  area?: string;
  landmark?: string;
  city?: string;
  state?: string;
}

export const createCustomer = (data: CustomerPayload) => api.post("/users", data);

// ==================== PAYMENTS ====================

export const getPayments = () => {
  return api.get("/payments");
};

// ==================== SHIPMENTS ====================

export const getShipments = () => {
  return api.get("/shipments");
};

export default api;
