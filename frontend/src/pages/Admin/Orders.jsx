import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const Orders = () => {
  const [ordersList, setOrdersList] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("http://localhost:3001/admin/orders", {
        headers: { Authorization: token },
        withCredentials: true
      });
      if (res.data.success) {
        setOrdersList(res.data.orders);
      }
    } catch (error) {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.put(`http://localhost:3001/admin/orders/${orderId}`, { status: newStatus }, {
        headers: { Authorization: token },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success("Order status updated");
        setOrdersList(ordersList.map(o => o._id === orderId ? res.data.order : o));
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Orders Management</h1>
          <p className="text-slate-500 font-medium text-lg">Manage and process customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-extrabold uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ordersList.map((order) => (
                <tr key={order._id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-5 font-mono text-xs">{order.paymentId || order._id}</td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-900">{order.userId?.firstName} {order.userId?.lastName}</p>
                    <p className="text-xs font-medium text-slate-500">{order.userId?.email}</p>
                  </td>
                  <td className="px-8 py-5 font-black text-slate-900">₹{order.totalAmount}</td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-xl text-[11px] font-bold tracking-wide uppercase
                      ${order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Shipped' ? 'bg-orange-100 text-orange-700' :
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            'bg-slate-100 text-slate-700'}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right w-48">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none transition-all cursor-pointer"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {ordersList.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-10 text-center text-slate-500 font-medium">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
