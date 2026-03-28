import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const Users = () => {
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
          headers: { Authorization: token },
          withCredentials: true
        });
        if(res.data.success) {
          setUsersList(res.data.users);
        }
      } catch (error) {
        toast.error("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Users Management</h1>
          <p className="text-slate-500 font-medium text-lg">View and manage all registered users.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-extrabold uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-8 py-5">Name</th>
                <th className="px-8 py-5">Email</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Joined At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {usersList.map((usr) => (
                <tr key={usr._id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-900">{usr.firstName} {usr.lastName}</td>
                  <td className="px-8 py-5 font-medium">{usr.email}</td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-xl text-[11px] font-bold tracking-wide uppercase ${usr.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                      {usr.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-medium text-slate-500">{new Date(usr.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {usersList.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-8 py-10 text-center text-slate-500 font-medium">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
