import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  Smartphone,
  CreditCard,
  Landmark,
  Banknote,
  Wallet,
} from "lucide-react";

import { API_URL } from "../auth/authContext";
import { useCart } from "../context/CartContext";

type MethodKey = "upi" | "card" | "netbanking" | "cod" | "partial_cod";

// Share of the total paid online for Partial COD (must match the backend).
const PARTIAL_COD_ADVANCE_RATE = 0.2;

const BANKS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
  "Bank of Baroda",
];

const METHODS: {
  key: MethodKey;
  title: string;
  subtitle: string;
  icon: typeof Smartphone;
}[] = [
  {
    key: "upi",
    title: "Pay with UPI",
    subtitle: "Google Pay, PhonePe, Paytm or any UPI app",
    icon: Smartphone,
  },
  {
    key: "card",
    title: "Credit or debit card",
    subtitle: "Visa, Mastercard, American Express",
    icon: CreditCard,
  },
  {
    key: "netbanking",
    title: "Net Banking",
    subtitle: "Pay directly from your bank account",
    icon: Landmark,
  },
  {
    key: "cod",
    title: "Cash on Delivery / Pay on Delivery",
    subtitle: "Cash, UPI and cards accepted at your doorstep",
    icon: Banknote,
  },
  {
    key: "partial_cod",
    title: "Partial COD",
    subtitle: "Pay a small advance online now, rest as cash on delivery",
    icon: Wallet,
  },
];

const METHOD_LABELS: Record<MethodKey, string> = {
  upi: "UPI",
  card: "Card",
  netbanking: "Net Banking",
  cod: "Cash on Delivery",
  partial_cod: "Partial COD",
};

const rupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const amount = Number(
    searchParams.get("amount") ||
      sessionStorage.getItem("checkoutTotal") ||
      0
  );

  const orderId =
    searchParams.get("order_id") || sessionStorage.getItem("currentOrderId");

  const advance = Math.round(amount * PARTIAL_COD_ADVANCE_RATE);
  const balance = amount - advance;

  const [method, setMethod] = useState<MethodKey | null>(null);

  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const payableNow =
    method === "cod" ? 0 : method === "partial_cod" ? advance : amount;

  const validate = (): string => {
    if (!method) return "Please choose a payment method.";

    if (method === "upi" && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim())) {
      return "Please enter a valid UPI ID (e.g. name@bank).";
    }

    if (method === "netbanking" && !bank) {
      return "Please choose your bank.";
    }

    if (method === "card") {
      if (!/^\d{16}$/.test(cardNumber)) {
        return "Please enter a valid 16-digit card number.";
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        return "Please enter expiry in MM/YY format.";
      }
      if (!/^\d{3}$/.test(cvv)) {
        return "Please enter a valid 3-digit CVV.";
      }
      if (!cardName.trim()) {
        return "Please enter the name on card.";
      }
    }

    return "";
  };

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const problem = validate();

    if (problem) {
      setError(problem);
      return;
    }

    if (!orderId) {
      setError("We couldn't find your order. Please go back to checkout.");
      return;
    }

    setProcessing(true);

    try {
      // Mock gateway delay for online methods.
      if (method !== "cod") {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const response = await fetch(`${API_URL}/api/payments/mock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: Number(orderId), method }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Payment failed. Please try again.");
      }

      sessionStorage.setItem(
        "mockPayment",
        JSON.stringify({
          transactionId: result.data.payment.transaction_id,
          method,
          methodLabel: METHOD_LABELS[method!],
          total: amount,
          paidOnline: result.data.amount_paid_online,
          dueOnDelivery: result.data.amount_due_on_delivery,
          paymentDate: new Date().toISOString(),
        })
      );

      clearCart();
      navigate("/payment-success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
      setProcessing(false);
    }
  };

  const buttonLabel = () => {
    if (processing) return "Processing...";
    if (method === "cod") return `Place Order · Pay ${rupees(amount)} on delivery`;
    if (method === "partial_cod") return `Pay ${rupees(advance)} advance & place order`;
    return `Pay ${rupees(amount)}`;
  };

  return (
    <section className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <button
            type="button"
            className="back-to-cart"
            onClick={() => navigate("/checkout")}
          >
            <ArrowLeft size={16} />
            Back to Checkout
          </button>

          <p className="cart-eyebrow">SECURE PAYMENT</p>

          <h1>Payment</h1>

          <p>Choose how you would like to pay for your order.</p>
        </div>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handlePayment}>
            <div className="checkout-card">
              <div className="checkout-card-header">
                <div>
                  <p className="checkout-step">STEP 02</p>
                  <h2>Payment method</h2>
                </div>
              </div>

              <div className="pay-methods">
                {METHODS.map(({ key, title, subtitle, icon: Icon }) => {
                  const selected = method === key;

                  return (
                    <div
                      key={key}
                      className={`pay-method ${selected ? "selected" : ""}`}
                    >
                      <label className="pay-method-head">
                        <input
                          type="radio"
                          name="payment-method"
                          checked={selected}
                          onChange={() => {
                            setMethod(key);
                            setError("");
                          }}
                        />

                        <span className="pay-method-text">
                          <strong>{title}</strong>
                          <span>{subtitle}</span>
                        </span>

                        <Icon size={20} />
                      </label>

                      {selected && (
                        <div className="pay-method-body">
                          {key === "upi" && (
                            <div className="checkout-field">
                              <label htmlFor="upiId">UPI ID</label>
                              <input
                                id="upiId"
                                type="text"
                                placeholder="name@bank"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                              />
                              <small>
                                A payment request will be sent to your UPI app.
                              </small>
                            </div>
                          )}

                          {key === "netbanking" && (
                            <div className="checkout-field">
                              <label htmlFor="bank">Choose your bank</label>
                              <select
                                id="bank"
                                value={bank}
                                onChange={(e) => setBank(e.target.value)}
                              >
                                <option value="">Choose an option</option>
                                {BANKS.map((name) => (
                                  <option key={name} value={name}>
                                    {name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {key === "card" && (
                            <div className="checkout-fields">
                              <div className="checkout-field full-width">
                                <label htmlFor="cardName">Name on Card</label>
                                <input
                                  id="cardName"
                                  type="text"
                                  placeholder="Enter card holder name"
                                  value={cardName}
                                  onChange={(e) => setCardName(e.target.value)}
                                />
                              </div>

                              <div className="checkout-field full-width">
                                <label htmlFor="cardNumber">Card Number</label>
                                <input
                                  id="cardNumber"
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={16}
                                  placeholder="4242424242424242"
                                  value={cardNumber}
                                  onChange={(e) =>
                                    setCardNumber(e.target.value.replace(/\D/g, ""))
                                  }
                                />
                              </div>

                              <div className="checkout-field">
                                <label htmlFor="expiry">Expiry</label>
                                <input
                                  id="expiry"
                                  type="text"
                                  maxLength={5}
                                  placeholder="MM/YY"
                                  value={expiry}
                                  onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, "");

                                    if (value.length > 2) {
                                      value = value.slice(0, 2) + "/" + value.slice(2, 4);
                                    }

                                    setExpiry(value);
                                  }}
                                />
                              </div>

                              <div className="checkout-field">
                                <label htmlFor="cvv">CVV</label>
                                <input
                                  id="cvv"
                                  type="password"
                                  inputMode="numeric"
                                  maxLength={3}
                                  placeholder="123"
                                  value={cvv}
                                  onChange={(e) =>
                                    setCvv(e.target.value.replace(/\D/g, ""))
                                  }
                                />
                              </div>

                              <p className="pay-hint full-width">
                                Test card: 4242 4242 4242 4242 · 12/30 · 123
                              </p>
                            </div>
                          )}

                          {key === "cod" && (
                            <p className="pay-hint">
                              Pay {rupees(amount)} when your order is delivered. No
                              payment is needed now.
                            </p>
                          )}

                          {key === "partial_cod" && (
                            <div className="pay-split">
                              <div className="summary-row">
                                <span>Pay now (20% advance)</span>
                                <strong>{rupees(advance)}</strong>
                              </div>
                              <div className="summary-row">
                                <span>Pay on delivery</span>
                                <strong>{rupees(balance)}</strong>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {error && (
                <p style={{ color: "#d93025", marginTop: "16px" }} role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="checkout-security">
              <Lock size={17} />

              <span>
                This is a test payment gateway. No real money will be charged.
              </span>
            </div>

            <button
              type="submit"
              className="checkout-payment-button"
              disabled={processing || !method}
            >
              {buttonLabel()}

              {!processing && <CheckCircle2 size={17} />}
            </button>
          </form>

          <aside className="checkout-summary">
            <div className="checkout-card">
              <div className="checkout-card-header">
                <div>
                  <p className="checkout-step">TEST MODE</p>

                  <h2>Payment Summary</h2>
                </div>
              </div>

              <div className="checkout-summary-details">
                <div className="summary-row">
                  <span>Payment Method</span>
                  <strong>{method ? METHOD_LABELS[method] : "Not selected"}</strong>
                </div>

                <div className="summary-row">
                  <span>Order Total</span>
                  <strong>{rupees(amount)}</strong>
                </div>

                {method === "partial_cod" && (
                  <div className="summary-row">
                    <span>Due on delivery</span>
                    <strong>{rupees(balance)}</strong>
                  </div>
                )}

                <div className="summary-divider" />

                <div className="summary-total">
                  <span>Pay Now</span>

                  <strong>{rupees(method ? payableNow : amount)}</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Payment;
