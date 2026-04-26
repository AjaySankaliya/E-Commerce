import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Trash2, UserPlus, Shield, User as UserIcon, Search, MoreVertical, Mail, Calendar, Zap } from 'lucide-react';

const Users = () => {
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: { Authorization: token },
        withCredentials: true
      });
      if (res.data.success) {
        setUsersList(res.data.users);
      }
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 60000); // Auto-refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    const toastId = toast.loading("Deleting user...");
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, {
        headers: { Authorization: token },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success("User deleted successfully", { id: toastId });
        setUsersList(usersList.filter(u => u._id !== userId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user", { id: toastId });
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const toastId = toast.loading("Updating user role...");
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: token },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success("Role updated successfully", { id: toastId });
        setUsersList(usersList.map(u => u._id === userId ? { ...u, role: newRole } : u));
      }
    } catch (error) {
      toast.error("Failed to update role", { id: toastId });
    }
  };

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterRole === 'All' || u.role === filterRole;
    
    return matchesSearch && matchesFilter;
  });

  const adminCount = usersList.filter(u => u.role === 'admin').length;
  const userCount = usersList.filter(u => u.role === 'user').length;

  const getInitials = (firstName, lastName) => {
    return (firstName?.charAt(0) || '') + (lastName?.charAt(0) || '');
  };

  const getGradient = (email) => {
    const hashes = [
      'from-red-400 to-red-600',
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-yellow-400 to-yellow-600',
      'from-indigo-400 to-indigo-600',
      'from-cyan-400 to-cyan-600',
    ];
    const hash = email.charCodeAt(0) + email.charCodeAt(email.length - 1);
    return hashes[hash % hashes.length];
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">User Directory</h1>
          <p className="text-slate-500 font-medium text-lg">Manage platform access, roles, and user permissions. <span className="text-blue-600 font-bold">{usersList.length} total users</span></p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Users</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{usersList.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <UserIcon size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Admins</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{adminCount}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <Shield size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Regular Users</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{userCount}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <UserPlus size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-4">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-medium shadow-sm focus:ring-2 ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Role Filter */}
        <div className="flex gap-2">
          {['All', 'user', 'admin'].map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role === 'All' ? 'All' : role)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${filterRole === role ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'}`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th className="px-8 py-6">User Details</th>
                <th className="px-8 py-6">Email Address</th>
                <th className="px-8 py-6">Role / Level</th>
                <th className="px-8 py-6">Joined Date</th>
                <th className="px-8 py-6 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6"><div className="h-12 w-48 bg-slate-100 rounded-xl"></div></td>
                    <td className="px-8 py-6"><div className="h-6 w-40 bg-slate-100 rounded-lg"></div></td>
                    <td className="px-8 py-6"><div className="h-6 w-24 bg-slate-100 rounded-lg"></div></td>
                    <td className="px-8 py-6"><div className="h-6 w-32 bg-slate-100 rounded-lg"></div></td>
                    <td className="px-8 py-6 ml-auto"><div className="h-10 w-24 bg-slate-100 rounded-xl ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <Search size={40} />
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-900">No users found</p>
                        <p className="text-slate-500 font-medium text-sm">Try using different search keywords or filters.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((usr) => (
                  <tr key={usr._id} className="group hover:bg-slate-50/80 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg bg-gradient-to-br ${getGradient(usr.email)}`}>
                          {getInitials(usr.firstName, usr.lastName)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase tracking-tight">{usr.firstName} {usr.lastName}</p>
                          <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-slate-400" />
                        <p className="text-sm font-medium text-slate-600 truncate">{usr.email}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-2 ${usr.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600'}`}>
                          {usr.role === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                          {usr.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(usr.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="relative group/select inline-block">
                          <select
                            value={usr.role}
                            onChange={(e) => handleRoleChange(usr._id, e.target.value)}
                            className="bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold rounded-xl focus:ring-2 ring-blue-500/10 outline-none p-2.5 transition-all cursor-pointer appearance-none pr-8"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          <MoreVertical size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                        </div>
                        <button
                          onClick={() => handleDeleteUser(usr._id)}
                          className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                          title="Remove User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Stats */}
      {!isLoading && usersList.length > 0 && (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6 text-center">
          <p className="text-sm text-slate-600 font-medium">
            Showing <span className="font-black text-slate-900">{filteredUsers.length}</span> of <span className="font-black text-slate-900">{usersList.length}</span> users
          </p>
        </div>
      )}
    </div>
  );
};

export default Users;
