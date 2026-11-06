
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const paymentData = JSON.parse(
    sessionStorage.getItem("mockPayment") || "{}"
  );

  const checkoutData = JSON.parse(
    sessionStorage.getItem("checkoutData") || "{}"
  );

  const paidOnline = Number(paymentData.paidOnline || 0);
  const dueOnDelivery = Number(paymentData.dueOnDelivery || 0);
  const isCod = paymentData.method === "cod";

  const orderId =
    paymentData.orderId ||
    checkoutData.orderId ||
    paymentData.order_id ||
    checkoutData.order_id ||
    paymentData.id ||
    checkoutData.id ||
    (paymentData.transactionId
      ? `ORD_${paymentData.transactionId.replace(/^(COD_|TXN_|PAY_)/, "")}`
      : "ORD_" + Date.now());

  const items = Array.isArray(checkoutData.items)
    ? checkoutData.items
    : Array.isArray(paymentData.items)
      ? paymentData.items
      : [];

  const singleImage =
    checkoutData.image ||
    checkoutData.img ||
    checkoutData.orderImg ||
    checkoutData.productImage ||
    paymentData.image ||
    null;

  return (
    <section className="checkout-page">
      <div
        className="checkout-container"
        style={{ maxWidth: "760px", margin: "0 auto" }}
      >
        <div
          className="checkout-card"
          style={{ textAlign: "center", padding: "60px 30px" }}
        >
          <CheckCircle2
            size={64}
            strokeWidth={1.5}
            style={{ marginBottom: "20px" }}
          />

          <p className="cart-eyebrow">
            {isCod ? "ORDER PLACED" : "PAYMENT SUCCESSFUL"}
          </p>

          <h1>Thank You!</h1>

          <p>
            {isCod
              ? "Your order has been placed. Please keep the amount ready for delivery."
              : "Your payment has been successfully completed."}
          </p>

          <div
            style={{
              margin: "30px auto",
              maxWidth: "420px",
              padding: "20px",
              border: "1px solid #e5e5e5",
              borderRadius: "12px",
              textAlign: "left",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>Order Details</h3>

            {items.length > 0 ? (
              items.map((item: any, index: number) => {
                const image =
                  item.image ||
                  item.imageUrl ||
                  item.image_url ||
                  item.product_image ||
                  item.productImage ||
                  item.img;

                return (
                  <div
                    key={`${item.id || item.product_id || index}-${item.variant_id ?? item.variant_name ?? ""}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "12px 0",
                      borderBottom: "1px solid #e5e5e5",
                    }}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={item.product_name || item.name || "Ordered product"}
                        style={{
                          width: "76px",
                          height: "76px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #e5e5e5",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "76px",
                          height: "76px",
                          background: "#f3f3f3",
                          borderRadius: "8px",
                          display: "grid",
                          placeItems: "center",
                          fontSize: "11px",
                          color: "#777",
                          flexShrink: 0,
                        }}
                      >
                        No Image
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong>
                        {item.product_name || item.name || "Product"}
                      </strong>

                      <p style={{ margin: "6px 0", fontSize: "13px" }}>
                        Order ID: {orderId}
                      </p>

                      <p style={{ margin: 0, fontSize: "13px" }}>
                        Quantity: {item.quantity || 1}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              singleImage && (
                <div style={{ marginBottom: "16px", textAlign: "center" }}>
                  <img
                    src={singleImage}
                    alt="Ordered product"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              )
            )}

            <div className="summary-row">
              <span>Order ID</span>
              <strong>{orderId}</strong>
            </div>

            <div className="summary-row">
              <span>Customer</span>
              <strong>{checkoutData.name || "Customer"}</strong>
            </div>

            <div className="summary-row">
              <span>Payment Method</span>
              <strong>{paymentData.methodLabel || "Online"}</strong>
            </div>

            <div className="summary-row">
              <span>Transaction ID</span>
              <strong>{paymentData.transactionId || "MOCK_PAYMENT"}</strong>
            </div>

            <div className="summary-divider" />

            {dueOnDelivery > 0 && (
              <div className="summary-row">
                <span>Due on delivery</span>
                <strong>
                  ₹{dueOnDelivery.toLocaleString("en-IN")}
                </strong>
              </div>
            )}

            <div className="summary-total">
              <span>Paid Online</span>
              <strong>
                ₹{paidOnline.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="checkout-payment-button"
            onClick={() => navigate("/")}
          >
            Continue Shopping
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;
