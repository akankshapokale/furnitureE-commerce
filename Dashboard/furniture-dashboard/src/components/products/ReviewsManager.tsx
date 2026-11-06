import { useCallback, useEffect, useState, type FormEvent } from "react";
import { BadgeCheck, Plus, Star, Trash2 } from "lucide-react";

import {
  apiError,
  createReview,
  deleteReview,
  getReviews,
  updateReview,
  type ProductReview,
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

const emptyForm = { reviewer_name: "", rating: 5, title: "", comment: "", status: "approved", verified: false };

const ReviewsManager = ({ productId }: { productId: number }) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

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

    if (!form.reviewer_name.trim()) return setError("Reviewer name is required");

    try {
      setSaving(true);
      setError("");
      await createReview({
        product_id: productId,
        reviewer_name: form.reviewer_name,
        rating: form.rating,
        title: form.title,
        comment: form.comment,
        status: form.status,
        is_verified_purchase: form.verified,
      });
      setForm(emptyForm);
      setAdding(false);
      await load();
    } catch (err) {
      setError(apiError(err, "Failed to add review"));
    } finally {
      setSaving(false);
    }
  };

  const approved = reviews.filter((r) => r.status === "approved");
  const average = approved.length ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length : 0;
  const pending = reviews.filter((r) => r.status === "pending").length;

  return (
    <section className="border border-gray-200 bg-white p-5 sm:p-6">
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
          onClick={() => setAdding((value) => !value)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Plus size={15} /> {adding ? "Cancel" : "Add review"}
        </button>
      </div>

      {error && <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      {adding && (
        <form onSubmit={submit} className="mt-5 space-y-3 border border-gray-100 bg-slate-50 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input value={form.reviewer_name} onChange={(e) => setForm({ ...form, reviewer_name: e.target.value })} placeholder="Reviewer name" className={input} />
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={input}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} star{n === 1 ? "" : "s"}</option>
              ))}
            </select>
          </div>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Review title (optional)" className={input} />
          <textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Review text" rows={3} className={input} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={`${input} !w-auto`}>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="hidden">Hidden</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} />
                Verified purchase
              </label>
            </div>
            <button type="submit" disabled={saving} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
              {saving ? "Adding…" : "Add review"}
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
                  {review.title && <p className="mt-1 text-sm font-medium text-slate-800">{review.title}</p>}
                  {review.comment && <p className="mt-1 text-sm text-slate-600">{review.comment}</p>}
                </div>

                <div className="flex shrink-0 items-center gap-2">
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
                    onClick={() => {
                      if (window.confirm("Delete this review?")) act(() => deleteReview(review.id), "Failed to delete review");
                    }}
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
