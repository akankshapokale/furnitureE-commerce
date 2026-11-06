import {
  Search,
  Download,
  Truck,
  Package,
  Clock3,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useOrderRows } from "../hooks/useOrderRows";

const Dispatched = () => {
  const { rows: dispatchedOrders, loading, error } = useOrderRows(["dispatched", "shipped"]);
  const inTransit = dispatchedOrders.filter(
    (order) => order.shipmentStatus === "in_transit" || order.shipmentStatus === "in transit"
  ).length;
  const expectedSoon = dispatchedOrders.filter((order) => order.expectedSoon).length;

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Dispatched Orders
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track orders that have been dispatched to customers
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

          {/* Dispatched */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Dispatched Orders
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {dispatchedOrders.length}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Truck className="h-5 w-5 text-purple-600" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Orders handed over to courier
            </p>
          </div>

          {/* In Transit */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  In Transit
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {inTransit}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            <p className="mt-4 text-xs text-blue-600">
              Currently on the way
            </p>
          </div>

          {/* Expected Soon */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Expected Soon
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {expectedSoon}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
                <Clock3 className="h-5 w-5 text-yellow-600" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Expected within 2 days
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
                placeholder="Search order, customer or tracking ID..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* Courier */}

            {/* Delivery */}
          </div>
        </div>

        {/* Orders Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          {/* Table Header */}
          <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Dispatched Orders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Orders currently dispatched or in transit
              </p>
            </div>

            <span className="w-fit rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              {dispatchedOrders.length} Dispatched
            </span>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1150px]">

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
                    Dispatched
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Expected
                  </th>

                  <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={9} className="px-6 py-10 text-center text-sm text-slate-400">
                      Loading orders...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={9} className="px-6 py-10 text-center text-sm text-red-500">
                      {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && dispatchedOrders.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-10 text-center text-sm text-slate-400">
                      No orders found.
                    </td>
                  </tr>
                )}

                {dispatchedOrders.map((order) => (
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
                        {order.dispatchedDate}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">
                        {order.expectedDate}
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

export default Dispatched;
