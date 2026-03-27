import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, ShoppingBag, IndianRupee, Package, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col gap-4 relative overflow-hidden group hover:border-slate-300 transition-all">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-500 ${color.bg}`}></div>
    <div className="flex justify-between items-start">
      <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-100 ${color.text}`}>
        {icon}
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
      <p className="text-sm font-semibold text-slate-500 mt-1">{title}</p>
    </div>
  </div>
);

const ActivityRow = ({ icon, color, title, time, sub }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
    <div className={`p-3 rounded-2xl ${color.bg} ${color.text}`}>
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-bold text-slate-900">{title}</h4>
      <p className="text-xs font-medium text-slate-500">{sub}</p>
    </div>
    <span className="text-xs font-semibold text-slate-400">{time}</span>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:3001/admin/stats", {
          headers: { Authorization: token },
          withCredentials: true
        });
        if(res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium text-lg">Here's what's happening in your store today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
          <Calendar size={18} className="text-slate-400" />
          <span className="text-sm font-bold text-slate-700">Last 30 Days</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.revenue.toLocaleString()}`} 
          icon={<IndianRupee size={24} />} 
          color={{ text: 'text-blue-600', bg: 'bg-blue-600' }} 
          trend="+12.5%" 
        />
        <StatCard 
          title="Total Orders" 
          value={stats.orders} 
          icon={<ShoppingBag size={24} />} 
          color={{ text: 'text-emerald-600', bg: 'bg-emerald-600' }} 
          trend="+5.2%" 
        />
        <StatCard 
          title="Active Users" 
          value={stats.users} 
          icon={<Users size={24} />} 
          color={{ text: 'text-purple-600', bg: 'bg-purple-600' }} 
          trend="+18.1%" 
        />
        <StatCard 
          title="Products" 
          value={stats.products} 
          icon={<Package size={24} />} 
          color={{ text: 'text-orange-600', bg: 'bg-orange-600' }} 
        />
      </div>

      {/* Extra Features: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Main Chart/Banner area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-white space-y-4 max-w-sm">
                <h3 className="text-2xl font-bold">Ready to scale your business?</h3>
                <p className="text-slate-400 font-medium">Your store is doing great. Consider running a marketing campaign to boost your Q3 targets.</p>
                <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">
                  Create Campaign
                </button>
              </div>
              <img src="https://illustrations.popsy.co/amber/surreal-hourglass.svg" alt="Illustration" className="w-48 opacity-90 drop-shadow-2xl"/>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Activity */}
        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/20 rounded-[2rem] p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-extrabold text-lg text-slate-900">Recent Activity</h3>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
          </div>
          
          <div className="space-y-2">
            <ActivityRow 
              icon={<ShoppingBag size={18} />} 
              color={{ text: 'text-blue-600', bg: 'bg-blue-50' }} 
              title="New Order #1002" 
              sub="₹1,299 from John Doe" 
              time="2m ago" 
            />
            <ActivityRow 
              icon={<Users size={18} />} 
              color={{ text: 'text-purple-600', bg: 'bg-purple-50' }} 
              title="New user registered" 
              sub="alice@example.com" 
              time="1h ago" 
            />
            <ActivityRow 
              icon={<CreditCard size={18} />} 
              color={{ text: 'text-emerald-600', bg: 'bg-emerald-50' }} 
              title="Payment Processed" 
              sub="Order #1001" 
              time="3h ago" 
            />
            <ActivityRow 
              icon={<Package size={18} />} 
              color={{ text: 'text-orange-600', bg: 'bg-orange-50' }} 
              title="Stock Update" 
              sub="2 products restocked" 
              time="5h ago" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
