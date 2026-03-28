import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutDashboard, Users, ShoppingBag, ArrowLeft, Menu, X, Bell, Search } from 'lucide-react';

const AdminLayout = () => {
  const { user } = useSelector(store => store.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-x-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-900 text-white flex flex-col z-50 transition-transform duration-500 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex h-screen shadow-2xl`}>
        <div className="p-8 border-b border-slate-800/50 flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Admin<span className="text-white">Pro</span>
          </h2>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <div className="px-5 py-10 flex-1 space-y-2 overflow-y-auto">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 h-px bg-slate-800/50 flex items-center justify-center">
            <span className="bg-slate-900 px-3">CORE MENU</span>
          </p>

          <NavLink to="/admin/dashboard" className={({isActive}) => `flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20}/> Dashboard
          </NavLink>
          
          <NavLink to="/admin/users" className={({isActive}) => `flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Users size={20}/> Manage Users
          </NavLink>
          
          <NavLink to="/admin/orders" className={({isActive}) => `flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <ShoppingBag size={20}/> Customer Orders
          </NavLink>
        </div>

        <div className="p-6 border-t border-slate-800/50 space-y-4">
          <NavLink to="/" className="flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Website
          </NavLink>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30 transition-all">
          <div className="flex items-center gap-4">
             <button 
              className="md:hidden p-2 text-slate-600 bg-slate-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
              onClick={() => setIsSidebarOpen(true)}
             >
                <Menu size={24} />
             </button>
             <h1 className="hidden sm:block text-xl font-black text-slate-900 tracking-tight">
                {location.pathname.split('/').pop().charAt(0).toUpperCase() + location.pathname.split('/').pop().slice(1)} Overview
             </h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden lg:flex items-center bg-slate-100 rounded-xl px-4 py-2 border border-slate-200 group focus-within:ring-2 ring-blue-500/20 transition-all">
               <Search size={18} className="text-slate-400" />
               <input type="text" placeholder="Global search..." className="bg-transparent border-none text-sm focus:ring-0 w-40 placeholder:font-bold" />
            </div>

            <button className="p-2 text-slate-400 hover:text-blue-600 relative">
               <Bell size={22} />
               <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Admin Access</p>
                  <p className="text-xs font-black text-slate-900">{user?.firstName}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black border-2 border-white shadow-lg">
                 {user?.firstName?.charAt(0) || 'A'}
               </div>
            </div>
          </div>
        </header>
        
        <div className="p-6 sm:p-10 bg-slate-50/50 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

