import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { BadgeCheck, CalendarDays, ImagePlus, Plus, Star, Trash2, X } from "lucide-react";
import ConfirmDialog from "../common/ConfirmDialog";
import DateRangeCalendar from "../common/DateRangeCalendar";

import {
  apiError,
  createReview,
  deleteReview,
  getReviews,
  updateReview,
  type ProductReview,
  API_ORIGIN,
  getMediaUrl,
} from "../../services/api";

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-green-50 text-green-700",
  pending: "bg-yellow-50 text-yellow-700",
  hidden: "bg-slate-100 text-slate-600",
};

const input =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100";

const Stars = ({ value }: { value: number }) => (
  <span className="inline-flex text-amber-500" aria-label={`${value} out of 5`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} size={14} fill={n <= value ? "currentColor" : "none"} className={n <= value ? "" : "text-slate-300"} />
    ))}
  </span>
);

const localDateValue = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const reviewDateValue = (value?: string | null) => {
  if (!value) return localDateValue();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? localDateValue() : localDateValue(date);
};
const MAX_IMAGES = 6;
const reviewImages = (r: ProductReview): string[] =>
  r.image_urls && r.image_urls.length ? r.image_urls : r.image_url ? [r.image_url] : [];
const emptyForm = { reviewer_name: "", rating: 5, title: "", comment: "", status: "approved", verified: true, image_urls: [] as string[], review_date: localDateValue() };

const ReviewsManager = ({ productId }: { productId: number }) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductReview | null>(null);
  const [uploading, setUploading] = useState(false);
  const [reviewCalendarOpen, setReviewCalendarOpen] = useState(false);
  const [reviewCalendarMonth, setReviewCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const imageInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(
    () =>
      getReviews({ product_id: productId })
        .then((res) => {
          setReviews(res.data.data || []);
          setError("");
        })
        .catch((err) => setError(apiError(err, "Failed to load reviews")))
        .finally(() => setLoading(false)),
    [productId]
  );

  useEffect(() => {
    load();
  }, [load]);

  const act = async (action: () => Promise<unknown>, fallback: string) => {
    try {
      setError("");
      await action();
      await load();
    } catch (err) {
      setError(apiError(err, fallback));
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.reviewer_name.trim()) return setError("Customer name is required");
    if (!Number.isInteger(form.rating) || form.rating < 1 || form.rating > 5) return setError("Rating must be a whole number from 1 to 5.");
    if (!form.comment.trim()) return setError("Review description is required");
    if (!form.review_date || Number.isNaN(new Date(`${form.review_date}T12:00:00`).getTime())) return setError("Choose a valid review date");

    try {
      setSaving(true);
      setError("");
      const reviewData = {
        product_id: productId,
        reviewer_name: form.reviewer_name,
        rating: form.rating,
        title: form.title,
        comment: form.comment,
        status: form.status as ProductReview["status"],
        is_verified_purchase: form.verified,
        image_urls: form.image_urls,
        image_url: form.image_urls[0] ?? null,
        created_at: new Date(`${form.review_date}T12:00:00`).toISOString(),
      };
      if (editingId !== null) await updateReview(editingId, reviewData);
      else await createReview(reviewData);
      setForm(emptyForm);
      setAdding(false);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(apiError(err, "Failed to add review"));
    } finally {
      setSaving(false);
    }
  };

  const uploadCustomerImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    if (files.length > MAX_IMAGES - form.image_urls.length) {
      setError(`You can attach up to ${MAX_IMAGES} images per review.`);
      return;
    }
    if (files.some((f) => !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type))) {
      setError("Only JPG, PNG, and WebP images are allowed.");
      return;
    }
    if (files.some((f) => f.size > 8 * 1024 * 1024)) {
      setError("Each image must be smaller than 8 MB.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const token = localStorage.getItem("staff_token");
      const urls: string[] = [];
      for (const file of files) {
        const body = new FormData();
        body.append("image", file);
        const response = await fetch(`${API_ORIGIN}/api/upload/image`, { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Upload failed");
        const imageUrl = result.url ?? result.data?.url;
        if (typeof imageUrl !== "string" || !imageUrl) throw new Error(result.message || "The upload completed without returning an image URL.");
        urls.push(imageUrl);
      }
      setForm((current) => ({ ...current, image_urls: [...current.image_urls, ...urls] }));
    } catch (err) {
      setError(apiError(err, "Failed to upload customer image"));
    } finally {
      setUploading(false);
    }
  };

  const startEditing = (review: ProductReview) => {
      setForm({ reviewer_name: review.reviewer_name, rating: review.rating, title: review.title ?? "", comment: review.comment ?? "", status: review.status, verified: review.is_verified_purchase, image_urls: reviewImages(review), review_date: reviewDateValue(review.created_at) });
    const date = new Date(review.created_at);
    if (!Number.isNaN(date.getTime())) setReviewCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setEditingId(review.id);
    setAdding(true);
    setReviewCalendarOpen(false);
    setError("");
  };

  const approved = reviews.filter((r) => r.status === "approved");
  const average = approved.length ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length : 0;
  const pending = reviews.filter((r) => r.status === "pending").length;

  return (
    <section className="border border-gray-200 bg-white p-5 sm:p-6">
      {deleteTarget && <ConfirmDialog title="Delete review?" message={`Delete the review from ${deleteTarget.reviewer_name}? This cannot be undone.`} onCancel={() => setDeleteTarget(null)} onConfirm={() => { const target = deleteTarget; setDeleteTarget(null); void act(() => deleteReview(target.id), "Failed to delete review"); }} />}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Customer reviews</h2>
          <p className="mt-1 text-xs text-slate-500">
            Only approved reviews appear on the product page.
            {approved.length > 0 && ` Average ${average.toFixed(1)} from ${approved.length} review${approved.length === 1 ? "" : "s"}.`}
            {pending > 0 && <strong className="text-yellow-700"> {pending} awaiting approval.</strong>}
          </p>
        </div>

        <button
          type="button"
          onClick={() => { setAdding((value) => !value); setEditingId(null); setForm(emptyForm); setError(""); }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Plus size={15} /> {adding ? "Cancel" : "Add review"}
        </button>
      </div>

      {error && <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      {adding && (
        <form onSubmit={submit} className="mt-5 space-y-3 border border-gray-100 bg-slate-50 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-slate-600">Customer Name<input required value={form.reviewer_name} onChange={(e) => setForm({ ...form, reviewer_name: e.target.value })} placeholder="Customer name" className={`${input} mt-1.5`} /></label>
            <label className="block text-xs font-semibold text-slate-600">Rating (1–5)<select required value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={`${input} mt-1.5`}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} star{n === 1 ? "" : "s"}</option>
              ))}
            </select></label>
          </div>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Review title (optional)" className={input} />
          <label className="block text-xs font-semibold text-slate-600">Review Description<textarea required value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Write the customer review" rows={3} className={`${input} mt-1.5`} /></label>
          <div className="relative">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Review Date</label>
            <button type="button" aria-expanded={reviewCalendarOpen} onClick={() => {
              if (!reviewCalendarOpen && form.review_date) {
                const date = new Date(`${form.review_date}T12:00:00`);
                if (!Number.isNaN(date.getTime())) setReviewCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
              }
              setReviewCalendarOpen((open) => !open);
            }} className={`${input} flex items-center justify-between text-left`}>
              <span>{form.review_date || "Choose review date"}</span><CalendarDays size={16} className="text-slate-500" />
            </button>
            {reviewCalendarOpen && <div className="absolute left-0 top-full z-50 mt-2 flex w-[min(94vw,600px)] border border-gray-200 bg-white shadow-xl">
              <DateRangeCalendar
                calendarMonth={reviewCalendarMonth}
                dateRange={{ start: form.review_date ? new Date(`${form.review_date}T00:00:00`) : null, end: form.review_date ? new Date(`${form.review_date}T23:59:59.999`) : null }}
                rangeAnchor={null}
                selectionMode="single"
                onMonthChange={setReviewCalendarMonth}
                onChooseDate={(date) => setForm((current) => ({ ...current, review_date: localDateValue(date) }))}
                onClear={() => setForm((current) => ({ ...current, review_date: "" }))}
                onApply={() => setReviewCalendarOpen(false)}
              />
            </div>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Customer Images <span className="font-normal text-slate-400">(optional, up to {MAX_IMAGES})</span></label>
            <input ref={imageInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={uploadCustomerImage} className="hidden" />
            <div className="flex flex-wrap items-center gap-3">
              {form.image_urls.map((url, i) => <div key={`${url}-${i}`} className="relative h-16 w-16 overflow-hidden border border-gray-200"><img src={getMediaUrl(url)} alt={`Customer review preview ${i + 1}`} className="h-full w-full object-cover" /><button type="button" onClick={() => setForm((current) => ({ ...current, image_urls: current.image_urls.filter((_, idx) => idx !== i) }))} aria-label="Remove customer image" className="absolute right-0 top-0 bg-white/90 p-0.5 text-slate-600"><X size={14} /></button></div>)}
              {form.image_urls.length < MAX_IMAGES && <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 border border-gray-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"><ImagePlus size={16} />{uploading ? "Uploading…" : form.image_urls.length ? "Add more" : "Upload images"}</button>}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={`${input} !w-auto`}>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="hidden">Hidden</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} />
                Purchased
              </label>
            </div>
            <button type="submit" disabled={saving || uploading} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
              {saving ? "Saving…" : editingId !== null ? "Update review" : "Add review"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-5">
        {loading ? (
          <p className="py-6 text-center text-sm text-slate-400">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">No reviews yet</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {reviews.map((review) => (
              <li key={review.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-sm text-slate-900">{review.reviewer_name}</strong>
                    <Stars value={review.rating} />
                    {review.is_verified_purchase && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700">
                        <BadgeCheck size={13} /> Verified
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  {reviewImages(review).length > 0 && <div className="mt-3 flex flex-wrap gap-2">{reviewImages(review).map((url, i) => <img key={`${url}-${i}`} src={getMediaUrl(url)} alt={`${review.reviewer_name}'s review ${i + 1}`} loading="lazy" className="h-16 w-16 border border-gray-100 object-cover" />)}</div>}
                  {review.title && <p className="mt-1 text-sm font-medium text-slate-800">{review.title}</p>}
                  {review.comment && <p className="mt-1 text-sm text-slate-600">{review.comment}</p>}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={() => startEditing(review)} className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">Edit</button>
                  <select
                    value={review.status}
                    onChange={(e) => act(() => updateReview(review.id, { status: e.target.value as ProductReview["status"] }), "Failed to update review")}
                    className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ${STATUS_STYLES[review.status]}`}
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="hidden">Hidden</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(review)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete review"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ReviewsManager;
