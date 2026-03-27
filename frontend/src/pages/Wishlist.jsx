import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import { HeartCrack } from 'lucide-react';
import axios from 'axios';
import { setWishlist } from '@/redux/wishlistSlice';
import { toast } from 'sonner';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlists } = useSelector((store) => store.wishlist);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:3001/wishlist", {
          headers: { Authorization: token },
          withCredentials: true
        });
        if (res.data.success) {
          dispatch(setWishlist(res.data.wishlist.products || []));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchWishlist();
  }, [dispatch]);

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            My Wishlist <span className="bg-blue-100 text-blue-700 text-sm py-1 px-3 rounded-full">{wishlists ? wishlists.length : 0} items</span>
          </h1>
        </div>

        {wishlists && wishlists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlists.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
           <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-300">
             <HeartCrack className="text-slate-300 mb-6" size={64} />
             <h2 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
             <p className="text-slate-500 font-medium max-w-sm text-center">
               Looks like you haven't added any items to your wishlist yet.
             </p>
           </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
