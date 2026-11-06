import { Link } from "react-router-dom";
import { ArrowRight, Heart, ShoppingCart, Trash2 } from "lucide-react";

import AccountLayout from "../components/AccountLayout";
import LazyImage from "../components/common/LazyImage";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: (typeof wishlistItems)[number]) => {
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
    });
  };

  return (
    <AccountLayout>
      {wishlistItems.length === 0 ? (
        <section className="wishlist-list-page wishlist-list-empty">
          <div>
            <Heart size={28} />
            <h1>Your Wishlist is Empty</h1>
            <p>Save your favourite furniture pieces here and come back to them anytime.</p>
            <Link to="/shop">Explore Products <ArrowRight size={17} /></Link>
          </div>
        </section>
      ) : (
        <section className="wishlist-list-page">
          <header className="wishlist-list-header">
            <h1>Wishlist</h1>
            <p>Your Favorites, All In One Place</p>
          </header>

          <div className="wishlist-list-items">
            {wishlistItems.map((product) => (
              <article className="wishlist-list-item" key={product.id}>
                <Link to={`/product/${product.id}`} className="wishlist-list-image">
                  <LazyImage src={product.image} alt={product.name} />
                </Link>

                <div className="wishlist-list-info">
                  <Link to={`/product/${product.id}`} className="wishlist-list-name">
                    {product.name}
                  </Link>
                  <p>{product.category}</p>
                  <div className="wishlist-list-price">
                    <strong>₹{product.price.toLocaleString("en-IN")}</strong>
                    {product.oldPrice && <span>₹{product.oldPrice.toLocaleString("en-IN")}</span>}
                    {product.oldPrice && product.oldPrice > product.price && (
                      <em>{Math.round((1 - product.price / product.oldPrice) * 100)}% OFF</em>
                    )}
                  </div>
                </div>

                <div className="wishlist-list-actions">
                  <button type="button" className="wishlist-cart-button" onClick={() => handleAddToCart(product)}>
                    <ShoppingCart size={17} /> Add To Cart
                  </button>
                  <button type="button" className="wishlist-list-remove" onClick={() => removeFromWishlist(product.id)}>
                    <Trash2 size={15} /> Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <style>{`
        .wishlist-list-page {
          width: 100%;
          min-width: 0;
          overflow: hidden;
          border-radius: 4px;
          background: #ffffff;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .wishlist-list-header {
          padding: 16px 24px 12px;
          border-bottom: 1px solid #eeeeeb;
        }

        .wishlist-list-header h1 {
          margin: 0;
          color: #1f1f1f;
          font-size: 26px;
          font-weight: 600;
        }

        .wishlist-list-header p {
          margin: 2px 0 0;
          color: #555555;
          font-size: 14px;
        }

        .wishlist-list-items { padding: 0 24px; }

        .wishlist-list-item {
          display: grid;
          grid-template-columns: 175px minmax(0, 1fr) 160px;
          align-items: center;
          gap: 24px;
          min-width: 0;
          padding: 24px 0;
          border-bottom: 1px solid #e9e4dc;
        }

        .wishlist-list-image {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 175px;
          height: 152px;
          overflow: hidden;
          background: var(--product-card-beige);
        }

        .wishlist-list-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .wishlist-list-info { min-width: 0; }

        .wishlist-list-name {
          display: block;
          color: #1f1f1f;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.4;
          text-decoration: none;
        }

        .wishlist-list-info > p {
          margin: 3px 0 18px;
          color: #555555;
          font-size: 14px;
        }

        .wishlist-list-price {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 8px;
        }

        .wishlist-list-price strong { color: #1f1f1f; font-size: 20px; font-weight: 600; }
        .wishlist-list-price span { color: #555555; font-size: 13px; text-decoration: line-through; }
        .wishlist-list-price em { color: #1f1f1f; font-size: 13px; font-style: normal; font-weight: 600; }

        .wishlist-list-actions {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 20px;
        }

        .wishlist-list-actions .wishlist-cart-button {
          width: 100%;
          min-height: 46px;
          margin: 0;
          border-color: #1f1f1f;
          background: #1f1f1f;
          color: #ffffff;
        }

        .wishlist-list-actions .wishlist-cart-button:hover {
          border-color: #8b7355;
          background: #8b7355;
        }

        .wishlist-list-remove {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 38px;
          border: 0;
          background: transparent;
          color: #1f1f1f;
          font: inherit;
          cursor: pointer;
        }

        .wishlist-list-remove:hover { color: #8b7355; }

        .wishlist-list-empty {
          display: grid;
          min-height: 360px;
          place-items: center;
          padding: 32px;
          text-align: center;
        }

        .wishlist-list-empty h1 { margin: 14px 0 8px; color: #1f1f1f; font-size: 24px; }
        .wishlist-list-empty p { margin: 0 0 18px; color: #555555; }
        .wishlist-list-empty a { display: inline-flex; align-items: center; gap: 8px; color: #1f1f1f; font-weight: 600; text-decoration: none; }

        @media (max-width: 900px) {
          .wishlist-list-item { grid-template-columns: 130px minmax(0, 1fr) 130px; gap: 16px; }
          .wishlist-list-image { width: 130px; height: 130px; }
        }

        @media (max-width: 620px) {
          .wishlist-list-header { padding: 16px; }
          .wishlist-list-items { padding: 0 16px; }
          .wishlist-list-item { grid-template-columns: 92px minmax(0, 1fr); gap: 12px; align-items: start; }
          .wishlist-list-image { width: 92px; height: 100px; }
          .wishlist-list-name { font-size: 15px; }
          .wishlist-list-info > p { margin-bottom: 10px; font-size: 12px; }
          .wishlist-list-price strong { font-size: 17px; }
          .wishlist-list-actions { grid-column: 2; flex-direction: row; align-items: center; gap: 10px; }
          .wishlist-list-actions .wishlist-cart-button { min-height: 40px; font-size: 11px; }
        }
      `}</style>
    </AccountLayout>
  );
};

export default Wishlist;
