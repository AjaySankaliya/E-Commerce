import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { CreditCard, Banknote } from 'lucide-react';

const PaymentMethod = () => {
  const navigate = useNavigate();
  
  // Ensure we have a shipping address
  useEffect(() => {
    if (!localStorage.getItem('shippingAddress')) {
      navigate('/shipping');
    }
  }, [navigate]);

  const savedPaymentMethod = localStorage.getItem('paymentMethod') || 'Online';
  const [paymentMethod, setPaymentMethod] = useState(savedPaymentMethod);

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem('paymentMethod', paymentMethod);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 font-sans">
      <div className="max-w-3xl mx-auto px-4">
        <CheckoutSteps step1 step2 step3 />
        
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Payment Method</h2>
            <p className="text-slate-500 text-sm">Select how you want to pay for your order</p>
          </div>

          <form onSubmit={submitHandler}>
            <div className="space-y-4">
              <label 
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'Online' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex h-5 items-center">
                  <input
                    type="radio"
                    className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-600"
                    id="Online"
                    value="Online"
                    checked={paymentMethod === 'Online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${paymentMethod === 'Online' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900">Online Payment / UPI / Card</span>
                    <span className="block text-sm text-slate-500 mt-0.5">Pay securely via Razorpay</span>
                  </div>
                </div>
              </label>

              <label 
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex h-5 items-center">
                  <input
                    type="radio"
                    className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-600"
                    id="COD"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${paymentMethod === 'COD' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Banknote size={20} />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900">Cash on Delivery (COD)</span>
                    <span className="block text-sm text-slate-500 mt-0.5">Pay when you receive the order</span>
                  </div>
                </div>
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 mt-8"
            >
              Continue to Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
