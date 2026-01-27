import React from "react";
import { ChevronDown } from "lucide-react";

const FilterSideBar = ({
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
  allProduct,
}) => {
  const categories = allProduct?.map((p) => p.category);
  const uniqueCategory = ["All", ...new Set(categories)];

  const Brands = allProduct?.map((b) => b.brand);
  const uniqueBrand = ["All", ...new Set(Brands)];

  const handleCategoryClick = (val) => {
    setCategory(val);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const resetFilter = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
  };

  return (
    <div className="space-y-10">
      {/* 1. Search Section */}
      <div className="space-y-3">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
          Find Product
        </label>
        <div className="relative group">
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition"
          />
        </div>
      </div>

      {/* 2. Category Section */}
      <div className="space-y-4">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
          Categories
        </h2>
        <div className="space-y-2">
          {uniqueCategory.map((item, index) => (
            <div key={index} className="flex items-center group cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="radio"
                  checked={category === item}
                  onChange={() => handleCategoryClick(item)}
                  className="peer appearance-none w-5 h-5 border border-slate-300 rounded-full checked:border-blue-600 checked:border-[5px] transition-all cursor-pointer"
                />
              </div>
              <label
                htmlFor={`cat-${index}`}
                className="ml-3 text-sm font-medium text-slate-600 group-hover:text-blue-600 cursor-pointer transition-colors"
              >
                {item}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Brand Section */}
      <div className="space-y-4">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
          Brand
        </h2>
        <div className="relative">
          <select
            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 cursor-pointer transition"
            value={brand}
            onChange={handleBrandChange}
          >
            {uniqueBrand.map((item, index) => (
              <option key={index} value={item}>
                {item.toUpperCase()}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* 4. Reset Button (Optional but recommended) */}
      <button
        onClick={resetFilter}
        className="w-full py-3 text-xs font-bold text-slate-400 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-600 transition"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSideBar;
