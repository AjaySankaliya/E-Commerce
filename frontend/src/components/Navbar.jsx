import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";

const Navbar = () => {
  const {user} = useSelector((state)=>state.user);
  const navigate=useNavigate();
  const accessToken=localStorage.getItem('accessToken')
  const dispatch=useDispatch();

  const logoutHandler=async()=>{
    try {
       const res=await axios.post("http://localhost:3001/auth/logout",{},{
        headers:{
          Authorization:`${accessToken}`
        },
        withCredentials:true
       })
       if(res.data.success)
       {
        dispatch(setUser(null));
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        toast.success(res.data.message)
       }
    } catch (error) {
      console.log(error.response.data.message); 
      toast.error("Logout failed");
    }
  }

  return (
    <header className="fixed w-full z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4 sm:px-6">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <ShoppingCart className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-slate-900">
            Nexal<span className="text-blue-600">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/products" className="hover:text-blue-600 transition">
            Products
          </Link>
          {user && (
            <><Link to={`/updateProfile/${user._id}`} className="hover:text-blue-600 transition">
              My Account
            </Link><p>Hello {user.firstName}</p></>
          )}
          
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-5">
          <button className="text-slate-600 hover:text-blue-600 hidden sm:block">
            <Search size={22} />
          </button>

          <Link
            to="/cart"
            className="relative text-slate-700 hover:text-blue-600 transition"
          >
            <ShoppingCart size={24} />

            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
              0
            </span>
          </Link>

          {user ? (
            <Button onClick={logoutHandler}>
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Button onClick={()=>navigate('/login')} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
