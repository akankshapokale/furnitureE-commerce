import { useNavigate } from "react-router-dom";

interface Order {
  id: number;
  order_number: string;
  total_amount: number | string;
  status: string;
  payment_status: string;
  created_at: string;
  customer_name?: string;
}

interface RecentOrdersProps {
  orders: Order[];
}

const statusStyles: Record<string, string> = {
  delivered: "bg-green-50 text-green-700",
  processing: "bg-blue-50 text-blue-700",
  dispatched: "bg-purple-50 text-purple-700",
  pending: "bg-yellow-50 text-yellow-700",
  returned: "bg-red-50 text-red-700",
  cancelled: "bg-red-50 text-red-700",
};

const RecentOrders = ({ orders }: RecentOrdersProps) => {
  const navigate = useNavigate();

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number | string) => {
    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount)) {
      return "₹0";
    }

    return `₹${numericAmount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-none border border-gray-200 bg-white">

      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5 lg:px-6">

        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Recent Orders
          </h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Latest furniture orders
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="self-start text-xs font-semibold text-green-600 transition-colors hover:text-green-700 sm:self-auto sm:text-sm"
        >
          View All
        </button>

      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[780px]">

          {/* Table Head */}
          <thead>
            <tr className="border-b border-gray-100 bg-slate-50/70">

              <th className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:px-5 lg:px-6">
                Order ID
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:px-5 lg:px-6">
                Customer
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:px-5 lg:px-6">
                Amount
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:px-5 lg:px-6">
                Payment
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:px-5 lg:px-6">
                Status
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:px-5 lg:px-6">
                Date
              </th>

            </tr>
          </thead>

          {/* Table Body */}
          <tbody>

            {recentOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              recentOrders.map((order) => {
                const status =
                  order.status?.toLowerCase() || "pending";

                const paymentStatus =
                  order.payment_status?.toLowerCase() || "pending";

                return (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="cursor-pointer border-b border-gray-100 last:border-0 "
                  >

                    {/* Order ID */}
                    <td className="whitespace-nowrap px-4 py-3.5 sm:px-5 lg:px-6">
                      <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                        {order.order_number || `#ORD-${order.id}`}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="whitespace-nowrap px-4 py-3.5 sm:px-5 lg:px-6">
                      <span className="text-xs font-medium text-slate-700 sm:text-sm">
                        {order.customer_name || "Guest"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="whitespace-nowrap px-4 py-3.5 sm:px-5 lg:px-6">
                      <span className="text-xs font-semibold text-slate-900 sm:text-sm">
                        {formatAmount(order.total_amount)}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="whitespace-nowrap px-4 py-3.5 sm:px-5 lg:px-6">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-xs ${
                          paymentStatus === "paid"
                            ? "bg-green-50 text-green-700"
                            : paymentStatus === "failed"
                            ? "bg-red-50 text-red-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {order.payment_status || "Pending"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-4 py-3.5 sm:px-5 lg:px-6">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-xs ${
                          statusStyles[status] ||
                          "bg-slate-50 text-slate-600"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-4 py-3.5 sm:px-5 lg:px-6">
                      <span className="text-xs text-slate-500 sm:text-sm">
                        {formatDate(order.created_at)}
                      </span>
                    </td>

                  </tr>
                );
              })
            )}

          </tbody>

        </table>
      </div>

      {/* Mobile scroll hint */}
      <div className="border-t border-gray-100 px-4 py-2 text-center sm:hidden">
        <span className="text-[10px] text-slate-400">
          Swipe horizontally to view all columns
        </span>
      </div>

    </div>
  );
};

export default RecentOrders;
