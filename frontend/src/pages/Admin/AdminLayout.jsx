import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutDashboard, Users, ShoppingBag, ArrowLeft } from 'lucide-react';

const AdminLayout = () => {
  const { user } = useSelector(store => store.user);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex fixed h-full z-20 shadow-xl shadow-slate-900/20">
        <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Admin<span className="text-white">Pro</span>
          </h2>
        </div>
        
        <div className="px-4 py-8 flex-1 space-y-2">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Menu</p>

          <NavLink to="/admin/dashboard" className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-200 ${isActive ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-inner' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20}/> Dashboard
          </NavLink>
          
          <NavLink to="/admin/users" className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-200 ${isActive ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-inner' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Users size={20}/> Users
          </NavLink>
          
          <NavLink to="/admin/orders" className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-200 ${isActive ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-inner' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <ShoppingBag size={20}/> Orders
          </NavLink>
        </div>

        <div className="p-4 border-t border-slate-800/50">
          <NavLink to="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <ArrowLeft size={18}/> Back to Store
          </NavLink>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200/60 px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800 hidden md:block">Welcome, {user?.firstName || 'Admin'}</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-md">
              {user?.firstName?.charAt(0) || 'A'}
            </div>
          </div>
        </header>
        
        <div className="p-8 bg-slate-50/50 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
