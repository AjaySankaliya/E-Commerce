import React, { useState } from "react";
import { ShoppingCart, Heart, Plus, Minus, Loader2 } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "@/redux/productSlice"; 
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { productName, productImg, productPrice, _id } = product;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const { cart } = useSelector((store) => store.product);
  const { wishlists } = useSelector((store) => store.wishlist);
  const isWishlisted = wishlists && wishlists.some((item) => (item._id || item) === _id);

  // Check if item is in cart and get its quantity
  const cartItem = cart?.items?.find((item) => (item.productId._id || item.productId) === _id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleWishlist = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("accessToken");
      if (isWishlisted) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/wishlist/${_id}`, {
          headers: { Authorization: token },
          withCredentials: true
        });
        dispatch({ type: "Wishlist/removeFromWishlistState", payload: _id });
        toast.info("Removed from wishlist");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/wishlist/${_id}`, {}, {
          headers: { Authorization: token },
          withCredentials: true
        });
        dispatch({ type: "Wishlist/addToWishlistState", payload: product });
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Please login first");
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/add-to-cart`,
        { productId: _id },
        {
          headers: { Authorization: `${token}` },
          withCredentials: true 
        }
      );
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Added to cart");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Please login first");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (e, newQty) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      
      if (newQty < 1) {
        // Remove item if quantity is < 1
        const res = await axios.delete(
          `${import.meta.env.VITE_API_URL}/cart/remove-item/${_id}`,
          {
            headers: { Authorization: token },
            withCredentials: true
          }
        );
        if (res.data.success) {
          dispatch(setCart(res.data.cart));
          toast.info("Removed from cart");
        }
      } else {
        // Update quantity
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/cart/update-cart`,
          { productId: _id, quantity: newQty },
          {
            headers: { Authorization: token },
            withCredentials: true
          }
        );
        if (res.data.success) {
          dispatch(setCart(res.data.cart));
        }
      }
    } catch (error) {
      toast.error("Failed to update cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onClick={() => navigate(`/product/${_id}`)}
      className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 flex flex-col h-full cursor-pointer"
    >
      
      {/* Image Container */}
      <div className="relative h-60 bg-slate-50 flex items-center justify-center p-6 border-b border-slate-50">
        <img
          src={productImg[0]?.url}
          alt={productName}
          className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge and Wishlist Heart */}
        <div className="absolute top-4 w-full px-4 flex justify-between items-start">
          <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm">
            TRENDING
          </span>
          <button 
            onClick={handleWishlist}
            className={`p-2 rounded-xl transition-all shadow-lg z-20 ${isWishlisted ? 'bg-red-50 text-red-500 hover:scale-110' : 'bg-white text-slate-300 hover:text-red-500 hover:scale-110'}`}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6 flex flex-col flex-1 bg-white">
        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{product.brand || 'Electronics'}</p>
        <h3 className="text-slate-900 font-extrabold text-sm mb-3 line-clamp-2 h-10 leading-tight">
          {productName}
        </h3>

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-900">
              ₹{productPrice.toLocaleString()}
            </span>
          </div>

          {quantity > 0 ? (
            <div className="flex items-center bg-blue-50 rounded-2xl p-1 gap-1">
              <button 
                onClick={(e) => updateQuantity(e, quantity - 1)}
                disabled={loading}
                className="p-2 bg-white text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90 disabled:opacity-50"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-bold text-blue-700">{quantity}</span>
              <button 
                onClick={(e) => updateQuantity(e, quantity + 1)}
                disabled={loading}
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm active:scale-90 disabled:opacity-50"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAddToCart}
              disabled={loading}
              className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 active:scale-95"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;