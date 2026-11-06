import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { useCart, type CartProduct } from "../context/CartContext";
import { useCallback, useEffect, useState } from "react";
import { API_URL, useAuth } from "../auth/authContext";
import "./account.css";
import LazyImage from "../components/common/LazyImage";

interface Address {
  id: number;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

const EMPTY_ADDRESS = {
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
};

const Checkout = () => {
  const { cartItems } = useCart();
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowItem = (location.state as { buyNowItem?: CartProduct } | null)?.buyNowItem;
  const checkoutItems = buyNowItem ? [buyNowItem] : cartItems;
  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState(EMPTY_ADDRESS);
  const [addressError, setAddressError] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryCharge = subtotal >= 50000 || subtotal === 0 ? 0 : 499;
  const total = subtotal + deliveryCharge;

  const addressApi = useCallback(
    async (init: RequestInit = {}) => {
      const res = await fetch(`${API_URL}/api/addresses/mine`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Something went wrong");
      return body;
    },
    [token]
  );

  // Load saved addresses and preselect the default one.
  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    addressApi()
      .then((body) => {
        if (cancelled) return;
        const list: Address[] = body.data;
        setAddresses(list);
        setSelectedId((list.find((a) => a.is_default) ?? list[0])?.id ?? null);
        if (list.length === 0) setShowForm(true);
      })
      .catch((err) => {
        if (!cancelled) setAddressError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [token, addressApi]);

  const handleNewAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setNewAddress((current) => ({ ...current, [name]: value }));
    setAddressError("");
  };

  const handleSaveAddress = async () => {
    if (
      !newAddress.address_line1 ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.postal_code
    ) {
      setAddressError("Address, city, state and pincode are required.");
      return;
    }

    try {
      setSavingAddress(true);
      const body = await addressApi({
        method: "POST",
        body: JSON.stringify(newAddress),
      });
      const created: Address = body.data;

      setAddresses((current) => [...(current ?? []), created]);
      setSelectedId(created.id);
      setNewAddress(EMPTY_ADDRESS);
      setShowForm(false);
      setAddressError("");
    } catch (err) {
      setAddressError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (!user?.id) {
        alert("Please login before placing an order.");
        setIsSubmitting(false);
        return;
      }

      const shippingAddress = addresses?.find((a) => a.id === selectedId);

      if (!shippingAddress) {
        alert("Please select or add a delivery address.");
        setIsSubmitting(false);
        return;
      }

      // Create order
      const orderNumber = `ORD-${Date.now()}`;

      const orderResponse = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order_number: orderNumber,
            user_id: user.id,
            shipping_address_id: shippingAddress.id,
            subtotal: subtotal,
            discount_amount: 0,
            shipping_charge: deliveryCharge,
            tax_amount: 0,
            total_amount: total,
            status: "pending",
            payment_status: "pending",
            notes: null,
            items: checkoutItems.map((item) => ({
              product_id: item.id,
              variant_id: item.variantId ?? null,
              custom_size_request_id: item.customSizeRequestId ?? null,
              product_name: item.variantName ? `${item.name} - ${item.variantName}` : item.name,
              sku: null,
              quantity: item.quantity,
              unit_price: item.price,
              discount_amount: 0,
              total_price: item.price * item.quantity,
            })),
          }),
        }
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(
          orderData?.message || "Failed to create order."
        );
      }

      const orderId =
        orderData?.data?.id ??
        orderData?.id ??
        orderData?.data?.order?.id;

      if (!orderId) {
        throw new Error("Order was created but order ID was not received.");
      }

      // Save checkout information
      
sessionStorage.setItem(
  "checkoutData",
  JSON.stringify({
    name: user.name,
    phone: user.phone ?? "",
    address: [
      shippingAddress.address_line1,
      shippingAddress.address_line2,
    ]
      .filter(Boolean)
      .join(", "),
    city: shippingAddress.city,
    state: shippingAddress.state,
    pincode: shippingAddress.postal_code,

    orderId: orderId,
    orderNumber: orderNumber,

    items: checkoutItems.map((item) => ({
      id: item.id,
      product_id: item.id,
      variant_id: item.variantId ?? null,
      name: item.variantName ? `${item.name} - ${item.variantName}` : item.name,
      product_name: item.variantName ? `${item.name} - ${item.variantName}` : item.name,
      variant_name: item.variantName ?? null,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
      category: item.category,
    })),
  })
);


      sessionStorage.setItem(
        "checkoutTotal",
        total.toString()
      );

      sessionStorage.setItem(
        "currentOrderId",
        String(orderId)
      );

      sessionStorage.setItem(
        "currentOrderNumber",
        orderNumber
      );

      // Go to payment
      navigate(
        `/payment?order_id=${orderId}&amount=${total}`
      );
    } catch (error: any) {
      console.error("Checkout error:", error);

      alert(
        error?.message ||
          "Something went wrong while creating your order."
      );

      setIsSubmitting(false);
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <section className="cart-page cart-empty">
        <p className="cart-eyebrow">CHECKOUT</p>

        <h1>Your cart is empty</h1>

        <p>
          Add some furniture to your cart before proceeding to checkout.
        </p>

        <Link to="/shop" className="continue-shopping">
          Continue Shopping
          <ArrowRight size={17} />
        </Link>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="checkout-container">

        {/* Header */}
        <div className="checkout-header">
          <Link to="/cart" className="back-to-cart">
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

          <p className="cart-eyebrow">SECURE CHECKOUT</p>

          <h1>Checkout</h1>

          <p>
            Complete your delivery details to continue with your order.
          </p>
        </div>

        <div className="checkout-layout">

          {/* Delivery Details */}
          <form
            className="checkout-form"
            onSubmit={handleSubmit}
          >
            <div className="checkout-card">
              <div className="checkout-card-header">
                <div>
                  <p className="checkout-step">STEP 01</p>
                  <h2>Delivery Address</h2>
                </div>
              </div>

              {authLoading ? null : !user ? (
                <p className="checkout-address-note">
                  Please <Link to="/login">sign in</Link> to choose a delivery
                  address.
                </p>
              ) : (
                <>
                  {addresses === null && !addressError && (
                    <p className="checkout-address-note">
                      Loading your addresses…
                    </p>
                  )}

                  <div className="addr-pick-list">
                    {addresses?.map((address) => (
                      <label
                        key={address.id}
                        className={`addr-pick${
                          selectedId === address.id ? " selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping_address"
                          checked={selectedId === address.id}
                          onChange={() => setSelectedId(address.id)}
                        />

                        <span className="addr-pick-text">
                          {address.is_default && (
                            <em className="addr-pick-badge">Default</em>
                          )}
                          {address.address_line1}
                          {address.address_line2 &&
                            `, ${address.address_line2}`}
                          <br />
                          {address.city}, {address.state} – {address.postal_code}
                        </span>
                      </label>
                    ))}
                  </div>

                  {addressError && (
                    <div className="acct-msg error">{addressError}</div>
                  )}

                  {!showForm && (
                    <button
                      type="button"
                      className="acct-btn acct-btn-outline"
                      onClick={() => setShowForm(true)}
                    >
                      + ADD NEW ADDRESS
                    </button>
                  )}

                  {showForm && (
                    <div
                      className="checkout-new-address"
                      onKeyDown={(event) => {
                        // keep Enter from submitting the order form
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleSaveAddress();
                        }
                      }}
                    >
                      <h3>New address</h3>

                      <div className="checkout-fields">
                        <div className="checkout-field full-width">
                          <label htmlFor="address_line1">
                            Flat, House no., Building
                          </label>
                          <input
                            id="address_line1"
                            name="address_line1"
                            type="text"
                            value={newAddress.address_line1}
                            onChange={handleNewAddressChange}
                          />
                        </div>

                        <div className="checkout-field full-width">
                          <label htmlFor="address_line2">
                            Area, Street, Landmark
                          </label>
                          <input
                            id="address_line2"
                            name="address_line2"
                            type="text"
                            value={newAddress.address_line2}
                            onChange={handleNewAddressChange}
                          />
                        </div>

                        <div className="checkout-field">
                          <label htmlFor="city">City</label>
                          <input
                            id="city"
                            name="city"
                            type="text"
                            value={newAddress.city}
                            onChange={handleNewAddressChange}
                          />
                        </div>

                        <div className="checkout-field">
                          <label htmlFor="state">State</label>
                          <input
                            id="state"
                            name="state"
                            type="text"
                            value={newAddress.state}
                            onChange={handleNewAddressChange}
                          />
                        </div>

                        <div className="checkout-field">
                          <label htmlFor="postal_code">Pincode</label>
                          <input
                            id="postal_code"
                            name="postal_code"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={newAddress.postal_code}
                            onChange={handleNewAddressChange}
                          />
                        </div>
                      </div>

                      <div className="checkout-address-actions">
                        <button
                          type="button"
                          className="acct-btn"
                          disabled={savingAddress}
                          onClick={handleSaveAddress}
                        >
                          {savingAddress ? "SAVING..." : "SAVE & USE THIS ADDRESS"}
                        </button>

                        {(addresses?.length ?? 0) > 0 && (
                          <button
                            type="button"
                            className="acct-btn acct-btn-outline"
                            onClick={() => {
                              setShowForm(false);
                              setNewAddress(EMPTY_ADDRESS);
                              setAddressError("");
                            }}
                          >
                            CANCEL
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="checkout-security">
              <Lock size={17} />

              <span>
                Your information is securely processed and protected.
              </span>
            </div>

            <button
              type="submit"
              className="checkout-payment-button"
              disabled={isSubmitting || !selectedId}
            >
              {isSubmitting
                ? "Processing..."
                : "Continue to Payment"}

              {!isSubmitting && <ArrowRight size={17} />}
            </button>
          </form>

          {/* Order Summary */}
          <aside className="checkout-summary">

            <div className="checkout-card">

              <div className="checkout-card-header">
                <div>
                  <p className="checkout-step">ORDER</p>
                  <h2>Order Summary</h2>
                </div>

                <span>
                  {checkoutItems.length}{" "}
                  {checkoutItems.length === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="checkout-products">

                {checkoutItems.map((item) => (
                  <div
                    className="checkout-product"
                    key={`${item.id}-${item.variantId ?? item.variantName ?? "default"}`}
                  >
                    <div className="checkout-product-image">
                      <LazyImage
                        src={item.image}
                        alt={item.name}
                      />

                      <span>
                        {item.quantity}
                      </span>
                    </div>

                    <div className="checkout-product-info">
                      <h3>{item.name}</h3>

                      <p>{item.variantName ? `Size: ${item.variantName}` : item.category}</p>
                    </div>

                    <strong>
                      ₹
                      {(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>
                ))}

              </div>

              <div className="checkout-summary-details">

                <div className="summary-row">
                  <span>Subtotal</span>

                  <strong>
                    ₹{subtotal.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="summary-row">
                  <span>Delivery</span>

                  <strong>
                    {deliveryCharge === 0
                      ? "FREE"
                      : `₹${deliveryCharge.toLocaleString("en-IN")}`}
                  </strong>
                </div>

                <div className="summary-divider" />

                <div className="summary-total">
                  <span>Total</span>

                  <strong>
                    ₹{total.toLocaleString("en-IN")}
                  </strong>
                </div>

              </div>

            </div>

            <Link
              to="/cart"
              className="checkout-edit-cart"
            >
              <ArrowLeft size={15} />
              Edit Cart
            </Link>

          </aside>

        </div>
      </div>
    </section>
  );
};

export default Checkout;
