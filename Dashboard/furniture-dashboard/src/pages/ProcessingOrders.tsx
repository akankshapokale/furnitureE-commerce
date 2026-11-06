import {
  Search,
  Download,
  Clock3,
  Package,
  Truck,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useOrderRows } from "../hooks/useOrderRows";

const paymentStyles: Record<string, string> = {
  Failed: "bg-red-50 text-red-700",
  Refunded: "bg-orange-50 text-orange-700",
  Paid: "bg-green-50 text-green-700",
  Pending: "bg-yellow-50 text-yellow-700",
};

const ProcessingOrders = () => {
  const { rows: processingOrders, loading, error } = useOrderRows(["processing"]);
  const readyToDispatch = processingOrders.filter((order) => order.payment === "Paid").length;
  const delayed = processingOrders.filter((order) => order.createdAgeDays > 2).length;

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Processing Orders
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage orders that are currently being processed
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700 sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Export Orders
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {/* Processing Orders */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Processing Orders
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {processingOrders.length}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            <p className="mt-4 text-xs text-blue-600">
              Currently being processed
            </p>
          </div>

          {/* Ready to Dispatch */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Ready to Dispatch
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {readyToDispatch}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <Truck className="h-5 w-5 text-green-600" />
              </div>
            </div>

            <p className="mt-4 text-xs text-green-600">
              Ready for shipment
            </p>
          </div>

          {/* Delayed */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Processing Delayed
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {delayed}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
                <Clock3 className="h-5 w-5 text-yellow-600" />
              </div>
            </div>

            <p className="mt-4 text-xs text-yellow-600">
              Processing for more than 2 days
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

            {/* Search */}
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search order, customer or product..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* Payment */}

            {/* Processing Duration */}
          </div>
        </div>

        {/* Processing Orders Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          {/* Table Header */}
          <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Processing Orders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Orders currently being prepared for dispatch
              </p>
            </div>

            <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {processingOrders.length} Processing
            </span>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1100px]">

              <thead>
                <tr className="border-b border-gray-100 bg-slate-50/70">

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Order ID
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Customer
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Product
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Amount
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Payment
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Order Date
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Processing Since
                  </th>

                  <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-400">
                      Loading orders...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-red-500">
                      {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && processingOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-400">
                      No orders found.
                    </td>
                  </tr>
                )}

                {processingOrders.map((order) => (
                  <tr
                    key={order.dbId}
                    className="border-b border-gray-100 last:border-0 transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-4">
                      <Link to={`/orders/${order.dbId}`} className="text-sm font-semibold text-slate-700">{order.id}</Link>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-700">
                        {order.customer}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {order.product}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-900">
                        {order.amount}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          paymentStyles[order.payment]
                        }`}
                      >
                        {order.payment}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">
                        {order.orderDate}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          order.createdAgeDays > 2
                            ? "text-yellow-600"
                            : "text-slate-500"
                        }`}
                      >
                        {order.updatedAgeLabel}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProcessingOrders;
