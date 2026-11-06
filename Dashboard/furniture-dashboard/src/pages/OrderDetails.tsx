import { useEffect, useState } from "react";
import { API_BASE_URL } from "../services/api";
import { formatOrderDateTime } from "../utils/orderDate";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Mail,
  User,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

type Order = {
  id: number;
  order_number: string;
  user_id: number;
  shipping_address_id: number;
  subtotal: number;
  discount_amount: number;
  shipping_charge: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  payment_status: string;
  notes?: string;

  created_at: string;

  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;

  address_line1?: string;
  address_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  shipping_address_type?: string;
};

type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  variant_id?: number;
  product_name: string;
  sku?: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  total_price: number;
};

const API_URL = API_BASE_URL;

const formatCurrency = (value: number | string | undefined) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (date?: string) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusStyle = (status: string) => {
  const value = status?.toLowerCase();

  if (value === "delivered") {
    return {
      background: "#ecfdf3",
      color: "#027a48",
      border: "#abefc6",
    };
  }

  if (value === "shipped") {
    return {
      background: "#eff8ff",
      color: "#175cd3",
      border: "#b2ddff",
    };
  }

  if (value === "dispatched") {
    return {
      background: "#f4f3ff",
      color: "#5925dc",
      border: "#d9d6fe",
    };
  }

  if (value === "cancelled") {
    return {
      background: "#fef3f2",
      color: "#b42318",
      border: "#fecdca",
    };
  }

  return {
    background: "#fffaeb",
    color: "#b54708",
    border: "#fedf89",
  };
};

const getStatusIcon = (status: string) => {
  const value = status?.toLowerCase();

  if (value === "delivered") return <CheckCircle2 size={16} />;
  if (value === "cancelled") return <XCircle size={16} />;
  if (value === "shipped" || value === "dispatched") {
    return <Truck size={16} />;
  }

  return <Clock3 size={16} />;
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/orders/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }

        const body = await response.json();

        // the API wraps the order as { success, data }
        setOrder(body.data ?? body);
      } catch (error) {
        console.error("Order details error:", error);
        setError("Unable to load order details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchOrderItems = async () => {
      try {
        setItemsLoading(true);

        const response = await fetch(
          `${API_URL}/order-items/order/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order items");
        }

        const data = await response.json();

        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Order items error:", error);
        setItems([]);
      } finally {
        setItemsLoading(false);
      }
    };

    fetchOrderDetails();
    fetchOrderItems();
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8f9fb",
          padding: "32px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "50px",
            textAlign: "center",
            color: "#667085",
          }}
        >
          Loading order details...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8f9fb",
          padding: "32px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#344054",
            fontSize: "14px",
            marginBottom: "24px",
          }}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "50px",
            textAlign: "center",
            color: "#b42318",
          }}
        >
          {error || "Order not found"}
        </div>
      </div>
    );
  }

  const statusStyle = getStatusStyle(order.status);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fb",
        padding: "28px 32px 40px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "#667085",
              fontSize: "14px",
              marginBottom: "14px",
            }}
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>

          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 700,
              color: "#101828",
            }}
          >
            Order Details
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#667085",
              fontSize: "14px",
            }}
          >
            Manage and view complete order information
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 14px",
              borderRadius: "8px",
              border: `1px solid ${statusStyle.border}`,
              background: statusStyle.background,
              color: statusStyle.color,
              fontSize: "13px",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {getStatusIcon(order.status)}
            {order.status || "Pending"}
          </div>
        </div>
      </div>

      {/* ORDER SUMMARY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div style={summaryCardStyle}>
          <div style={summaryIconStyle}>
            <Package size={19} />
          </div>

          <div>
            <p style={labelStyle}>Order Number</p>
            <p style={valueStyle}>{order.order_number || `#${order.id}`}</p>
          </div>
        </div>

        <div style={summaryCardStyle}>
          <div style={summaryIconStyle}>
            <CalendarDays size={19} />
          </div>

          <div>
            <p style={labelStyle}>Order Date</p>
            <p style={valueStyle}>{formatDate(order.created_at)}</p>
          </div>
        </div>

        <div style={summaryCardStyle}>
          <div style={summaryIconStyle}>
            <CreditCard size={19} />
          </div>

          <div>
            <p style={labelStyle}>Payment</p>
            <p
              style={{
                ...valueStyle,
                textTransform: "capitalize",
              }}
            >
              {order.payment_status || "Pending"}
            </p>
          </div>
        </div>

        <div style={summaryCardStyle}>
          <div style={summaryIconStyle}>
            <Truck size={19} />
          </div>

          <div>
            <p style={labelStyle}>Total Amount</p>
            <p style={valueStyle}>
              {formatCurrency(order.total_amount)}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(300px, 1fr)",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* PRODUCTS */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div>
                <h2 style={cardTitleStyle}>Order Items</h2>
                <p style={cardSubtitleStyle}>
                  {items.length} product{items.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {itemsLoading ? (
              <div
                style={{
                  padding: "35px",
                  textAlign: "center",
                  color: "#667085",
                }}
              >
                Loading products...
              </div>
            ) : items.length === 0 ? (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "#667085",
                }}
              >
                <Package
                  size={34}
                  style={{ marginBottom: "10px", opacity: 0.5 }}
                />
                <p style={{ margin: 0 }}>No products found for this order.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "650px",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Product</th>
                      <th style={tableHeaderStyle}>SKU</th>
                      <th style={tableHeaderStyle}>Qty</th>
                      <th style={tableHeaderStyle}>Price</th>
                      <th style={tableHeaderStyle}>Discount</th>
                      <th
                        style={{
                          ...tableHeaderStyle,
                          textAlign: "right",
                        }}
                      >
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td style={tableCellStyle}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "8px",
                                background: "#f2f4f7",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <Package size={19} color="#667085" />
                            </div>

                            <span
                              style={{
                                fontWeight: 600,
                                color: "#101828",
                              }}
                            >
                              {item.product_name}
                            </span>
                          </div>
                        </td>

                        <td style={tableCellStyle}>
                          {item.sku || "-"}
                        </td>

                        <td style={tableCellStyle}>
                          {item.quantity}
                        </td>

                        <td style={tableCellStyle}>
                          {formatCurrency(item.unit_price)}
                        </td>

                        <td style={tableCellStyle}>
                          {formatCurrency(item.discount_amount)}
                        </td>

                        <td
                          style={{
                            ...tableCellStyle,
                            textAlign: "right",
                            fontWeight: 600,
                            color: "#101828",
                          }}
                        >
                          {formatCurrency(item.total_price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SHIPPING ADDRESS */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div>
                <h2 style={cardTitleStyle}>Shipping Address</h2>
                <p style={cardSubtitleStyle}>
                  Delivery information
                </p>
              </div>

              <MapPin size={20} color="#667085" />
            </div>

            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #eaecf0",
                borderRadius: "10px",
                padding: "18px",
              }}
            >
              <p
                style={{
                  margin: "0 0 7px",
                  fontWeight: 600,
                  color: "#101828",
                }}
              >
                {order.shipping_address_type
                  ? `${order.shipping_address_type} Address`
                  : "Delivery Address"}
              </p>

              <p
                style={{
                  margin: "0 0 4px",
                  color: "#475467",
                  lineHeight: 1.6,
                }}
              >
                {order.address_line1 || "-"}
              </p>

              {order.address_line2 && (
                <p
                  style={{
                    margin: "0 0 4px",
                    color: "#475467",
                  }}
                >
                  {order.address_line2}
                </p>
              )}

              <p
                style={{
                  margin: 0,
                  color: "#475467",
                }}
              >
                {[
                  order.shipping_city,
                  order.shipping_state,
                  order.shipping_postal_code,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              {order.shipping_country && (
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#475467",
                  }}
                >
                  {order.shipping_country}
                </p>
              )}
            </div>
          </div>

          {/* NOTES */}
          {order.notes && (
            <div style={cardStyle}>
              <h2 style={cardTitleStyle}>Order Notes</h2>

              <p
                style={{
                  margin: "12px 0 0",
                  color: "#475467",
                  lineHeight: 1.6,
                }}
              >
                {order.notes}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* CUSTOMER */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div>
                <h2 style={cardTitleStyle}>Customer Details</h2>
                <p style={cardSubtitleStyle}>
                  Customer information
                </p>
              </div>

              <User size={20} color="#667085" />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div>
                <p style={labelStyle}>Name</p>
                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#101828",
                    fontWeight: 600,
                  }}
                >
                  {order.customer_name || "-"}
                </p>
              </div>

              <div>
                <p style={labelStyle}>Email</p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "5px",
                    color: "#475467",
                    wordBreak: "break-word",
                  }}
                >
                  <Mail size={16} />
                  {order.customer_email || "-"}
                </div>
              </div>

              <div>
                <p style={labelStyle}>Phone</p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "5px",
                    color: "#475467",
                  }}
                >
                  <Phone size={16} />
                  {order.customer_phone || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT SUMMARY */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div>
                <h2 style={cardTitleStyle}>Payment Summary</h2>
                <p style={cardSubtitleStyle}>
                  Complete order calculation
                </p>
              </div>

              <CreditCard size={20} color="#667085" />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "13px",
              }}
            >
              <AmountRow
                label="Subtotal"
                value={formatCurrency(order.subtotal)}
              />

              <AmountRow
                label="Discount"
                value={`- ${formatCurrency(order.discount_amount)}`}
                valueColor="#039855"
              />

              <AmountRow
                label="Shipping"
                value={formatCurrency(order.shipping_charge)}
              />

              <AmountRow
                label="Tax"
                value={formatCurrency(order.tax_amount)}
              />

              <div
                style={{
                  height: "1px",
                  background: "#eaecf0",
                  margin: "5px 0",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#101828",
                  }}
                >
                  Total
                </span>

                <span
                  style={{
                    fontSize: "19px",
                    fontWeight: 700,
                    color: "#101828",
                  }}
                >
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* ORDER INFORMATION */}
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Order Information</h2>

            <div
              style={{
                marginTop: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "13px",
              }}
            >
              <InfoRow
                label="Order ID"
                value={`#${order.id}`}
              />

              <InfoRow
                label="Order Number"
                value={order.order_number || "-"}
              />

              <InfoRow
                label="Payment Status"
                value={order.payment_status || "Pending"}
                capitalize
              />

              <InfoRow
                label="Order Status"
                value={order.status || "Pending"}
                capitalize
              />

              <InfoRow
                label="Created At"
                value={formatOrderDateTime(order.created_at, "-", order.order_number)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AmountRow = ({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <span
        style={{
          color: "#667085",
          fontSize: "14px",
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: valueColor || "#344054",
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        {value}
      </span>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
  capitalize,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
      }}
    >
      <span
        style={{
          color: "#667085",
          fontSize: "13px",
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: "#344054",
          fontSize: "13px",
          fontWeight: 600,
          textAlign: "right",
          textTransform: capitalize ? "capitalize" : "none",
        }}
      >
        {value}
      </span>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #eaecf0",
  borderRadius: "14px",
  padding: "22px",
  boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
};

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "20px",
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "17px",
  fontWeight: 700,
  color: "#101828",
};

const cardSubtitleStyle: React.CSSProperties = {
  margin: "5px 0 0",
  fontSize: "13px",
  color: "#667085",
};

const summaryCardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #eaecf0",
  borderRadius: "12px",
  padding: "17px",
  display: "flex",
  alignItems: "center",
  gap: "13px",
};

const summaryIconStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "9px",
  background: "#f2f4f7",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#475467",
  flexShrink: 0,
};

const labelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "12px",
  color: "#667085",
};

const valueStyle: React.CSSProperties = {
  margin: "5px 0 0",
  fontSize: "14px",
  fontWeight: 600,
  color: "#101828",
};

const tableHeaderStyle: React.CSSProperties = {
  padding: "12px 14px",
  background: "#f9fafb",
  borderBottom: "1px solid #eaecf0",
  color: "#667085",
  fontSize: "12px",
  fontWeight: 600,
  textAlign: "left",
  whiteSpace: "nowrap",
};

const tableCellStyle: React.CSSProperties = {
  padding: "14px",
  borderBottom: "1px solid #f2f4f7",
  color: "#475467",
  fontSize: "13px",
  whiteSpace: "nowrap",
};

export default OrderDetails;