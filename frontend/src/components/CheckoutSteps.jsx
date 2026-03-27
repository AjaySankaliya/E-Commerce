import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="flex justify-center items-center mb-10 w-full">
      <div className="flex items-center text-sm font-medium">
        {step1 ? (
          <Link to="/cart" className="text-blue-600 hover:text-blue-800 transition-colors">Cart</Link>
        ) : (
          <span className="text-slate-400">Cart</span>
        )}
        
        <ChevronRight size={16} className="mx-2 text-slate-300" />
        
        {step2 ? (
          <Link to="/shipping" className="text-blue-600 hover:text-blue-800 transition-colors">Shipping</Link>
        ) : (
          <span className="text-slate-400">Shipping</span>
        )}

        <ChevronRight size={16} className="mx-2 text-slate-300" />
        
        {step3 ? (
          <Link to="/payment-method" className="text-blue-600 hover:text-blue-800 transition-colors">Payment</Link>
        ) : (
          <span className="text-slate-400">Payment</span>
        )}

        <ChevronRight size={16} className="mx-2 text-slate-300" />
        
        {step4 ? (
          <span className="text-slate-900 font-bold">Place Order</span>
        ) : (
          <span className="text-slate-400">Place Order</span>
        )}
      </div>
    </div>
  );
};

export default CheckoutSteps;
