import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "../context/CartContext";
import LazyImage from "./common/LazyImage";

const CartDrawer = () => {
  const {
    cartItems,
    cartCount,
    subtotal,
    isCartOpen,
    lastAddedId,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const { pathname } = useLocation();

  /* The sticky cart panel belongs to the shop page only */
  if (pathname !== "/shop") return null;

  return (
    <>
      <aside
        /* An empty cart closes the panel; adding an item opens it again */
        className={`cart-drawer ${isCartOpen && cartItems.length > 0 ? "open" : ""}`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="cart-drawer-header">
          <h2>
            Your Cart
            <span>
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </span>
          </h2>

        </div>

        {cartItems.length === 0 ? (
          <div className="cart-drawer-empty">
            <ShoppingBag size={38} strokeWidth={1.4} />
            <p>Your cart is empty</p>
            <Link to="/shop" className="cart-drawer-secondary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer-items">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.variantId ?? item.variantName ?? "default"}`}
                  className={`cart-drawer-item ${
                    item.id === lastAddedId ? "just-added" : ""
                  }`}
                >
                  <Link
                    to={`/product/${item.id}`}
                    className="cart-drawer-image"
                  >
                    <LazyImage src={item.image} alt={item.name} />
                  </Link>

                  <div className="cart-drawer-info">
                    <p>{item.category}</p>
                    <h3>{item.name}</h3>
                    {item.variantName && <p>Size: {item.variantName}</p>}
                    <strong>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </strong>

                    <div className="cart-drawer-actions">
                      <div className="quantity-control">
                        <button
                          onClick={() => decreaseQuantity(item.id, item.variantId, item.variantName)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item.id, item.variantId, item.variantName)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        className="remove-product"
                        onClick={() => removeFromCart(item.id, item.variantId, item.variantName)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-drawer-subtotal">
                <span>Subtotal</span>
                <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
              </div>

              <p>Delivery and taxes calculated at checkout.</p>

              <Link to="/checkout" className="checkout-button">
                Checkout
                <ArrowRight size={17} />
              </Link>

              <Link to="/cart" className="cart-drawer-secondary">
                View Cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
