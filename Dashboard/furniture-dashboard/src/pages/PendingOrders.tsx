import {
  Search,
  Download,
  Clock3,
  IndianRupee,
  AlertTriangle,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useOrderRows, formatRupees } from "../hooks/useOrderRows";

const paymentStyles: Record<string, string> = {
  Failed: "bg-red-50 text-red-700",
  Refunded: "bg-orange-50 text-orange-700",
  Paid: "bg-green-50 text-green-700",
  Pending: "bg-yellow-50 text-yellow-700",
};

const PendingOrders = () => {
  const { rows: pendingOrders, loading, error } = useOrderRows(["pending"]);
  const pendingValue = pendingOrders.reduce((sum, order) => sum + order.amountValue, 0);
  const needsAttention = pendingOrders.filter((order) => order.createdAgeDays > 2).length;

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Pending Orders
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage orders waiting for processing
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

          {/* Pending Orders */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending Orders
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {pendingOrders.length}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
                <Clock3 className="h-5 w-5 text-yellow-600" />
              </div>
            </div>

            <p className="mt-4 text-xs text-yellow-600">
              Awaiting processing
            </p>
          </div>

          {/* Pending Order Value */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending Order Value
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {formatRupees(pendingValue)}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Total value of pending orders
            </p>
          </div>

          {/* Needs Attention */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Needs Attention
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {needsAttention}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
            </div>

            <p className="mt-4 text-xs text-red-500">
              Pending for more than 2 days
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
          </div>
        </div>

        {/* Orders Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          {/* Table Header */}
          <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Pending Orders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Orders waiting to be processed
              </p>
            </div>

            <span className="w-fit rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
              {pendingOrders.length} Pending
            </span>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1050px]">

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
                    Pending Since
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

                {!loading && !error && pendingOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-400">
                      No orders found.
                    </td>
                  </tr>
                )}

                {pendingOrders.map((order) => (
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
                            ? "text-red-500"
                            : "text-slate-500"
                        }`}
                      >
                        {order.createdAgeLabel}
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

export default PendingOrders;
