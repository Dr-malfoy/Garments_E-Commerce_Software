import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        category_id: '',
        price: '',
        description: '',
        image: null,
        sizes: [{ size: 'M', stock_qty: 0 }]
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setSelectedProduct(product);
            setFormData({
                name: product.name,
                code: product.code,
                category_id: product.category_id,
                price: product.price,
                description: product.description || '',
                image: null,
                sizes: product.sizes || [{ size: 'M', stock_qty: 0 }]
            });
        } else {
            setSelectedProduct(null);
            setFormData({
                name: '',
                code: '',
                category_id: '',
                price: '',
                description: '',
                image: null,
                sizes: [{ size: 'M', stock_qty: 0 }]
            });
        }
        setIsModalOpen(true);
    };

    const handleSizeChange = (index, field, value) => {
        const newSizes = [...formData.sizes];
        newSizes[index][field] = value;
        setFormData({ ...formData, sizes: newSizes });
    };

    const addSize = () => {
        setFormData({ ...formData, sizes: [...formData.sizes, { size: '', stock_qty: 0 }] });
    };

    const removeSize = (index) => {
        const newSizes = formData.sizes.filter((_, i) => i !== index);
        setFormData({ ...formData, sizes: newSizes });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('code', formData.code);
        data.append('category_id', formData.category_id);
        data.append('price', formData.price);
        data.append('description', formData.description);
        data.append('sizes', JSON.stringify(formData.sizes));
        if (formData.image) data.append('image', formData.image);

        try {
            if (selectedProduct && selectedProduct.id) {
                data.append('_method', 'PUT');
                await axios.post(`/api/products/${selectedProduct.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post('/api/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error('Failed to save product', error);
            alert('Failed to save product. Please check your input.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`/api/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Failed to delete product', error);
            }
        }
    };

    const inputStyle = {
        width: '100%', padding: '12px 16px', borderRadius: 10, outline: 'none',
        background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)',
        color: 'var(--admin-text-bright)', fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
    };

    return (
        <div className="p-8 space-y-12 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-[var(--admin-text-bright)]">Product <span className="text-[#2563eb]">Catalog.</span></h1>
                    <p className="text-[var(--admin-text-muted)] font-bold uppercase tracking-widest text-[10px] mt-1">Manage garments inventory and variants</p>
                </div>
                <button onClick={() => handleOpenModal()} 
                    className="px-8 py-4 bg-[#2563eb] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#f53003] transition-all shadow-xl shadow-[#2563eb]/20 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                    Add New Product
                </button>
            </div>
            
            <div className="bg-[var(--admin-card-bg)] border border-[var(--admin-border)] rounded-[48px] premium-shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[var(--admin-input-bg)]/30">
                                {['Item', 'Details', 'Category', 'Pricing', 'Stock Status', 'Actions'].map(h => (
                                    <th key={h} className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] border-b border-[var(--admin-border)]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="p-24 text-center text-[var(--admin-text-muted)] text-[10px] uppercase font-black tracking-[0.4em] animate-pulse">Synchronizing Inventory...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan="6" className="p-24 text-center">
                                    <div className="w-20 h-20 bg-[var(--admin-input-bg)] rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-8 h-8 text-[var(--admin-text-muted)]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    </div>
                                    <p className="text-[var(--admin-text-muted)] text-[10px] font-black uppercase tracking-widest">No products in catalog</p>
                                </td></tr>
                            ) : products.map((product) => (
                                <tr key={product.id} className="border-b border-[var(--admin-border)]/50 hover:bg-[var(--admin-input-bg)]/20 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="w-16 h-16 rounded-2xl bg-[var(--admin-input-bg)] border border-[var(--admin-border)] overflow-hidden shadow-lg">
                                            {product.image ? 
                                                <img src={`/storage/${product.image}`} className="w-full h-full object-cover" /> : 
                                                <div className="w-full h-full flex items-center justify-center text-[var(--admin-text-muted)]/20">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </div>
                                            }
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-black text-[var(--admin-text-bright)] text-lg">{product.name}</div>
                                        <div className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest mt-1">SKU: {product.code}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-4 py-1 rounded-full bg-[var(--admin-input-bg)] border border-[var(--admin-border)] text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-muted)]">
                                            {product.category?.name || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-black text-[var(--admin-text-bright)] text-lg">
                                        ৳{parseFloat(product.price).toLocaleString()}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-2 flex-wrap max-w-[200px]">
                                            {product.sizes.map(s => (
                                                <div key={s.id} className="flex items-center rounded-lg overflow-hidden border border-[var(--admin-border)] shadow-sm">
                                                    <span className={`text-[9px] font-black px-2 py-1 ${s.stock_qty <= 5 ? 'bg-red-500' : 'bg-[#2563eb]'} text-white`}>{s.size}</span>
                                                    <span className="text-[10px] font-bold px-2 py-1 bg-[var(--admin-input-bg)] text-[var(--admin-text-bright)]">{s.stock_qty}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-3 justify-end">
                                            <button onClick={() => handleOpenModal(product)} className="w-10 h-10 rounded-xl bg-[var(--admin-input-bg)] border border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:bg-[#2563eb] hover:text-white transition-all flex items-center justify-center">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="w-10 h-10 rounded-xl bg-[var(--admin-input-bg)] border border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:bg-[#ef4444] hover:text-white transition-all flex items-center justify-center">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
                    <div className="bg-[var(--admin-card-bg)] w-full max-w-2xl rounded-[48px] p-12 premium-shadow my-auto animate-slide-up relative border border-[var(--admin-border)]">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 w-12 h-12 flex items-center justify-center rounded-full bg-[var(--admin-input-bg)] hover:bg-[#f53003] text-[var(--admin-text-muted)] hover:text-white transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="mb-12">
                            <h2 className="text-3xl font-black tracking-tight text-[var(--admin-text-bright)]">{selectedProduct ? 'Edit Item' : 'New Creation'}</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] mt-1">Configure your product specifications</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] ml-4">Product Name</label>
                                    <input style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Premium Silk Saree" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] ml-4">Product Code</label>
                                    <input style={inputStyle} value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. GRM-102" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] ml-4">Category</label>
                                    <select style={inputStyle} value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} required>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] ml-4">Price (Tk)</label>
                                    <input type="number" style={inputStyle} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] ml-4">Visual Asset</label>
                                <div className="relative group">
                                    <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" />
                                    <div className="w-full px-8 py-5 bg-[var(--admin-input-bg)] border border-[var(--admin-border)] rounded-3xl text-[var(--admin-text-muted)] font-bold text-center group-hover:border-[#2563eb] transition-all">
                                        {formData.image ? formData.image.name : 'Click to upload product image'}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)]">Variants & Stock</label>
                                    <button type="button" onClick={addSize} className="text-[#2563eb] text-[10px] font-black uppercase tracking-widest hover:text-[#f53003] transition-colors">+ Add Size</button>
                                </div>
                                <div className="space-y-4">
                                    {formData.sizes.map((s, idx) => (
                                        <div key={idx} className="flex gap-4 items-center animate-fade-in">
                                            <input style={{ ...inputStyle, flex: 1 }} value={s.size} onChange={e => handleSizeChange(idx, 'size', e.target.value)} placeholder="Size (M, L...)" required />
                                            <input type="number" style={{ ...inputStyle, flex: 1 }} value={s.stock_qty} onChange={e => handleSizeChange(idx, 'stock_qty', e.target.value)} placeholder="Quantity" required />
                                            {formData.sizes.length > 1 && (
                                                <button type="button" onClick={() => removeSize(idx)} className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-6 pt-6">
                                <button type="submit" className="flex-1 py-6 bg-[#2563eb] text-white rounded-[32px] font-black text-xs uppercase tracking-[0.4em] hover:bg-[#f53003] transition-all shadow-2xl shadow-[#2563eb]/20">
                                    {selectedProduct ? 'Update Listing' : 'Confirm Entry'}
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-6 bg-[var(--admin-input-bg)] text-[var(--admin-text-bright)] rounded-[32px] font-black text-xs uppercase tracking-[0.4em] border border-[var(--admin-border)] hover:bg-[var(--admin-border)] transition-all">
                                    Discard
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
;
};

export default Products;
