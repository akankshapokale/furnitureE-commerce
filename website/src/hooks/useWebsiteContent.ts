import { useEffect, useState } from "react";
import { fetchWebsiteContent } from "../services/websiteContent";

export function useWebsiteContent(key: string) {
  const [content, setContent] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let current = true;
    fetchWebsiteContent()
      .then((all) => { if (current) setContent(all[key] ?? null); })
      .catch(() => { if (current) setError(true); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [key]);
  return { content, loading, error };
}
