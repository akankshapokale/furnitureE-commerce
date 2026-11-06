import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Search,
  Download,
  ShoppingCart,
  Clock3,
  CreditCard,
  Truck,
  Eye,
  X,
  CalendarDays,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { getOrders, getShipments, getMediaUrl, getPayments, updateShipment } from "../services/api";
import { formatOrderDateTime } from "../utils/orderDate";
import { normalizeShipmentStage, SHIPMENT_STAGES, shipmentStageLabel, type ShipmentStage } from "../utils/shipmentStatus";
import DateRangeCalendar from "../components/common/DateRangeCalendar";

interface OrderItem {
  id?: number;
  product_id?: number;
  product_name?: string;
  image_url?: string | null;
  price_at_purchase?: number | string;
  quantity?: number;
}

interface Order {
  id: number | string;
  order_number: string;
  user_id?: number | string;

  customer_name?: string;
  customer?: string;
  customer_phone?: string;
  customer_email?: string;
  phone?: string;
  address_line1?: string | null;
  address_line2?: string | null;
  shipping_city?: string | null;
  shipping_state?: string | null;
  shipping_postal_code?: string | null;
  shipping_country?: string | null;
  shipping_address_type?: string | null;
  subtotal?: number | string;
  discount_amount?: number | string;
  shipping_charge?: number | string;
  tax_amount?: number | string;
  payment_method?: string | null;
  source?: string | null;
  shipment_status?: string | null;
  shipmentStatus?: string | null;

  items?: OrderItem[];

  product?: string;

  total_amount: number | string;

  status: string;
  payment_status: string;

  created_at: string;
}

interface PaymentRecord {
  order_id: number | string;
  payment_status?: string | null;
  amount?: number | string | null;
}

interface ShipmentDetails {
  id: number;
  shipment_status?: string | null;
  tracking_number?: string | null;
  courier_name?: string | null;
  estimated_delivery?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
}

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconStyle: string;
  valueStyle?: string;
}

interface TableHeadProps {
  children: React.ReactNode;
}

const paymentStyles: Record<string, string> = {
  paid: "bg-green-50 text-green-700",
  success: "bg-green-50 text-green-700",
  completed: "bg-green-50 text-green-700",
  pending: "bg-yellow-50 text-yellow-700",
  failed: "bg-red-50 text-red-700",
  refunded: "bg-orange-50 text-orange-700",
};

const formatStatus = (status: string) => {
  if (!status) return "Pending";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const statusStyles: Record<string, string> = {
  order_placed: "bg-yellow-50 text-yellow-700",
  order_confirmed: "bg-sky-50 text-sky-700",
  processing: "bg-blue-50 text-blue-700",
  packaging: "bg-violet-50 text-violet-700",
  ready_to_ship: "bg-purple-50 text-purple-700",
  in_transit: "bg-indigo-50 text-indigo-700",
  out_for_delivery: "bg-orange-50 text-orange-700",
  delivered: "bg-green-50 text-green-700",
  returned: "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
};

const formatPaymentStatus = (status: string) => {
  if (!status) return "Pending";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const endOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
const MAX_CUSTOM_RANGE_DAYS = 62;

const canvasToPdf = (canvas: HTMLCanvasElement) => {
  const encoded = canvas.toDataURL("image/jpeg", 0.94).split(",")[1];
  const image = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  let length = 0;
  const append = (chunk: Uint8Array) => { chunks.push(chunk); length += chunk.length; };
  const appendText = (text: string) => append(encoder.encode(text));
  const offsets = [0];
  const object = (number: number, body: string) => {
    offsets[number] = length;
    appendText(`${number} 0 obj\n${body}\nendobj\n`);
  };

  appendText("%PDF-1.4\n");
  object(1, "<< /Type /Catalog /Pages 2 0 R >>");
  object(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  object(3, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Invoice 4 0 R >> >> /Contents 5 0 R >>");
  offsets[4] = length;
  appendText(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>\nstream\n`);
  append(image);
  appendText("\nendstream\nendobj\n");
  const content = "q\n595 0 0 842 0 0 cm\n/Invoice Do\nQ\n";
  object(5, `<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream`);
  const xrefOffset = length;
  appendText(`xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
  const pdf = new Uint8Array(length);
  let cursor = 0;
  for (const chunk of chunks) { pdf.set(chunk, cursor); cursor += chunk.length; }
  return new Blob([pdf.buffer as ArrayBuffer], { type: "application/pdf" });
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [shipmentStatuses, setShipmentStatuses] = useState<Record<string, string>>({});
  const [shipmentDetails, setShipmentDetails] = useState<Record<string, ShipmentDetails>>({});
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<string[]>([]);
  const [showPaymentFilter, setShowPaymentFilter] = useState(false);
  const [showShipmentFilter, setShowShipmentFilter] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>(() => {
    const end = endOfDay(new Date());
    const start = startOfDay(new Date(end.getFullYear(), end.getMonth(), end.getDate() - 29));
    return { start, end };
  });
  const [activeDatePreset, setActiveDatePreset] = useState("Last 30 Days");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() - 1, 1);
  });
  const [rangeAnchor, setRangeAnchor] = useState<Date | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [shipmentStageDraft, setShipmentStageDraft] = useState<ShipmentStage>("order_placed");
  const [savingShipmentStage, setSavingShipmentStage] = useState(false);
  const [shipmentStageMessage, setShipmentStageMessage] = useState("");
  const [invoicePreviewOpen, setInvoicePreviewOpen] = useState(false);

  useEffect(() => {
    if (!selectedOrder) return;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setInvoicePreviewOpen(false);
        setSelectedOrder(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedOrder]);

  const handleDownloadInvoice = async () => {
    if (!selectedOrder) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1240;
    canvas.height = 1754;
    const context = canvas.getContext("2d");
    if (!context) return;

    const customerName = selectedOrder.customer_name || selectedOrder.customer || "Customer";
    const address = [selectedOrder.address_line1, selectedOrder.address_line2, selectedOrder.shipping_city, selectedOrder.shipping_state, selectedOrder.shipping_postal_code, selectedOrder.shipping_country].filter(Boolean).join(", ");
    const money = (value: number) => `Rs. ${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
    const drawText = (value: string, x: number, y: number, font = "20px Arial", color = "#172033", maxWidth?: number) => {
      context.font = font;
      context.fillStyle = color;
      context.fillText(value, x, y, maxWidth);
    };
    const wrap = (value: string, x: number, y: number, maxWidth: number, lineHeight: number, font = "17px Arial") => {
      context.font = font;
      const words = value.split(/\s+/);
      let line = "";
      let lineY = y;
      for (const word of words) {
        const next = line ? `${line} ${word}` : word;
        if (context.measureText(next).width > maxWidth && line) {
          drawText(line, x, lineY, font, "#475569");
          line = word;
          lineY += lineHeight;
        } else line = next;
      }
      if (line) drawText(line, x, lineY, font, "#475569");
      return lineY + lineHeight;
    };
    const line = (y: number, x1 = 80, x2 = 1160, color = "#d7dde5") => {
      context.strokeStyle = color;
      context.lineWidth = 1.5;
      context.beginPath();
      context.moveTo(x1, y);
      context.lineTo(x2, y);
      context.stroke();
    };

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#111111";
    context.lineWidth = 2;
    context.strokeRect(76, 54, 1088, 1640);
    const brandLogo = new Image();
    brandLogo.src = "/logo-mark-dark.png";
    try {
      await brandLogo.decode();
      context.drawImage(brandLogo, 94, 82, 62, 62);
    } catch {
      // Keep the invoice readable if the optional brand mark cannot load.
    }
    context.textAlign = "center";
    drawText("TAX INVOICE", 620, 95, "bold 24px Arial", "#111111");
    context.textAlign = "left";
    drawText("STAGING SPACES", 170, 121, "bold 22px Arial", "#111111");
    drawText("BY NARESH STEEL CORPORATION", 170, 145, "12px Arial", "#111111");
    context.strokeStyle = "#111111";
    context.lineWidth = 1;
    context.strokeRect(744, 108, 420, 104);
    context.beginPath(); context.moveTo(880, 108); context.lineTo(880, 212); context.stroke();
    line(143, 744, 1164, "#111111");
    line(178, 744, 1164, "#111111");
    drawText("Invoice No.", 760, 135, "bold 13px Arial", "#111111");
    drawText(selectedOrder.order_number, 900, 135, "14px Arial", "#111111", 240);
    drawText("Invoice Date", 760, 165, "bold 13px Arial", "#111111");
    drawText(formatOrderDateTime(selectedOrder.created_at, "—", selectedOrder.order_number), 900, 165, "14px Arial", "#111111", 240);
    drawText("Payment", 760, 195, "bold 13px Arial", "#111111");
    drawText(`${formatPaymentStatus(selectedOrder.payment_status || "pending")}${selectedOrder.payment_method ? ` - ${selectedOrder.payment_method}` : ""}`, 900, 195, "14px Arial", "#111111", 240);

    context.lineWidth = 1.5;
    const sellerBottom = 220;
    const buyerTop = 220;
    context.strokeRect(76, sellerBottom, 544, 300);
    context.strokeRect(620, buyerTop, 544, 300);
    drawText("SUPPLIER", 94, 248, "bold 13px Arial", "#111111");
    drawText("Staging Spaces", 94, 276, "bold 13px Arial", "#111111");
    drawText("By Naresh Steel Corporation", 94, 301, "14px Arial", "#111111");
    drawText("987, A,D Camp Chowk, Bhawani Peth, Pune, Maharashtra 411042", 94, 326, "12px Arial", "#475569", 510);
    drawText("Phone: +91 8669944932", 94, 350, "12px Arial", "#475569", 510);
    drawText("GSTIN: 27AABFN5839R1ZI", 94, 380, "bold 13px Arial", "#111111", 510);
    drawText("BUYER (BILL TO)", 638, 248, "bold 13px Arial", "#111111");
    drawText(customerName, 638, 276, "bold 13px Arial", "#111111", 500);
    if (selectedOrder.customer_phone || selectedOrder.phone) drawText(`Phone: ${selectedOrder.customer_phone || selectedOrder.phone}`, 638, 304, "13px Arial", "#111111", 500);
    if (selectedOrder.customer_email) drawText(selectedOrder.customer_email, 638, 330, "13px Arial", "#111111", 500);
    wrap(address || "Address not available", 638, 360, 500, 21, "13px Arial");
    line(390, 620, 1164, "#111111");
    drawText("RECEIVER (SHIP TO)", 638, 420, "bold 13px Arial", "#111111");
    drawText(customerName, 638, 446, "bold 13px Arial", "#111111", 500);
    if (selectedOrder.customer_phone || selectedOrder.phone) drawText(`Phone: ${selectedOrder.customer_phone || selectedOrder.phone}`, 638, 469, "12px Arial", "#475569", 500);
    if (selectedOrder.customer_email) drawText(`Email: ${selectedOrder.customer_email}`, 638, 492, "12px Arial", "#475569", 500);
    wrap(address || "Address not available", 638, 515, 500, 19, "12px Arial");

    const subtotal = Number(selectedOrder.subtotal ?? selectedOrder.total_amount ?? 0);
    const discount = Number(selectedOrder.discount_amount || 0);
    const shipping = Number(selectedOrder.shipping_charge || 0);
    const tax = Number(selectedOrder.tax_amount || 0);
    const items = selectedOrder.items?.length ? selectedOrder.items : [{ product_name: selectedOrder.product || "Order item", quantity: 1, price_at_purchase: subtotal }];
    const tableTop = 550;
    const tableLeft = 76;
    const columnWidths = [54, 390, 116, 115, 115, 120, 178];
    const headers = ["Sr.", "Description of Goods", "HSN/SAC", "Part No.", "Quantity", "Rate", "Amount"];
    const rowHeight = Math.max(58, Math.floor(790 / Math.max(items.length, 1)));
    const tableBottom = tableTop + 46 + rowHeight * items.length;
    let x = tableLeft;
    context.lineWidth = 1.5;
    context.strokeRect(tableLeft, tableTop, columnWidths.reduce((sum, width) => sum + width, 0), tableBottom - tableTop);
    headers.forEach((header, index) => {
      const centerHeader = index === 0 || index === 2 || index === 3;
      context.textAlign = centerHeader ? "center" : index >= 4 ? "right" : "left";
      const headerX = centerHeader ? x + columnWidths[index] / 2 : index >= 4 ? x + columnWidths[index] - 8 : x + 8;
      drawText(header, headerX, tableTop + 29, "bold 12px Arial", "#111111", columnWidths[index] - 14);
      context.textAlign = "left";
      x += columnWidths[index];
      if (index < headers.length - 1) {
        context.beginPath(); context.moveTo(x, tableTop); context.lineTo(x, tableBottom); context.stroke();
      }
    });
    line(tableTop + 46, tableLeft, tableLeft + columnWidths.reduce((sum, width) => sum + width, 0), "#111111");
    items.forEach((item, index) => {
      const rowY = tableTop + 46 + rowHeight * index;
      const quantity = Number(item.quantity || 1);
      const price = Number(item.price_at_purchase || 0);
      const values = [String(index + 1), item.product_name || "Product", "—", "—", `${quantity} No.`, money(price), money(price * quantity)];
      let cellX = tableLeft;
      values.forEach((value, cellIndex) => {
        const alignRight = cellIndex >= 4;
        const textX = alignRight ? cellX + columnWidths[cellIndex] - 8 : cellX + 8;
        context.textAlign = alignRight ? "right" : "left";
        drawText(value, textX, rowY + 30, cellIndex === 1 ? "bold 13px Arial" : "12px Arial", "#111111", columnWidths[cellIndex] - 16);
        context.textAlign = "left";
        cellX += columnWidths[cellIndex];
      });
      if (index < items.length - 1) line(rowY + rowHeight, tableLeft, tableLeft + columnWidths.reduce((sum, width) => sum + width, 0), "#111111");
    });

    const summaryTop = tableBottom + 36;
    const summaryX = 760;
    let summaryY = summaryTop;
    const summaryLine = (label: string, amount: number, bold = false) => {
      drawText(label, summaryX, summaryY, `${bold ? "bold " : ""}14px Arial`, "#111111", 220);
      context.textAlign = "right";
      drawText(money(amount), 1140, summaryY, `${bold ? "bold " : ""}14px Arial`, "#111111", 170);
      context.textAlign = "left";
      summaryY += 26;
    };
    summaryLine("Subtotal", subtotal);
    if (discount > 0) summaryLine("Discount", -discount);
    if (shipping > 0) summaryLine("Shipping", shipping);
    if (tax > 0) summaryLine("GST / Tax", tax);
    line(summaryY - 8, summaryX, 1164, "#111111");
    summaryLine("Grand Total", Number(selectedOrder.total_amount || 0), true);
    drawText("This is a computer generated invoice.", 430, 1645, "13px Arial", "#111111");

    const blob = canvasToPdf(canvas);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${selectedOrder.order_number.replace(/[^a-z0-9-_]/gi, "-")}.pdf`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const [ordersResult, shipmentsResult, paymentsResult] = await Promise.allSettled([getOrders(), getShipments(), getPayments()]);

    if (ordersResult.status === "fulfilled") {
      setOrders(Array.isArray(ordersResult.value.data?.data) ? ordersResult.value.data.data : []);
    } else {
      console.error("Failed to fetch orders:", ordersResult.reason);
      setOrders([]);
    }

    if (paymentsResult.status === "fulfilled") {
      const records = Array.isArray(paymentsResult.value.data?.data) ? paymentsResult.value.data.data : [];
      setPayments(records);
    } else {
      setPayments([]);
    }

    if (shipmentsResult.status === "fulfilled") {
      const latestByOrder: Record<string, string> = {};
      const detailByOrder: Record<string, ShipmentDetails> = {};
      const shipments = Array.isArray(shipmentsResult.value.data?.data) ? shipmentsResult.value.data.data : [];
      for (const shipment of shipments) {
        const orderId = String(shipment.order_id);
        if (!latestByOrder[orderId]) {
          latestByOrder[orderId] = normalizeShipmentStage(shipment.shipment_status);
          detailByOrder[orderId] = shipment;
        }
      }
      setShipmentStatuses(latestByOrder);
      setShipmentDetails(detailByOrder);
    } else {
      setShipmentStatuses({});
      setShipmentDetails({});
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const openOrderDetails = (order: Order) => {
    setInvoicePreviewOpen(false);
    setSelectedOrder(order);
    setShipmentStageDraft(normalizeShipmentStage(shipmentStatuses[String(order.id)] || order.shipment_status || order.shipmentStatus || order.status));
    setShipmentStageMessage("");
  };

  const saveShipmentStage = async () => {
    if (!selectedOrder) return;
    const shipment = shipmentDetails[String(selectedOrder.id)];
    if (!shipment?.id) {
      setShipmentStageMessage("This order has no shipment record yet.");
      return;
    }

    try {
      setSavingShipmentStage(true);
      setShipmentStageMessage("");
      const now = new Date().toISOString();
      await updateShipment(shipment.id, {
        shipment_status: shipmentStageDraft,
        ...(shipmentStageDraft === "in_transit" && !shipment.shipped_at ? { shipped_at: now } : {}),
        ...(shipmentStageDraft === "delivered" && !shipment.delivered_at ? { delivered_at: now } : {}),
      });
      await loadOrders();
      setShipmentStageMessage("Shipment progress updated.");
    } catch {
      setShipmentStageMessage("Could not update shipment progress. Please try again.");
    } finally {
      setSavingShipmentStage(false);
    }
  };

  const isPaid = (order: Order) => ["paid", "success", "completed"].includes(order.payment_status?.toLowerCase() || "");
  const isCancelled = (order: Order) => ["cancelled", "canceled"].includes(order.status?.toLowerCase() || "");
  const isReturned = (order: Order) => ["returned", "rto", "returned_to_origin"].includes(order.status?.toLowerCase() || "");
  const amountOf = (order: Order) => Number(order.total_amount || 0);
  const sumAmount = (rows: Order[]) => rows.reduce((sum, order) => sum + amountOf(order), 0);
  const inr = (amount: number) => `\u20b9${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  const periodOrders = useMemo(() => {
    const start = dateRange.start?.getTime() ?? null;
    const end = dateRange.end
      ? endOfDay(dateRange.end).getTime()
      : (dateRange.start ? endOfDay(new Date()).getTime() : null);
    if (start === null && end === null) return orders;
    return orders.filter((order) => {
      const created = new Date(order.created_at).getTime();
      return Number.isFinite(created) && (start === null || created >= start) && (end === null || created <= end);
    });
  }, [orders, dateRange]);
  const paidAmountFor = (order: Order) => {
    const successfulPayments = payments.filter((payment) =>
      String(payment.order_id) === String(order.id) &&
      ["paid", "success", "completed"].includes(payment.payment_status?.toLowerCase() || "")
    );
    if (successfulPayments.length) {
      return Math.min(amountOf(order), successfulPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0));
    }
    return isPaid(order) ? amountOf(order) : 0;
  };
  const paidOrders = periodOrders.filter((order) => paidAmountFor(order) >= amountOf(order));
  const pendingOrders = periodOrders.filter((order) =>
    !isCancelled(order) && !isReturned(order) && paidAmountFor(order) < amountOf(order)
  );
  const totalAmount = sumAmount(periodOrders);
  const pendingAmount = periodOrders.reduce((sum, order) => {
    if (isCancelled(order) || isReturned(order)) return sum;
    return sum + Math.max(0, amountOf(order) - paidAmountFor(order));
  }, 0);
  const receivedAmount = periodOrders.reduce((sum, order) => sum + paidAmountFor(order), 0);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return periodOrders.filter((order) => {
      const rawPaymentStatus = (order.payment_status || "pending").toLowerCase().replace(/[\s-]+/g, "_");
      const paymentStatus = ["paid", "completed"].includes(rawPaymentStatus)
        ? "success"
        : rawPaymentStatus === "partially_paid" ? "partial" : rawPaymentStatus === "canceled" ? "cancelled" : rawPaymentStatus;
      const shipmentStatus = normalizeShipmentStage(shipmentStatuses[String(order.id)] || order.shipment_status || order.shipmentStatus || order.status);
      const customerName = order.customer_name || order.customer || (order.user_id ? `User #${order.user_id}` : "Customer");
      const productName = order.items?.map((item) => item.product_name || "Product").join(", ") || order.product || "";
      const matchesSearch = !query || [order.order_number, customerName, order.customer_phone, order.phone, productName]
        .some((value) => String(value || "").toLowerCase().includes(query));
      const matchesShipment = statusFilter.length === 0 || statusFilter.some((selected) => {
        return shipmentStatus === selected;
      });
      const matchesPayment = paymentFilter.length === 0 || paymentFilter.includes(paymentStatus);
      return matchesSearch && matchesShipment && matchesPayment;
    });
  }, [periodOrders, search, statusFilter, paymentFilter, shipmentStatuses]);

  const applyQuickRange = (preset: string) => {
    const today = new Date();
    const end = endOfDay(today);
    let start: Date | null = null;

    if (preset === "Today") start = startOfDay(today);
    if (preset === "This Week") {
      start = startOfDay(today);
      start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    }
    if (preset === "This Month") start = new Date(today.getFullYear(), today.getMonth(), 1);
    if (preset === "Last Month") {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
    }
    if (preset === "Last 30 Days") start = startOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29));

    setDateRange({ start, end: preset === "All" ? null : end });
    setActiveDatePreset(preset);
    setRangeAnchor(null);
    setShowDatePicker(false);
  };

  const chooseCalendarDate = (day: Date) => {
    const selected = startOfDay(day);
    setActiveDatePreset("Custom Range");
    if (!rangeAnchor) {
      setRangeAnchor(selected);
      setDateRange({ start: selected, end: null });
      return;
    }

    if (Math.abs(selected.getTime() - rangeAnchor.getTime()) / 86_400_000 >= MAX_CUSTOM_RANGE_DAYS) {
      setRangeAnchor(selected);
      setDateRange({ start: selected, end: endOfDay(selected) });
      return;
    }

    const start = selected < rangeAnchor ? selected : rangeAnchor;
    const end = selected < rangeAnchor ? rangeAnchor : selected;
    setDateRange({ start, end: endOfDay(end) });
    setRangeAnchor(null);
  };

  const handleExportCsv = () => {
    const escapeCsv = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = filteredOrders.map((order) => [
      order.order_number,
      order.customer_name || order.customer || "Customer",
      (order.items || []).map((item) => item.product_name || "Product").join("; "),
      amountOf(order),
      formatPaymentStatus(order.payment_status || "pending"),
      formatStatus(order.status || "pending"),
      formatStatus(shipmentStatuses[String(order.id)] || order.shipment_status || order.shipmentStatus || "not shipped"),
      order.created_at ? new Date(order.created_at).toLocaleDateString("en-US") : "",
      [order.address_line1, order.address_line2, order.shipping_city, order.shipping_state, order.shipping_country].filter(Boolean).join(", "),
      order.shipping_postal_code || "",
    ]);
    const csv = [["Order ID", "Customer", "Product", "Value", "Payment", "Status", "Shipment", "Date", "Address", "Pincode"], ...rows]
      .map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const summaryCards: SummaryCardProps[] = [
    { title: "Total Orders", value: periodOrders.length.toLocaleString("en-IN"), icon: ShoppingCart, iconStyle: "text-emerald-600" },
    { title: "Pending Orders", value: pendingOrders.length.toLocaleString("en-IN"), icon: Clock3, iconStyle: "text-amber-500", valueStyle: "text-amber-600" },
    { title: "Paid Orders", value: paidOrders.length.toLocaleString("en-IN"), icon: CreditCard, iconStyle: "text-green-600", valueStyle: "text-green-600" },
    { title: "Total Amount", value: inr(totalAmount), icon: Truck, iconStyle: "text-emerald-600" },
    { title: "Pending Amount", value: inr(pendingAmount), icon: Clock3, iconStyle: "text-amber-500", valueStyle: "text-amber-600" },
    { title: "Amount Received", value: inr(receivedAmount), icon: CreditCard, iconStyle: "text-green-600", valueStyle: "text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-5 lg:p-6 xl:p-8">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-[28px]">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">Manage and track all orders</p>
        </div>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {summaryCards.map((card) => <SummaryCard key={card.title} {...card} />)}
        </section>

        <section className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search orders..."
              className="h-11 w-full rounded-none border border-gray-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none placeholder:text-gray-400 focus:border-green-500"
            />
          </div>

          <div className="relative">
            <button type="button" onClick={() => setShowShipmentFilter((open) => !open)} aria-expanded={showShipmentFilter} className="inline-flex h-11 min-w-52 items-center justify-between gap-3 border border-gray-200 bg-white px-4 text-sm text-slate-700 hover:bg-gray-50">
              <span>{statusFilter.length ? statusFilter.map((status) => shipmentStageLabel(status)).join(", ") : "All Shipment Statuses"}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
            </button>
            {showShipmentFilter && (
              <div className="absolute left-0 top-full z-40 mt-1 w-52 border border-gray-200 bg-white p-2 shadow-lg">
                {SHIPMENT_STAGES.map((option) => (
                  <label key={option.value} className="flex cursor-pointer items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-gray-50">
                    <input type="checkbox" checked={statusFilter.includes(option.value)} onChange={() => setStatusFilter((current) => current.includes(option.value) ? current.filter((value) => value !== option.value) : [...current, option.value])} className="h-4 w-4 accent-green-700" />
                    {option.label}
                  </label>
                ))}
                <button type="button" onClick={() => setStatusFilter([])} className="mt-1 w-full border-t border-gray-100 px-2 pt-2 text-left text-xs font-medium text-green-700 hover:text-green-800">Clear selection</button>
              </div>
            )}
          </div>

          <div className="relative">
            <button type="button" onClick={() => setShowPaymentFilter((open) => !open)} aria-expanded={showPaymentFilter} className="inline-flex h-11 min-w-52 items-center justify-between gap-3 border border-gray-200 bg-white px-4 text-sm text-slate-700 hover:bg-gray-50">
              <span>{paymentFilter.length ? paymentFilter.map((status) => status.split("_").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ")).join(", ") : "All Payment Statuses"}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
            </button>
            {showPaymentFilter && (
              <div className="absolute left-0 top-full z-40 mt-1 w-64 border border-gray-200 bg-white p-2 shadow-lg">
                {[
                  { value: "success", label: "Success" },
                  { value: "pending", label: "Pending" },
                  { value: "partial", label: "Partial" },
                  { value: "failed", label: "Failed" },
                  { value: "refunded", label: "Refunded" },
                  { value: "refund_processing", label: "Refund processing" },
                  { value: "refund_failed", label: "Refund failed" },
                  { value: "cancelled", label: "Cancelled" },
                ].map((option) => (
                  <label key={option.value} className="flex cursor-pointer items-center gap-3 px-2.5 py-2 text-sm text-slate-800 hover:bg-gray-50">
                    <input type="checkbox" checked={paymentFilter.includes(option.value)} onChange={() => setPaymentFilter((current) => current.includes(option.value) ? current.filter((value) => value !== option.value) : [...current, option.value])} className="h-4 w-4 accent-green-700" />
                    {option.label}
                  </label>
                ))}
                <button type="button" onClick={() => setPaymentFilter([])} className="mt-1 w-full border-t border-gray-100 px-2.5 pt-2 text-left text-xs font-medium text-green-700 hover:text-green-800">Clear selection</button>
              </div>
            )}
          </div>

          <div className="relative">
            <button type="button" onClick={() => setShowDatePicker((open) => !open)} aria-expanded={showDatePicker} className="inline-flex h-10 items-center gap-2 border border-green-200 bg-green-50 px-3 text-sm text-green-800 hover:bg-green-100">
              <CalendarDays className="h-3.5 w-3.5" /> {activeDatePreset}
            </button>
            {showDatePicker && (
              <div className="absolute right-0 top-full z-50 mt-2 flex w-[min(94vw,600px)] flex-col border border-gray-200 bg-white shadow-xl sm:flex-row">
                <aside className="w-full shrink-0 border-b border-gray-200 p-2 sm:w-32 sm:border-b-0 sm:border-r">
                  <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Quick Ranges</p>
                  {["Today", "This Week", "This Month", "Last Month", "Last 30 Days", "All"].map((preset) => (
                    <button key={preset} type="button" onClick={() => applyQuickRange(preset)} className={`mb-1 w-full px-2.5 py-2 text-left text-sm ${activeDatePreset === preset ? "bg-green-50 font-semibold text-green-800" : "text-slate-600 hover:bg-gray-50"}`}>
                      {preset}
                    </button>
                  ))}
                </aside>

                <DateRangeCalendar
                  calendarMonth={calendarMonth}
                  dateRange={dateRange}
                  rangeAnchor={rangeAnchor}
                  onMonthChange={setCalendarMonth}
                  onChooseDate={chooseCalendarDate}
                  onClear={() => { setDateRange({ start: null, end: null }); setRangeAnchor(null); setActiveDatePreset("All"); setShowDatePicker(false); }}
                  onApply={() => { setRangeAnchor(null); setShowDatePicker(false); }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-2 xl:ml-auto">
            <button type="button" onClick={handleExportCsv} className="inline-flex h-11 items-center justify-center gap-2 bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700">
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </section>

        <section className="mt-6 overflow-hidden border border-gray-200 bg-white">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Shipment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead> </TableHead>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="px-5 py-12 text-center text-sm text-slate-500">Loading orders...</td></tr>
                ) : filteredOrders.length === 0 ? (
                  <tr><td colSpan={9} className="px-5 py-12 text-center text-sm text-slate-500">No orders found.</td></tr>
                ) : filteredOrders.map((order) => {
                  const customerName = order.customer_name || order.customer || (order.user_id ? `User #${order.user_id}` : "Customer");
                  const shipmentStatus = normalizeShipmentStage(shipmentStatuses[String(order.id)] || order.shipment_status || order.shipmentStatus || order.status);
                  const productName = order.items?.map((item) => `${item.product_name || "Product"}${item.quantity ? ` \u00d7 ${item.quantity}` : ""}`).join(", ") || order.product || "\u2014";
                  const payment = order.payment_status?.toLowerCase() || "pending";
                  const status = order.status?.toLowerCase() || "pending";
                  const shipmentLabel = shipmentStageLabel(shipmentStatus);
                  const date = order.created_at ? new Date(order.created_at).toLocaleDateString("en-US") : "\u2014";

                  return (
                    <tr key={order.id} className="border-b border-gray-100 last:border-0">
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-800">{order.order_number}</td>
                      <td className="px-5 py-4">
                        <p className="whitespace-nowrap text-sm font-medium text-slate-800">{customerName}</p>
                        {(order.customer_phone || order.phone) && <p className="mt-0.5 text-xs text-slate-400">{order.customer_phone || order.phone}</p>}
                      </td>
                      <td className="max-w-[240px] px-5 py-4"><p className="truncate text-sm text-slate-700" title={productName}>{productName}</p></td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-900">{inr(amountOf(order))}</td>
                      <td className="px-5 py-4"><span className={`inline-flex whitespace-nowrap px-2.5 py-1 text-xs font-semibold ${paymentStyles[payment] || "bg-gray-50 text-gray-600"}`}>{formatPaymentStatus(order.payment_status || "pending")}</span></td>
                      <td className="px-5 py-4"><span className={`inline-flex whitespace-nowrap px-2.5 py-1 text-xs font-semibold ${statusStyles[status] || "bg-gray-50 text-gray-600"}`}>{formatStatus(order.status || "pending")}</span></td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{shipmentLabel}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">{date}</td>
                      <td className="px-5 py-4">
                        <button type="button" title="View order details" onClick={() => openOrderDetails(order)} className="flex h-8 w-8 items-center justify-center text-slate-500 hover:text-slate-800">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-gray-100 px-5 py-3 text-sm text-slate-500">
            Showing {filteredOrders.length.toLocaleString("en-IN")} orders
          </div>
        </section>
      </div>

      {selectedOrder && (() => {
        const customerName = selectedOrder.customer_name || selectedOrder.customer || (selectedOrder.user_id ? `User #${selectedOrder.user_id}` : "Customer");
        const shipment = shipmentDetails[String(selectedOrder.id)];
        const activeShipmentStage = normalizeShipmentStage(shipmentStatuses[String(selectedOrder.id)] || shipment?.shipment_status || selectedOrder.shipment_status || selectedOrder.shipmentStatus || selectedOrder.status);
        const activeShipmentStageIndex = SHIPMENT_STAGES.findIndex((stage) => stage.value === activeShipmentStage);
        const address = [selectedOrder.address_line1, selectedOrder.address_line2, selectedOrder.shipping_city, selectedOrder.shipping_state, selectedOrder.shipping_postal_code, selectedOrder.shipping_country]
          .filter(Boolean).join(", ");
        const orderDate = formatOrderDateTime(selectedOrder.created_at, "—", selectedOrder.order_number);
        const subtotal = Number(selectedOrder.subtotal ?? selectedOrder.total_amount ?? 0);
        const discount = Number(selectedOrder.discount_amount || 0);
        const shippingCharge = Number(selectedOrder.shipping_charge || 0);
        const tax = Number(selectedOrder.tax_amount || 0);
        const shareOrder = () => {
          const shareUrl = `${window.location.origin}/orders#${selectedOrder.order_number}`;
          if (navigator.share) void navigator.share({ title: `Order ${selectedOrder.order_number}`, url: shareUrl });
          else if (navigator.clipboard) void navigator.clipboard.writeText(shareUrl);
        };

        return (
          <div className={`fixed inset-0 z-[100] flex ${invoicePreviewOpen ? "items-center justify-center p-4 sm:p-8" : "justify-end"}`}>
            <button type="button" aria-label="Close order details" onClick={() => { setInvoicePreviewOpen(false); setSelectedOrder(null); }} className="absolute inset-0 bg-slate-900/30" />
            <aside role="dialog" aria-modal="true" aria-labelledby="order-details-title" className={`relative flex ${invoicePreviewOpen ? "h-[92vh] max-h-[900px] w-full max-w-4xl border border-gray-200" : "h-full w-full max-w-[620px] border-l border-gray-200"} flex-col bg-white shadow-2xl`}>
              <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-gray-200 px-5">
                <div className="min-w-0">
                  <h2 id="order-details-title" className="text-lg font-bold text-slate-900">{invoicePreviewOpen ? "Invoice Preview" : "Order Details"}</h2>
                  <p className="truncate text-xs text-slate-500">{selectedOrder.order_number}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {invoicePreviewOpen ? (
                    <button type="button" onClick={() => setInvoicePreviewOpen(false)} className="inline-flex h-9 items-center gap-2 border border-gray-200 px-3 text-sm text-slate-700 hover:bg-gray-50"><ArrowLeft className="h-4 w-4" /> Back</button>
                  ) : (
                    <>
                      <button type="button" onClick={shareOrder} className="hidden h-9 items-center gap-2 border border-gray-200 px-3 text-sm text-slate-700 hover:bg-gray-50 sm:inline-flex">Share</button>
                      <button type="button" onClick={() => setInvoicePreviewOpen(true)} className="inline-flex h-9 items-center gap-2 bg-green-700 px-3 text-sm font-semibold text-white hover:bg-green-800"><Download className="h-4 w-4" /> Invoice</button>
                    </>
                  )}
                  <button type="button" onClick={() => { setInvoicePreviewOpen(false); setSelectedOrder(null); }} aria-label="Close" className="flex h-9 w-9 items-center justify-center text-slate-500 hover:bg-gray-100"><X className="h-5 w-5" /></button>
                </div>
              </header>

              <div className="flex-1 overscroll-contain overflow-y-auto p-4 sm:p-5">
                {invoicePreviewOpen ? (
                  <article className="mx-auto w-full max-w-4xl border border-black bg-white p-4 text-[11px] leading-4 text-black sm:p-6">
                    <h3 className="mb-4 text-center text-base font-bold">TAX INVOICE</h3>
                    <div className="grid grid-cols-1 border border-black sm:grid-cols-2">
                      <section className="flex min-h-32 items-start gap-3 border-b border-black p-3 sm:border-b-0 sm:border-r">
                        <img src="/logo-mark-dark.png" alt="Staging Spaces logo" className="h-12 w-12 shrink-0 object-contain" />
                        <div className="min-w-0 space-y-1"><p className="font-bold">STAGING SPACES</p><p>By Naresh Steel Corporation</p><p>987, A,D Camp Chowk, Bhawani Peth, Pune, Maharashtra 411042</p><p>Phone: +91 8669944932</p><p className="font-bold">GSTIN: 27AABFN5839R1ZI</p></div>
                      </section>
                      <section className="grid h-full grid-cols-[110px_minmax(0,1fr)] grid-rows-3 self-stretch">
                        <p className="border-b border-r border-black bg-gray-50 p-2 font-semibold">Invoice No.</p><p className="break-all border-b border-black p-2">{selectedOrder.order_number}</p>
                        <p className="border-b border-r border-black bg-gray-50 p-2 font-semibold">Invoice Date</p><p className="border-b border-black p-2">{orderDate}</p>
                        <p className="border-r border-black bg-gray-50 p-2 font-semibold">Payment</p><p className="p-2">{formatPaymentStatus(selectedOrder.payment_status || "pending")}{selectedOrder.payment_method ? ` · ${selectedOrder.payment_method}` : ""}</p>
                      </section>
                      <section className="min-h-36 border-t border-black p-3 sm:border-r">
                        <p className="mb-2 border-b border-gray-200 pb-2 font-bold tracking-wide">BUYER (BILL TO)</p>
                        <p className="font-bold">{customerName}</p>
                        {(selectedOrder.customer_phone || selectedOrder.phone) && <p className="mt-1">Phone: {selectedOrder.customer_phone || selectedOrder.phone}</p>}
                        {selectedOrder.customer_email && <p className="break-all">Email: {selectedOrder.customer_email}</p>}
                        <p className="mt-1">{address || "Address not available"}</p>
                      </section>
                      <section className="min-h-36 border-t border-black p-3">
                        <p className="mb-2 border-b border-gray-200 pb-2 font-bold tracking-wide">RECEIVER (SHIP TO)</p>
                        <p className="font-bold">{customerName}</p>
                        {(selectedOrder.customer_phone || selectedOrder.phone) && <p className="mt-1">Phone: {selectedOrder.customer_phone || selectedOrder.phone}</p>}
                        {selectedOrder.customer_email && <p className="break-all">Email: {selectedOrder.customer_email}</p>}
                        <p className="mt-1">{address || "Address not available"}</p>
                      </section>
                    </div>
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full min-w-[680px] border-collapse border border-black text-left text-[10px]">
                        <thead><tr className="bg-gray-50 font-semibold"><th className="border border-black p-2 text-center align-middle">Sr.</th><th className="border border-black p-2 text-left align-middle">Description of Goods</th><th className="border border-black p-2 text-center align-middle">HSN/SAC</th><th className="border border-black p-2 text-center align-middle">Part No.</th><th className="border border-black p-2 text-right align-middle">Quantity</th><th className="border border-black p-2 text-right align-middle">Rate</th><th className="border border-black p-2 text-right align-middle">Amount</th></tr></thead>
                        <tbody>
                          {(selectedOrder.items?.length ? selectedOrder.items : [{ product_name: selectedOrder.product || "Order item", quantity: 1, price_at_purchase: subtotal }]).map((item, index) => { const quantity = Number(item.quantity || 1); const unitPrice = Number(item.price_at_purchase || 0); return <tr key={item.id ?? index} className="h-20"><td className="border border-black p-2 align-top">{index + 1}</td><td className="border border-black p-2 align-top font-semibold">{item.product_name || "Product"}</td><td className="border border-black p-2 align-top">—</td><td className="border border-black p-2 align-top">—</td><td className="border border-black p-2 text-right align-top">{quantity} No.</td><td className="border border-black p-2 text-right align-top">{inr(unitPrice)}</td><td className="border border-black p-2 text-right align-top font-semibold">{inr(unitPrice * quantity)}</td></tr>; })}
                        </tbody>
                      </table>
                    </div>
                    <div className="ml-auto mt-4 w-full max-w-sm space-y-1 text-xs">
                      <div className="flex justify-between"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
                      {discount > 0 && <div className="flex justify-between"><span>Discount</span><span>-{inr(discount)}</span></div>}
                      {shippingCharge > 0 && <div className="flex justify-between"><span>Shipping</span><span>{inr(shippingCharge)}</span></div>}
                      {tax > 0 && <div className="flex justify-between"><span>GST / Tax</span><span>{inr(tax)}</span></div>}
                      <div className="flex justify-between border-t border-black pt-2 text-sm font-bold"><span>Grand Total</span><span>{inr(Number(selectedOrder.total_amount || 0))}</span></div>
                    </div>
                    <p className="mt-8 border-t border-gray-300 pt-3 text-center text-[10px]">This is a computer generated invoice.</p>
                  </article>
                ) : (
                  <>
                <section className="border-b border-gray-200 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Order ID</p>
                      <p className="mt-1 truncate font-semibold text-slate-900">{selectedOrder.order_number}</p>
                      <p className="mt-1 text-xs text-slate-500">{orderDate}</p>
                      <p className="mt-1 text-xs text-slate-500">From: {selectedOrder.source || "Website"}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Status</p>
                      <span className={`mt-1 inline-flex px-2.5 py-1 text-xs font-semibold ${statusStyles[selectedOrder.status?.toLowerCase()] || "bg-gray-100 text-slate-700"}`}>{formatStatus(selectedOrder.status || "pending")}</span>
                    </div>
                  </div>
                </section>

                <section className="mt-4 grid grid-cols-1 gap-3 border-b border-gray-200 pb-4 sm:grid-cols-2">
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Customer</h3>
                    <p className="mt-2 truncate text-sm font-semibold text-slate-900">{customerName}</p>
                    <p className="mt-1 truncate text-sm text-slate-700">{selectedOrder.customer_phone || selectedOrder.phone || "Phone not available"}</p>
                    {selectedOrder.customer_email && <p className="mt-1 truncate text-xs text-slate-500">{selectedOrder.customer_email}</p>}
                  </div>
                  <div className="min-w-0 border-t border-gray-100 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Shipping Address</h3>
                    <p className="mt-2 text-sm leading-5 text-slate-700">{address || "Address not available"}</p>
                  </div>
                </section>

                <section className="mt-4 border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Shipment Tracking</h3>
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold ${statusStyles[activeShipmentStage] || "bg-gray-100 text-slate-700"}`}>{shipmentStageLabel(activeShipmentStage)}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {SHIPMENT_STAGES.map((stage, index) => (
                      <div key={stage.value} className={`border px-2.5 py-2 text-xs ${index <= activeShipmentStageIndex ? "border-green-200 bg-green-50 text-green-800" : "border-gray-200 bg-gray-50 text-slate-400"}`}>
                        <span className="mr-1 font-bold">{index < activeShipmentStageIndex ? "✓" : index + 1}</span>{stage.label}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <select value={shipmentStageDraft} onChange={(event) => setShipmentStageDraft(event.target.value as ShipmentStage)} disabled={!shipment?.id || savingShipmentStage} className="h-10 min-w-0 flex-1 border border-gray-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 disabled:bg-gray-50">
                      {SHIPMENT_STAGES.map((stage) => <option key={stage.value} value={stage.value}>{stage.label}</option>)}
                    </select>
                    <button type="button" onClick={() => void saveShipmentStage()} disabled={!shipment?.id || savingShipmentStage || shipmentStageDraft === activeShipmentStage} className="h-10 border border-green-700 bg-green-700 px-4 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400">
                      {savingShipmentStage ? "Saving…" : "Update stage"}
                    </button>
                  </div>
                  {shipmentStageMessage && <p role="status" className={`mt-2 text-xs ${shipmentStageMessage.startsWith("Could not") || shipmentStageMessage.startsWith("This order") ? "text-red-600" : "text-green-700"}`}>{shipmentStageMessage}</p>}
                  {shipment?.tracking_number || shipment?.courier_name ? (
                    <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                      <div><p className="text-xs text-slate-400">Courier</p><p className="mt-0.5 font-medium text-slate-800">{shipment.courier_name || "\u2014"}</p></div>
                      <div><p className="text-xs text-slate-400">Tracking ID</p><p className="mt-0.5 break-all font-medium text-slate-800">{shipment.tracking_number || "\u2014"}</p></div>
                    </div>
                  ) : <p className="mt-2 text-sm text-slate-500">No shipment has been created for this order yet.</p>}
                </section>

                <section className="mt-4">
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Order Items</h3>
                  <div className="divide-y divide-gray-100 border-y border-gray-200">
                    {selectedOrder.items?.length ? selectedOrder.items.map((item, index) => (
                      <div key={item.id ?? index} className="flex items-center justify-between gap-3 py-2.5">
                        <div className="flex min-w-0 items-center gap-2.5">
                          {item.image_url ? <img src={getMediaUrl(item.image_url)} alt="" className="h-10 w-10 shrink-0 border border-gray-200 object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-slate-50 text-[10px] text-slate-400">Item</div>}
                          <div className="min-w-0"><p className="truncate text-sm font-medium text-slate-800">{item.product_name || "Product"}</p><p className="text-xs text-slate-500">Qty: {Number(item.quantity || 1)}</p></div>
                        </div>
                        <p className="shrink-0 text-sm font-semibold text-slate-900">{inr(Number(item.price_at_purchase || 0) * Number(item.quantity || 1))}</p>
                      </div>
                    )) : <div className="py-3 text-sm text-slate-600">{selectedOrder.product || "Order item details are unavailable."}</div>}
                  </div>
                </section>

                <section className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 sm:grid-cols-[0.8fr_1.2fr]">
                  <div>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Payment Info</h3>
                    <div className="flex items-center justify-between gap-2 text-sm"><span className="text-slate-500">Method</span><span className="font-medium text-slate-800">{selectedOrder.payment_method || "\u2014"}</span></div>
                    <div className="mt-2 flex items-center justify-between gap-2 text-sm"><span className="text-slate-500">Status</span><span className={`px-2 py-0.5 text-xs font-semibold ${paymentStyles[selectedOrder.payment_status?.toLowerCase()] || "bg-gray-100 text-slate-700"}`}>{formatPaymentStatus(selectedOrder.payment_status || "pending")}</span></div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Order Total</h3>
                    {selectedOrder.subtotal !== undefined && <div className="flex justify-between text-xs text-slate-500"><span>Subtotal</span><span>{inr(Number(selectedOrder.subtotal))}</span></div>}
                    {discount > 0 && <div className="mt-1 flex justify-between text-xs text-slate-500"><span>Discount</span><span>-{inr(discount)}</span></div>}
                    {shippingCharge > 0 && <div className="mt-1 flex justify-between text-xs text-slate-500"><span>Shipping</span><span>{inr(shippingCharge)}</span></div>}
                    {tax > 0 && <div className="mt-1 flex justify-between text-xs text-slate-500"><span>Tax</span><span>{inr(tax)}</span></div>}
                    <div className="mt-2 flex justify-between border-t border-gray-100 pt-2 text-sm font-bold text-slate-900"><span>Total</span><span>{inr(Number(selectedOrder.total_amount || 0))}</span></div>
                  </div>
                </section>
                  </>
                )}
              </div>
              {invoicePreviewOpen && (
                <footer className="shrink-0 border-t border-gray-200 bg-white p-4">
                  <button type="button" onClick={handleDownloadInvoice} className="flex h-11 w-full items-center justify-center gap-2 bg-green-700 text-sm font-semibold text-white hover:bg-green-800"><Download className="h-4 w-4" /> Download PDF</button>
                </footer>
              )}
            </aside>
          </div>
        );
      })()}

    </div>
  );
};

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  iconStyle,
  valueStyle,
}: SummaryCardProps) => {
  return (
    <div className="min-w-0 border border-gray-200 bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="min-h-8 whitespace-normal break-words text-[11px] font-semibold uppercase leading-tight tracking-wide text-slate-500 sm:text-xs">{title}</p>
          <h3 className={`mt-2 text-2xl font-bold sm:text-[28px] ${valueStyle || "text-slate-900"}`}>{value}</h3>
        </div>
        <Icon className={`h-5 w-5 shrink-0 ${iconStyle}`} />
      </div>
    </div>
  );
};

const TableHead = ({ children }: TableHeadProps) => {
  return (
    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </th>
  );
};

export default Orders;
