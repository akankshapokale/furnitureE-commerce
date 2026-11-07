import { useEffect, useState } from "react";
import OverviewCard from "../components/dashboard/OverviewCard";
import SalesSummary from "../components/dashboard/SalesSummary";
import MostBoughtProducts from "../components/dashboard/MostBoughtProducts";
import CustomerOverview from "../components/dashboard/CustomerOverview";
import RecentOrders from "../components/dashboard/RecentOrders";

import {
  getOrders,
  getPayments,
  getUsers,
} from "../services/api";

interface Order {
  id: number;
  order_number: string;
  total_amount: number | string;
  status: string;
  payment_status: string;
  created_at: string;
  customer_name?: string;
  user_id?: number;
  items?: { product_name?: string; quantity?: number }[];
}

interface Payment {
  id: number;
  payment_status: string;
  amount: number | string;
  payment_date?: string;
  created_at?: string;
}

interface User {
  id: number;
  name?: string;
  email?: string;
  phone?: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [orders, payments, users] =
          await Promise.allSettled([
            getOrders(),
            getPayments(),
            getUsers(),
          ]);

        // One failing endpoint should not blank the whole dashboard.
        if (orders.status === "fulfilled")
          setOrders(orders.value.data.data || []);
        if (payments.status === "fulfilled")
          setPayments(payments.value.data.data || []);
        if (users.status === "fulfilled")
          setCustomers(
            (users.value.data.data || []).filter(
              (user: User) => user.role === "customer"
            )
          );
      } catch (error) {
        console.error(
          "Failed to fetch dashboard data:",
          error
        );
      }
    };

    void fetchDashboardData();
    const interval = window.setInterval(() => void fetchDashboardData(), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "pending"
  ).length;

  const dispatchedOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "dispatched"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "delivered"
  ).length;

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-white">
      <div className="w-full min-w-0 p-4 sm:p-5 md:p-6 lg:p-6">

        {/* Overview Cards */}
        <section className="grid min-w-0 grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">

          <OverviewCard
            title="Total Orders"
            value={totalOrders.toLocaleString("en-IN")}
          />

          <OverviewCard
            title="Pending"
            value={pendingOrders.toLocaleString("en-IN")}
          />

          <OverviewCard
            title="Dispatched"
            value={dispatchedOrders.toLocaleString("en-IN")}
          />

          <OverviewCard
            title="Delivered"
            value={deliveredOrders.toLocaleString("en-IN")}
          />

        </section>

        {/* Sales + Orders */}
        <section className="mt-4 grid min-w-0 grid-cols-1 items-stretch gap-4 lg:mt-5 lg:grid-cols-2">

          <div className="flex min-w-0">
            <SalesSummary payments={payments} orders={orders} />
          </div>

          <div className="flex min-w-0">
            <MostBoughtProducts orders={orders} />
          </div>

        </section>

        {/* Customers */}
        <section className="mt-4 min-w-0 lg:mt-5">
          <CustomerOverview customers={customers} orders={orders} />
        </section>

        {/* Recent Orders */}
        <section className="mt-4 min-w-0 lg:mt-5">
          <RecentOrders orders={orders} />
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
