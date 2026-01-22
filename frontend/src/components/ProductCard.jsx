import React from "react";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  const { productName, productImg, productPrice } = product;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col h-full">
      
      {/* Image Container */}
      <div className="relative h-56 bg-slate-100 flex items-center justify-center p-4">
        <img
          src={productImg[0]?.url}
          alt={productName}
          className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            New
          </span>
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="p-3 bg-white rounded-full text-slate-900 hover:bg-blue-600 hover:text-white transition-colors shadow-lg">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-slate-900 font-bold text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {productName}
        </h3>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 line-through">
              {(productPrice * 1.2).toFixed(2)}
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              {productPrice}
            </span>
          </div>

          <button className="text-xs font-bold text-blue-600 hover:underline">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
