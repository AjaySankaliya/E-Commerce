import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  CheckCircle2,
  Clock,
  Download,
  Eye,
  IndianRupee,
  Package,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import StatusButtonGroup from "../../components/admin/StatusButtonGroup";
import { downloadOrderInvoice } from "../../utils/orderInvoice";

const Orders = () => {
  const navigate = useNavigate();
  const [ordersList, setOrdersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const fetchOrders = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/orders`, {
        headers: { Authorization: token },
        withCredentials: true,
      });

      if (res.data.success) {
        setOrdersList(res.data.orders);
      }
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = window.setInterval(fetchOrders, 30000);

    return () => window.clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const selectedOrder = ordersList.find((order) => order._id === orderId);

    if (!selectedOrder || selectedOrder.status === newStatus || updatingOrderId === orderId) {
      return;
    }

    setUpdatingOrderId(orderId);
    const toastId = toast.loading("Updating status...");

    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/orders/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: token },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Order status updated", { id: toastId });
        setOrdersList((currentOrders) =>
          currentOrders.map((order) => (order._id === orderId ? res.data.order : order))
        );
      }
    } catch (error) {
      toast.error("Failed to update status", { id: toastId });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDownloadInvoice = (order) => {
    try {
      downloadOrderInvoice(order);
      toast.success("Invoice downloaded");
    } catch (error) {
      toast.error("Failed to download invoice");
    }
  };

  const normalizedQuery = searchQuery.toLowerCase();
  const filteredOrders = ordersList.filter((order) => {
    const matchesSearch =
      (order.paymentId || order._id || "").toLowerCase().includes(normalizedQuery) ||
      `${order.userId?.firstName || ""} ${order.userId?.lastName || ""}`
        .toLowerCase()
        .includes(normalizedQuery) ||
      (order.userId?.email || "").toLowerCase().includes(normalizedQuery);

    const matchesFilter = filterStatus === "All" || order.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusStyles = (status) => {
    switch (status) {
      case "Processing":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Shipped":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "Delivered":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Cancelled":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Clock size={14} />;
      case "Shipped":
        return <Truck size={14} />;
      case "Delivered":
        return <CheckCircle2 size={14} />;
      case "Cancelled":
        return <XCircle size={14} />;
      default:
        return <Package size={14} />;
    }
  };

  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + (order.status === "Delivered" ? order.totalAmount : 0),
    0
  );
  const processingCount = filteredOrders.filter((order) => order.status === "Processing").length;
  const deliveredCount = filteredOrders.filter((order) => order.status === "Delivered").length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Order Management
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Track, update and manage customer fulfillment.{" "}
            <span className="text-blue-600 font-bold">{ordersList.length} total orders</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Total Revenue
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-1">
                <IndianRupee size={20} /> {(totalRevenue || 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
              <IndianRupee size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Processing
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">{processingCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <Clock size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Delivered
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">{deliveredCount}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search orders by ID, name or email..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                filterStatus === status
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-lg hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th className="px-8 py-6">Order ID</th>
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                [1, 2, 3, 4, 5].map((item) => (
                  <tr key={item} className="animate-pulse">
                    <td className="px-8 py-6">
                      <div className="h-6 w-32 bg-slate-100 rounded-lg"></div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="h-12 w-48 bg-slate-100 rounded-xl"></div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="h-6 w-20 bg-slate-100 rounded-lg"></div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="h-6 w-24 bg-slate-100 rounded-lg"></div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="h-24 w-56 bg-slate-100 rounded-2xl"></div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="h-10 w-24 bg-slate-100 rounded-xl ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                        <ShoppingBag size={48} />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-900 tracking-tight">
                          No matching orders found
                        </p>
                        <p className="text-slate-500 font-medium text-base">
                          We couldn&apos;t find any orders matching your criteria.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="group hover:bg-slate-50/80 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                          <Package size={18} />
                        </div>
                        <div>
                          <p className="font-mono text-xs font-black text-slate-900">
                            #{(order.paymentId || order._id).slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-sm">
                          {order.userId?.firstName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase tracking-tight text-sm">
                            {order.userId?.firstName} {order.userId?.lastName}
                          </p>
                          <p className="text-[11px] font-bold text-slate-400">{order.userId?.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <span className="text-lg font-black text-slate-900 tracking-tighter flex items-center gap-1">
                        <IndianRupee size={16} /> {order.totalAmount.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="px-8 py-6">
                      <div className="min-w-[240px] space-y-3">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-[0.05em] uppercase border ${getStatusStyles(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                        <StatusButtonGroup
                          value={order.status}
                          onChange={(status) => handleStatusChange(order._id, status)}
                          disabled={updatingOrderId === order._id}
                          compact
                          showIcons={false}
                          className="min-w-[180px]"
                        />
                      </div>
                    </td>

                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewOrder(order._id)}
                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(order)}
                          className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-90"
                          title="Download Invoice"
                        >
                          <Download size={18} />
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

      <div className="md:hidden space-y-4">
        {isLoading ? (
          [1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="bg-white border border-slate-100 rounded-2xl p-4 animate-pulse">
              <div className="h-12 bg-slate-100 rounded-lg mb-3"></div>
              <div className="h-8 bg-slate-100 rounded-lg mb-2"></div>
              <div className="h-8 bg-slate-100 rounded-lg"></div>
            </div>
          ))
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white border border-slate-100 rounded-2xl">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-3">
              <ShoppingBag size={40} />
            </div>
            <p className="text-lg font-black text-slate-900 tracking-tight">No matching orders</p>
            <p className="text-slate-500 font-medium text-sm">
              We couldn&apos;t find any orders matching your criteria.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Order</p>
                  <p className="text-sm font-black text-slate-900">
                    #{(order.paymentId || order._id).slice(-8).toUpperCase()}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase whitespace-nowrap border ${getStatusStyles(order.status)}`}
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Customer</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {order.userId?.firstName?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-slate-900 truncate">
                      {order.userId?.firstName} {order.userId?.lastName}
                    </p>
                    <p className="text-xs text-slate-400 font-medium truncate">{order.userId?.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">
                    Amount
                  </p>
                  <p className="text-lg font-black text-slate-900 flex items-center gap-1">
                    <IndianRupee size={14} /> {order.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">
                    Date
                  </p>
                  <p className="text-sm font-bold text-slate-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-4">
                <StatusButtonGroup
                  value={order.status}
                  onChange={(status) => handleStatusChange(order._id, status)}
                  disabled={updatingOrderId === order._id}
                  compact
                  showIcons={false}
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewOrder(order._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all active:scale-95"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => handleDownloadInvoice(order)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-all active:scale-95"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!isLoading && ordersList.length > 0 && (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6 text-center">
          <p className="text-sm text-slate-600 font-medium">
            Showing <span className="font-black text-slate-900">{filteredOrders.length}</span> of{" "}
            <span className="font-black text-slate-900">{ordersList.length}</span> orders
          </p>
        </div>
      )}
    </div>
  );
};

export default Orders;
