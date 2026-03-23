import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/productSlice";   // ← your existing slice
import { toast } from "sonner";

const ProductCard = ({ product }) => {
  const { productName, productImg, productPrice, _id } = product;
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        "http://localhost:3001/cart/add-to-cart",
        { productId: _id },
        {
          headers: {
          Authorization: `${token}`,
          },
          withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success(`${productName} added to cart!`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

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

        {/* Hover Action — now functional */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="p-3 bg-white rounded-full text-slate-900 hover:bg-blue-600 hover:text-white transition-colors shadow-lg disabled:opacity-50"
          >
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
              ₹{(productPrice * 1.2).toFixed(2)}
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              ₹{productPrice}
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