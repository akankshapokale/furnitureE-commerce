import { API_URL } from "../auth/authContext";

export type WebsiteContentRecord = {
  content_key: string;
  content: Record<string, unknown>;
  updated_at?: string;
};

let publishedContentRequest: Promise<Record<string, WebsiteContentRecord["content"]>> | null = null;
let publishedContentFetchedAt = 0;
const PUBLISHED_CONTENT_TTL_MS = 30_000;

export const fetchWebsiteContent = () => {
  if (!publishedContentRequest || Date.now() - publishedContentFetchedAt >= PUBLISHED_CONTENT_TTL_MS) {
    publishedContentFetchedAt = Date.now();
    publishedContentRequest = fetch(`${API_URL}/api/website-content`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to load website content");
        const body = await response.json();
        const records = Array.isArray(body.data) ? body.data as WebsiteContentRecord[] : [];
        return Object.fromEntries(records.map((record) => [record.content_key, record.content]));
      })
      .catch((error) => {
        publishedContentRequest = null;
        publishedContentFetchedAt = 0;
        throw error;
      });
  }
  return publishedContentRequest;
};

export const resetWebsiteContentCache = () => {
  publishedContentRequest = null;
  publishedContentFetchedAt = 0;
};
