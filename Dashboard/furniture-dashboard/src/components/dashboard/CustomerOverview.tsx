interface Customer {
  id: number;
  is_active: boolean;
  created_at: string;
}

interface Order {
  id: number;
  status: string;
  user_id?: number;
}

interface CustomerOverviewProps {
  customers: Customer[];
  orders: Order[];
}

const CustomerOverview = ({
  customers,
  orders,
}: CustomerOverviewProps) => {
  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.is_active
  ).length;

  const thirtyDaysAgo = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;

  const newCustomers = customers.filter(
    (customer) =>
      new Date(customer.created_at).getTime() >= thirtyDaysAgo
  ).length;

  const orderingCustomers = new Set(
    orders
      .map((order) => order.user_id)
      .filter((id) => id !== undefined && id !== null)
  ).size;

  return (
    <div className="flex h-full w-full min-w-0 flex-col rounded-none border border-gray-200 bg-white p-4">

      {/* Header */}
      <div className="min-w-0">
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
          Customer Overview
        </h2>

        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Registered customers
        </p>
      </div>

      {/* Main Count */}
      <div className="mt-4 flex flex-1 flex-col justify-center rounded-none bg-green-50 p-4">
        <p className="text-xs font-medium text-slate-500 sm:text-sm">
          Total Customers
        </p>

        <h3 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          {totalCustomers.toLocaleString("en-IN")}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {orderingCustomers.toLocaleString("en-IN")} have placed orders
        </p>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">

        {/* Active */}
        <div className="rounded-none border border-gray-100 bg-slate-50 p-2.5">
          <p className="text-[11px] font-medium text-slate-400">
            Active
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            {activeCustomers.toLocaleString("en-IN")}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            Active accounts
          </p>
        </div>

        {/* Completed */}
        <div className="rounded-none border border-gray-100 bg-slate-50 p-2.5">
          <p className="text-[11px] font-medium text-slate-400">
            New
          </p>

          <p className="mt-1 text-lg font-bold text-green-600">
            {newCustomers.toLocaleString("en-IN")}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            Last 30 days
          </p>
        </div>

        {/* Pending */}
        <div className="rounded-none border border-gray-100 bg-slate-50 p-2.5">
          <p className="text-[11px] font-medium text-slate-400">
            Inactive
          </p>

          <p className="mt-1 text-lg font-bold text-red-600">
            {(totalCustomers - activeCustomers).toLocaleString("en-IN")}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            Disabled accounts
          </p>
        </div>

      </div>

    </div>
  );
};

export default CustomerOverview;
