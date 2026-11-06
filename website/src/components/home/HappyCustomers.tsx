import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Ruler, Truck, HeartHandshake, Camera, ArrowRight } from "lucide-react";
import LazyImage from "../common/LazyImage";
import { fetchProducts, type ProductListing } from "../../services/catalog";

const SERVICE_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Prime Steel Craftsmanship",
    desc: "Built with certified heavy-gauge CRCA steel and oven-baked epoxy powder coating for rust-proof longevity.",
  },
  {
    icon: Ruler,
    title: "Customized to Your Space",
    desc: "Tailored table sizes (3×2, 5×2), internal locker configurations, and custom powder-coat finishes.",
  },
  {
    icon: Truck,
    title: "Direct-from-Factory Dispatch",
    desc: "Every piece is carefully blanket-wrapped and dispatched directly from our manufacturing floor to your location.",
  },
  {
    icon: HeartHandshake,
    title: "Attentive Client Support",
    desc: "Personalized assistance from material selection through assembly and lifetime post-purchase care.",
  },
];

const CUSTOMER_PRODUCT_ORDER = [
  { categoryId: 10, subCategoryId: 45, keywords: ["workstation"] },
  { categoryId: 15, subCategoryId: null, keywords: ["bunk bed"] },
  { categoryId: 19, subCategoryId: 62, keywords: ["chair"] },
  { categoryId: 10, subCategoryId: 40, keywords: ["employee", "desk"] },
];

const selectCustomerProducts = (items: ProductListing[]) =>
  CUSTOMER_PRODUCT_ORDER.flatMap(({ categoryId, subCategoryId, keywords }) => {
    const matches = items.filter((product) => {
      const text = `${product.name} ${product.sub_category_name ?? ""}`.toLowerCase();
      return product.category_id === categoryId &&
        (subCategoryId === null || product.sub_category_id === subCategoryId) &&
        keywords.every((keyword) => text.includes(keyword)) &&
        Boolean(product.image_url && (product.description || product.short_description));
    });

    const product = matches.find((item) => item.is_featured) ?? matches[0];
    return product ? [product] : [];
  });

const HappyCustomers = () => {
  const [products, setProducts] = useState<ProductListing[]>([]);

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((items) => {
        if (!active) return;
        setProducts(selectCustomerProducts(items));
      })
      .catch(() => {
        if (active) setProducts([]);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="happy-customers-section" id="happy-customers" style={{ padding: "20px 24px 24px", background: "var(--site-warm-bg)", borderTop: "none" }}>
      <style>{`
        .happy-customers-section .service-pillars-grid,
        .happy-customers-section .customer-spaces-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
          align-items: stretch;
        }
        .happy-customers-section .customer-space-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        @media (max-width: 900px) {
          .happy-customers-section .service-pillars-grid,
          .happy-customers-section .customer-spaces-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 560px) {
          .happy-customers-section {
            padding-top: 20px !important;
          }

          .happy-customers-section .service-pillars-grid,
          .happy-customers-section .customer-spaces-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        {/* Section Header */}
        <div style={{ textAlign: "left", maxWidth: "1400px", margin: "0 auto 38px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", color: "#8b7865", marginBottom: "14px" }}>
            CUSTOMER SATISFACTION &amp; SERVICE EXCELLENCE
          </p>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 46px)", fontWeight: "700", color: "#222222", lineHeight: "1.15", margin: "0", letterSpacing: "-1.5px" }}>
            Furniture Chosen by Our Customers
          </h2>
          <p style={{ fontSize: "15px", color: "#77716b", lineHeight: "1.7", margin: "14px 0 0" }}>
            Explore products from our current CMS catalogue, with their original product images and descriptions.
          </p>
        </div>

        {/* 4 Pillars of Customer Commitment */}
        <div className="service-pillars-grid" style={{ marginBottom: "40px" }}>
          {SERVICE_PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                style={{
                  background: "#fffdfb",
                  border: "1px solid #e9ddd5",
                  borderRadius: "0",
                  padding: "16px 18px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "10px"
                }}>
                  <div style={{
                    width: "38px",
                    height: "38px",
                    flexShrink: 0,
                    borderRadius: "0",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#0f172a"
                  }}>
                    <Icon size={19} strokeWidth={1.8} />
                  </div>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0, lineHeight: "1.3" }}>
                    {p.title}
                  </h3>
                </div>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", margin: 0 }}>
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
        {/* Products from the CMS catalogue */}
        <div className="customer-spaces-grid" style={{ marginBottom: "40px" }}>
          {products.map((product, idx) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              style={{
                background: "#ffffff",
                borderRadius: "0",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                color: "inherit",
                textDecoration: "none",
                boxShadow: "0 3px 12px rgba(0,0,0,0.03)"
              }}
            >
              <div style={{
                position: "relative",
                height: "240px",
                overflow: "hidden",
                background: idx === 2 ? "#ffffff" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <LazyImage
                  src={product.image_url!}
                  alt={product.name}
                  width={600}
                  className="customer-space-image"
                  style={
                    idx === 2
                      ? { objectFit: "contain", maxHeight: "88%", maxWidth: "88%" }
                      : undefined
                  }
                />
              </div>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#b45309", letterSpacing: "0.5px", marginBottom: "4px" }}>
                  {product.sub_category_name || product.category_name || "Furniture"}
                </span>
                <h4 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px", lineHeight: "1.3" }}>
                  {product.name}
                </h4>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", margin: "0" }}>
                  {product.description || product.short_description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Share your space banner */}
        <div className="home-showcase-banner" style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: "0",
          padding: "20px 28px",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div style={{ maxWidth: "780px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <Camera size={16} color="#f59e0b" />
              <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#f59e0b" }}>
                Proud of Your Staging Space?
              </span>
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 4px" }}>
              Have your furniture installation featured in our showcase
            </h3>
            <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0, lineHeight: "1.4" }}>
              Share your room photos with our team or request customized CAD layout consultation for your workspace.
            </p>
          </div>

          <div className="home-showcase-actions" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              to="/contact"
              className="home-showcase-button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#f59e0b",
                color: "#0f172a",
                fontWeight: "700",
                fontSize: "13px",
                padding: "9px 18px",
                borderRadius: "6px",
                textDecoration: "none",
                transition: "background 0.2s ease"
              }}
            >
              Contact Us <ArrowRight size={15} />
            </Link>
            <Link
              to="/categories"
              className="home-showcase-button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255, 255, 255, 0.1)",
                color: "#ffffff",
                fontWeight: "600",
                fontSize: "13px",
                padding: "9px 16px",
                borderRadius: "6px",
                textDecoration: "none",
                border: "1px solid rgba(255, 255, 255, 0.2)"
              }}
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HappyCustomers;
