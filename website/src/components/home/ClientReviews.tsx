import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useWebsiteContent } from "../../hooks/useWebsiteContent";

import re1 from "../../assets/RE1.jpeg";
import re2 from "../../assets/RE2.jpeg";
import re3 from "../../assets/RE3.jpeg";
import re4 from "../../assets/RE4.jpeg";
import re5 from "../../assets/RE5.jpeg";
import re6 from "../../assets/RE6.jpeg";

type Review = {
  name: string;
  role: string;
  rating: number;
  product: string;
  review: string;
  initials: string;
  image: string;
  containerBg: string;
  imgFit: "contain" | "cover";
  imgPadding?: string;
  imgPosition?: string;
};

const curatedReviews: Review[] = [
  {
    name: "Aarav Deshmukh",
    role: "Architect, Pune",
    rating: 5,
    product: "3-Seater Patio Lounge Sofa",
    review:
      "The 3-seater patio sofa transformed our terrace. Its black metal frame is weather-proof, and the off-white cushions offer supreme comfort.",
    initials: "AD",
    image: re1,
    containerBg: "#fffdfb",
    imgFit: "contain",
    imgPadding: "8px",
  },
  {
    name: "Rajesh Kulkarni",
    role: "Banquet Operations, Mumbai",
    rating: 5,
    product: "Multi-Color Folding Chairs",
    review:
      "These durable chairs fold completely flat for effortless storage. The vibrant color range and sturdy build bring immense convenience.",
    initials: "RK",
    image: re2,
    containerBg: "#fffdfb",
    imgFit: "contain",
    imgPadding: "6px",
  },
  {
    name: "Sneha Kapadia",
    role: "Cafe Founder, Bengaluru",
    rating: 5,
    product: "Square Ripple Glass Bistro Table",
    review:
      "Outfitted our outdoor cafe with these ripple glass bistro tables. The steel legs are stable, and the textured top wipes clean in seconds.",
    initials: "SK",
    image: re3,
    containerBg: "#fffdfb",
    imgFit: "contain",
    imgPadding: "6px",
  },
  {
    name: "Vikram Malhotra",
    role: "Workplace Director, Hyderabad",
    rating: 5,
    product: "Modular Workstation Cubicles",
    review:
      "Fitted our floor with modular workstation clusters. The teal acoustic screens maintain privacy while cable ducts keep desks tidy.",
    initials: "VM",
    image: re4,
    containerBg: "#fffdfb",
    imgFit: "cover",
    imgPosition: "center",
  },
  {
    name: "Dr. Arindam Sen",
    role: "Managing Director, Gurugram",
    rating: 5,
    product: "Executive High-Gloss Table",
    review:
      "The custom conference table is the focal point of our boardroom. The glossy white finish with wire raceways keeps meetings wire-free.",
    initials: "AS",
    image: re5,
    containerBg: "#fffdfb",
    imgFit: "contain",
    imgPadding: "6px",
  },
  {
    name: "Meera Nair",
    role: "Residential Client, Kochi",
    rating: 5,
    product: "3-Door Steel Wardrobe (Plum)",
    review:
      "The craftsmanship on this 3-door almirah is exceptional. The royal plum finish looks sophisticated while providing robust storage.",
    initials: "MN",
    image: re6,
    containerBg: "#fffdfb",
    imgFit: "contain",
    imgPadding: "6px",
  },
];

const ClientReviews = () => {
  const { content } = useWebsiteContent("home_content");
  // Page 0 = first 3 reviews (RE1, RE2, RE3), Page 1 = next 3 reviews (RE4, RE5, RE6)
  const [currentPage, setCurrentPage] = useState<0 | 1>(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-switch between the two groups every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev === 0 ? 1 : 0));
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const displayedReviews =
    currentPage === 0
      ? curatedReviews.slice(0, 3)
      : curatedReviews.slice(3, 6);

  return (
    <section
      className="client-reviews"
      id="customer-reviews"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        padding: "44px 24px 38px",
        background: "var(--site-warm-bg)",
        borderTop: "1px solid #f1ede7",
      }}
    >
      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        {/* Section Header (without arrows) */}
        <div style={{ marginBottom: "26px" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "#8b7865",
              margin: "0 0 8px",
            }}
          >
            {typeof content?.testimonials_eyebrow === "string"
              ? content.testimonials_eyebrow
              : "PATRON EXPERIENCES & FEEDBACK"}
          </p>

          <h2
            style={{
              fontSize: "clamp(24px, 3.2vw, 34px)",
              fontWeight: "700",
              color: "#222222",
              lineHeight: "1.2",
              letterSpacing: "-0.8px",
              margin: 0,
            }}
          >
            {typeof content?.testimonials_heading === "string" &&
            content.testimonials_heading !== "Customer reviews"
              ? content.testimonials_heading
              : "Reflections of Elegance & Craft"}
          </h2>

          <p
            style={{
              fontSize: "13.5px",
              color: "#77716b",
              lineHeight: "1.5",
              margin: "6px 0 0",
            }}
          >
            {typeof content?.testimonials_subtitle === "string" &&
            content.testimonials_subtitle !== "What our customers say."
              ? content.testimonials_subtitle
              : "Discover authentic stories from patrons who elevated their spaces with our furniture."}
          </p>
        </div>

        {/* 3 Horizontal Cards (Equal Height for Both Sets) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "18px",
            alignItems: "stretch",
          }}
        >
          {displayedReviews.map((review) => (
            <article
              key={review.name}
              style={{
                background: "#ffffff",
                border: "1px solid #e7e3dc",
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "row",
                height: "195px",
                boxShadow: "0 2px 8px rgba(40, 32, 24, 0.04)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 18px rgba(40, 32, 24, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(40, 32, 24, 0.04)";
              }}
            >
              {/* Left Side: Product Image */}
              <div
                style={{
                  width: "140px",
                  minWidth: "140px",
                  maxWidth: "140px",
                  height: "100%",
                  background: review.containerBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderRight: "1px solid #f1ede7",
                  padding: review.imgPadding || "0",
                  flexShrink: 0,
                }}
              >
                <img
                  src={review.image}
                  alt={review.product}
                  loading="lazy"
                  style={{
                    width: review.imgFit === "cover" ? "100%" : "auto",
                    height: review.imgFit === "cover" ? "100%" : "auto",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: review.imgFit,
                    objectPosition: review.imgPosition || "center",
                    display: "block",
                  }}
                />
              </div>

              {/* Right Side: Details */}
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: "100%",
                  padding: "14px 16px 12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxSizing: "border-box",
                }}
              >
                <div>
                  {/* 1. Stars at the top */}
                  <div
                    style={{
                      display: "flex",
                      gap: "3px",
                      color: "#d97706",
                      marginBottom: "8px",
                    }}
                  >
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>

                  {/* 2. Headline in Black with gap below */}
                  <h3
                    style={{
                      margin: "0 0 8px",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#111827",
                      lineHeight: "1.3",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {review.product}
                  </h3>

                  {/* 3. Description without truncation or "..." */}
                  <p
                    style={{
                      fontSize: "11.5px",
                      color: "#524d47",
                      lineHeight: "1.5",
                      margin: 0,
                    }}
                  >
                    “{review.review}”
                  </p>
                </div>

                {/* 4. Patron Name & Role */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    paddingTop: "8px",
                    borderTop: "1px solid #f4f0ea",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "#eee8df",
                      color: "#544637",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: "700",
                      fontSize: "10.5px",
                      flexShrink: 0,
                    }}
                  >
                    {review.initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#1e1b18",
                        lineHeight: "1.2",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {review.name}
                    </h4>
                    <p
                      style={{
                        margin: "1px 0 0",
                        fontSize: "10.5px",
                        color: "#827b73",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 2 Dots Indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            marginTop: "22px",
          }}
          aria-label="Reviews page selector"
        >
          <button
            type="button"
            style={{
              width: currentPage === 0 ? "24px" : "8px",
              height: "7px",
              padding: 0,
              border: "none",
              borderRadius: "10px",
              background: currentPage === 0 ? "#8b7865" : "#dedad3",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onClick={() => setCurrentPage(0)}
            aria-label="Show first 3 reviews"
            aria-current={currentPage === 0 ? "true" : undefined}
          />
          <button
            type="button"
            style={{
              width: currentPage === 1 ? "24px" : "8px",
              height: "7px",
              padding: 0,
              border: "none",
              borderRadius: "10px",
              background: currentPage === 1 ? "#8b7865" : "#dedad3",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onClick={() => setCurrentPage(1)}
            aria-label="Show next 3 reviews"
            aria-current={currentPage === 1 ? "true" : undefined}
          />
        </div>
      </div>
    </section>
  );
};

export default ClientReviews;
