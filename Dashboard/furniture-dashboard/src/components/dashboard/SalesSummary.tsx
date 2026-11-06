import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Payment {
  id: number;
  payment_status: string;
  amount: number | string;
  payment_date?: string;
  created_at?: string;
}

interface SalesSummaryProps {
  payments: Payment[];
  orders: { total_amount: number | string; status: string }[];
}

const SalesSummary = ({ payments, orders }: SalesSummaryProps) => {
  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  };

  const revenueData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();

    date.setDate(date.getDate() - (6 - index));

    const dateString = date.toISOString().split("T")[0];

    const dailyRevenue = payments
      .filter((payment) => {
        const paymentDate =
          payment.payment_date || payment.created_at;

        if (!paymentDate) {
          return false;
        }

        const paymentDay = new Date(paymentDate)
          .toISOString()
          .split("T")[0];

        const status =
          payment.payment_status?.toLowerCase();

        return (
          paymentDay === dateString &&
          (
            status === "paid" ||
            status === "success" ||
            status === "successful" ||
            status === "completed"
          )
        );
      })
      .reduce((total, payment) => {
        return total + Number(payment.amount || 0);
      }, 0);

    return {
      day: getDayName(date),
      revenue: dailyRevenue,
    };
  });

  const isPaid = (payment: Payment) =>
    ["paid", "success", "successful", "completed"].includes(
      payment.payment_status?.toLowerCase()
    );

  const paidPayments = payments.filter(isPaid);

  const totalRevenue = paidPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const now = new Date();

  const monthRevenue = paidPayments
    .filter((payment) => {
      const raw = payment.payment_date || payment.created_at;
      if (!raw) return false;
      const date = new Date(raw);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  const activeOrders = orders.filter(
    (order) => !["cancelled", "returned"].includes(order.status?.toLowerCase())
  );

  const orderValue = activeOrders.reduce(
    (total, order) => total + Number(order.total_amount || 0),
    0
  );

  const summary = [
    { label: "Total Order Value", value: orderValue },
    { label: "Avg. Order Value", value: activeOrders.length ? orderValue / activeOrders.length : 0 },
    { label: "Paid Revenue", value: totalRevenue },
    { label: "Paid This Month", value: monthRevenue },
  ];

  return (
    <div className="flex h-full w-full min-w-0 flex-col rounded-none border border-gray-200 bg-white p-4">

      {/* Header */}
      <div className="mb-3">
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
          Sales Summary
        </h2>

        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Order value, paid revenue and the last 7 days of payments
        </p>
      </div>

      {/* Totals */}
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {summary.map((item) => (
          <div
            key={item.label}
            className="min-w-0 rounded-none border border-gray-100 bg-slate-50 p-2.5"
          >
            <p className="truncate text-[11px] font-medium text-slate-400">
              {item.label}
            </p>
            <p className="mt-1 truncate text-sm font-bold text-slate-900 sm:text-base">
              ₹{Math.round(item.value).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="min-h-[150px] w-full min-w-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={revenueData}
            margin={{
              top: 10,
              right: 8,
              left: -10,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 11,
              }}
              dy={8}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              width={42}
              tick={{
                fill: "#94a3b8",
                fontSize: 10,
              }}
              tickFormatter={(value) =>
                `₹${Math.round(Number(value) / 100) / 10}K`
              }
            />

            <Tooltip
              formatter={(value) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                "Revenue",
              ]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: "12px",
              }}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{
                r: 3,
                fill: "#16a34a",
              }}
              activeDot={{
                r: 5,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesSummary;
