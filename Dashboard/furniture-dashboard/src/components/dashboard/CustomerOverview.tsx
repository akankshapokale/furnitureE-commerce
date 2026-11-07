import { Link } from "react-router-dom";

interface Customer {
  id: number;
  name?: string;
  email?: string;
  phone?: string | null;
  is_active: boolean;
  created_at: string;
}

interface Order {
  id: number;
  status: string;
  user_id?: number;
  total_amount?: number | string;
}

interface CustomerOverviewProps {
  customers: Customer[];
  orders: Order[];
}

const CustomerOverview = ({ customers, orders }: CustomerOverviewProps) => {
  const stats = new Map<number, { count: number; spent: number }>();
  orders.forEach((o) => {
    if (o.user_id == null || ["cancelled", "canceled", "returned"].includes(o.status?.toLowerCase())) return;
    const s = stats.get(o.user_id) || { count: 0, spent: 0 };
    s.count += 1;
    s.spent += Number(o.total_amount || 0);
    stats.set(o.user_id, s);
  });

  const activeCount = customers.filter((c) => c.is_active).length;
  const recent = [...customers]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  return (
    <div className="flex h-full w-full min-w-0 flex-col border border-gray-200 bg-white p-4">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Customer Overview</h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {customers.length.toLocaleString("en-IN")} customers · {activeCount.toLocaleString("en-IN")} active
          </p>
        </div>
        <Link to="/customers" className="shrink-0 text-xs font-semibold text-slate-900 hover:underline sm:text-sm">View all →</Link>
      </div>

      <div className="mt-4 min-w-0 flex-1 overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2 text-right">Orders</th>
              <th className="px-3 py-2 text-right">Spent</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 && (
              <tr><td colSpan={4} className="px-3 py-6 text-center text-slate-400">No customers yet</td></tr>
            )}
            {recent.map((c) => {
              const s = stats.get(c.id);
              return (
                <tr key={c.id} className="border-t border-gray-100">
                  <td className="px-3 py-2.5">
                    <p className="max-w-[180px] truncate font-medium text-slate-800">{c.name || "—"}</p>
                    <p className="max-w-[180px] truncate text-xs text-slate-400">{c.email || c.phone || ""}</p>
                  </td>
                  <td className="px-3 py-2.5 text-right text-slate-700">{(s?.count ?? 0).toLocaleString("en-IN")}</td>
                  <td className="px-3 py-2.5 text-right font-medium text-slate-800">₹{Math.round(s?.spent ?? 0).toLocaleString("en-IN")}</td>
                  <td className="px-3 py-2.5">
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${c.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerOverview;
