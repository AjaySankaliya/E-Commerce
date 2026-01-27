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
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "@/redux/productSlice";

const Products = () => {
  const [allProduct, setAllProduct] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sortOrder,setSortOrder]=useState('');

  const { products } = useSelector((store) => store.product);
  const dispatch = useDispatch();

  // 🔹 Fetch all products
  useEffect(() => {
    const getAllProduct = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/product/get-products"
        );

        if (res.data.success) {
          setAllProduct(res.data.products);
          dispatch(setProduct(res.data.products)); 
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch products");
      }
    };

    getAllProduct();
  }, [dispatch]);

 
  useEffect(() => {
    if (allProduct.length === 0) return;

    let filtered = [...allProduct];

    
    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (brand !== "All") {
      filtered = filtered.filter((p) => p.brand === brand);
    }

    if(sortOrder==="low-high")
    {
      filtered.sort((a,b)=>a.productPrice-b.productPrice)
    }else if(sortOrder==="high-low")
    {
      filtered.sort((a,b)=>b.productPrice-a.productPrice)
    }

    dispatch(setProduct(filtered));
  }, [search, category, brand,sortOrder, allProduct, dispatch]);

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

            <FilterSideBar
              allProduct={allProduct}
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              brand={brand}
              setBrand={setBrand}
            />
          </div>
        </aside>

        {/* Main Section */}
        <div className="flex flex-col flex-1">
          
          {/* Header */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
            <h1 className="text-xl font-extrabold text-slate-900">
              Electronics{" "}
              <span className="text-slate-400 font-medium text-sm">
                ({products.length})
              </span>
            </h1>

            <Select onValueChange={(value)=>setSortOrder(value)}>
              <SelectTrigger className="w-52 bg-slate-50 border-slate-200 rounded-xl py-5">
                <SelectValue placeholder="Sort Products" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Price Range</SelectLabel>
                  <SelectItem value="low-high">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="high-low">
                    Price: High to Low
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <LayoutGrid className="text-slate-300 mb-4" size={40} />
              <p className="text-slate-500 font-medium">
                No products found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
