import FilterSideBar from "@/components/FilterSideBar";
import ProductCard from "@/components/ProductCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LayoutGrid, ListFilter } from "lucide-react";

const Products = () => {
  const [allProduct, setAllProduct] = useState([]);

  useEffect(() => {
    const getAllProduct = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/product/get-products",
        );
        if (res.data.success) {
          setAllProduct(res.data.products);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch products");
      }
    };
    getAllProduct();
  }, []);

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-28 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <ListFilter size={18} className="text-blue-600" />
              <h2 className="font-bold text-slate-900 uppercase tracking-wider text-sm">
                Filters
              </h2>
            </div>
            <FilterSideBar />
          </div>
        </aside>

        {/* Main Section */}
        <div className="flex flex-col flex-1">
          {/* Header & Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-extrabold text-slate-900">
                Electronics{" "}
                <span className="text-slate-400 font-medium text-sm">
                  ({allProduct.length})
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden lg:inline text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Sort By
              </span>
              <Select defaultValue="featured">
                <SelectTrigger className="w-52 bg-slate-50 border-slate-200 rounded-xl py-5 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition font-semibold text-slate-700">
                  <SelectValue placeholder="Sort Products" />
                </SelectTrigger>

                <SelectContent className="bg-white border-slate-200 rounded-xl shadow-2xl">

                  {/* Meaningful Price Labels */}
                  <SelectGroup>
                    <div className="h-px bg-slate-100 my-1" />{" "}
                    {/* Visual Divider */}
                    <SelectLabel className="text-[10px] font-bold text-slate-400 uppercase p-3 tracking-widest">
                      Price Range
                    </SelectLabel>
                    <SelectItem
                      value="low-high"
                      className="py-2.5 cursor-pointer"
                    >
                      Price: Low to High
                    </SelectItem>
                    <SelectItem
                      value="high-low"
                      className="py-2.5 cursor-pointer"
                    >
                      Price: High to Low
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid: 4 columns on large screens for a high-end feel */}
          {allProduct.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allProduct.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <LayoutGrid className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
