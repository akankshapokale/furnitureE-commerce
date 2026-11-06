import { useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

import LazyImage from "../common/LazyImage";
import type { ProductImage } from "../../services/catalog";

interface GalleryProps {
  images: ProductImage[];
  name: string;
  badge?: string;
  wishlisted: boolean;
  onToggleWishlist: () => void;
}

const Gallery = ({ images, name, badge, wishlisted, onToggleWishlist }: GalleryProps) => {
  const [active, setActive] = useState(0);
  const [zoomPoint, setZoomPoint] = useState({ x: 50, y: 50, active: false });

  const updateZoomPoint = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setZoomPoint({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
      active: true,
    });
  };

  if (images.length === 0) {
    return (
      <div className="pd-gallery no-thumbs">
        <div className="pd-gallery-main pd-gallery-empty">No image available</div>
      </div>
    );
  }

  const current = images[Math.min(active, images.length - 1)];
  const step = (direction: -1 | 1) => {
    setActive((index) => (index + direction + images.length) % images.length);
    setZoomPoint((point) => ({ ...point, active: false }));
  };
  const selectImage = (index: number) => {
    setActive(index);
    setZoomPoint((point) => ({ ...point, active: false }));
  };

  return (
    <div className={`pd-gallery ${images.length > 1 ? "has-thumbs" : "no-thumbs"}`}>
      <div className="pd-gallery-main">
        <div
          className={`pd-gallery-zoom-area${zoomPoint.active ? " is-zoomed" : ""}`}
          onPointerEnter={(event) => { if (event.pointerType === "mouse") updateZoomPoint(event); }}
          onPointerMove={(event) => { if (event.pointerType === "mouse" || zoomPoint.active) updateZoomPoint(event); }}
          onPointerLeave={(event) => { if (event.pointerType === "mouse") setZoomPoint((point) => ({ ...point, active: false })); }}
          onPointerDown={(event) => { if (event.pointerType !== "mouse") updateZoomPoint(event); }}
          onPointerCancel={() => setZoomPoint((point) => ({ ...point, active: false }))}
          aria-label="Move over or touch the product image to zoom into that area"
        >
          <LazyImage
            key={current.id}
            src={current.image_url}
            alt={current.alt_text || name}
            width={1200}
            eager={active === 0}
            className="pd-gallery-image"
            style={{
              transform: `scale(${zoomPoint.active ? 2.2 : 1})`,
              transformOrigin: `${zoomPoint.x}% ${zoomPoint.y}%`,
            }}
          />
        </div>

        <div className="pd-gallery-actions">
          <button
            type="button"
            className={`pd-gallery-action${wishlisted ? " active" : ""}`}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            onClick={onToggleWishlist}
          >
            <Heart size={21} fill={wishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        {badge && <span className="pd-badge">{badge}</span>}

        {images.length > 1 && (
          <>
            <button type="button" className="pd-arrow left" onClick={() => step(-1)} aria-label="Previous image">
              <ChevronLeft size={20} />
            </button>
            <button type="button" className="pd-arrow right" onClick={() => step(1)} aria-label="Next image">
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="pd-thumbs" role="tablist" aria-label="Product images">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Show image ${index + 1}`}
              className={`pd-thumb ${index === active ? "active" : ""}`}
              onClick={() => selectImage(index)}
            >
              <LazyImage src={image.image_url} alt="" width={200} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
