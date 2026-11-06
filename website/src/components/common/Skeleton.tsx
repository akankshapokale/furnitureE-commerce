import type { CSSProperties } from "react";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
}

export const Skeleton = ({ width, height, className = "", style }: SkeletonProps) => (
  <div
    className={`skeleton ${className}`.trim()}
    style={{ width, height, ...style }}
    aria-hidden="true"
  />
);

export const ProductCardSkeleton = () => (
  <div className="skeleton-card" aria-hidden="true">
    <Skeleton className="skeleton-card-image" />
    <Skeleton height={12} width="35%" />
    <Skeleton height={18} width="80%" />
    <Skeleton height={16} width="45%" />
    <Skeleton height={46} />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="skeleton-grid">
    {Array.from({ length: count }, (_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

/** Shown while a lazily-loaded page chunk downloads. The navbar stays in place around it. */
export const PageSkeleton = ({ variant = "list" }: { variant?: "grid" | "list" | "detail" }) => (
  <div className="skeleton-page" role="status" aria-label="Loading">
    <Skeleton height={14} width={120} />
    <Skeleton height={38} width="min(360px, 70%)" style={{ marginTop: 14 }} />

    {variant === "grid" && (
      <div style={{ marginTop: 36 }}>
        <ProductGridSkeleton />
      </div>
    )}

    {variant === "detail" && (
      <div className="skeleton-detail">
        <Skeleton className="skeleton-detail-image" />
        <div className="skeleton-detail-info">
          <Skeleton height={14} width="25%" />
          <Skeleton height={34} width="75%" />
          <Skeleton height={24} width="30%" />
          <Skeleton height={90} />
          <Skeleton height={52} />
        </div>
      </div>
    )}

    {variant === "list" && (
      <div className="skeleton-list">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} height={110} />
        ))}
      </div>
    )}
  </div>
);

export const SectionSkeleton = ({ height = 420 }: { height?: number }) => (
  <div className="skeleton-section" style={{ minHeight: height }} aria-hidden="true">
    <Skeleton height={32} width="min(300px, 60%)" />
    <div style={{ marginTop: 28 }}>
      <ProductGridSkeleton count={4} />
    </div>
  </div>
);
