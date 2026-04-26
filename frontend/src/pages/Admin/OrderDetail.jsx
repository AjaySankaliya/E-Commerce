import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Mail,
  MapPin,
  Package,
  Phone,
  Printer,
} from "lucide-react";
import StatusButtonGroup from "../../components/admin/StatusButtonGroup";
import {
  downloadOrderInvoice,
  formatOrderCurrency,
  getCustomerPhone,
  getOrderDisplayId,
  getPaymentMethod,
  getPaymentStatusLabel,
  getShippingAddress,
  printOrderInvoice,
} from "../../utils/orderInvoice";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

  const fetchOrderDetail = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/orders`, {
        headers: { Authorization: token },
        withCredentials: true,
      });

      if (res.data.success) {
        const foundOrder = res.data.orders.find((item) => item._id === orderId);

        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          toast.error("Order not found");
          navigate("/admin/orders");
        }
      }
    } catch (error) {
      toast.error("Failed to load order details");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!order || order.status === newStatus || isStatusUpdating) {
      return;
    }

    setIsStatusUpdating(true);
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
        setOrder(res.data.order);
      }
    } catch (error) {
      toast.error("Failed to update status", { id: toastId });
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const handleDownloadInvoice = () => {
    try {
      downloadOrderInvoice(order);
      toast.success("Invoice downloaded");
    } catch (error) {
      toast.error("Failed to download invoice");
    }
  };

  const handlePrintOrder = () => {
    const didOpen = printOrderInvoice(order);

    if (!didOpen) {
      toast.error("Allow popups to print the invoice");
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-black text-slate-900">Order not found</p>
      </div>
    );
  }

  const paymentStatusLabel = getPaymentStatusLabel(order);
  const paymentStatusClass =
    paymentStatusLabel === "Paid" || paymentStatusLabel === "Paid on delivery"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-amber-50 text-amber-700";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/orders")}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order Details</h1>
          <p className="text-slate-500 font-medium">Order ID: {getOrderDisplayId(order)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900">Order Status</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                    Order Date
                  </p>
                  <p className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Calendar size={18} className="text-blue-600" />
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                    Order Time
                  </p>
                  <p className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Clock size={18} className="text-amber-600" />
                    {new Date(order.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">
                    Update Status
                  </label>
                  {isStatusUpdating && (
                    <span className="text-xs font-bold text-blue-600">Saving...</span>
                  )}
                </div>
                <StatusButtonGroup
                  value={order.status}
                  onChange={handleStatusChange}
                  disabled={isStatusUpdating}
                  className="max-w-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Customer Information</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                  {order.userId?.firstName?.charAt(0) || "C"}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-black text-slate-900">
                    {order.userId?.firstName} {order.userId?.lastName}
                  </p>
                  <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                    <Mail size={16} /> {order.userId?.email || "Not provided"}
                  </p>
                  <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                    <Phone size={16} /> {getCustomerPhone(order)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <MapPin className="text-emerald-600" size={24} />
              Shipping Address
            </h2>

            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-sm font-medium text-slate-600">{getShippingAddress(order)}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Order Items</h2>

            <div className="space-y-3">
              {order.items?.map((item, idx) => {
                const lineTotal = (item.price ?? item.productId?.productPrice ?? 0) * (item.quantity || 1);

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                        {item.productId?.productImg?.[0] ? (
                          <img
                            src={item.productId.productImg[0].url}
                            alt={item.productId?.productName || "Product"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Package size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-slate-900 uppercase tracking-tight text-sm">
                          {item.productId?.productName || "Product"}
                        </p>
                        <p className="text-xs text-slate-500 font-bold mt-1">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-slate-900">{formatOrderCurrency(lineTotal)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-600">Subtotal</p>
                <p className="font-black text-slate-900">{formatOrderCurrency(order.totalAmount)}</p>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-600">Shipping</p>
                <p className="font-black text-slate-900">Free</p>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-600">Tax</p>
                <p className="font-black text-slate-900">Included</p>
              </div>
              <div className="flex justify-between items-center pt-4 bg-blue-50 px-4 py-3 rounded-xl">
                <p className="text-sm font-black text-blue-900">Total Amount</p>
                <p className="text-2xl font-black text-blue-600">
                  {formatOrderCurrency(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6">Payment Information</h2>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                  Payment ID
                </p>
                <p className="font-mono text-sm font-black text-slate-900 break-all">
                  {order.paymentId || order._id}
                </p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                  Payment Method
                </p>
                <p className="text-sm font-bold text-slate-600">{getPaymentMethod(order)}</p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                  Payment Status
                </p>
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-black ${paymentStatusClass}`}
                >
                  {paymentStatusLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-[0.99]"
            >
              <Download size={18} />
              Download Invoice
            </button>
            <button
              type="button"
              onClick={handlePrintOrder}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-[0.99]"
            >
              <Printer size={18} />
              Print Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
