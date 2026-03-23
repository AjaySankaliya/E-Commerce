import { Link } from "react-router-dom";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube, 
  FaLinkedinIn 
} from "react-icons/fa";
import { ShoppingCart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <ShoppingCart className="text-white h-5 w-5" />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-white">
                Nexal<span className="text-blue-600">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Leading the way in premium electronics. From high-performance computing to smart home integration, we provide the tech that powers your future.
            </p>
            <div className="flex gap-4">
              {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaLinkedinIn].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Shop Categories</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/products" className="hover:text-blue-500 transition">Laptops & Computers</Link></li>
              <li><Link to="/products" className="hover:text-blue-500 transition">Smartphones & Tablets</Link></li>
              <li><Link to="/products" className="hover:text-blue-500 transition">Audio & Headphones</Link></li>
              <li><Link to="/products" className="hover:text-blue-500 transition">Smart Home Tech</Link></li>
              <li><Link to="/products" className="hover:text-blue-500 transition">Wearable Gadgets</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Support</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-blue-600" />
                <span>123 Tech Avenue, Silicon Valley, CA</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-600" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-600" />
                <span>support@nexal.com</span>
              </li>
              <li><Link to="/faq" className="hover:text-blue-500 transition">Track Your Order</Link></li>
              <li><Link to="/returns" className="hover:text-blue-500 transition">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Join the Tech Club</h3>
            <p className="text-sm text-slate-400 mb-4">
              Get early access to drops and exclusive tech news.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-blue-600 transition"
                />
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-center items-center gap-6">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Nexal Electronics Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;