import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCart, clearCartState } from "@/redux/productSlice";
import { toast } from "sonner";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((store) => store.product);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // ── Auth config — reads token fresh each call ────────────────────────────
  const getAuthConfig = () => ({
    withCredentials: true,
    headers: { Authorization: `${localStorage.getItem("accessToken")}` },
  });

  // ── Fetch cart on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/cart/get-cart",
          getAuthConfig()   // ✅ direct — NOT { authConfig }
        );
        if (res.data.success) dispatch(setCart(res.data.cart));
      } catch {
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [dispatch]);

  // ── Quantity update ─────────────────────────────────────────────────────
  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1) {
    return handleRemove(productId);
    }
    setUpdatingId(productId);
    try {
      const res = await axios.put(
        "http://localhost:3001/cart/update-cart",
        { productId, quantity: newQty },
        getAuthConfig()   // ✅ correct
      );
      if (res.data.success) dispatch(setCart(res.data.cart));
    } catch {
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Remove item ─────────────────────────────────────────────────────────
  const handleRemove = async (productId) => {
    setUpdatingId(productId);
    try {
      const res = await axios.delete(
        `http://localhost:3001/cart/remove-item/${productId}`,
        getAuthConfig()   // ✅ correct
      );
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Item removed");
      }
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Clear cart ──────────────────────────────────────────────────────────
  const handleClearCart = async () => {
    try {
      const res = await axios.delete(
        "http://localhost:3001/cart/clear-cart",
        getAuthConfig()   // ✅ direct — NOT { authConfig }
      );
      if (res.data.success) {
        dispatch(clearCartState());
        toast.success("Cart cleared");
      }
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  // ── Derived values ──────────────────────────────────────────────────────
  const items = cart?.items || [];
  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const discount = subtotal > 4999 ? Math.round(subtotal * 0.05) : 0;
  const grandTotal = subtotal + shipping - discount;

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="pt-28 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading your cart…</p>
        </div>
      </div>
    );
  }

  // ── Empty cart ──────────────────────────────────────────────────────────
  if (!cart || items.length === 0) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200 flex flex-col items-center gap-4 max-w-sm w-full mx-4">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
            <ShoppingBag className="text-blue-500" size={36} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Your cart is empty</h2>
          <p className="text-slate-500 text-sm text-center">
            Looks like you haven't added anything yet. Browse our products and start shopping!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ── Cart with items ─────────────────────────────────────────────────────
  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Shopping Cart
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {items.length} {items.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <button
            onClick={handleClearCart}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Items List ───────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-4">
            {items.map((item) => {
              const product = item.productId;
              const image = product?.productImg?.[0]?.url;
              const isUpdating = updatingId === product?._id;

              return (
                <div
                  key={item._id}
                  className={`bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 shadow-sm transition-opacity ${
                    isUpdating ? "opacity-60 pointer-events-none" : ""
                  }`}
                >
                  {/* Product image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    {image ? (
                      <img
                        src={image}
                        alt={product?.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
                        No img
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                          {product?.brand}
                        </p>
                        <h3 className="font-bold text-slate-800 text-sm leading-snug mt-0.5 line-clamp-2">
                          {product?.productName}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{product?.category}</p>
                      </div>

                      <button
                        onClick={() => handleRemove(product?._id)}
                        className="text-slate-300 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity control */}
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(product?._id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-slate-800 border-x border-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(product?._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="text-right">
                        <p className="text-xs text-slate-400">
                          ₹{Number(item.price).toLocaleString("en-IN")} × {item.quantity}
                        </p>
                        <p className="font-extrabold text-slate-900 text-base">
                          ₹{Number(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Back link */}
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm mt-2 transition-colors"
            >
              <ArrowLeft size={15} />
              Continue Shopping
            </Link>
          </div>

          {/* ── Order Summary ─────────────────────────────────────────── */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-28">
              <h2 className="font-extrabold text-slate-900 text-lg mb-5 pb-4 border-b border-slate-100">
                Order Summary
              </h2>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-slate-800">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-slate-800"}`}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag size={13} /> Discount (5%)
                    </span>
                    <span className="font-semibold">−₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {shipping > 0 && subtotal <= 999 && (
                  <p className="text-xs bg-blue-50 text-blue-600 rounded-lg px-3 py-2">
                    Add ₹{(1000 - subtotal).toLocaleString("en-IN")} more for free shipping!
                  </p>
                )}

                {subtotal < 5000 && (
                  <p className="text-xs bg-amber-50 text-amber-700 rounded-lg px-3 py-2">
                    Spend ₹{(5000 - subtotal).toLocaleString("en-IN")} more to get 5% off!
                  </p>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-900">Grand Total</span>
                <span className="text-xl font-extrabold text-blue-600">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <button className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm tracking-wide">
                Proceed to Checkout
              </button>

              <p className="text-xs text-slate-400 text-center mt-3">
                🔒 Secure checkout — SSL encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;