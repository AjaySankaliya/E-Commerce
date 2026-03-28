import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, Heart, ArrowLeft, ShieldCheck, Truck, RefreshCcw, Loader2, Star, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "@/redux/productSlice";
import Navbar from "@/components/Navbar";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  const { cart } = useSelector((store) => store.product);
  const { wishlists } = useSelector((store) => store.wishlist);
  const isWishlisted = wishlists && wishlists.some((item) => (item._id || item) === id);

  // Check if item is in cart and get its quantity
  const cartItem = cart?.items?.find((item) => (item.productId._id || item.productId) === id);
  const quantity = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/product/get-product/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (error) {
        toast.error("Failed to load product details");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/add-to-cart`,
        { productId: id },
        {
          headers: { Authorization: `${token}` },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Added to cart");
      }
    } catch (error) {
      toast.error("Please login to add to cart");
    } finally {
      setActionLoading(false);
    }
  };

  const updateQuantity = async (newQty) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      
      if (newQty < 1) {
        const res = await axios.delete(
          `${import.meta.env.VITE_API_URL}/cart/remove-item/${id}`,
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
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/cart/update-cart`,
          { productId: id, quantity: newQty },
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
      setActionLoading(false);
    }
  };

  const handleWishlist = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (isWishlisted) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/wishlist/${id}`, {
          headers: { Authorization: token },
          withCredentials: true,
        });
        dispatch({ type: "Wishlist/removeFromWishlistState", payload: id });
        toast.info("Removed from wishlist");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/wishlist/${id}`, {}, {
          headers: { Authorization: token },
          withCredentials: true,
        });
        dispatch({ type: "Wishlist/addToWishlistState", payload: product });
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Please login first");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-3xl p-8 border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm group">
              <img 
                src={product.productImg[0]?.url} 
                alt={product.productName}
                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {product.productImg.map((img, idx) => (
                <div key={idx} className="aspect-square bg-white rounded-xl border border-blue-200 p-2 overflow-hidden cursor-pointer shadow-sm">
                  <img src={img.url} alt="" className="w-full h-full object-contain opacity-50 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-8 bg-white p-8 lg:p-10 rounded-3xl border border-slate-200 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">{product.category}</span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-bold text-slate-900 mt-1">4.8</span>
                  <span className="text-xs text-slate-400 mt-1 font-medium">(120 reviews)</span>
                </div>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                {product.productName}
              </h1>
              <p className="text-blue-600 font-bold text-lg">{product.brand}</p>
            </div>

            <div className="flex items-baseline gap-4 border-y border-slate-100 py-6">
              <span className="text-3xl font-extrabold text-slate-900">₹{product.productPrice.toLocaleString()}</span>
              <span className="text-lg text-slate-400 line-through">₹{(product.productPrice * 1.25).toLocaleString()}</span>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded uppercase">25% OFF</span>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900">Description</h3>
              <p className="text-slate-500 leading-relaxed text-base">
                {product.productDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Truck size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Free Delivery</p>
                  <p className="text-[10px] text-slate-500">Orders over ₹5,000</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <RefreshCcw size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">7 Days Return</p>
                  <p className="text-[10px] text-slate-500">Hassle free policy</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">2 Year Warranty</p>
                  <p className="text-[10px] text-slate-500">Genuine products</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {quantity > 0 ? (
                <div className="flex-1 flex items-center bg-blue-50 rounded-2xl p-2 justify-between px-6 border border-blue-100">
                  <button 
                    onClick={() => updateQuantity(quantity - 1)}
                    disabled={actionLoading}
                    className="p-3 bg-white text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    <Minus size={24} />
                  </button>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-blue-700">{quantity}</span>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">In Cart</span>
                  </div>
                  <button 
                    onClick={() => updateQuantity(quantity + 1)}
                    disabled={actionLoading}
                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              ) : (
                <Button 
                  onClick={handleAddToCart}
                  disabled={actionLoading}
                  className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-200 transition-all text-lg font-bold"
                >
                  {actionLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> Working...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShoppingCart size={20} /> Add to Cart
                    </span>
                  )}
                </Button>
              )}
              
              <Button 
                variant="outline"
                onClick={handleWishlist}
                className={`h-14 px-8 rounded-2xl border-slate-200 transition-all ${isWishlisted ? 'bg-red-50 border-red-100 text-red-500 hover:bg-red-100' : 'hover:bg-slate-50 hover:text-red-500'}`}
              >
                <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

