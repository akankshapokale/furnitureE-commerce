
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import LazyImage from "../common/LazyImage";
import { fetchProducts, type ProductListing } from "../../services/catalog";

type FeaturedProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  image: string;
  rating: number;
};

const featuredIds = [201, 202, 205];
const fallbackProducts: FeaturedProduct[] = [
  {
    id: 201,
    name: "AeroPro Ergonomic High-Back Office Chair",
    category: "Seating Solutions",
    price: 11999,
    image: "/images-webp/officechair1.webp",
    rating: 4.9,
  },
  {
    id: 202,
    name: "Presidential Bonded Leather Executive Chair",
    category: "Seating Solutions",
    price: 18499,
    image: "/images-webp/bosschair1.webp",
    rating: 4.9,
  },
  {
    id: 205,
    name: "Executive 3-Seater Leatherette Office Sofa",
    category: "Seating Solutions",
    price: 24999,
    image: "/images-webp/officesopa1.webp",
    rating: 4.9,
  },
];

const FeaturedProducts = () => {
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<FeaturedProduct[]>(fallbackProducts);

  useEffect(() => {
    let current = true;
    fetchProducts()
      .then((rows) => {
        if (!current) return;
        const byId = new Map(rows.map((row) => [row.id, row]));
        const next = featuredIds
          .map((id) => byId.get(id))
          .filter((row): row is ProductListing => Boolean(row))
          .map((row) => {
            const regularPrice = Number(row.price);
            const sellingPrice = Number(row.discount_price ?? row.price);
            const percentOff = regularPrice > sellingPrice
              ? Math.round((1 - sellingPrice / regularPrice) * 100)
              : 0;
            return {
              id: row.id,
              name: row.name,
              category: row.category_name || "Seating Solutions",
              price: sellingPrice,
              oldPrice: percentOff > 0 ? regularPrice : undefined,
              discount: percentOff > 0 ? `${percentOff}% OFF` : undefined,
              image: row.image_url || row.images[0]?.image_url || "/images-webp/chair1.webp",
              rating: Number(row.rating_avg ?? 4.8),
            };
          });
        if (next.length) setProducts(next);
      })
      .catch(() => undefined);

    return () => { current = false; };
  }, []);

  const handleAddToCart = (product: FeaturedProduct) => {
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
    });
  };

  const handleWishlist = (
    event: React.MouseEvent<HTMLButtonElement>,
    product: FeaturedProduct
  ) => {
    event.preventDefault();
    event.stopPropagation();

    toggleWishlist({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
    });
  };

  return (
    <>
      <style>{`
        .featured-section {
          width: 100%;
          box-sizing: border-box;
          padding: 64px 24px;
          background: #ffffff;
        }

        .featured-header {
          max-width: 1320px;
          margin: 0 auto 32px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }

        .featured-eyebrow {
          margin: 0 0 14px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 3px;
          color: #8b7865;
        }

        .featured-header h2 {
          margin: 0;
          font-size: clamp(32px, 4vw, 46px);
          line-height: 1.15;
          font-weight: 700;
          letter-spacing: -1.5px;
          color: #222222;
        }

        .featured-subtitle {
          max-width: 560px;
          margin: 14px 0 0;
          font-size: 15px;
          line-height: 1.7;
          color: #77716b;
        }

        .view-all {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }

        .view-all span {
          transition: transform 0.2s ease;
        }

        .view-all:hover span {
          transform: translateX(4px);
        }

        .products-grid {
          max-width: 1320px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
        }

        .product-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid #e9ddd5;
          border-radius: 10px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
        }

        .product-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 4.2;
          overflow: hidden;
          border-radius: 0;
        }

        .product-image-link {
          display: block;
          width: 100%;
          height: 100%;
        }

        .product-image {
          width: 100%;
          height: 100%;
          padding: 12px;
          object-fit: contain;
          background: transparent;
          display: block;
          transition: none;
        }

        .product-card:hover .product-image {
          transform: none;
        }

        .discount-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
          padding: 6px 9px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
        }

        .wishlist-button {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 3;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 50%;
          cursor: pointer;
        }

        .product-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 16px 2px 0;
        }

        .product-category {
          margin: 0 0 6px;
          font-size: 12px;
        }

        .product-name-link {
          color: inherit;
          text-decoration: none;
        }

        .product-name-link h3 {
          margin: 0;
          font-size: 17px;
          line-height: 1.5;
          font-weight: 600;
          overflow-wrap: anywhere;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }

        .product-rating span {
          font-size: 14px;
          letter-spacing: 1px;
        }

        .product-rating small {
          font-size: 12px;
        }

        .product-price {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 10px;
          margin: 12px 0 16px;
        }

        .product-price strong {
          font-size: 17px;
        }

        .product-price del {
          font-size: 13px;
        }

        .add-cart-button {
          width: 100%;
          min-height: 42px;
          margin-top: auto;
          padding: 10px 12px;
          border: 1px solid currentColor;
          border-radius: 6px;
          font: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .add-cart-button:hover {
          opacity: 0.8;
        }

        /* Laptop */
        @media (max-width: 1100px) {
          .featured-section {
            padding: 52px 20px;
          }

          .products-grid {
            gap: 18px;
          }

          .product-name-link h3 {
            font-size: 16px;
          }

          .product-details {
            padding-top: 14px;
          }
        }

        /* Tablet */
        @media (max-width: 768px) {
          .featured-section {
            padding: 44px 20px;
          }

          .featured-header {
            align-items: flex-start;
            margin-bottom: 26px;
          }

          .featured-subtitle {
            font-size: 14px;
          }

          .products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 28px 18px;
          }

          .product-image-wrapper {
            aspect-ratio: 1 / 1;
          }
        }

        /* Mobile */
        @media (max-width: 520px) {
          .featured-section {
            padding: 36px 16px;
          }

          .featured-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
          }

          .featured-eyebrow {
            font-size: 12px;
            letter-spacing: 3px;
          }

          .featured-header h2 {
            font-size: 32px;
          }

          .featured-subtitle {
            font-size: 14px;
            line-height: 1.7;
          }

          .view-all {
            font-size: 13px;
          }

          .products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 24px 12px;
          }

          .product-image-wrapper {
            aspect-ratio: 1 / 1.05;
          }

          .discount-badge {
            top: 7px;
            left: 7px;
            padding: 5px 6px;
            font-size: 9px;
          }

          .wishlist-button {
            top: 6px;
            right: 6px;
            width: 32px;
            height: 32px;
          }

          .wishlist-button svg {
            width: 17px;
            height: 17px;
          }

          .product-details {
            padding-top: 12px;
          }

          .product-category {
            font-size: 11px;
          }

          .product-name-link h3 {
            font-size: 14px;
            line-height: 1.45;
          }

          .product-rating {
            gap: 5px;
            margin-top: 6px;
          }

          .product-rating span {
            font-size: 12px;
            letter-spacing: 0;
          }

          .product-rating small {
            font-size: 11px;
          }

          .product-price {
            gap: 6px;
            margin: 10px 0 12px;
          }

          .product-price strong {
            font-size: 14px;
          }

          .product-price del {
            font-size: 11px;
          }

          .add-cart-button {
            min-height: 38px;
            padding: 8px 5px;
            font-size: 11px;
            line-height: 1.4;
          }
        }

        /* Extra-small Mobile */
        @media (max-width: 340px) {
          .featured-section {
            padding: 28px 12px;
          }

          .products-grid {
            gap: 20px 10px;
          }

          .featured-header h2 {
            font-size: 24px;
          }

          .product-name-link h3 {
            font-size: 13px;
          }

          .product-price {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .add-cart-button {
            font-size: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .view-all span,
          .add-cart-button {
            transition: none;
          }
        }
      `}</style>

      <section className="featured-section">
        {/* Header */}
        <div className="featured-header">
          <div>
            <p className="featured-eyebrow">
              SEATING SOLUTIONS
            </p>

            <h2>Featured Seating</h2>

            <p className="featured-subtitle">
              Explore ergonomic office seating, executive chairs, and lounge sofas.
            </p>
          </div>

          <Link to="/shop" className="view-all">
            View All Products
            <span>→</span>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="products-grid">
          {products.map((product) => {
            const cartProduct = cartItems.find(
              (item) => item.id === product.id
            );

            const wishlistActive = isInWishlist(product.id);

            return (
              <article
                className="product-card"
                key={product.id}
              >
                {/* Product Image */}
                <div className="product-image-wrapper">
                  <Link
                    to={`/product/${product.id}`}
                    className="product-image-link"
                  >
                    <LazyImage
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                  </Link>

                  {product.discount && <span className="discount-badge">{product.discount}</span>}

                  {/* Wishlist */}
                  <button
                    type="button"
                    className={`wishlist-button ${
                      wishlistActive ? "active" : ""
                    }`}
                    aria-label={
                      wishlistActive
                        ? `Remove ${product.name} from wishlist`
                        : `Add ${product.name} to wishlist`
                    }
                    onClick={(event) =>
                      handleWishlist(event, product)
                    }
                  >
                    <Heart
                      size={20}
                      fill={
                        wishlistActive
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>

                {/* Product Details */}
                <div className="product-details">
                  <p className="product-category">
                    {product.category}
                  </p>

                  <Link
                    to={`/product/${product.id}`}
                    className="product-name-link"
                  >
                    <h3>{product.name}</h3>
                  </Link>

                  <div className="product-rating">
                    <span>★★★★★</span>
                    <small>{product.rating.toFixed(1)}</small>
                  </div>

                  <div className="product-price">
                    <strong>
                      ₹{product.price.toLocaleString("en-IN")}
                    </strong>

                    {product.oldPrice && <del>₹{product.oldPrice.toLocaleString("en-IN")}</del>}
                  </div>

                  <button
                    type="button"
                    className="add-cart-button"
                    onClick={() => handleAddToCart(product)}
                  >
                    {cartProduct
                      ? `Added to Cart (${cartProduct.quantity})`
                      : "Add to Cart"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default FeaturedProducts;
