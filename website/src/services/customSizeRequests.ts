import { API_URL } from "../auth/authContext";

export type CustomSizeStatus = "Pending" | "Under Review" | "Quotation Sent" | "Approved" | "Rejected";

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

export interface CustomSizeRequest {
  id: number;
  request_id: string;
  customer_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  product_id: number | null;
  product_name: string;
  product_image: string | null;
  reference_image?: string | null;
  length_cm: number | string;
  width_cm: number | string;
  height_cm: number | string;
  measurement_unit: "CM";
  additional_requirements?: string | null;
  status: CustomSizeStatus;
  admin_remarks: string | null;
  quotation_amount: number | string | null;
  quotation_details: string | null;
  additional_charges?: number | string | null;
  terms_and_conditions?: string | null;
  validity_date?: string | null;
  customer_decision: "Accepted" | "Rejected" | null;
  customer_decided_at?: string | null;
  customer_rejection_reason?: string | null;
  quotation_sent_at: string | null;
  order_id: number | null;
  created_at: string;
  updated_at: string;
  status_history?: CustomSizeStatusHistory[];
}

export interface CustomSizeValidationError {
  message: string;
  errors?: Record<string, string>;
}

const request = async <T>(path: string, token: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}/api/custom-size-requests${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(body.message || "Unable to process custom size request.") as Error & {
      errors?: Record<string, string>;
    };
    if (body.errors && typeof body.errors === "object") {
      err.errors = body.errors;
    }
    throw err;
  }
  return body as T;
};

export const uploadReferenceImage = async (token: string, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("reference_image", file);

  const response = await fetch(`${API_URL}/api/upload/reference-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || "Failed to upload reference image.");
  }
  return body.url as string;
};

export const createCustomSizeRequest = (token: string, input: {
  productId: number;
  length: string | number;
  width: string | number;
  height: string | number;
  unit?: string;
  additional_requirements?: string;
  reference_image?: string | null;
}) => request<{ success: boolean; message: string; data: CustomSizeRequest }>("/", token, {
  method: "POST",
  body: JSON.stringify(input),
});

export const getMyCustomSizeRequests = (token: string) =>
  request<{ success: boolean; data: CustomSizeRequest[] }>("/my", token);

export const getCustomSizeRequestById = (token: string, id: number) =>
  request<{ success: boolean; data: CustomSizeRequest }>(`/${id}`, token);

export const decideCustomSizeQuotation = (
  token: string,
  id: number,
  decision: "Accepted" | "Rejected",
  reason?: string
) =>
  request<{ success: boolean; message: string; data: CustomSizeRequest }>(`/${id}/decision`, token, {
    method: "POST",
    body: JSON.stringify({ decision, reason }),
  });
