import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, LogOut, Heart, Menu, X, User, LayoutDashboard, Home, Package } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.product);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [navigate]);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, {
        headers: { Authorization: `${accessToken}` },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setUser(null));
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        toast.success("Logged out successfully");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="fixed w-full z-[100] border-b bg-white/70 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4 sm:px-8">

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform duration-300">
            <ShoppingCart className="text-white h-5 w-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Nexal<span className="text-blue-600">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-bold text-slate-500 uppercase tracking-widest">
          <Link to="/" className="hover:text-blue-600 transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/products" className="hover:text-blue-600 transition-colors relative group">
            Products
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
          {user && (
            <Link to={`/updateProfile/${user._id}`} className="hover:text-blue-600 transition-colors relative group">
              My Account
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
          )}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            {user && (
              <>
                <Link
                  to="/wishlist"
                  className="p-2.5 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Heart size={22} />
                </Link>

                <Link
                  to="/cart"
                  className="relative p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-blue-600 text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user ? (
              <div className="hidden md:flex items-center gap-4 border-l pl-6 border-slate-200">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Welcome back,</span>
                  <span className="text-xs font-black text-slate-900">{user.firstName}</span>
                </div>
                <button
                  onClick={logoutHandler}
                  className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-bold shadow-lg shadow-blue-100">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}></div>

      {/* Mobile Drawer Menu */}
      <div className={`fixed top-0 left-0 h-screen w-[280px] bg-white z-[100] border-r shadow-2xl transition-transform duration-500 md:hidden flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ShoppingCart className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-black text-slate-900">Nexal.</span>
          </div>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-lg bg-slate-50 text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2 mb-2">Main Navigation</p>
            <Link to="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all font-bold">
              <Home size={18} /> Home
            </Link>
            <Link to="/products" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all font-bold">
              <Package size={18} /> Products
            </Link>
          </div>

          {user && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2 mb-2">My Profile</p>
              <Link to={`/updateProfile/${user._id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all font-bold">
                <User size={18} /> Account Settings
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-blue-600 transition-all font-bold">
                  <LayoutDashboard size={18} /> Admin Dashboard
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t mt-auto space-y-4">
          {user ? (
            <Button
              onClick={logoutHandler}
              className="w-full h-12 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl shadow-none flex gap-2"
            >
              <LogOut size={18} /> Log out
            </Button>
          ) : (
            <Link to="/login" className="w-full">
              <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

