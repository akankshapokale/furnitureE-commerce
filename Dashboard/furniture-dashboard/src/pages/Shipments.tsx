import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Search,
  Download,
  Truck,
  PackageCheck,
  Clock3,
  MapPin,
  Eye,
  RefreshCw,
  X,
  Save,
  ChevronDown,
} from "lucide-react";

import { getShipments, getOrders, updateShipment } from "../services/api";
import { normalizeShipmentStage, SHIPMENT_STAGES, shipmentStageLabel, type ShipmentStage } from "../utils/shipmentStatus";

interface Shipment {
  id: number;
  order_id: number;
  tracking_number: string | null;
  courier_name: string | null;
  shipment_status: string | null;
  shipped_at: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  shipping_address_id: number | null;
  created_at: string;
  updated_at: string;
}

interface OrderAddressInfo {
  address_line1?: string | null;
  address_line2?: string | null;
  shipping_city?: string | null;
  shipping_state?: string | null;
  shipping_country?: string | null;
  shipping_postal_code?: string | null;
}

type ShipmentStatus = ShipmentStage;

const statusStyles: Record<string, string> = {
  order_placed: "bg-yellow-50 text-yellow-700",
  order_confirmed: "bg-sky-50 text-sky-700",
  processing: "bg-blue-50 text-blue-700",
  packaging: "bg-violet-50 text-violet-700",
  ready_to_ship: "bg-purple-50 text-purple-700",
  out_for_delivery: "bg-orange-50 text-orange-700",
  pending: "bg-yellow-50 text-yellow-700",
  dispatched: "bg-purple-50 text-purple-700",
  in_transit: "bg-blue-50 text-blue-700",
  shipped: "bg-blue-50 text-blue-700",
  delivered: "bg-green-50 text-green-700",
};

const formatStatus = (status?: string | null) => {
  if (!status) return "Pending";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Shipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [orderAddresses, setOrderAddresses] = useState<Record<string, OrderAddressInfo>>({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const statusFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!statusFilterRef.current?.contains(event.target as Node)) setShowStatusFilter(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowStatusFilter(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const [selectedShipment, setSelectedShipment] =
    useState<Shipment | null>(null);

  const [editStatus, setEditStatus] =
    useState<ShipmentStatus>("order_placed");

  const [editCourier, setEditCourier] = useState("");
  const [editTracking, setEditTracking] = useState("");
  const [editShippedAt, setEditShippedAt] = useState("");
  const [editEstimatedDelivery, setEditEstimatedDelivery] =
    useState("");
  const [editDeliveredAt, setEditDeliveredAt] = useState("");

  const [saving, setSaving] = useState(false);

  // =========================
  // FETCH SHIPMENTS
  // =========================

  const fetchShipments = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getShipments();
      setShipments(response.data.data || []);

      try {
        const ordersResponse = await getOrders();
        const orderRows = ordersResponse.data.data || [];
        setOrderAddresses(Object.fromEntries(orderRows.map((order: OrderAddressInfo & { id: number }) => [String(order.id), order])));
      } catch (error) {
        console.error("Failed to fetch order addresses for shipment export:", error);
        setOrderAddresses({});
      }
    } catch (error) {
      console.error("Failed to fetch shipments:", error);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchShipments(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchShipments]);

  // =========================
  // FILTER SHIPMENTS
  // =========================

  const filteredShipments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return shipments.filter((shipment) => {
      const matchesSearch =
        !query ||
        String(shipment.id).toLowerCase().includes(query) ||
        String(shipment.order_id).toLowerCase().includes(query) ||
        shipment.tracking_number
          ?.toLowerCase()
          .includes(query) ||
        shipment.courier_name
          ?.toLowerCase()
          .includes(query);

      const normalizedStatus = normalizeShipmentStage(shipment.shipment_status);
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(normalizedStatus);

      return matchesSearch && matchesStatus;
    });
  }, [
    shipments,
    search,
    statusFilter,
  ]);

  // =========================
  // DYNAMIC SUMMARY COUNTS
  // =========================

  const totalShipments = shipments.length;

  const pendingShipments = shipments.filter((shipment) =>
    ["order_placed", "order_confirmed", "processing", "packaging"].includes(normalizeShipmentStage(shipment.shipment_status))
  ).length;

  const dispatchedShipments = shipments.filter(
    (shipment) =>
      normalizeShipmentStage(shipment.shipment_status) === "ready_to_ship"
  ).length;

  const inTransitShipments = shipments.filter((shipment) => {
    const status = normalizeShipmentStage(shipment.shipment_status);

    return (
      status === "in_transit" || status === "out_for_delivery"
    );
  }).length;

  const deliveredShipments = shipments.filter(
    (shipment) =>
      normalizeShipmentStage(shipment.shipment_status) === "delivered"
  ).length;

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const openEditModal = (shipment: Shipment) => {
    setSelectedShipment(shipment);

    setEditStatus(normalizeShipmentStage(shipment.shipment_status));

    setEditCourier(shipment.courier_name || "");
    setEditTracking(shipment.tracking_number || "");

    setEditShippedAt(
      shipment.shipped_at
        ? shipment.shipped_at.slice(0, 16)
        : ""
    );

    setEditEstimatedDelivery(
      shipment.estimated_delivery
        ? shipment.estimated_delivery.slice(0, 16)
        : ""
    );

    setEditDeliveredAt(
      shipment.delivered_at
        ? shipment.delivered_at.slice(0, 16)
        : ""
    );
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const closeEditModal = () => {
    if (saving) return;

    setSelectedShipment(null);
  };

  // =========================
  // UPDATE SHIPMENT
  // =========================

  const handleUpdateShipment = async () => {
    if (!selectedShipment) return;

    try {
      setSaving(true);

      await updateShipment(selectedShipment.id, {
        courier_name: editCourier || null,
        tracking_number: editTracking || null,
        shipment_status: editStatus,
        shipped_at: editShippedAt || null,
        estimated_delivery:
          editEstimatedDelivery || null,
        delivered_at: editDeliveredAt || null,
      });

      await fetchShipments();

      setSelectedShipment(null);
    } catch (error) {
      console.error(
        "Failed to update shipment:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EXPORT SHIPMENTS
  // =========================

  const exportShipments = () => {
    const headers = [
      "Shipment ID",
      "Order ID",
      "Courier",
      "Tracking Number",
      "Address",
      "Pincode",
      "Status",
      "Shipped At",
      "Estimated Delivery",
      "Delivered At",
    ];

    const rows = filteredShipments.map((shipment) => {
      const order = orderAddresses[String(shipment.order_id)];
      const address = [order?.address_line1, order?.address_line2, order?.shipping_city, order?.shipping_state, order?.shipping_country]
        .filter(Boolean)
        .join(", ");
      return [
        shipment.id,
        shipment.order_id,
        shipment.courier_name || "",
        shipment.tracking_number || "",
        address,
        order?.shipping_postal_code || "",
        formatStatus(shipment.shipment_status),
        formatDate(shipment.shipped_at),
        formatDate(shipment.estimated_delivery),
        formatDate(shipment.delivered_at),
      ];
    });

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "shipments.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-white">
      <div className="w-full min-w-0 p-4 sm:p-6 lg:p-8">

        {/* Header */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Shipments
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track and manage furniture order shipments
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">

            <button
              type="button"
              onClick={fetchShipments}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={exportShipments}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              <Download className="h-4 w-4" />

              Export Shipments
            </button>

          </div>
        </div>

        {/* Summary Cards */}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">

          {/* Total */}

          <div className="min-h-[132px] border border-gray-200 bg-white p-4 sm:p-5">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Shipments
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {totalShipments.toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <Truck className="h-5 w-5 text-green-600" />
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-400">
              All shipments
            </p>

          </div>

          {/* In Transit */}

          <div className="min-h-[132px] border border-gray-200 bg-white p-4 sm:p-5">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  In Transit
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {inTransitShipments.toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-400">
              Currently on the way
            </p>

          </div>

          {/* Delivered */}

          <div className="min-h-[132px] border border-gray-200 bg-white p-4 sm:p-5">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Delivered
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {deliveredShipments.toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <PackageCheck className="h-5 w-5 text-green-600" />
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-400">
              Successfully delivered
            </p>

          </div>

          {/* Pending */}

          <div className="min-h-[132px] border border-gray-200 bg-white p-4 sm:p-5">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending Shipments
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {pendingShipments.toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
                <Clock3 className="h-5 w-5 text-yellow-600" />
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-400">
              Awaiting dispatch
            </p>

          </div>
          {/* Ready to Ship */}

          <div className="min-h-[132px] border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Ready to Ship</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">{dispatchedShipments.toLocaleString("en-IN")}</h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Truck className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">Handed over to courier</p>
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
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search shipment, order, tracking ID or courier..."
                className="h-11 w-full rounded-none border border-gray-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none placeholder:text-gray-400 focus:border-green-500"
              />

            </div>


            {/* Shipment Status Filter */}

            <div ref={statusFilterRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowStatusFilter((open) => !open)}
                aria-expanded={showStatusFilter}
                className="inline-flex h-11 min-w-52 items-center justify-between gap-3 border border-gray-200 bg-white px-4 text-sm text-slate-700 hover:bg-gray-50"
              >
                <span>
                  {statusFilter.length
                    ? statusFilter.map((status) => shipmentStageLabel(status)).join(", ")
                    : "All Shipment Statuses"}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
              </button>

              {showStatusFilter && (
                <div className="absolute right-0 top-full z-40 mt-1 w-64 border border-gray-200 bg-white p-2 shadow-lg">
                  {SHIPMENT_STAGES.map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-center gap-3 px-2.5 py-2 text-sm text-slate-800 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={statusFilter.includes(option.value)}
                        onChange={() => setStatusFilter((current) => current.includes(option.value) ? current.filter((value) => value !== option.value) : [...current, option.value])}
                        className="h-4 w-4 accent-green-700"
                      />
                      {option.label}
                    </label>
                  ))}
                  <button type="button" onClick={() => setStatusFilter([])} className="mt-1 w-full border-t border-gray-100 px-2.5 pt-2 text-left text-xs font-medium text-green-700 hover:text-green-800">Clear selection</button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Shipment Table */}

        <div className="mt-6 overflow-hidden border border-gray-200 bg-white">

          {/* Table Header */}

          <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Shipment List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track current and completed shipments
              </p>
            </div>

            <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              {filteredShipments.length} Shipments
            </span>

          </div>

          {/* Loading */}

          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center">

              <div className="flex items-center gap-2 text-sm text-slate-500">

                <RefreshCw className="h-4 w-4 animate-spin" />

                Loading shipments...

              </div>

            </div>
          ) : filteredShipments.length === 0 ? (

            <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">

              <Truck className="h-10 w-10 text-slate-300" />

              <h3 className="mt-3 text-sm font-semibold text-slate-700">
                No shipments found
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Try changing your search or filters.
              </p>

            </div>

          ) : (

            <div className="w-full overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead>

                  <tr className="border-b border-gray-100 bg-slate-50/70">

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Shipment ID
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Order ID
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Courier
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      AWB / Tracking
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Shipped
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Expected Delivery
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredShipments.map((shipment) => {

                    const normalizedStatus = normalizeShipmentStage(shipment.shipment_status);

                    return (
                      <tr
                        key={shipment.id}
                        className="border-b border-gray-100 last:border-0 transition-colors hover:bg-slate-50/60"
                      >

                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-slate-700">
                            SHP-
                            {String(shipment.id).padStart(
                              5,
                              "0"
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-600">
                            #ORD-{shipment.order_id}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-700">
                            {shipment.courier_name ||
                              "Not assigned"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-700">
                            {shipment.tracking_number ||
                              "Not available"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-500">
                            {formatDate(
                              shipment.shipped_at
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-500">
                            {formatDate(
                              shipment.estimated_delivery
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              statusStyles[
                                normalizedStatus
                              ] ||
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {shipmentStageLabel(shipment.shipment_status)}
                          </span>

                        </td>

                        <td className="px-6 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(shipment)
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            title="Manage shipment"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

      {/* Edit Shipment Modal */}

      {selectedShipment && (

        <div className="fixed inset-0 z-[100] flex justify-end">

          <button type="button" aria-label="Close shipment details" onClick={closeEditModal} className="absolute inset-0 bg-slate-900/30" />
          <aside role="dialog" aria-modal="true" aria-labelledby="shipment-dialog-title" className="relative flex h-full w-full max-w-[620px] flex-col border-l border-gray-200 bg-white shadow-2xl">

            {/* Modal Header */}

            <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-gray-100 px-5">

              <div>

                <h2 id="shipment-dialog-title" className="text-lg font-bold text-slate-900">
                  Manage Shipment
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Shipment #{selectedShipment.id} · Order #
                  {selectedShipment.order_id}
                </p>

              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>

            </header>

            {/* Drawer Body */}

            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Courier / Shipping Partner
                </label>

                <input
                  type="text"
                  value={editCourier}
                  onChange={(event) =>
                    setEditCourier(event.target.value)
                  }
                  placeholder="e.g. Delhivery"
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />

              </div>

              {/* Tracking */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  AWB / Tracking Number
                </label>

                <input
                  type="text"
                  value={editTracking}
                  onChange={(event) =>
                    setEditTracking(event.target.value)
                  }
                  placeholder="Enter tracking number"
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Shipment Status
                </label>

                <select
                  value={editStatus}
                  onChange={(event) =>
                    setEditStatus(
                      event.target.value as ShipmentStatus
                    )
                  }
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                >

                  {SHIPMENT_STAGES.map((stage) => (
                    <option key={stage.value} value={stage.value}>{stage.label}</option>
                  ))}

                </select>

              </div>

              {/* Shipped At */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Shipped At
                </label>

                <input
                  type="datetime-local"
                  value={editShippedAt}
                  onChange={(event) =>
                    setEditShippedAt(event.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />

              </div>

              {/* Estimated Delivery */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Estimated Delivery
                </label>

                <input
                  type="datetime-local"
                  value={editEstimatedDelivery}
                  onChange={(event) =>
                    setEditEstimatedDelivery(
                      event.target.value
                    )
                  }
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />

              </div>

              {/* Delivered At */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Delivered At
                </label>

                <input
                  type="datetime-local"
                  value={editDeliveredAt}
                  onChange={(event) =>
                    setEditDeliveredAt(event.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />

              </div>

              {/* Shipment Information */}

              <div className="sm:col-span-2">

                <div className="rounded-xl border border-gray-100 bg-slate-50 p-4">

                  <div className="flex items-center gap-2">

                    <Truck className="h-4 w-4 text-green-600" />

                    <p className="text-sm font-semibold text-slate-700">
                      Shipment Information
                    </p>

                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">

                    <div>

                      <p className="text-xs text-slate-400">
                        Shipment ID
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        SHP-
                        {String(
                          selectedShipment.id
                        ).padStart(5, "0")}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-slate-400">
                        Order ID
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        #ORD-{selectedShipment.order_id}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-slate-400">
                        Address ID
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {selectedShipment.shipping_address_id ||
                          "-"}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              </div>
            </div>

            {/* Drawer Footer */}

            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdateShipment}
                disabled={saving}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Shipment
                  </>
                )}

              </button>

            </div>

          </aside>
        </div>
      )}

    </div>
  );
};

export default Shipments;
