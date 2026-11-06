import { Link } from "react-router-dom";

import LazyImage from "../components/common/LazyImage";
import { PRODUCTS } from "../types/product";
import "./info.css";

const CATEGORIES = [
  {
    name: "Office Furniture",
    description:
      "Modern employee desks, boss tables, workstations, reception desks, and modular office setups.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Home Furniture",
    description:
      "Create a warm, comfortable, and stylish home with contemporary living & dining furniture (Coming Soon).",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Seating Solutions",
    description:
      "Ergonomic mesh revolving chairs, executive leather seating, and office sofas.",
    image:
      "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Cupboards & Almirahs",
    description:
      "Heavy-gauge steel storewells, almirahs with mirrors, industrial lockers, bookcases, and library cupboards.",
    image: "/images-webp/cupboard1.webp",
  },
  {
    name: "Outdoor Furniture",
    description:
      "All-weather powder-coated metal planters, tables, garden chairs, planter stands, and metal sofas.",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Bunk Beds",
    description:
      "Space-saving and heavy-duty double-decker steel bunk beds for hostels, PGs, and homes.",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Metal Racks",
    description:
      "Durable, multi-tier slotted angle metal racks for organized industrial and retail storage.",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1000&q=80",
  },
];

const Categories = () => (
  <main className="info-page">
    <section className="info-hero">
      <div className="info-wrap">
        <p className="info-eyebrow">Explore our collection</p>

        <h1>Shop by category</h1>

        <p className="info-lead">
          Explore our premium collection of heavy-gauge steel storewells, almirahs, industrial lockers, bookcases, executive desks, and modern home essentials crafted for lifetime durability.
        </p>
      </div>
    </section>

    <section className="info-section">
      <div className="info-wrap cat-grid">
        {CATEGORIES.map((category) => {
          const count = PRODUCTS.filter(
            (product) =>
              product.category === category.name ||
              ((category.name === "Cupboards & Almirahs" || category.name === "Cupboards and Almirahs") &&
                (product.category === "Metal Cupboards" || product.category === "Cupboards and Almirahs" || product.category === "Cupboards & Almirahs"))
          ).length;

          const categorySlugMap: Record<string, string> = {
            "Office Furniture": "office-furniture",
            "Home Furniture": "home-furniture",
            "Seating Solutions": "seating-solutions",
            "Cupboards & Almirahs": "cupboards-almirahs",
            "Cupboards and Almirahs": "cupboards-almirahs",
            "Metal Cupboards": "cupboards-almirahs",
            "Metal Furniture": "cupboards-almirahs",
            "Outdoor Furniture": "outdoor-furniture",
            "Bunk Beds": "bunk-beds",
            "Metal Racks": "metal-racks",
          };

          const linkTarget = categorySlugMap[category.name]
            ? `/category/${categorySlugMap[category.name]}`
            : `/shop?category=${encodeURIComponent(category.name)}`;

          return (
            <Link
              key={category.name}
              to={linkTarget}
              className="cat-card"
            >
              <div className="cat-card-image-skeleton" aria-hidden="true">
                <LazyImage
                  src={category.image}
                  alt={`${category.name} furniture`}
                  width={900}
                />
              </div>

              <div className="cat-card-body">
                <span className="count">
                  {count} {count === 1 ? "product" : "products"}
                </span>

                <h3>{category.name}</h3>

                <p>{category.description}</p>

                <span className="cat-cta">
                  Shop {category.name} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  </main>
);

export default Categories;
