import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, X, Search, UserCog } from "lucide-react";
import {
  getPeople,
  createPerson,
  updatePerson,
  deletePerson,
  apiError,
  type PersonPayload,
} from "../services/api";
import { PAGES } from "../config/permissions";
import ConfirmDialog from "../components/common/ConfirmDialog";

interface Person {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  designation: string | null;
  department: string | null;
  permissions: string[];
  is_active: boolean;
  created_at: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  password: string;
  permissions: string[];
  is_active: boolean;
}

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  designation: "",
  department: "",
  password: "",
  permissions: [],
  is_active: true,
};

const STAFF_DEPARTMENTS = ["Production", "Sales", "Accounts", "Warehouse", "Dispatch", "Customer Support", "HR & Admin"];

const People = ({ title = "Team Management", staffView = false }: { title?: string; staffView?: boolean }) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeDepartment, setActiveDepartment] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Person | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Person | null>(null);

  const fetchPeople = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPeople();
      setPeople(Array.isArray(res.data.data) ? res.data.data : []);
      setError("");
    } catch (err) {
      setError(apiError(err, "Failed to load employees"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchPeople(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchPeople]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setNotice("");
    setModalOpen(true);
  };

  const openEdit = (person: Person) => {
    setEditing(person);
    setNotice("");
    setForm({
      name: person.name,
      email: person.email,
      phone: person.phone ?? "",
      designation: person.designation ?? "",
      department: person.department ?? "",
      password: "",
      permissions: person.permissions ?? [],
      is_active: person.is_active,
    });
    setFormError("");
    setModalOpen(true);
  };

  const togglePermission = (key: string) =>
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(key)
        ? f.permissions.filter((p) => p !== key)
        : [...f.permissions, key],
    }));

  const allSelected = form.permissions.length === PAGES.length;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (!editing && form.password.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }

    const payload: PersonPayload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || undefined,
      designation: form.designation.trim() || undefined,
      department: form.department.trim() || undefined,
      permissions: form.permissions,
      is_active: form.is_active,
    };

    if (form.password) payload.password = form.password;

    try {
      setSaving(true);

      if (editing) {
        await updatePerson(editing.id, payload);
        setNotice(`${form.name.trim()} updated successfully`);
      } else {
        await createPerson(payload);
        // A newly added employee may not match the selected department/search filter.
        setActiveDepartment("All");
        setSearch("");
        setNotice(`${form.name.trim()} created successfully`);
      }

      setModalOpen(false);
      await fetchPeople();
    } catch (err) {
      setFormError(apiError(err, "Failed to save employee"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (person: Person) => {
    try {
      await deletePerson(person.id);
      setPeople((current) => current.filter((p) => p.id !== person.id));
    } catch (err) {
      setError(apiError(err, "Failed to delete employee"));
    }
  };

  const query = search.trim().toLowerCase();
  const visible = people.filter(
    (p) => {
      const matchesSearch = !query ||
        p.name.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query) ||
        (p.phone ?? "").includes(query) ||
        (p.designation ?? "").toLowerCase().includes(query) ||
        (p.department ?? "").toLowerCase().includes(query);
      const matchesDepartment = !staffView || activeDepartment === "All" ||
        (activeDepartment === "Unassigned" ? !p.department : p.department === activeDepartment);
      return matchesSearch && matchesDepartment;
    }
  );
  const departmentFilters = ["All", ...STAFF_DEPARTMENTS, "Unassigned"];
  const departmentCount = (department: string) => department === "All"
    ? people.length
    : department === "Unassigned"
      ? people.filter((person) => !person.department).length
      : people.filter((person) => person.department === department).length;

  const pageLabel = (key: string) => PAGES.find((p) => p.key === key)?.label ?? key;

  return (
    <div className="min-h-screen bg-white">
      {deleteTarget && <ConfirmDialog title="Delete team member?" message={`Delete ${deleteTarget.name}? This cannot be undone.`} onCancel={() => setDeleteTarget(null)} onConfirm={() => { const target = deleteTarget; setDeleteTarget(null); void handleDelete(target); }} />}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {staffView
                ? "Manage furniture staff, departments, designations and dashboard access"
                : "Manage your team, employee profiles and page permissions"}
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="flex h-10 items-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            {staffView ? "Add Staff Member" : "Add Team Member"}
          </button>
        </div>

        {staffView && (
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {departmentFilters.map((department) => (
              <button
                key={department}
                type="button"
                onClick={() => setActiveDepartment(department)}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  activeDepartment === department
                    ? "bg-green-700 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {department} <span className="ml-1 opacity-75">{departmentCount(department)}</span>
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="mt-6 flex h-10 max-w-sm items-center rounded-lg border border-gray-200 bg-white px-3">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={staffView ? "Search staff by name, email, phone or designation" : "Search by name, email, phone or designation"}
            className="h-full w-full bg-transparent px-2 text-sm outline-none placeholder:text-gray-400"
          />
        </div>

        {error && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <span>{error}</span>
            <button type="button" onClick={() => void fetchPeople()} className="shrink-0 font-semibold underline">Retry</button>
          </div>
        )}

        {notice && (
          <div className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700" role="status">
            {notice}
          </div>
        )}

        {/* List */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className={`w-full ${staffView ? "min-w-[1050px]" : "min-w-[820px]"} text-left text-sm`}>
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                {staffView && <th className="px-4 py-3 font-semibold">Employee ID</th>}
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Designation</th>
                {staffView && <th className="px-4 py-3 font-semibold">Department</th>}
                <th className="px-4 py-3 font-semibold">{staffView ? "Permissions" : "Page access"}</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={staffView ? 7 : 5} className="px-4 py-10 text-center text-gray-500">
                    Loading employees...
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={staffView ? 7 : 5} className="px-4 py-12 text-center text-gray-500">
                    <UserCog className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                    {people.length === 0 ? "No employees yet. Add your first one." : "No matches."}
                  </td>
                </tr>
              ) : (
                visible.map((person) => (
                  <tr key={person.id} className="align-top">
                    {staffView && (
                      <td className="px-4 py-4 font-mono text-xs text-slate-500">EMP-{String(person.id).padStart(3, "0")}</td>
                    )}
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{person.name}</p>
                      <p className="text-xs text-gray-500">{person.email}</p>
                      {person.phone && <p className="text-xs text-gray-500">{person.phone}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{person.designation || "—"}</td>
                    {staffView && (
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          {person.department || "Unassigned"}
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-3">
                      {staffView ? (
                        <span className="text-slate-600">{person.permissions?.length ?? 0} pages</span>
                      ) : !Array.isArray(person.permissions) || person.permissions.length === 0 ? (
                        <span className="text-xs text-gray-400">No pages</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {person.permissions.map((key) => (
                            <span
                              key={key}
                              className="rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700"
                            >
                              {pageLabel(key)}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          person.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}
                      >
                        {person.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(person)}
                          aria-label={`Edit ${person.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(person)}
                          aria-label={`Delete ${person.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleSubmit}
            className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                {editing ? (staffView ? "Edit Staff Member" : "Edit Team Member") : (staffView ? "Add Staff Member" : "Add Team Member")}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full name *">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label="Designation">
                  <input
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    placeholder="e.g. Order Manager"
                    className="input"
                  />
                </Field>
                {staffView && (
                  <Field label="Department">
                    <select
                      required
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="input"
                    >
                      <option value="">Choose a department</option>
                      {STAFF_DEPARTMENTS.map((department) => (
                        <option key={department} value={department}>{department}</option>
                      ))}
                    </select>
                  </Field>
                )}
                <Field label="Email *">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label="Phone number">
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="10-digit mobile"
                    className="input"
                  />
                </Field>
                <Field label={editing ? "New password (leave blank to keep)" : "Password *"}>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="input"
                  />
                </Field>

                {editing && (
                  <Field label="Status">
                    <select
                      value={form.is_active ? "active" : "inactive"}
                      onChange={(e) => setForm({ ...form, is_active: e.target.value === "active" })}
                      className="input"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive (cannot sign in)</option>
                    </select>
                  </Field>
                )}
              </div>

              {/* Page permissions */}
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Page access</p>
                    <p className="text-xs text-gray-500">
                      Selected pages are fully accessible to this employee.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        permissions: allSelected ? [] : PAGES.map((p) => p.key),
                      })
                    }
                    className="text-xs font-medium text-green-700 hover:underline"
                  >
                    {allSelected ? "Clear all" : "Select all"}
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {PAGES.map((page) => {
                    const checked = form.permissions.includes(page.key);
                    return (
                      <label
                        key={page.key}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                          checked ? "border-green-500 bg-green-50" : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePermission(page.key)}
                          className="mt-0.5 h-4 w-4 accent-green-600"
                        />
                        <span>
                          <span className="block text-sm font-medium text-gray-900">{page.label}</span>
                          <span className="block text-xs text-gray-500">{page.description}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {formError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                  {formError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="h-10 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="h-10 rounded-lg bg-green-600 px-5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : editing ? "Save Changes" : staffView ? "Create Staff Member" : "Create Team Member"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="mb-1.5 block text-xs font-medium text-gray-700">{label}</label>
    {children}
  </div>
);

export default People;
