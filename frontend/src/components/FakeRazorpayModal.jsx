import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, ChevronRight, Smartphone } from 'lucide-react';

const FakeRazorpayModal = ({ isOpen, onClose, amount, onSuccess }) => {
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setProcessing(true);
    // Simulate network request + bank processing time
    setTimeout(() => {
      setProcessing(false);
      const mockPaymentId = "pay_" + Math.random().toString(36).substring(2, 12);
      onSuccess(mockPaymentId);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#031b34] text-white p-5 relative">
          <button 
            onClick={onClose} 
            disabled={processing}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-bold text-[#031b34] text-xl">
              E
            </div>
            <div>
              <h3 className="font-semibold leading-tight">E-Commerce Store</h3>
              <p className="text-white/60 text-xs text-left">Test Merchant</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
            <span className="text-white/80 text-sm">Amount to Pay</span>
            <span className="text-2xl font-semibold">₹ {amount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 relative min-h-[300px] flex flex-col">
          {processing ? (
            <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center text-center px-6">
              <div className="w-12 h-12 border-4 border-[#3395ff] border-t-transparent rounded-full animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-1">Processing Payment...</h3>
              <p className="text-sm text-slate-500">Please do not refresh or close this window.</p>
            </div>
          ) : (
            <>
              <h4 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Cards, UPI & More</h4>
              
              <div className="space-y-2 mb-6">
                <button 
                  onClick={handlePay}
                  className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-[#3395ff] hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded text-slate-600 group-hover:text-[#3395ff] group-hover:bg-[#3395ff]/10">
                      <CreditCard size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-800">Card</p>
                      <p className="text-xs text-slate-500">Visa, MasterCard, RuPay & More</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
                </button>

                <button 
                  onClick={handlePay}
                  className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-[#3395ff] hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded text-slate-600 group-hover:text-[#3395ff] group-hover:bg-[#3395ff]/10">
                      <Smartphone size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-800">UPI</p>
                      <p className="text-xs text-slate-500">Google Pay, PhonePe, Paytm</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
                </button>
              </div>

              <div className="mt-auto flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
                <ShieldCheck size={14} />
                <span>Secured by Razorpay (Mock)</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FakeRazorpayModal;
