interface Order {
  id: number;
  order_number: string;
  total_amount: number | string;
  status: string;
  payment_status: string;
  created_at: string;
}

interface OrdersOverviewProps {
  orders: Order[];
  totalOrders: number;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  dispatched: "bg-purple-500",
  delivered: "bg-green-500",
  returned: "bg-red-500",
};

const OrdersOverview = ({
  orders,
  totalOrders,
}: OrdersOverviewProps) => {
  const statuses = [
    {
      label: "Pending",
      key: "pending",
    },
    {
      label: "Dispatched",
      key: "dispatched",
    },
    {
      label: "Delivered",
      key: "delivered",
    },
  ];

  return (
    <div className="flex h-full w-full min-w-0 flex-col rounded-none border border-gray-200 bg-white p-4">

      {/* Header */}
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Orders Overview
          </h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Current order status
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700 sm:px-3 sm:text-xs">
          {totalOrders.toLocaleString("en-IN")} Orders
        </span>
      </div>

      {/* Orders */}
      <div className="mt-4 flex flex-1 flex-col justify-evenly gap-3">
        {statuses.map((status) => {
          const count = orders.filter(
            (order) =>
              order.status?.toLowerCase() === status.key
          ).length;

          const percentage =
            totalOrders > 0
              ? Math.round((count / totalOrders) * 100)
              : 0;

          return (
            <div
              key={status.key}
              className="min-w-0"
            >
              {/* Label */}
              <div className="mb-1.5 flex min-w-0 items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                      statusColors[status.key]
                    }`}
                  />

                  <span className="truncate text-xs font-medium text-slate-700 sm:text-sm">
                    {status.label}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900 sm:text-sm">
                    {count.toLocaleString("en-IN")}
                  </span>

                  <span className="text-[10px] text-slate-400 sm:text-xs">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    statusColors[status.key]
                  }`}
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-xs text-slate-500 sm:text-sm">
          Total Orders
        </span>

        <span className="text-base font-bold text-slate-900 sm:text-lg">
          {totalOrders.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
};

export default OrdersOverview;
