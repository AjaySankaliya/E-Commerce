import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingAddress = () => {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  
  // Get initial values from user or localStorage
  const savedAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};
  
  const [address, setAddress] = useState(savedAddress.address || user?.address || "");
  const [city, setCity] = useState(savedAddress.city || user?.city || "");
  const [postalCode, setPostalCode] = useState(savedAddress.postalCode || user?.zipCode || "");

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem('shippingAddress', JSON.stringify({ address, city, postalCode }));
    navigate('/payment-method');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 font-sans">
      <div className="max-w-3xl mx-auto px-4">
        <CheckoutSteps step1 step2 />
        
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Shipping Address</h2>
            <p className="text-slate-500 text-sm">Where should we send your order?</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Full Address</label>
              <textarea 
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all outline-none"
                rows="3"
                placeholder="Enter complete shipping address..."
              ></textarea>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">City</label>
                <input 
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all outline-none"
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Postal Code</label>
                <input 
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all outline-none"
                  placeholder="ZIP or Postal Code"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 mt-8"
            >
              Continue to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddress;
