import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, ShoppingBag, IndianRupee, Package, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const StatCard = ({ title, value, icon, color, trend, subtext }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/20 flex flex-col gap-4 relative overflow-hidden group hover:border-slate-300 transition-all">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-500 ${color.bg}`}></div>
    <div className="flex justify-between items-start">
      <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-100 ${color.text}`}>
        {icon}
      </div>
      {trend && (
        <span className={`flex items-center gap-1 text-xs font-black rounded-lg px-3 py-1 ${trend.startsWith("+") ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
          <ArrowUpRight size={12} /> {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
      <p className="text-sm font-semibold text-slate-500 mt-1">{title}</p>
      {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
    </div>
  </div>
);

const ActivityRow = ({ icon, color, title, time, sub }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50/80 transition-all border border-transparent hover:border-slate-100">
    <div className={`p-3 rounded-2xl ${color.bg} ${color.text} flex-shrink-0`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-slate-900 truncate">{title}</h4>
      <p className="text-xs font-medium text-slate-500 truncate">{sub}</p>
    </div>
    <span className="text-xs font-semibold text-slate-400 flex-shrink-0">{time}</span>
  </div>
);

const RecentOrderRow = ({ order, onView }) => (
  <div
    onClick={() => onView(order._id)}
    className="flex items-center justify-between p-4 hover:bg-blue-50/60 rounded-2xl transition-all border border-transparent hover:border-slate-100 cursor-pointer group"
  >
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
        {order.userId?.firstName?.charAt(0) || "O"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
          Order #{order._id.slice(-6).toUpperCase()}
        </p>
        <p className="text-xs text-slate-500 truncate">{order.userId?.firstName || "Customer"}</p>
      </div>
    </div>
    <div className="text-right flex-shrink-0 ml-2">
      <p className="text-sm font-black text-slate-900">₹{order.totalAmount}</p>
      <span className="inline-block text-[10px] font-bold rounded-lg px-2.5 py-1 mt-1 bg-emerald-50 text-emerald-600">
        Delivered
      </span>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now - then) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const [statsRes, ordersRes, usersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, {
          headers: { Authorization: token },
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/admin/orders`, {
          headers: { Authorization: token },
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
          headers: { Authorization: token },
          withCredentials: true,
        }),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      if (ordersRes.data.success) {
        const deliveredOrders = ordersRes.data.orders
          .filter((order) => order.status === "Delivered")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const deliveredRevenue = deliveredOrders.reduce(
          (sum, order) => sum + (Number(order.totalAmount) || 0),
          0
        );

        setStats((currentStats) => ({
          ...currentStats,
          orders: deliveredOrders.length,
          revenue: deliveredRevenue,
        }));

        setRecentOrders(deliveredOrders.slice(0, 5));

        const activities = deliveredOrders.slice(0, 5).map((order) => ({
          type: "order",
          title: `Delivered order for ${order.userId?.firstName || "Customer"}`,
          sub: `₹${order.totalAmount} - Order ID: ${order._id.slice(-6)}`,
          time: getTimeAgo(order.createdAt),
          icon: ShoppingBag,
          color: { text: "text-emerald-600", bg: "bg-emerald-50" },
        }));

        if (usersRes.data.success && usersRes.data.users.length > 0) {
          const recentUsers = usersRes.data.users
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 2)
            .map((user) => ({
              type: "user",
              title: `New user: ${user.firstName} ${user.lastName}`,
              sub: user.email,
              time: getTimeAgo(user.createdAt),
              icon: Users,
              color: { text: "text-purple-600", bg: "bg-purple-50" },
            }));

          activities.push(...recentUsers);
        }

        setRecentActivities(activities.slice(0, 5));
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      if (!loading) toast.error("Failed to refresh dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium text-lg">Delivered-order focused overview of your store performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Delivered Revenue"
          value={`₹${(stats.revenue || 0).toLocaleString()}`}
          icon={<IndianRupee size={24} />}
          color={{ text: "text-blue-600", bg: "bg-blue-600" }}
          trend="+12.5%"
          subtext="Delivered orders only"
        />
        <StatCard
          title="Delivered Orders"
          value={stats.orders || 0}
          icon={<CheckCircle2 size={24} />}
          color={{ text: "text-emerald-600", bg: "bg-emerald-600" }}
          trend="+5.2%"
          subtext="Completed fulfilment"
        />
        <StatCard
          title="Total Users"
          value={stats.users || 0}
          icon={<Users size={24} />}
          color={{ text: "text-purple-600", bg: "bg-purple-600" }}
          trend="+18.1%"
          subtext="All time"
        />
        <StatCard
          title="Total Products"
          value={stats.products || 0}
          icon={<Package size={24} />}
          color={{ text: "text-orange-600", bg: "bg-orange-600" }}
          trend="+2.4%"
          subtext="In catalog"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2rem] p-8 md:p-10 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-white space-y-4 max-w-md">
                <h3 className="text-3xl font-black tracking-tight">Delivered Orders Snapshot</h3>
                <p className="text-slate-300 font-medium">
                  Your store has completed <span className="font-black text-blue-400">{stats.orders}</span> delivered orders and generated{" "}
                  <span className="font-black text-emerald-400">₹{(stats.revenue || 0).toLocaleString()}</span> in delivered revenue.
                </p>
              </div>
              <div className="text-6xl text-white/10 font-black">✓</div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 shadow-lg rounded-[2rem] p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-black text-xl text-slate-900">Recent Delivered Orders</h3>
                <p className="text-xs text-slate-500 font-bold mt-1">Latest completed orders from your store</p>
              </div>
              <button
                onClick={() => navigate("/admin/orders")}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <RecentOrderRow key={order._id} order={order} onView={handleViewOrder} />
                ))
              ) : (
                <div className="py-8 text-center text-slate-500">
                  <ShoppingBag size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="font-medium">No delivered orders yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 shadow-lg rounded-[2rem] p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-lg text-slate-900">Activity Feed</h3>
              <p className="text-xs text-slate-500 font-bold mt-1">Latest delivered orders and users</p>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, idx) => (
                <ActivityRow
                  key={idx}
                  icon={<activity.icon size={18} />}
                  color={activity.color}
                  title={activity.title}
                  sub={activity.sub}
                  time={activity.time}
                />
              ))
            ) : (
              <div className="py-12 text-center text-slate-500">
                <Clock size={40} className="mx-auto mb-3 opacity-20" />
                <p className="font-medium text-sm">No recent activities</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
