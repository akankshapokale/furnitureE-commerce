import { API_URL } from "../auth/authContext";

export type CustomSizeStatus = "Pending" | "Under Review" | "Quotation Sent" | "Approved" | "Rejected";

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
  length_cm: number | string;
  width_cm: number | string;
  height_cm: number | string;
  measurement_unit: "CM";
  status: CustomSizeStatus;
  admin_remarks: string | null;
  quotation_amount: number | string | null;
  quotation_details: string | null;
  customer_decision: "Accepted" | "Rejected" | null;
  quotation_sent_at: string | null;
  order_id: number | null;
  created_at: string;
  updated_at: string;
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
  if (!response.ok) throw new Error(body.message || "Unable to process custom size request.");
  return body as T;
};

export const createCustomSizeRequest = (token: string, input: {
  productId: number;
  length: string;
  width: string;
  height: string;
}) => request<{ success: boolean; message: string; data: CustomSizeRequest }>("/", token, {
  method: "POST",
  body: JSON.stringify(input),
});

export const getMyCustomSizeRequests = (token: string) =>
  request<{ success: boolean; data: CustomSizeRequest[] }>("/my", token);

export const decideCustomSizeQuotation = (token: string, id: number, decision: "Accepted" | "Rejected") =>
  request<{ success: boolean; message: string; data: CustomSizeRequest }>(`/${id}/decision`, token, {
    method: "POST",
    body: JSON.stringify({ decision }),
  });
