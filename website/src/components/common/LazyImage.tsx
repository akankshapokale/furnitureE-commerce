import { useEffect, useRef, useState } from "react";
import type { ImgHTMLAttributes } from "react";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Rendered width in CSS px; used to request a right-sized Unsplash image. */
  width?: number;
  /** Above-the-fold images load immediately instead of lazily. */
  eager?: boolean;
}

// Unsplash serves any size on request: ask for what we need, not the 1000px+ originals.
const optimise = (src: string, width: number) => {
  if (!src.includes("images.unsplash.com")) return src;

  try {
    const url = new URL(src);
    const requested = Number(url.searchParams.get("w")) || width;

    url.searchParams.set("w", String(Math.min(requested, width)));
    url.searchParams.set("q", "75");

    return url.toString();
  } catch {
    return src;
  }
};

const LazyImage = ({
  src,
  alt,
  width = 800,
  eager = false,
  className = "",
  onLoad,
  ...rest
}: LazyImageProps) => {
  const [loadedSrc, setLoadedSrc] = useState("");
  const ref = useRef<HTMLImageElement>(null);

  const finalSrc = optimise(src, width);
  const loaded = loadedSrc === finalSrc;

  // Cached images can finish before React attaches onLoad.
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) {
      setLoadedSrc(finalSrc);
    }
  }, [finalSrc]);

  return (
    <img
      {...rest}
      ref={ref}
      src={finalSrc}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : "auto"}
      className={`lazy-img ${loaded ? "is-loaded" : ""} ${className}`.trim()}
      onLoad={(event) => {
        setLoadedSrc(finalSrc);
        onLoad?.(event);
      }}
      onError={() => setLoadedSrc(finalSrc)}
    />
  );
};

export default LazyImage;
