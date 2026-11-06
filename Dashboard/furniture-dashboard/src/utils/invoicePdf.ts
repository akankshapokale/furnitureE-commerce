export interface InvoiceLineItem {
  product_name?: string;
  quantity?: number | string;
  unit_price?: number | string;
  price_at_purchase?: number | string;
  total_price?: number | string;
}

export interface InvoiceOrder {
  id: number | string;
  order_number?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  phone?: string;
  address_line1?: string | null;
  address_line2?: string | null;
  shipping_city?: string | null;
  shipping_state?: string | null;
  shipping_postal_code?: string | null;
  subtotal?: number | string;
  discount_amount?: number | string;
  total_amount: number | string;
  payment_status: string;
  created_at: string;
  items?: InvoiceLineItem[];
}

const plainAscii = (value: unknown) => String(value ?? "")
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/₹/g, "INR ")
  .replace(/[^\x20-\x7E]/g, "?");

const escapePdfText = (value: string) => plainAscii(value).replace(/([\\()])/g, "\\$1");
const money = (value: number | string | null | undefined) => `INR ${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const splitLine = (line: string, max = 88) => {
  const words = plainAscii(line).split(/\s+/);
  const result: string[] = [];
  let current = "";
  words.forEach((word) => {
    if (current && `${current} ${word}`.length > max) {
      result.push(current);
      current = word;
    } else current = current ? `${current} ${word}` : word;
  });
  if (current) result.push(current);
  return result;
};

export const downloadInvoicePdf = (order: InvoiceOrder) => {
  const orderId = order.order_number || `ORD-${order.id}`;
  const discount = Number(order.discount_amount || 0);
  const itemSubtotal = (order.items || []).reduce((sum, item) => sum + Number(item.total_price || 0), 0);
  const subtotal = order.subtotal != null ? Number(order.subtotal) : itemSubtotal || Number(order.total_amount || 0) + discount;
  const address = [order.address_line1, order.address_line2, order.shipping_city, order.shipping_state, order.shipping_postal_code].filter(Boolean).join(", ");
  const lines = [
    "FURNITURE STORE - SALES INVOICE",
    "========================================================================================",
    "",
    `Invoice Number: INV-${orderId}`,
    `Order ID: ${orderId}`,
    `Customer Name: ${order.customer_name || "Guest"}`,
    `Customer Contact: ${[order.customer_phone || order.phone, order.customer_email].filter(Boolean).join(" | ") || "Not provided"}`,
    ...(address ? [`Address: ${address}`] : []),
    `Order Date: ${new Date(order.created_at).toLocaleString("en-IN")}`,
    "",
    "PRODUCT DETAILS",
    "----------------------------------------------------------------------------------------",
    "Product | Quantity | Unit Price | Line Total",
    ...((order.items || []).flatMap((item) => {
      const quantity = Number(item.quantity || 0);
      const lineTotal = Number(item.total_price ?? 0);
      const unitPrice = Number(item.price_at_purchase ?? item.unit_price ?? (quantity ? lineTotal / quantity : 0));
      return splitLine(`${item.product_name || "Product"} | ${quantity} | ${money(unitPrice)} | ${money(lineTotal || quantity * unitPrice)}`);
    })),
    ...(order.items?.length ? [] : ["No product line items were included with this order record."]),
    "",
    `Subtotal: ${money(subtotal)}`,
    `Discount: -${money(discount)}`,
    `Total Amount: ${money(order.total_amount)}`,
    `Payment Status: ${order.payment_status || "Pending"}`,
    "========================================================================================",
  ];
  const wrapped = lines.flatMap((line) => splitLine(line));
  const pageLines = 48;
  const pages: string[][] = [];
  for (let i = 0; i < wrapped.length; i += pageLines) pages.push(wrapped.slice(i, i + pageLines));

  const objects: string[] = [];
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>";
  const pageObjectIds: number[] = [];
  pages.forEach((page, pageIndex) => {
    const pageId = 4 + pageIndex * 2;
    const contentId = pageId + 1;
    pageObjectIds.push(pageId);
    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`;
    const textLines = page.map((line, index) => `${index === 0 ? "" : "T* "}(${escapePdfText(line)}) Tj`).join(" ");
    const stream = `BT /F1 10 Tf 48 790 Td 14 TL ${textLines} ET`;
    objects[contentId] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });
  objects[2] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>`;

  let pdf = "%PDF-1.4\n%ASCII\n";
  const offsets = [0];
  for (let id = 1; id < objects.length; id += 1) {
    offsets[id] = pdf.length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id += 1) pdf += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${plainAscii(orderId).replace(/[^a-zA-Z0-9_-]/g, "-")}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
