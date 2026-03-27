import React, { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "@/redux/productSlice";   // ← your existing slice
import { toast } from "sonner";

const ProductCard = ({ product }) => {
  const { productName, productImg, productPrice, _id } = product;
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  const { wishlists } = useSelector(store => store.wishlist);
  const isWishlisted = wishlists && wishlists.some(item => (item._id || item) === _id);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (isWishlisted) {
        await axios.delete(`http://localhost:3001/wishlist/${_id}`, {
          headers: { Authorization: token },
          withCredentials: true
        });
        dispatch({ type: "Wishlist/removeFromWishlistState", payload: _id });
        toast.info("Removed from wishlist");
      } else {
        await axios.post(`http://localhost:3001/wishlist/${_id}`, {}, {
          headers: { Authorization: token },
          withCredentials: true
        });
        dispatch({ type: "Wishlist/addToWishlistState", payload: product });
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Please login first");
    }
  };

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

        {/* Badge and Wishlist Heart */}
        <div className="absolute top-3 w-full px-3 flex justify-between items-start">
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
            New
          </span>
          <button 
            onClick={handleWishlist}
            className={`p-2 rounded-full transition-colors shadow-md z-10 ${isWishlisted ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-white text-slate-400 hover:text-red-500 hover:bg-slate-50'}`}
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
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