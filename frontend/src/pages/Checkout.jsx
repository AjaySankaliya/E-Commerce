import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { ShieldCheck, CreditCard, CheckCircle, MapPin, Banknote } from 'lucide-react';
import CheckoutSteps from '../components/CheckoutSteps';
import FakeRazorpayModal from '../components/FakeRazorpayModal';

const Checkout = () => {
  const { cart } = useSelector((store) => store.product);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const savedAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};
  const paymentMethod = localStorage.getItem('paymentMethod') || 'Online';
  const fullAddressStr = `${savedAddress.address || ''}, ${savedAddress.city || ''}, ${savedAddress.postalCode || ''}`;
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const items = cart?.items || [];
  const totalAmount = cart?.totalPrice || 0;

  const handlePayment = async () => {
    if (!savedAddress.address) return toast.error("Please provide a shipping address first");
    
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login first to proceed.");
        setLoading(false);
        return navigate("/login");
      }
      
      if (paymentMethod === "COD") {
        // Handle COD directly
        const verifyRes = await axios.post("http://localhost:3001/payment/verify", {
          paymentId: "COD",
          items: items.map(p => ({ productId: p.productId._id, quantity: p.quantity, price: p.price })),
          totalAmount,
          shippingAddress: fullAddressStr,
          paymentMethod: "COD"
        }, {
          headers: { Authorization: token },
          withCredentials: true
        });

        if (verifyRes.data.success) {
          setSuccess(true);
          dispatch({ type: 'product/setCart', payload: { items: [], totalPrice: 0 } });
          toast.success("Order placed successfully with Cash on Delivery!");
        } else {
          throw new Error("Order creation failed");
        }
      } else {
        // 1. Create Mock Razorpay Order
        const orderRes = await axios.post("http://localhost:3001/payment/checkout", { amount: totalAmount }, {
          headers: { Authorization: token },
          withCredentials: true
        });

        // Open the fake razorpay modal instead of automatically verifying
        setCreatedOrder(orderRes.data.order);
        setIsModalOpen(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error?.response?.data?.message || "Payment init failed. Please try again.");
      setLoading(false);
    }
  };

  const handleFakeRazorpaySuccess = async (mockPaymentId) => {
    setIsModalOpen(false);
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const verifyRes = await axios.post("http://localhost:3001/payment/verify", {
        paymentId: mockPaymentId,
        items: items.map(p => ({ productId: p.productId._id, quantity: p.quantity, price: p.price })),
        totalAmount,
        shippingAddress: fullAddressStr,
        paymentMethod: "Online"
      }, {
        headers: { Authorization: token },
        withCredentials: true
      });

      if (verifyRes.data.success) {
        setSuccess(true);
        dispatch({ type: 'product/setCart', payload: { items: [], totalPrice: 0 } }); // clear cart in redux
        toast.success("Payment successful!");
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verify error:", error);
      toast.error(error?.response?.data?.message || "Payment verification failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-20 flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center">
          <CheckCircle className="text-green-500 w-24 h-24 mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Payment Successful!</h2>
          <p className="text-slate-500 font-medium mb-8">Thank you for your purchase. Your order is being processed.</p>
          <button onClick={() => navigate('/products')} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        <CheckoutSteps step1 step2 step3 step4 />
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-10">
          
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Place Order</h2>
              <p className="text-slate-500 text-sm">Please review your order details below</p>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex gap-4">
                <MapPin className="text-blue-600 shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Shipping Address</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{fullAddressStr}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex gap-4">
                {paymentMethod === 'COD' ? <Banknote className="text-blue-600 shrink-0" size={24} /> : <CreditCard className="text-blue-600 shrink-0" size={24} />}
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Payment Method</h3>
                  <p className="text-slate-600 text-sm">{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment (Razorpay Mock)'}</p>
                </div>
              </div>
            </div>
            
            {paymentMethod === 'Online' && (
              <div className="p-4 bg-blue-50 text-blue-800 rounded-2xl flex gap-3 text-sm font-medium border border-blue-100">
                <ShieldCheck size={20} className="shrink-0 text-blue-600" />
                <p>This is a mock Razorpay integration. Clicking Pay will simulate a successful online payment.</p>
              </div>
            )}
            
            {paymentMethod === 'COD' && (
              <div className="p-4 bg-amber-50 text-amber-800 rounded-2xl flex gap-3 text-sm font-medium border border-amber-100">
                <ShieldCheck size={20} className="shrink-0 text-amber-600" />
                <p>You will pay {totalAmount} INR in cash when the order is delivered.</p>
              </div>
            )}
          </div>

          <div className="w-full md:w-80 bg-slate-50 p-6 rounded-3xl border border-slate-200 h-fit">
            <h3 className="font-bold text-slate-900 mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Total Items</span>
                <span className="font-bold text-slate-900">{items.reduce((acc, item) => acc + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-bold text-green-600">Free</span>
              </div>
              <div className="h-px bg-slate-200 w-full my-4"></div>
              <div className="flex justify-between text-lg">
                <span className="font-extrabold text-slate-900">Total</span>
                <span className="font-extrabold text-blue-600">₹{totalAmount}</span>
              </div>
            </div>

            <button 
              onClick={handlePayment} 
              disabled={loading || totalAmount === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {paymentMethod === 'COD' ? <Banknote size={18} /> : <CreditCard size={18} />}
                  {paymentMethod === 'COD' ? `Place Order` : `Pay ₹${totalAmount}`}
                </>
              )}
            </button>
          </div>
          
        </div>
      </div>

      <FakeRazorpayModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        amount={totalAmount} 
        onSuccess={handleFakeRazorpaySuccess} 
      />
    </div>
  );
};

export default Checkout;
