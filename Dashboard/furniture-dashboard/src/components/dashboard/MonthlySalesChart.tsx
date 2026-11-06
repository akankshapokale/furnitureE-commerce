import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface MonthlySalesPoint {
  month: string;
  sales: number;
  collected: number;
}

const compactCurrency = (value: number) =>
  value >= 100000
    ? `₹${(value / 100000).toFixed(1)}L`
    : value >= 1000
      ? `₹${(value / 1000).toFixed(0)}K`
      : `₹${value}`;

const inr = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

const MonthlySalesChart = ({ data }: { data: MonthlySalesPoint[] }) => (
  <div className="mt-4 h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 8, left: -5, bottom: 0 }}>
        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
        <YAxis axisLine={false} tickLine={false} width={50} tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={compactCurrency} />
        <Tooltip formatter={(value) => inr(Number(value))} />
        <Legend />
        <Bar dataKey="sales" name="Sales" fill="#16a34a" radius={[4, 4, 0, 0]} />
        <Bar dataKey="collected" name="Collected" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default MonthlySalesChart;
