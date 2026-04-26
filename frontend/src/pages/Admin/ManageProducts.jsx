import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Upload, Image as ImageIcon, Search, Filter, Eye, Grid, List } from 'lucide-react';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Form State
    const [formData, setFormData] = useState({
        productName: '',
        productDesc: '',
        productPrice: '',
        category: '',
        brand: '',
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Books'];

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/product/get-products`);
            if (res.data.success) {
                setProducts(res.data.products);
            }
        } catch (error) {
            toast.error("Failed to fetch products");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);

        // Create preview URLs
        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    const resetForm = () => {
        setFormData({
            productName: '',
            productDesc: '',
            productPrice: '',
            category: '',
            brand: '',
        });
        setSelectedFiles([]);
        setPreviewUrls([]);
        setEditingProduct(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading(editingProduct ? "Updating product..." : "Adding product...");

        try {
            const token = localStorage.getItem("accessToken");
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            selectedFiles.forEach(file => data.append('productImg', file));

            const url = editingProduct
                ? `${import.meta.env.VITE_API_URL}/product/update-product/${editingProduct._id}`
                : `${import.meta.env.VITE_API_URL}/product/add-product`;

            const method = editingProduct ? 'put' : 'post';

            const res = await axios[method](url, data, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message, { id: toastId });
                fetchProducts();
                setIsModalOpen(false);
                resetForm();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed", { id: toastId });
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            productName: product.productName,
            productDesc: product.productDesc,
            productPrice: product.productPrice,
            category: product.category,
            brand: product.brand,
        });
        setPreviewUrls(product.productImg.map(img => img.url));
        setIsModalOpen(true);
    };

    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        const toastId = toast.loading("Deleting product...");
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/product/delete-product/${productId}`, {
                headers: { Authorization: token },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success("Product deleted successfully", { id: toastId });
                fetchProducts();
            }
        } catch (error) {
            toast.error("Failed to delete product", { id: toastId });
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Product Inventory</h1>
                    <p className="text-slate-500 font-medium text-lg">Manage your catalog, prices, and stock levels. <span className="text-blue-600 font-bold">{filteredProducts.length} products</span></p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95 text-sm whitespace-nowrap"
                >
                    <Plus size={20} /> Add New Product
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, category or brand..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 ring-blue-500/10 outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setViewMode('table')}
                            className={`p-3 rounded-xl transition-all ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                            title="Table view"
                        >
                            <List size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                            title="Grid view"
                        >
                            <Grid size={18} />
                        </button>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Table View */}
            {viewMode === 'table' && (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50/80 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-6">Product</th>
                                    <th className="px-8 py-6">Category</th>
                                    <th className="px-8 py-6">Brand</th>
                                    <th className="px-8 py-6">Price</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-8 py-6"><div className="h-12 w-48 bg-slate-100 rounded-xl"></div></td>
                                            <td className="px-8 py-6"><div className="h-6 w-24 bg-slate-100 rounded-lg"></div></td>
                                            <td className="px-8 py-6"><div className="h-6 w-20 bg-slate-100 rounded-lg"></div></td>
                                            <td className="px-8 py-6"><div className="h-6 w-16 bg-slate-100 rounded-lg"></div></td>
                                            <td className="px-8 py-6"><div className="h-10 w-24 bg-slate-100 rounded-xl ml-auto"></div></td>
                                        </tr>
                                    ))
                                ) : filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                                    <Search size={40} />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-slate-900">No products found</p>
                                                    <p className="text-slate-500 font-medium text-sm">Try adjusting your search filters or add a new product.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product._id} className="group hover:bg-slate-50/80 transition-all duration-300">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200/50 flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                                                        {product.productImg?.[0] ? (
                                                            <img src={product.productImg[0].url} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                <ImageIcon size={24} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{product.productName}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold truncate max-w-[150px]">{product.productDesc.substring(0, 50)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-4 py-1.5 rounded-xl bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-wider">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 font-bold text-slate-500 uppercase text-xs">{product.brand}</td>
                                            <td className="px-8 py-6">
                                                <span className="text-lg font-black text-slate-900 tracking-tighter">₹{product.productPrice}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
                                                        title="Edit Product"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Products Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {isLoading ? (
                        [1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                                <div className="w-full h-40 bg-slate-100"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))
                    ) : filteredProducts.length === 0 ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                    <Search size={40} />
                                </div>
                                <p className="text-lg font-black text-slate-900">No products found</p>
                            </div>
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <div key={product._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-slate-300 transition-all group shadow-sm hover:shadow-lg">
                                <div className="w-full h-40 bg-slate-100 overflow-hidden relative group">
                                    {product.productImg?.[0] ? (
                                        <img src={product.productImg[0].url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <ImageIcon size={40} />
                                        </div>
                                    )}
                                    <button className="absolute top-2 right-2 bg-white p-2 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Eye size={18} className="text-slate-600" />
                                    </button>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div>
                                        <p className="font-black text-slate-900 text-sm truncate uppercase tracking-tight">{product.productName}</p>
                                        <p className="text-xs text-slate-500 font-bold mt-1">{product.brand}</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-lg font-black text-slate-900">₹{product.productPrice}</span>
                                        <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black">{product.category}</span>
                                    </div>
                                    <div className="flex gap-2 pt-4 border-t border-slate-100">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="flex-1 p-2 text-blue-600 bg-blue-50 rounded-xl font-bold text-xs hover:bg-blue-100 transition-all"
                                        >
                                            <Pencil size={16} className="mx-auto" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="flex-1 p-2 text-red-600 bg-red-50 rounded-xl font-bold text-xs hover:bg-red-100 transition-all"
                                        >
                                            <Trash2 size={16} className="mx-auto" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Product Details & Listing</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400 border border-slate-100">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Product Name</label>
                                    <input
                                        type="text" name="productName" value={formData.productName} onChange={handleInputChange} required
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                                        placeholder="e.g. Ultra Gaming Headset Pro"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Description</label>
                                    <textarea
                                        name="productDesc" value={formData.productDesc} onChange={handleInputChange} required rows="4"
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 ring-blue-500/10 outline-none transition-all placeholder:text-slate-300 resize-none"
                                        placeholder="Detailed description of the product features..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Price (₹)</label>
                                    <input
                                        type="number" name="productPrice" value={formData.productPrice} onChange={handleInputChange} required
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Category</label>
                                    <select
                                        name="category" value={formData.category} onChange={handleInputChange} required
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 ring-blue-500/10 outline-none transition-all"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.slice(1).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Brand</label>
                                    <input
                                        type="text" name="brand" value={formData.brand} onChange={handleInputChange} required
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                                        placeholder="e.g. Sony"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Product Images</label>

                                <div className="flex gap-4 flex-wrap">
                                    {previewUrls.map((url, i) => (
                                        <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-blue-100 shadow-sm group">
                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                    <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer transition-all group">
                                        <Upload size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                        <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-500 mt-2">UPLOAD</span>
                                        <input type="file" multiple onChange={handleFileChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all border border-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95"
                                >
                                    {editingProduct ? 'Save Changes' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;
