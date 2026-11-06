import {
  Search,
  Download,
  PackageCheck,
  IndianRupee,
  Truck,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useOrderRows, formatRupees } from "../hooks/useOrderRows";

const Delivered = () => {
  const { rows: deliveredOrders, totalOrders, loading, error } = useOrderRows(["delivered"]);
  const deliveredRevenue = deliveredOrders.reduce((sum, order) => sum + order.amountValue, 0);
  const deliveryRate = totalOrders > 0 ? (deliveredOrders.length / totalOrders) * 100 : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Delivered Orders
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage successfully delivered furniture orders
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

          {/* Delivered Orders */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Delivered Orders
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {deliveredOrders.length}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <PackageCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>

            <p className="mt-4 text-xs font-medium text-green-600">
              Successfully delivered
            </p>
          </div>

          {/* Delivered Revenue */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Delivered Revenue
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {formatRupees(deliveredRevenue)}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Revenue from delivered orders
            </p>
          </div>

          {/* Delivery Rate */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Delivery Rate
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {deliveryRate.toFixed(1)}%
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${deliveryRate}%` }}
              />
            </div>
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
                placeholder="Search order, customer or tracking ID..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* Courier */}

            {/* Date */}
          </div>
        </div>

        {/* Delivered Orders Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          {/* Table Header */}
          <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Delivered Orders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest successfully delivered orders
              </p>
            </div>

            <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              {deliveredOrders.length} Delivered
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
                    Courier
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Tracking ID
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Delivered Date
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

                {!loading && !error && deliveredOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-400">
                      No orders found.
                    </td>
                  </tr>
                )}

                {deliveredOrders.map((order) => (
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
                      <span className="text-sm text-slate-600">
                        {order.courier}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-700">
                        {order.trackingId}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">
                        {order.deliveredDate}
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

export default Delivered;
