
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { API_BASE_URL, TOKEN_KEY } from "../services/api";
import {
  Tag,
  Plus,
  Search,
  Pencil,
  X,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  Percent,
} from "lucide-react";

const API_URL = `${API_BASE_URL}/offers`;

const staffHeaders = (json = false): HeadersInit => {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

interface Offer {
  id: number;
  product_id: number | null;
  title: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface OfferForm {
  product_id: string;
  title: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const emptyForm: OfferForm = {
  product_id: "",
  title: "",
  description: "",
  discount_type: "percentage",
  discount_value: "",
  start_date: "",
  end_date: "",
  is_active: true,
};

const formatDate = (value: string | null) => {
  if (!value) return "No end date";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const getDateInputValue = (value: string | null | undefined) => {
  if (!value) return "";
  return value.slice(0, 10);
};

const OffersPromotions = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [form, setForm] = useState<OfferForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadOffers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load offers.");
      }

      setOffers(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the offers API."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadOffers(), 0);
    return () => window.clearTimeout(timer);
  }, [loadOffers]);

  const updateField = <K extends keyof OfferForm>(
    field: K,
    value: OfferForm[K]
  ) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const openCreateForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setFormOpen(true);
    setMessage("");
    setError("");
  };

  const openEditForm = (offer: Offer) => {
    setForm({
      product_id: offer.product_id ? String(offer.product_id) : "",
      title: offer.title,
      description: offer.description || "",
      discount_type: offer.discount_type,
      discount_value: String(offer.discount_value),
      start_date: getDateInputValue(offer.start_date),
      end_date: getDateInputValue(offer.end_date),
      is_active: offer.is_active,
    });

    setEditingId(offer.id);
    setFormOpen(true);
    setMessage("");
    setError("");
  };

  const saveOffer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const discountValue = Number(form.discount_value);

    if (
      !Number.isFinite(discountValue) ||
      discountValue < 0 ||
      (form.discount_type === "percentage" && discountValue > 100)
    ) {
      setError(
        form.discount_type === "percentage"
          ? "Percentage discount must be between 0 and 100."
          : "Enter a valid non-negative discount amount."
      );
      setSaving(false);
      return;
    }

    if (
      form.start_date &&
      form.end_date &&
      form.end_date < form.start_date
    ) {
      setError("End date cannot be before start date.");
      setSaving(false);
      return;
    }

    const payload = {
      product_id: form.product_id ? Number(form.product_id) : null,
      title: form.title.trim(),
      description: form.description.trim(),
      discount_type: form.discount_type,
      discount_value: discountValue,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      is_active: form.is_active,
    };

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          headers: staffHeaders(true),
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save offer.");
      }

      setMessage(
        editingId
          ? "Offer updated successfully."
          : "Offer created successfully."
      );
      setFormOpen(false);
      setForm({ ...emptyForm });
      setEditingId(null);
      await loadOffers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save offer."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleOfferStatus = async (offer: Offer) => {
    setStatusUpdating(offer.id);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/${offer.id}/status`,
        {
          method: "PATCH",
          headers: staffHeaders(true),
          body: JSON.stringify({ is_active: !offer.is_active }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update offer status.");
      }

      setOffers((previous) =>
        previous.map((item) =>
          item.id === offer.id ? result.data : item
        )
      );

      setMessage("Offer status updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update status."
      );
    } finally {
      setStatusUpdating(null);
    }
  };

  const filteredOffers = offers.filter((offer) =>
    `${offer.title} ${offer.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const activeCount = offers.filter((offer) => offer.is_active).length;

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-3">
              <Tag className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Offers & Promotions
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Create and manage furniture store offers.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            Create Offer
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle className="h-5 w-5 shrink-0" />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Total Offers</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {offers.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Active Offers</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {activeCount}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Inactive Offers</p>
            <p className="mt-2 text-3xl font-bold text-gray-500">
              {offers.length - activeCount}
            </p>
          </div>
        </div>

        {/* Create/Edit Form */}
        {formOpen && (
          <form
            onSubmit={saveOffer}
            className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? "Edit Offer" : "Create New Offer"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the promotion details below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close offer form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Offer Title *
                </span>
                <input
                  required
                  value={form.title}
                  onChange={(event) =>
                    updateField("title", event.target.value)
                  }
                  placeholder="e.g. Festive Furniture Sale"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Product ID (optional)
                </span>
                <input
                  type="number"
                  min="1"
                  value={form.product_id}
                  onChange={(event) =>
                    updateField("product_id", event.target.value)
                  }
                  placeholder="Leave blank for store-wide offer"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </span>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Describe this promotion..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Discount Type *
                </span>
                <select
                  required
                  value={form.discount_type}
                  onChange={(event) =>
                    updateField(
                      "discount_type",
                      event.target.value as "percentage" | "fixed"
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Discount Value *
                </span>
                <div className="relative">
                  <input
                    required
                    type="number"
                    min="0"
                    max={form.discount_type === "percentage" ? 100 : undefined}
                    step="0.01"
                    value={form.discount_value}
                    onChange={(event) =>
                      updateField("discount_value", event.target.value)
                    }
                    placeholder={
                      form.discount_type === "percentage" ? "e.g. 20" : "e.g. 500"
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    {form.discount_type === "percentage" ? (
                      <Percent className="h-4 w-4" />
                    ) : (
                      "₹"
                    )}
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Start Date
                </span>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(event) =>
                    updateField("start_date", event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  End Date
                </span>
                <input
                  type="date"
                  min={form.start_date || undefined}
                  value={form.end_date}
                  onChange={(event) =>
                    updateField("end_date", event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </label>

              <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 md:col-span-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) =>
                    updateField("is_active", event.target.checked)
                  }
                  className="h-4 w-4 accent-green-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  Offer is active
                </span>
              </label>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {editingId ? "Save Changes" : "Create Offer"}
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Offers List */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                All Offers
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                View and manage existing promotions.
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search offers..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-green-600"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading offers...
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Tag className="h-6 w-6 text-gray-400" />
              </div>
              <p className="font-medium text-gray-900">
                {search ? "No matching offers" : "No offers yet"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {search
                  ? "Try another search term."
                  : "Create your first offer to get started."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Offer</th>
                      <th className="px-5 py-4 font-semibold">Discount</th>
                      <th className="px-5 py-4 font-semibold">Validity</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOffers.map((offer) => (
                      <tr key={offer.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">
                            {offer.title}
                          </p>
                          <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                            {offer.description || "No description"}
                          </p>
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-800">
                          {offer.discount_type === "percentage"
                            ? `${offer.discount_value}%`
                            : `₹${offer.discount_value}`}
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4 text-gray-400" />
                            {formatDate(offer.start_date)}
                          </div>
                          <p className="mt-1 pl-5 text-xs text-gray-500">
                            to {formatDate(offer.end_date)}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            disabled={statusUpdating === offer.id}
                            onClick={() => toggleOfferStatus(offer)}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
                              offer.is_active
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {statusUpdating === offer.id
                              ? "Updating..."
                              : offer.is_active
                                ? "Active"
                                : "Inactive"}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => openEditForm(offer)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 p-4 md:hidden">
                {filteredOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {offer.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {offer.description || "No description"}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                        {offer.discount_type === "percentage"
                          ? `${offer.discount_value}% OFF`
                          : `₹${offer.discount_value} OFF`}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                      <button
                        type="button"
                        disabled={statusUpdating === offer.id}
                        onClick={() => toggleOfferStatus(offer)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          offer.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {statusUpdating === offer.id
                          ? "Updating..."
                          : offer.is_active
                            ? "Active"
                            : "Inactive"}
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditForm(offer)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OffersPromotions;
