import { Link } from "react-router-dom";

import img1 from "../../assets/img1.jpeg";
import img2 from "../../assets/img2.png";
import img3 from "../../assets/img3.jpeg";
import img4 from "../../assets/img4.jpg";
import img5 from "../../assets/img5.png";
import img6 from "../../assets/img6.webp";
import img7 from "../../assets/img7.png";
import img8 from "../../assets/img8.png";

type CollectionItem = {
  id: number;
  name: string;
  image: string;
  path: string;
  isCupboard?: boolean;
};

const collectionItems: CollectionItem[] = [
  {
    id: 1,
    name: "Cupboards & Almirahs",
    image: img1,
    path: "/category/cupboards-almirahs",
    isCupboard: true,
  },
  {
    id: 2,
    name: "Seating Solutions",
    image: img2,
    path: "/category/seating-solutions",
  },
  {
    id: 3,
    name: "Home Furniture (Coming Soon)",
    image: img3,
    path: "/category/home-furniture",
  },
  {
    id: 4,
    name: "Workstations",
    image: img4,
    path: "/category/office-furniture?sub=workstation",
  },
  {
    id: 5,
    name: "Office Furniture",
    image: img5,
    path: "/category/office-furniture",
  },
  {
    id: 6,
    name: "Bunk Beds",
    image: img6,
    path: "/category/bunk-beds",
  },
  {
    id: 7,
    name: "Outdoor Furniture",
    image: img7,
    path: "/category/outdoor-furniture",
  },
  {
    id: 8,
    name: "Conference & Meeting",
    image: img8,
    path: "/category/office-furniture?sub=conference-table",
  },
];

const Categories = () => {
  return (
    <main className="info-page">
      <style>{`
        .info-page {
          padding-bottom: 50px;
          background-color: #ffffff;
        }

        .info-hero {
          padding: 48px 0 16px;
          text-align: left;
          background-color: transparent;
          border-bottom: 0;
          margin-bottom: 0;
        }

        .info-section {
          padding: 0 0 16px;
        }

        .info-wrap {
          width: calc(100% - 48px);
          max-width: 1320px;
          margin: 0 auto;
          padding: 0;
        }

        .info-eyebrow {
          margin: 0 0 14px;
          color: #8b7865;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .info-hero h1 {
          margin: 0;
          font-size: clamp(32px, 4vw, 46px);
          line-height: 1.15;
          font-weight: 700;
          letter-spacing: -1.5px;
          color: #222222;
          text-align: left;
          font-family: inherit;
        }

        /* 4 columns layout: 4 on top row, 4 on bottom row */
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
          width: 100%;
          padding: 8px 0 14px;
        }

        .cat-item {
          min-width: 0;
        }

        .cat-card {
          position: relative;
          display: block;
          aspect-ratio: 1.25 / 1;
          min-width: 0;
          background: #ffffff;
          overflow: hidden;
          border: 1px solid #e9ddd5;
          border-radius: 0;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.03);
          text-decoration: none;
          cursor: pointer;
        }

        .cat-item-info {
          padding: 10px 2px 0;
          text-align: center;
        }

        .cat-item-info h3 {
          margin: 0;
          min-width: 0;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.4;
          color: #181818;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .cat-item-info h3 a {
          color: inherit;
          text-decoration: none;
        }

        .cat-item-info h3 a:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .cat-card-img-wrap {
          position: absolute;
          inset: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          background-color: #ffffff;
        }

        .cat-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          padding: 0;
        }

        /* Tablet (2 columns) */
        @media (max-width: 900px) {
          .cat-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
          }
        }

        /* Mobile (1 or 2 columns) */
        @media (max-width: 560px) {
          .info-hero {
            padding: 36px 0 28px;
          }

          .info-hero h1 {
            font-size: 32px;
          }

          .info-wrap {
            width: calc(100% - 40px);
            padding: 0;
          }

          .cat-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px 12px;
          }

          .cat-item-info h3 {
            font-size: 12px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="info-hero">
        <div className="info-wrap">
          <p className="info-eyebrow">Shop by category</p>
          <h1>Explore Our Collection</h1>
        </div>
      </section>

      {/* Section: 4 Columns per row (Total 8 images: 4 top, 4 bottom) */}
      <section className="info-section">
        <div className="info-wrap">
          <div className="cat-grid">
            {collectionItems.map((item) => (
              <div key={item.id} className="cat-item">
                <Link
                  to={item.path}
                  className="cat-card"
                  aria-label={`Open ${item.name}`}
                >
                  <div className="cat-card-img-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cat-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </Link>
                <div className="cat-item-info">
                  <h3>
                    <Link to={item.path}>
                      {item.name}
                    </Link>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Categories;
