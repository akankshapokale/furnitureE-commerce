import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import LazyImage from "../components/common/LazyImage";

const Cart = () => {
  const {
    cartItems,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const deliveryCharge = subtotal >= 50000 || subtotal === 0 ? 0 : 499;
  const total = subtotal + deliveryCharge;

  if (cartItems.length === 0) {
    return (
      <>
        <section className="cart-page cart-empty">
          <div className="empty-cart-icon">
            <ShoppingBag size={42} strokeWidth={1.4} />
          </div>

          <p className="cart-eyebrow">YOUR SHOPPING CART</p>

          <h1>Your cart is empty</h1>

          <p className="empty-cart-description">
            Discover beautiful furniture and find something perfect for your
            space.
          </p>

          <Link to="/" className="continue-shopping">
            Continue Shopping
            <ArrowRight size={17} />
          </Link>
        </section>

        <style>{`
          .cart-page,
          .cart-page * {
            box-sizing: border-box;
          }

          .cart-page {
            width: 100%;
            max-width: 1240px;
            margin: 0 auto;
            padding: 40px 24px 80px;
          }

          .cart-empty {
            min-height: 65vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .empty-cart-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 84px;
            height: 84px;
            margin-bottom: 24px;
            border-radius: 50%;
            background: #f5f5f5;
            color: #333333;
          }

          .cart-eyebrow {
            margin: 0 0 8px;
            color: #737373;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
          }

          .cart-empty h1 {
            margin: 0 0 12px;
            color: #222222;
            font-size: clamp(28px, 5vw, 40px);
            line-height: 1.2;
          }

          .empty-cart-description {
            max-width: 460px;
            margin: 0 0 24px;
            color: #737373;
            font-size: 15px;
            line-height: 1.7;
          }

          .continue-shopping {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            min-height: 46px;
            padding: 12px 22px;
            background: #111111;
            color: #ffffff;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
          }

          .continue-shopping:hover {
            background: #333333;
          }

          @media (max-width: 600px) {
            .cart-page {
              padding: 36px 16px 50px;
            }

            .cart-empty {
              min-height: 60vh;
            }

            .empty-cart-icon {
              width: 72px;
              height: 72px;
              margin-bottom: 20px;
            }

            .empty-cart-description {
              max-width: 320px;
              font-size: 13px;
            }

            .continue-shopping {
              width: 100%;
              max-width: 300px;
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <section className="cart-page">
        <div className="cart-container">
          {/* Header */}
          <div className="cart-header">
            <div>
              <p className="cart-eyebrow">YOUR SHOPPING CART</p>
              <h1>Shopping Cart</h1>
            </div>

            <span className="cart-items-count">
              {cartItems.length}{" "}
              {cartItems.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Cart Content */}
          <div className="cart-layout">
            <div className="cart-main">
            {/* Products Column */}
            <div className="cart-products">
              {cartItems.map((item) => (
                <div className="cart-product" key={`${item.id}-${item.variantId ?? item.variantName ?? "default"}`}>
                  <Link
                    to={`/products/${item.id}`}
                    className="cart-product-image"
                  >
                    <LazyImage src={item.image} alt={item.name} />
                  </Link>

                  <div className="cart-product-info">
                    <p>{item.category}</p>
                    <h2>{item.name}</h2>
                    {item.variantName && <p className="cart-product-variant">Size: {item.variantName}</p>}

                    <strong>
                      ₹{item.price.toLocaleString("en-IN")}
                    </strong>

                    <div className="cart-product-actions">
                      <div className="quantity-control">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id, item.variantId, item.variantName)}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus size={14} />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id, item.variantId, item.variantName)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="remove-product"
                        onClick={() => removeFromCart(item.id, item.variantId, item.variantName)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={15} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  <div className="cart-product-total">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <aside className="cart-summary">
              <h2>Total Summary</h2>

              <div className="cart-summary-content">
              <div className="summary-products">
                {cartItems.map((item) => (
                  <div className="summary-product" key={`${item.id}-${item.variantId ?? item.variantName ?? "default"}`}>
                    <LazyImage src={item.image} alt={item.name} />
                    <div className="summary-product-info">
                      <span>{item.name}</span>
                      <small>Qty: {item.quantity}</small>
                    </div>
                    <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                  </div>
                ))}
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <strong>
                  {deliveryCharge === 0
                    ? "FREE"
                    : `₹${deliveryCharge.toLocaleString("en-IN")}`}
                </strong>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>
                <strong>₹{total.toLocaleString("en-IN")}</strong>
              </div>

              <Link to="/checkout" className="checkout-button">
                Proceed to Checkout
                <ArrowRight size={17} />
              </Link>

              <Link to="/" className="continue-shopping-link">
                Continue Shopping
              </Link>
              </div>
            </aside>
            </div>

            <aside className="cart-selected-products" aria-label="Selected product images">
              <h2>My Shopping</h2>
              <div className="cart-selected-products-list">
                {cartItems.map((item) => (
                  <Link
                    to={`/products/${item.id}`}
                    className="cart-selected-product"
                    key={`${item.id}-${item.variantId ?? item.variantName ?? "default"}`}
                  >
                    <div className="cart-selected-product-image">
                      <LazyImage src={item.image} alt={item.name} />
                    </div>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <style>{`
        .cart-page,
        .cart-page * {
          box-sizing: border-box;
        }

        .cart-page {
          width: 100%;
          max-width: 1480px;
          min-height: calc(100vh - 150px);
          margin: 0 auto;
          padding: 32px 24px 72px;
          background: #ffffff;
        }

        .cart-container {
          width: 100%;
          max-width: 1400px;
          min-width: 0;
          margin: 0 auto;
        }

        .cart-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 22px;
          border-bottom: 0;
          margin-bottom: 16px;
          background: #ffffff;
        }

        .cart-eyebrow {
          margin: 0 0 6px;
          color: #737373;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .cart-header h1 {
          margin: 0;
          color: #222222;
          font-size: 32px;
          font-weight: 700;
          line-height: 1.2;
        }

        .cart-items-count {
          flex-shrink: 0;
          color: #737373;
          font-size: 14px;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.8fr) minmax(260px, 0.85fr);
          gap: 24px;
          align-items: start;
        }

        .cart-main {
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-width: 0;
        }

        .cart-products {
          display: flex;
          flex-direction: column;
          min-width: 0;
          padding: 0 22px;
          border: 1px solid var(--product-card-beige);
          background: #ffffff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        .cart-product {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          min-width: 0;
          padding: 24px 0;
          border-bottom: 1px solid #eeeeee;
        }

        .cart-product-image {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 130px;
          height: 130px;
          overflow: hidden;
          border-radius: 8px;
          background: #f7f7f7;
        }

        .cart-product-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cart-product-info {
          flex: 1;
          min-width: 0;
        }

        .cart-product-info > p {
          margin: 0 0 4px;
          color: #888888;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          overflow-wrap: anywhere;
        }

        .cart-product-info h2 {
          margin: 0 0 8px;
          color: #222222;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        .cart-product-info > strong {
          display: block;
          margin-bottom: 16px;
          color: #222222;
          font-size: 16px;
          font-weight: 600;
        }

        .cart-product-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px 20px;
        }

        .quantity-control {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          background: #ffffff;
        }

        .quantity-control button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          padding: 0;
          border: none;
          background: transparent;
          color: #404040;
          cursor: pointer;
        }

        .quantity-control button:hover {
          background: #f5f5f5;
        }

        .quantity-control span {
          min-width: 36px;
          color: #222222;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
        }

        .remove-product {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 0;
          border: none;
          background: transparent;
          color: #737373;
          font-size: 13px;
          cursor: pointer;
        }

        .remove-product:hover {
          color: #dc2626;
        }

        .cart-product-total {
          flex-shrink: 0;
          padding-top: 4px;
          color: #222222;
          font-size: 18px;
          font-weight: 700;
          white-space: nowrap;
        }

        .cart-summary {
          position: static;
          min-width: 0;
          width: 100%;
          max-width: none;
          align-self: stretch;
          overflow: hidden;
          border: 1px solid var(--product-card-beige);
          border-radius: 2px;
          background: #ffffff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
        }

        .cart-selected-products {
          min-width: 0;
          padding: 20px;
          border: 1px solid var(--product-card-beige);
          background: #ffffff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        .cart-selected-products > h2 {
          margin: 0 0 16px;
          color: #343a40;
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .cart-selected-products-list {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 16px;
        }

        .cart-selected-product {
          display: block;
          min-width: 0;
          color: #222222;
          text-decoration: none;
        }

        .cart-selected-product-image {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 220px;
          overflow: hidden;
          background: var(--product-card-beige);
        }

        .cart-selected-product-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .cart-selected-product > span {
          display: block;
          margin-top: 8px;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.4;
        }

        .cart-summary h2 {
          margin: 0;
          padding: 15px 20px;
          border-bottom: 1px solid #e6e8eb;
          background: var(--product-card-beige);
          color: #111111;
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .cart-summary-content {
          padding: 22px 20px 18px;
        }

        .summary-products {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .summary-product {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--product-card-beige);
        }

        .summary-product > img {
          width: 48px;
          height: 48px;
          flex: 0 0 48px;
          object-fit: contain;
          background: var(--product-card-beige);
        }

        .summary-product-info {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .summary-product-info > span {
          color: #111111;
          font-size: 14px;
          font-weight: 600;
          overflow-wrap: anywhere;
        }

        .summary-product-info > small {
          color: #555555;
          font-size: 12px;
        }

        .summary-product > strong {
          flex-shrink: 0;
          color: #111111;
          font-size: 13px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
          color: #111111;
          font-size: 14px;
        }

        .summary-row strong {
          color: #111111;
          text-align: right;
          overflow-wrap: anywhere;
        }

        .summary-divider {
          height: 1px;
          margin: 18px 0;
          background: var(--product-card-beige);
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 24px;
          color: #222222;
          font-size: 16px;
          font-weight: 600;
        }

        .summary-total strong {
          font-size: 22px;
          font-weight: 800;
          overflow-wrap: anywhere;
          text-align: right;
        }

        .checkout-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          min-height: 48px;
          padding: 14px;
          box-sizing: border-box;
          border-radius: 8px;
          background: #111111;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }

        .checkout-button:hover {
          opacity: 0.9;
        }

        .continue-shopping-link {
          display: block;
          margin-top: 16px;
          color: #737373;
          font-size: 13px;
          text-align: center;
          text-decoration: none;
        }

        .continue-shopping-link:hover {
          text-decoration: underline;
        }

        .cart-page button:focus-visible,
        .cart-page a:focus-visible {
          outline: 2px solid #555555;
          outline-offset: 3px;
        }

        @media (max-width: 1100px) {
          .cart-layout {
            gap: 24px;
          }

          .cart-summary {
            padding: 0;
          }

          .cart-summary-content {
            padding: 20px 16px 16px;
          }

          .cart-product {
            gap: 16px;
          }

          .cart-product-image {
            width: 110px;
            height: 120px;
          }

          .cart-product-info h2 {
            font-size: 16px;
          }

          .cart-product-total {
            font-size: 16px;
          }
        }

        @media (max-width: 900px) {
          .cart-page {
            padding: 32px 22px 60px;
          }

          .cart-layout {
            grid-template-columns: minmax(0, 1fr);
            gap: 30px;
          }

          .cart-summary {
            width: 100%;
          }

          .cart-selected-products-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .cart-selected-product-image {
            height: 180px;
          }
        }

        @media (max-width: 600px) {
          .cart-page {
            padding: 20px 14px 40px;
          }

          .cart-header {
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 18px;
            padding-bottom: 16px;
          }

          .cart-header h1 {
            font-size: 26px;
          }

          .cart-items-count {
            padding-top: 17px;
            font-size: 12px;
          }

          .cart-product {
            display: grid;
            grid-template-columns: 84px minmax(0, 1fr);
            gap: 10px;
            padding: 16px 0;
          }

          .cart-products {
            padding-right: 14px;
            padding-left: 14px;
          }

          .cart-product-image {
            grid-column: 1;
            grid-row: 1 / span 2;
            width: 84px;
            height: 98px;
          }

          .cart-product-info {
            grid-column: 2;
            grid-row: 1;
          }

          .cart-product-info h2 {
            margin-bottom: 6px;
            font-size: 14px;
          }

          .cart-product-info > p {
            font-size: 10px;
          }

          .cart-product-info > strong {
            margin-bottom: 10px;
            font-size: 14px;
          }

          .cart-product-actions {
            display: flex;
            flex-direction: row;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 4px;
          }

          .quantity-control button {
            width: 29px;
            height: 30px;
          }

          .quantity-control span {
            min-width: 27px;
            font-size: 13px;
          }

          .remove-product {
            gap: 4px;
            font-size: 12px;
          }

          .cart-product-total {
            grid-column: 2;
            grid-row: 2;
            align-self: start;
            justify-self: start;
            padding-top: 0;
            margin-top: 8px;
            font-size: 14px;
          }

          .cart-summary {
            padding: 20px 16px;
            border-radius: 8px;
          }

          .cart-summary h2 {
            font-size: 18px;
          }

          .summary-total strong {
            font-size: 20px;
          }

          .checkout-button {
            min-height: 46px;
            font-size: 13px;
          }
        }

        @media (max-width: 360px) {
          .cart-page {
            padding-right: 12px;
            padding-left: 12px;
          }

          .cart-header h1 {
            font-size: 23px;
          }

          .cart-product {
            grid-template-columns: 78px minmax(0, 1fr);
            gap: 10px;
          }

          .cart-product-image {
            width: 78px;
            height: 90px;
          }

          .cart-product-info h2 {
            font-size: 13px;
          }

          .cart-product-total {
            font-size: 13px;
          }

          .cart-summary {
            padding: 18px 12px;
          }

          .summary-row {
            font-size: 13px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .checkout-button {
            transition: none;
          }
        }
      `}</style>
    </>
  );
};

export default Cart;
