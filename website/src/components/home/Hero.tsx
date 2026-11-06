import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../../auth/authContext";
import { resolveCmsImage } from "../../services/media";


type HeroSlide = {
  image: string;
  alt: string;
};

const Hero = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    fetch(`${API_URL}/api/website-control/hero-banners?_=${Date.now()}`, { cache: "no-store", signal: controller.signal })
      .then((res) => (res.ok ? res.json() as Promise<{ success?: boolean; data?: unknown }> : null))
      .then((data) => {
        if (controller.signal.aborted) return;
        if (data?.success && Array.isArray(data.data)) {
          const apiSlides = data.data.flatMap((item: unknown): HeroSlide[] => {
            if (!item || typeof item !== "object") return [];
            const banner = item as Record<string, unknown>;
            const title = typeof banner.title === "string" ? banner.title.trim() : "";
            const image = resolveCmsImage(banner.image ?? banner.image_url);
            // CMS/database IDs can arrive as either numbers or strings. The image
            // is what makes a banner usable; rejecting string IDs caused the
            // component to silently fall back to the old local banners.
            if (!image) return [];
            return [{
              image,
              alt: title || "Promotional banner",
            }];
          });
          setSlides(apiSlides);
          setCurrentSlide(0);
          return;
        }
        setSlides([]);
      })
      .catch(() => undefined)
      .finally(() => window.clearTimeout(timeout));
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [nextSlide, slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="hero">
      {slide && (
        <img
          key={slide.image}
          className="hero-bg"
          fetchPriority="high"
          decoding="async"
          src={slide.image}
          alt={slide.alt}
          onError={(event) => { event.currentTarget.style.visibility = "hidden"; }}
        />
      )}

      {slides.length > 1 && <div className="hero-dots" aria-label="Choose banner">
          {slides.map((_, index) => (
            <button
              type="button"
              key={index}
              className={index === currentSlide ? "active" : ""}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Show banner ${index + 1}`}
              aria-current={index === currentSlide ? "true" : undefined}
            />
          ))}
        </div>}
    </section>
  );
};

export default Hero;
