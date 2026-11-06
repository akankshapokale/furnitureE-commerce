import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { createCustomer, deleteUser, getOrders, getPayments, getUsers, updateUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/common/ConfirmDialog";
import {
  Search,
  Plus,
  Download,
  Users,
  UserCheck,
  UserPlus,
  Eye,
  Trash2,
  X,
  Wallet,
} from "lucide-react";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  pincode?: string | null;
  flat?: string | null;
  area?: string | null;
  landmark?: string | null;
  city?: string | null;
  state?: string | null;
  created_at: string;
  updated_at: string;
  avatar_url?: string | null;
  orders?: number;
  spent?: number;
};

type CustomerOrder = {
  id: number | string;
  user_id?: number | string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  customer_name?: string | null;
  total_amount?: number | string | null;
  payment_status?: string | null;
  created_at?: string;
};

type CustomerPayment = {
  order_id: number | string;
  payment_status?: string | null;
  amount?: number | string | null;
};

const statusStyles: Record<string, string> = {
  Active: "bg-green-50 text-green-700",
  Inactive: "bg-red-50 text-red-700",
};

const customerAddress = (customer: Customer) =>
  [customer.flat, customer.area, customer.landmark, customer.city, customer.state, customer.pincode]
    .filter(Boolean)
    .join(", ") || "Not provided";

const customerCode = (customer: Customer) => customer.id < 0
  ? `GUEST-${String(Math.abs(customer.id)).padStart(3, "0")}`
  : `CUS-${String(customer.id).padStart(3, "0")}`;

const Customers = () => {
  const { isAdmin } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter] = useState("All Status");
  const [sortBy] = useState("Newest First");
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [savingCustomer, setSavingCustomer] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const fetchCustomers = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      setError("");

      const [usersResult, ordersResult, paymentsResult] = await Promise.allSettled([
        getUsers(),
        getOrders(),
        getPayments(),
      ]);
      if (usersResult.status === "rejected") throw usersResult.reason;

      const users = Array.isArray(usersResult.value.data?.data) ? usersResult.value.data.data : [];
      const orders: CustomerOrder[] = ordersResult.status === "fulfilled" && Array.isArray(ordersResult.value.data?.data)
        ? ordersResult.value.data.data
        : [];
      const payments: CustomerPayment[] = paymentsResult.status === "fulfilled" && Array.isArray(paymentsResult.value.data?.data)
        ? paymentsResult.value.data.data
        : [];

      const successfulPaymentsByOrder = new Map<string, number>();
      for (const payment of payments) {
        if (!["paid", "success", "completed"].includes(payment.payment_status?.toLowerCase() || "")) continue;
        const key = String(payment.order_id);
        successfulPaymentsByOrder.set(key, (successfulPaymentsByOrder.get(key) || 0) + Number(payment.amount || 0));
      }

      // Dashboard Customers page = only customer role
      const customerUsers: Customer[] = users.filter(
        (user: Customer) => user.role === "customer"
      ).map((customer: Customer) => {
        const customerOrders = orders.filter((order) => {
          if (order.user_id != null && String(order.user_id) === String(customer.id)) return true;
          const sameEmail = Boolean(customer.email && order.customer_email && customer.email.toLowerCase() === order.customer_email.toLowerCase());
          const customerPhone = (customer.phone || "").replace(/\D/g, "").slice(-10);
          const orderPhone = (order.customer_phone || "").replace(/\D/g, "").slice(-10);
          return sameEmail || Boolean(customerPhone && orderPhone && customerPhone === orderPhone);
        });

        const spent = customerOrders.reduce((sum, order) => {
          const total = Number(order.total_amount || 0);
          const captured = successfulPaymentsByOrder.get(String(order.id));
          const paid = captured !== undefined
            ? Math.min(total, captured)
            : ["paid", "success", "completed"].includes(order.payment_status?.toLowerCase() || "")
              ? total
              : 0;
          return sum + paid;
        }, 0);

        return { ...customer, orders: customerOrders.length, spent };
      });

      // Include buyers who checked out as guests or whose account is not in the users response.
      const claimedOrderIds = new Set<string>();
      for (const customer of customerUsers) {
        for (const order of orders) {
          const byId = order.user_id != null && String(order.user_id) === String(customer.id);
          const byEmail = Boolean(customer.email && order.customer_email && customer.email.toLowerCase() === order.customer_email.toLowerCase());
          const customerPhone = (customer.phone || "").replace(/\D/g, "").slice(-10);
          const orderPhone = (order.customer_phone || "").replace(/\D/g, "").slice(-10);
          if (byId || byEmail || Boolean(customerPhone && orderPhone && customerPhone === orderPhone)) claimedOrderIds.add(String(order.id));
        }
      }
      const guestGroups = new Map<string, CustomerOrder[]>();
      for (const order of orders) {
        if (claimedOrderIds.has(String(order.id))) continue;
        const email = (order.customer_email || "").trim().toLowerCase();
        const phone = (order.customer_phone || "").replace(/\D/g, "").slice(-10);
        if (!email && !phone) continue;
        const key = email || phone;
        guestGroups.set(key, [...(guestGroups.get(key) || []), order]);
      }
      for (const guestOrders of guestGroups.values()) {
        const first = guestOrders[0];
        const guestId = -Math.max(1, Math.abs(Number(first.id)) || customerUsers.length + 1);
        const spent = guestOrders.reduce((sum, order) => {
          const total = Number(order.total_amount || 0);
          const captured = successfulPaymentsByOrder.get(String(order.id));
          const isPaid = ["paid", "success", "completed"].includes(order.payment_status?.toLowerCase() || "");
          return sum + (captured !== undefined ? Math.min(total, captured) : isPaid ? total : 0);
        }, 0);
        customerUsers.push({
          id: guestId,
          name: first.customer_name?.trim() || "Guest customer",
          email: first.customer_email || "",
          phone: first.customer_phone || null,
          role: "customer",
          is_active: true,
          created_at: first.created_at || new Date().toISOString(),
          updated_at: first.created_at || new Date().toISOString(),
          orders: guestOrders.length,
          spent,
        });
      }

      setCustomers(customerUsers);
    } catch (err: unknown) {
      console.error("Fetch customers error:", err);
      setError(
        (isAxiosError(err) && err.response?.data?.message) ||
          (err instanceof Error ? err.message : "Failed to load customers")
      );
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const handleCreateCustomer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingCustomer(true);
    setFormError("");

    const formData = new FormData(event.currentTarget);
    try {
      const customerData = {
        name: `${String(formData.get("firstName")).trim()} ${String(formData.get("lastName")).trim()}`,
        email: String(formData.get("email")).trim(),
        phone: String(formData.get("mobile")).trim(),
        password: String(formData.get("password")),
        role: "customer" as const,
        is_active: true,
        pincode: String(formData.get("pincode")).trim(),
        flat: String(formData.get("flat")).trim(),
        area: String(formData.get("area")).trim(),
        landmark: String(formData.get("landmark")).trim(),
        city: String(formData.get("city")).trim(),
        state: String(formData.get("state")).trim(),
      };
      const created = await createCustomer(customerData);
      const createdId = Number(created.data?.data?.id);
      if (createdId) await updateUser(createdId, customerData);
      setShowAddCustomer(false);
      await fetchCustomers();
    } catch (err: unknown) {
      setFormError(
        (isAxiosError(err) && err.response?.data?.message) ||
          (err instanceof Error ? err.message : "Failed to add customer")
      );
    } finally {
      setSavingCustomer(false);
    }
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (!isAdmin) return;

    try {
      await deleteUser(customer.id);
      setCustomers((current) => current.filter((item) => item.id !== customer.id));
      setSelectedCustomer((current) => current?.id === customer.id ? null : current);
    } catch (err: unknown) {
      setError(
        (isAxiosError(err) && err.response?.data?.message) ||
          (err instanceof Error ? err.message : "Failed to delete customer")
      );
    }
  };

  const handleDownloadCustomerDetails = (customer: Customer) => {
    const escapeCsv = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = [
      ["Field", "Customer details"],
      ["Customer ID", customerCode(customer)],
      ["Name", customer.name],
      ["Email", customer.email],
      ["Mobile number", customer.phone || ""],
      ["Status", getCustomerStatus(customer)],
      ["Joined", customer.created_at ? new Date(customer.created_at).toLocaleDateString("en-IN") : ""],
      ["Profile address", customerAddress(customer)],
      ["Orders", customer.orders || 0],
      ["Total amount spent", formatSpent(customer.spent || 0)],
    ];
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `customer-${String(customer.id).padStart(3, "0")}-details.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  useEffect(() => {
    void fetchCustomers(true);
    const refresh = () => void fetchCustomers();
    const timer = window.setInterval(refresh, 15000);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, [fetchCustomers]);

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.is_active
  ).length;

  const totalCustomerSpend = customers.reduce((sum, customer) => sum + (customer.spent || 0), 0);

  const newCustomers = customers.filter((customer) => {
    if (!customer.created_at) return false;

    const createdDate = new Date(customer.created_at);
    const now = new Date();

    return (
      createdDate.getMonth() === now.getMonth() &&
      createdDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    // Search
    const searchValue = search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((customer) => {
        return (
          customer.name?.toLowerCase().includes(searchValue) ||
          customer.email?.toLowerCase().includes(searchValue) ||
          customer.phone?.toLowerCase().includes(searchValue)
        );
      });
    }

    // Status filter
    if (statusFilter === "Active") {
      result = result.filter((customer) => customer.is_active);
    }

    if (statusFilter === "Inactive") {
      result = result.filter((customer) => !customer.is_active);
    }

    // Sorting
    if (sortBy === "Newest First") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );
    }

    if (sortBy === "Most Orders") {
      result.sort((a, b) => (b.orders || 0) - (a.orders || 0));
    }

    if (sortBy === "Highest Spent") {
      result.sort((a, b) => (b.spent || 0) - (a.spent || 0));
    }

    return result;
  }, [customers, search, statusFilter, sortBy]);

  const formatSpent = (amount: number = 0) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const getCustomerStatus = (customer: Customer) => {
    return customer.is_active ? "Active" : "Inactive";
  };

  return (
    <div className="min-h-screen bg-white">
      {deleteTarget && <ConfirmDialog title="Delete customer?" message={`Delete customer "${deleteTarget.name}"?`} onCancel={() => setDeleteTarget(null)} onConfirm={() => { const target = deleteTarget; setDeleteTarget(null); void handleDeleteCustomer(target); }} />}
      <div className="p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Customers
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Live customer accounts and purchase activity · updates automatically
            </p>
          </div>

          <button
            type="button"
            onClick={() => { setFormError(""); setShowAddCustomer(true); }}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}
          <div className="border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Customers
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {totalCustomers.toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center bg-green-50">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Registered customers
            </p>
          </div>

          {/* Active */}
          <div className="border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active Customers
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {activeCustomers.toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center bg-green-50">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Currently active
            </p>
          </div>

          {/* New */}
          <div className="border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  New Customers
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {newCustomers.toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center bg-blue-50">
                <UserPlus className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Added this period
            </p>
          </div>

          {/* Lifetime spend */}
          <div className="border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Customer Spend</p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {formatSpent(totalCustomerSpend)}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center bg-green-50">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">Paid orders to date</p>
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer, email or phone..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Customer Table */}
        <div className="mt-6 overflow-hidden border border-gray-200 bg-white">

          {/* Table Header */}
          <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Customer List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Customer accounts and purchase activity
              </p>
            </div>

            <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              {filteredCustomers.length.toLocaleString("en-IN")} Customers
            </span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center px-6 py-16">
              <p className="text-sm text-slate-500">
                Loading customers...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center px-6 py-16">
              <p className="text-sm font-medium text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() => void fetchCustomers(true)}
                className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[1180px]">

                <thead>
                  <tr className="border-b border-gray-100 bg-slate-50/70">

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Customer ID
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Customer
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Email
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Contact
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Orders
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Total Spent
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Joined
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
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-12 text-center text-sm text-slate-400"
                      >
                        No customers found
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => {
                      const status = getCustomerStatus(customer);

                      return (
                        <tr
                          key={customer.id}
                          className="border-b border-gray-100 last:border-0 hover:bg-slate-50/60"
                        >
                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-slate-700">
                              {customerCode(customer)}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                            {customer.name}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {customer.email || "—"}
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-600">
                              {customer.phone || "—"}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-slate-700">
                              {customer.orders || 0}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-slate-900">
                              {formatSpent(customer.spent || 0)}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                            {customer.created_at
                              ? new Date(customer.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                              : "—"}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                statusStyles[status]
                              }`}
                            >
                              {status}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                title={`View ${customer.name}`}
                                aria-label={`View ${customer.name}`}
                                onClick={() => setSelectedCustomer(customer)}
                                className="inline-flex h-8 w-8 items-center justify-center text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {isAdmin && customer.id > 0 && (
                                <button
                                  type="button"
                                  title={`Delete ${customer.name}`}
                                  aria-label={`Delete ${customer.name}`}
                                  onClick={() => setDeleteTarget(customer)}
                                  className="inline-flex h-8 w-8 items-center justify-center text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>

              </table>
            </div>
          )}
        </div>
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <button type="button" aria-label="Close customer details" onClick={() => setSelectedCustomer(null)} className="absolute inset-0 bg-slate-900/30" />
          <aside role="dialog" aria-modal="true" aria-labelledby="customer-detail-title" className="relative flex h-full w-full flex-col bg-white shadow-2xl lg:w-1/2">
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-200 px-5 py-4 sm:px-6">
              <div>
                <h2 id="customer-detail-title" className="text-xl font-bold text-slate-900">Customer profile</h2>
                <p className="mt-1 text-sm text-slate-500">{selectedCustomer.name} · {customerCode(selectedCustomer)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={() => handleDownloadCustomerDetails(selectedCustomer)} className="inline-flex h-9 items-center gap-2 bg-green-700 px-3 text-sm font-semibold text-white hover:bg-green-800"><Download className="h-4 w-4" /> Download</button>
                <button type="button" onClick={() => setSelectedCustomer(null)} aria-label="Close customer details" className="flex h-9 w-9 items-center justify-center text-slate-500 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-5 sm:px-6">
              <section className="border-b border-gray-200 py-5">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500">Profile information</h3>
                <dl className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
                  <div><dt className="text-xs text-slate-400">Full name</dt><dd className="mt-1 font-semibold text-slate-800">{selectedCustomer.name || "—"}</dd></div>
                  <div><dt className="text-xs text-slate-400">Email</dt><dd className="mt-1 break-all text-slate-700">{selectedCustomer.email || "—"}</dd></div>
                  <div><dt className="text-xs text-slate-400">Mobile number</dt><dd className="mt-1 text-slate-700">{selectedCustomer.phone || "—"}</dd></div>
                  <div><dt className="text-xs text-slate-400">Account status</dt><dd className="mt-1 font-medium text-slate-700">{getCustomerStatus(selectedCustomer)}</dd></div>
                  <div><dt className="text-xs text-slate-400">Joined</dt><dd className="mt-1 text-slate-700">{selectedCustomer.created_at ? new Date(selectedCustomer.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</dd></div>
                </dl>
              </section>

              <section className="border-b border-gray-200 py-5">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Profile address</h3>
                <p className="text-sm leading-6 text-slate-700">{customerAddress(selectedCustomer)}</p>
              </section>

              <section className="py-5">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500">Purchase summary</h3>
                <div className="grid grid-cols-2 divide-x divide-gray-200">
                  <div className="pr-4"><p className="text-xs text-slate-400">Orders</p><p className="mt-1 text-2xl font-bold text-slate-900">{(selectedCustomer.orders || 0).toLocaleString("en-IN")}</p></div>
                  <div className="pl-4"><p className="text-xs text-slate-400">Total amount spent</p><p className="mt-1 text-2xl font-bold text-green-700">{formatSpent(selectedCustomer.spent || 0)}</p></div>
                </div>
              </section>
            </div>
          </aside>
        </div>
      )}

      {showAddCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !savingCustomer) setShowAddCustomer(false);
        }}>
          <form onSubmit={handleCreateCustomer} className="w-full max-w-lg bg-white p-6 shadow-xl" aria-labelledby="add-customer-title">
            <h2 id="add-customer-title" className="text-xl font-bold text-slate-900">Add customer</h2>
            <p className="mt-1 text-sm text-slate-500">Enter the customer profile and delivery details.</p>
            <div className="mt-5 grid max-h-[65vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">First name
                <input name="firstName" required autoComplete="given-name" className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 font-normal outline-none focus:border-green-500" />
              </label>
              <label className="text-sm font-medium text-slate-700">Last name
                <input name="lastName" required autoComplete="family-name" className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 font-normal outline-none focus:border-green-500" />
              </label>
              <label className="text-sm font-medium text-slate-700">Email
                <input name="email" type="email" required autoComplete="email" className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 font-normal outline-none focus:border-green-500" />
              </label>
              <label className="text-sm font-medium text-slate-700">Mobile number
                <input name="mobile" type="tel" required maxLength={10} autoComplete="tel" className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 font-normal outline-none focus:border-green-500" />
              </label>
              <label className="text-sm font-medium text-slate-700">Pincode
                <input name="pincode" required inputMode="numeric" maxLength={6} autoComplete="postal-code" className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 font-normal outline-none focus:border-green-500" />
              </label>
              <label className="text-sm font-medium text-slate-700">Flat, house no., building, apartment
                <input name="flat" required autoComplete="address-line1" className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 font-normal outline-none focus:border-green-500" />
              </label>
              <label className="text-sm font-medium text-slate-700">Area, street, sector
                <input name="area" required autoComplete="address-line2" className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 font-normal outline-none focus:border-green-500" />
              </label>
              <label className="text-sm font-medium text-slate-700">Landmark <span className="font-normal text-slate-400">(optional)</span>
                <input name="landmark" autoComplete="off" className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 font-normal outline-none focus:border-green-500" />
              </label>
              <label className="text-sm font-medium text-slate-700">City
                <input name="city" required autoComplete="address-level2" className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 font-normal outline-none focus:border-green-500" />
              </label>
              <label className="text-sm font-medium text-slate-700">State
                <input name="state" required autoComplete="address-level1" className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 font-normal outline-none focus:border-green-500" />
              </label>
              <label className="text-sm font-medium text-slate-700">Temporary password
                <input name="password" type="password" required minLength={8} autoComplete="new-password" className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 font-normal outline-none focus:border-green-500" />
              </label>
            </div>
            {formError && <p role="alert" className="mt-4 text-sm text-red-600">{formError}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowAddCustomer(false)} disabled={savingCustomer} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-slate-600 disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={savingCustomer} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">{savingCustomer ? "Adding..." : "Add customer"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Customers;
