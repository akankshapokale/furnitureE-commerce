import { availableStock } from "../products/helpers";

interface Product {
  id: number;
  name: string;
  stock_quantity: number;
  variants?: { stock_quantity: number; is_active?: boolean }[];
  status?: string;
}

interface Order {
  items?: { product_name?: string; quantity?: number }[];
}

interface ProductOverviewProps {
  products: Product[];
  orders: Order[];
}

const LOW_STOCK_LIMIT = 10;

const ProductOverview = ({ products, orders }: ProductOverviewProps) => {
  const lowStock = products.filter(
    (product) => {
      const stock = availableStock(product);
      return stock > 0 && stock <= LOW_STOCK_LIMIT;
    }
  ).length;

  const outOfStock = products.filter(
    (product) => availableStock(product) <= 0
  ).length;

  const sold = new Map<string, number>();

  orders.forEach((order) =>
    order.items?.forEach((item) => {
      if (!item.product_name) return;

      sold.set(
        item.product_name,
        (sold.get(item.product_name) || 0) + Number(item.quantity || 0)
      );
    })
  );

  const topSelling = [...sold.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const stats = [
    {
      name: "Total Products",
      value: products.length,
      description: "Products in catalogue",
    },
    {
      name: "Low Stock",
      value: lowStock,
      description: `${LOW_STOCK_LIMIT} units or fewer`,
    },
    {
      name: "Out of Stock",
      value: outOfStock,
      description: "Needs restocking",
    },
  ];

  return (
    <div className="flex h-full w-full min-w-0 flex-col rounded-none border border-gray-200 bg-white p-4">

      {/* Header */}
      <div className="min-w-0">
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
          Product Overview
        </h2>

        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Product and inventory summary
        </p>
      </div>

      {/* Product Stats */}
      <div className="mt-4 space-y-2">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex min-w-0 items-center justify-between gap-4 rounded-none border border-gray-100 bg-slate-50 p-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-700">
                {stat.name}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>

            <span className="shrink-0 text-lg font-bold text-slate-900">
              {stat.value.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>

      {/* Top Selling */}
      <div className="mt-4 border-t border-gray-100 pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Top Selling
        </p>

        {topSelling.length === 0 ? (
          <p className="mt-2 text-xs text-slate-400">No sales yet</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {topSelling.map(([name, quantity]) => (
              <li
                key={name}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="min-w-0 truncate text-slate-700">{name}</span>
                <span className="shrink-0 font-semibold text-slate-900">
                  {quantity.toLocaleString("en-IN")} sold
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductOverview;
