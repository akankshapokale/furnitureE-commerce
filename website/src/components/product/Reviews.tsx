import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Star } from "lucide-react";

import { useAuth } from "../../auth/authContext";
import {
  fetchReviews,
  submitReview,
  type Review,
  type ReviewSummary,
} from "../../services/catalog";
import Stars from "./Stars";
import { resolveCmsImage } from "../../services/media";

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const Reviews = ({ productId }: { productId: number }) => {
  const { user, token } = useAuth();

  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(() => Boolean(user && window.location.hash === "#reviews"));
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [thanks, setThanks] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetchReviews(productId)
      .then((data) => {
        if (cancelled) return;
        setSummary(data.summary ?? null);
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      })
      .catch(() => !cancelled && setError("Reviews could not be loaded right now."))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!token) return;
    if (rating === 0) return setFormError("Please choose a star rating.");
    if (comment.trim().length < 10) return setFormError("Please write at least a few words about the product.");

    try {
      setSending(true);
      setFormError("");
      const message = await submitReview(productId, token, { rating, title, comment });
      setThanks(message);
      setOpen(false);
      setRating(0);
      setTitle("");
      setComment("");
      // Reviews may be moderated before appearing publicly. Refresh in case this
      // product's review endpoint returns the new submission immediately.
      const data = await fetchReviews(productId);
      setSummary(data.summary ?? null);
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not submit your review.");
    } finally {
      setSending(false);
    }
  };

  const count = summary?.count ?? 0;
  const distribution = summary?.distribution ?? {};

  return (
    <div className="pd-reviews">
      {loading ? (
        <p className="pd-muted">Loading reviews…</p>
      ) : error ? (
        <p className="pd-muted">{error}</p>
      ) : (
        <div className="pd-reviews-layout">
          {/* Summary */}
          <div className="pd-reviews-summary">
            <div className="pd-reviews-score">
              <strong>{count ? Number(summary?.average || 0).toFixed(1) : "–"}</strong>
              <Stars value={summary?.average ?? 0} size={18} />
              <span>{count ? `Based on ${count} review${count === 1 ? "" : "s"}` : "No reviews yet"}</span>
            </div>

            {count > 0 && (
              <ul className="pd-bars">
                {[5, 4, 3, 2, 1].map((star) => {
                  const total = distribution[star] ?? 0;

                  return (
                    <li key={star}>
                      <span>{star}</span>
                      <Star size={13} fill="currentColor" />
                      <div className="pd-bar">
                        <div style={{ width: `${(total / count) * 100}%` }} />
                      </div>
                      <span className="pd-bar-count">{total}</span>
                    </li>
                  );
                })}
              </ul>
            )}

            {thanks ? (
              <p className="pd-review-thanks">{thanks}</p>
            ) : user ? (
              <button type="button" className="pd-outline-btn pd-review-cta" onClick={() => setOpen((value) => !value)}>
                {open ? "Cancel" : "Write a review"}
              </button>
            ) : (
              <Link to="/login" className="pd-outline-btn pd-review-cta">
                Write a review
              </Link>
            )}
          </div>

          {/* List + form */}
          <div className="pd-reviews-list">
            {open && (
              <form className="pd-review-form" onSubmit={handleSubmit} noValidate>
                <h3>Share your experience</h3>

                <div className="pd-rate-input" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`${star} star${star === 1 ? "" : "s"}`}
                      className={(hover || rating) >= star ? "on" : ""}
                      onMouseEnter={() => setHover(star)}
                      onClick={() => setRating(star)}
                    >
                      <Star size={26} fill="currentColor" />
                    </button>
                  ))}
                </div>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Review title (optional)"
                  maxLength={160}
                />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like or dislike? How is the quality and comfort?"
                  rows={4}
                />

                {formError && <p className="pd-form-error">{formError}</p>}

                <button type="submit" className="pd-dark-btn" disabled={sending}>
                  {sending ? "Submitting…" : "Submit review"}
                </button>
              </form>
            )}

            {reviews.length === 0 && !open && (
              <p className="pd-muted">Be the first to review this product.</p>
            )}

            {reviews.map((review) => (
              <article key={review.id} className="pd-review">
                <div className="pd-review-head">
                  <div className="pd-avatar">{(review.reviewer_name || "C").charAt(0).toUpperCase()}</div>
                  <div>
                    <strong>{review.reviewer_name || "Customer"}</strong>
                    {review.is_verified_purchase && (
                      <span className="pd-verified">
                        <BadgeCheck size={14} /> Verified purchase
                      </span>
                    )}
                  </div>
                  {formatDate(review.created_at) && <time>{formatDate(review.created_at)}</time>}
                </div>

                <Stars value={review.rating} size={15} />
                {review.title && <h4>{review.title}</h4>}
                {review.comment && <p>{review.comment}</p>}
                {(() => {
                  const photos = (review.image_urls?.length ? review.image_urls : review.image_url ? [review.image_url] : [])
                    .map((url) => resolveCmsImage(url))
                    .filter((url): url is string => Boolean(url));
                  return photos.length > 0 ? (
                    <div className="pd-review-photos">
                      {photos.map((url, i) => (
                        <a key={`${url}-${i}`} href={url} target="_blank" rel="noreferrer">
                          <img src={url} alt={`${review.reviewer_name || "Customer"} review photo ${i + 1}`} loading="lazy" />
                        </a>
                      ))}
                    </div>
                  ) : null;
                })()}
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
