interface Order {
  status: string;
  items?: { product_name?: string; quantity?: number }[];
}

const MostBoughtProducts = ({ orders }: { orders: Order[] }) => {
  const sold = new Map<string, number>();
  orders.forEach((order) => {
    if (["cancelled", "canceled", "returned"].includes(order.status?.toLowerCase())) return;
    order.items?.forEach((item) => {
      if (!item.product_name) return;
      sold.set(item.product_name, (sold.get(item.product_name) || 0) + Number(item.quantity || 0));
    });
  });
  const top = [...sold.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = top[0]?.[1] || 1;

  return (
    <div className="flex h-full w-full min-w-0 flex-col border border-gray-200 bg-white p-4">
      <div className="min-w-0">
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Most Bought Products</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">Top 5 by units sold</p>
      </div>

      <div className="mt-5 flex flex-1 flex-col justify-evenly gap-4">
        {top.length === 0 ? (
          <p className="text-center text-sm text-slate-400">No product sales yet</p>
        ) : (
          top.map(([name, qty], i) => (
            <div key={name} className="flex min-w-0 items-center gap-4">
              <span className="w-40 shrink-0 truncate text-sm text-slate-800 sm:w-48" title={name}>{name}</span>
              <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${i === 0 ? "bg-green-800" : "bg-green-700"}`} style={{ width: `${Math.max((qty / max) * 100, 3)}%` }} />
              </div>
              <span className="w-10 shrink-0 text-right text-sm font-semibold text-slate-900">{qty.toLocaleString("en-IN")}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MostBoughtProducts;
