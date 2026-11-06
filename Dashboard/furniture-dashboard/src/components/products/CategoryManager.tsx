import { useCallback, useEffect, useState } from "react";
import { Check, ChevronDown, ChevronRight, Pencil, Plus, Trash2, X } from "lucide-react";
import ConfirmDialog from "../common/ConfirmDialog";

import {
  apiError,
  createCategory,
  createSubCategory,
  deleteCategory,
  deleteSubCategory,
  getCategories,
  getSubCategories,
  updateCategory,
  updateSubCategory,
  type Category,
  type SubCategory,
} from "../../services/api";

interface CategoryManagerProps {
  onClose?: () => void;
  /** Called after any change so the parent can refresh its category lists. */
  onChanged: () => void;
  fullPage?: boolean;
}

const input =
  "min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500";

const CategoryManager = ({ onClose, onChanged, fullPage = false }: CategoryManagerProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subs, setSubs] = useState<SubCategory[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const [newCategory, setNewCategory] = useState("");
  const [newSub, setNewSub] = useState("");
  const [newSubGroup, setNewSubGroup] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleteSubTarget, setDeleteSubTarget] = useState<SubCategory | null>(null);
  const [replacementCategoryId, setReplacementCategoryId] = useState("");

  // Which row is being renamed: "c-<id>" or "s-<id>"
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const load = useCallback(
    () =>
      Promise.all([getCategories(), getSubCategories()])
        .then(([c, s]) => {
          setCategories(c.data.data || []);
          setSubs(s.data.data || []);
        })
        .catch((err) => setError(apiError(err, "Failed to load categories")))
        .finally(() => setLoading(false)),
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  // Run a change, then refresh both lists and tell the parent.
  const run = async (action: () => Promise<unknown>, fallback: string) => {
    try {
      setSaving(true);
      setError("");
      setNotice("");
      const response = await action() as { data?: { message?: string } };
      await load();
      onChanged();
      setNotice(response?.data?.message || "Changes saved successfully.");
      return true;
    } catch (err) {
      setError(apiError(err, fallback));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (key: string, value: string) => {
    setEditing(key);
    setEditValue(value);
  };

  const saveEdit = async () => {
    const name = editValue.trim();
    if (!editing || !name) return;

    const id = Number(editing.slice(2));
    const action =
      editing.startsWith("c-")
        ? () => updateCategory(id, { name })
        : () => updateSubCategory(id, { name });

    if (await run(action, "Failed to rename")) setEditing(null);
  };

  const renderName = (key: string, name: string) =>
    editing === key ? (
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <input
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit();
            if (e.key === "Escape") setEditing(null);
          }}
          className={input}
        />
        <button type="button" onClick={saveEdit} className="rounded-lg p-2 text-green-600 hover:bg-green-50" aria-label="Save">
          <Check size={16} />
        </button>
        <button type="button" onClick={() => setEditing(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Cancel">
          <X size={16} />
        </button>
      </div>
    ) : (
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">{name}</span>
    );

  return (
    <div
      className={fullPage ? "w-full" : "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"}
      onClick={fullPage ? undefined : onClose}
    >
      {deleteSubTarget && <ConfirmDialog title="Delete sub-category?" message={`Delete "${deleteSubTarget.name}"?`} onCancel={() => setDeleteSubTarget(null)} onConfirm={() => { const target = deleteSubTarget; setDeleteSubTarget(null); void run(() => deleteSubCategory(target.id), "Failed to delete sub-category"); }} />}
      <div
        role="dialog"
        aria-label={fullPage ? "Categories Master" : "Manage categories"}
        className={`flex w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ${fullPage ? "mx-auto max-h-[calc(100vh-190px)] max-w-6xl" : "max-h-[85vh] max-w-xl shadow-xl"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{fullPage ? "Categories Master" : "Categories"}</h2>
            <p className="text-xs text-slate-500">Organise products into categories and sub-categories</p>
          </div>
          {!fullPage && <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close">
            <X size={18} />
          </button>}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {error && <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</div>}
          {notice && <div className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700" role="status">{notice}</div>}

          {loading ? (
            <p className="py-8 text-center text-sm text-slate-400">Loading…</p>
          ) : (
            <ul className="space-y-2">
              {categories.map((category) => {
                const open = expanded === category.id;
                const children = subs.filter((sub) => sub.category_id === category.id);

                return (
                  <li key={category.id} className="rounded-xl border border-gray-100">
                    <div className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center">
                      <div className="flex min-w-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setExpanded(open ? null : category.id);
                            setNewSub("");
                            setNewSubGroup("");
                          }}
                          className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          aria-label={open ? "Collapse" : "Expand"}
                        >
                          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        {renderName(`c-${category.id}`, category.name)}
                        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
                          {children.length} subcategories
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1 sm:ml-auto sm:justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setExpanded(category.id);
                            setNewSub("");
                            setNewSubGroup("");
                          }}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-semibold text-green-700 hover:bg-green-50"
                        >
                          <Plus size={13} /> Add subcategory
                        </button>
                        <label className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs text-slate-500 hover:bg-slate-50">
                          <input
                            type="checkbox"
                            checked={category.is_active}
                            onChange={(e) =>
                              run(() => updateCategory(category.id, { is_active: e.target.checked }), "Failed to update")
                            }
                          />
                          Active
                        </label>
                        <button type="button" onClick={() => startEdit(`c-${category.id}`, category.name)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Rename">
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTarget(category);
                            setReplacementCategoryId(String(categories.find((item) => item.id !== category.id && item.is_active)?.id || ""));
                          }}
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {open && (
                      <div className="border-t border-gray-100 bg-slate-50/60 px-3 py-3">
                        {children.length === 0 ? (
                          <p className="px-2 text-xs text-slate-400">No sub-categories yet</p>
                        ) : (
                          Array.from(children.reduce((groups, sub) => {
                            const groupName = sub.group_name || "";
                            groups.set(groupName, [...(groups.get(groupName) || []), sub]);
                            return groups;
                          }, new Map<string, SubCategory[]>()).entries()).map(([groupName, groupedSubs]) => (
                            <section key={groupName || "ungrouped"} className="mb-3 last:mb-0">
                              {groupName && <h3 className="mb-1 pl-7 text-[11px] font-bold uppercase tracking-wide text-slate-400">{groupName}</h3>}
                              <ul className="space-y-1.5">
                                {groupedSubs.map((sub) => (
                                  <li key={sub.id} className="flex items-center gap-2 pl-7">
                                    {renderName(`s-${sub.id}`, sub.name)}
                                    <button type="button" onClick={() => startEdit(`s-${sub.id}`, sub.name)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700" aria-label="Rename">
                                      <Pencil size={13} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeleteSubTarget(sub)}
                                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                      aria-label="Delete"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </section>
                          ))
                        )}

                        <form
                          className="mt-3 grid gap-2 pl-7 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)_auto]"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const name = newSub.trim();
                            if (!name) return;
                            if (await run(() => createSubCategory({ category_id: category.id, name, group_name: newSubGroup.trim() || null }), "Failed to add sub-category")) setNewSub("");
                          }}
                        >
                          <input
                            value={newSub}
                            onChange={(e) => setNewSub(e.target.value)}
                            placeholder={`Add a sub-category to ${category.name}`}
                            aria-label={`New subcategory for ${category.name}`}
                            required
                            className={input}
                          />
                          <input
                            value={newSubGroup}
                            onChange={(e) => setNewSubGroup(e.target.value)}
                            placeholder="Group (optional)"
                            aria-label="Subcategory group (optional)"
                            className={input}
                          />
                          <button type="submit" disabled={saving} className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 disabled:cursor-wait disabled:opacity-60">
                            <Plus size={14} /> {saving ? "Saving…" : "Add subcategory"}
                          </button>
                        </form>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <form
          className="flex flex-col gap-2 border-t border-gray-100 bg-slate-50 px-4 py-4 sm:flex-row sm:px-6"
          onSubmit={async (e) => {
            e.preventDefault();
            const name = newCategory.trim();
            if (!name) return;
            if (await run(() => createCategory({ name, is_active: true }), "Failed to add category")) setNewCategory("");
          }}
        >
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            aria-label="New category name"
            required
            className={`${input} w-full`}
          />
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-wait disabled:opacity-60">
            <Plus size={16} /> {saving ? "Saving…" : "Add category"}
          </button>
        </form>
      </div>
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4" onClick={() => !saving && setDeleteTarget(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="delete-category-title" className="w-full max-w-md border border-gray-200 bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <h3 id="delete-category-title" className="text-base font-bold text-slate-900">Delete "{deleteTarget.name}"?</h3>
            <p className="mt-2 text-sm leading-5 text-slate-600">Products assigned to this category can be moved to another category before deletion. Their subcategory assignments will be cleared. If you leave this blank and products still use it, the category will be archived instead.</p>
            <label className="mt-4 block text-xs font-semibold text-slate-600">Move products to
              <select value={replacementCategoryId} onChange={(event) => setReplacementCategoryId(event.target.value)} className="mt-1 h-10 w-full border border-gray-200 bg-white px-3 text-sm font-normal outline-none focus:border-green-500">
                <option value="">Do not move products</option>
                {categories.filter((item) => item.id !== deleteTarget.id && item.is_active).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" disabled={saving} onClick={() => setDeleteTarget(null)} className="border border-gray-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
              <button type="button" disabled={saving} onClick={async () => {
                const destination = Number(replacementCategoryId) || undefined;
                const success = await run(() => deleteCategory(deleteTarget.id, destination), "Failed to delete category");
                if (success) setDeleteTarget(null);
              }} className="bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-wait disabled:opacity-50">{saving ? "Deleting..." : replacementCategoryId ? "Move products & delete" : "Delete category"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
