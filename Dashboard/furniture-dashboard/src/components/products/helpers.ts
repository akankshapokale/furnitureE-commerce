// Stock at or below this is flagged "low stock" across the product screens.
export const LOW_STOCK_LIMIT = 10;

export type StockState = "in" | "low" | "out";

export const availableStock = (product: {
  stock_quantity: number | string;
  variants?: { stock_quantity: number | string; is_active?: boolean }[];
}) => {
  if (product.variants?.length) {
    return product.variants
      .filter((variant) => variant.is_active !== false)
      .reduce((total, variant) => total + (Number(variant.stock_quantity) || 0), 0);
  }
  return Number(product.stock_quantity) || 0;
};

export const stockState = (quantity: number | string): StockState => {
  const value = Number(quantity) || 0;

  if (value <= 0) return "out";
  if (value <= LOW_STOCK_LIMIT) return "low";
  return "in";
};

export const formatINR = (value: number | string | null | undefined) =>
  `₹${Math.round(Number(value) || 0).toLocaleString("en-IN")}`;

// Percentage off the regular price, 0 when there is no (valid) selling price.
export const discountPercent = (
  price: number | string,
  sellingPrice: number | string | null | undefined
) => {
  const regular = Number(price);
  const selling = Number(sellingPrice);

  if (!regular || !selling || selling >= regular) return 0;

  return Math.round(((regular - selling) / regular) * 100);
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
