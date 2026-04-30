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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--admin-text-bright)', margin: 0 }}>Product Catalog</h1>
                <p style={{ fontSize: 14, color: 'var(--admin-text-muted)', marginTop: 4 }}>Manage your garments inventory and variants</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* Header Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleOpenModal()} 
                        style={{ background: 'linear-gradient(135deg,#2563eb,#60a5fa)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 20px rgba(37,99,235,0.3)' }}>
                        <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                        Add New Product
                    </button>
                </div>

                {/* Table Card */}
                <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-border)', borderRadius: 18, overflow: 'hidden', backdropFilter: 'var(--admin-glass-blur)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--admin-table-header)' }}>
                                    {['Visual', 'Product Details', 'Category', 'Price', 'Stock Status', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--admin-text-muted)', borderBottom: '1px solid var(--admin-border)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>Loading catalog...</td></tr>
                                ) : products.length === 0 ? (
                                    <tr><td colSpan="6" style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>No products found. Add your first item!</td></tr>
                                ) : products.map((product, i) => (
                                    <tr key={product.id} style={{ borderBottom: i < products.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ width: 56, height: 56, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {product.image ? <img src={`/storage/${product.image}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <svg style={{ width: 24, height: 24, color: 'rgba(255,255,255,0.1)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ fontWeight: 700, color: 'var(--admin-text-bright)', fontSize: 14 }}>{product.name}</div>
                                            <div style={{ color: 'var(--admin-text-muted)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{product.code}</div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                {product.category?.name || 'General'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 20px', color: '#2563eb', fontWeight: 800, fontSize: 14 }}>
                                            ৳{parseFloat(product.price).toLocaleString()}
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                                {product.sizes.map(s => (
                                                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden' }}>
                                                        <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', background: s.stock_qty <= 5 ? '#2563eb' : 'rgba(255,255,255,0.08)', color: '#fff' }}>{s.size}</span>
                                                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', color: s.stock_qty <= 5 ? '#f87171' : 'rgba(255,255,255,0.5)' }}>{s.stock_qty}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                <button onClick={() => handleOpenModal(product)} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }} onClick={() => setIsModalOpen(false)} />
                        <div style={{ position: 'relative', width: '100%', maxWidth: 640, background: 'var(--admin-card-bg)', borderRadius: 20, border: '1px solid var(--admin-border)', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', overflow: 'hidden', backdropFilter: 'var(--admin-glass-blur)' }}>
                            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h2 style={{ margin: 0, color: 'var(--admin-text-bright)', fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px' }}>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)' }}>
                                    <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} style={{ padding: 32, maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Product Name</label>
                                        <input style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Premium Silk Saree" required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Product Code</label>
                                        <input style={inputStyle} value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. GRM-102" required />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Category</label>
                                        <select style={inputStyle} value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} required>
                                            <option value="" style={{background: '#0d0d1a'}}>Select Category</option>
                                            {categories.map(c => <option key={c.id} value={c.id} style={{background: '#0d0d1a'}}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Price (Tk)</label>
                                        <input type="number" style={inputStyle} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" required />
                                    </div>
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Product Image</label>
                                    <input type="file" onChange={handleFileChange} style={{ ...inputStyle, padding: 8 }} accept="image/*" />
                                </div>
                                <div style={{ marginBottom: 24 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Sizes & Stock</label>
                                        <button type="button" onClick={addSize} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>+ Add Variant</button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {formData.sizes.map((s, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                                <input style={{ ...inputStyle, flex: 1 }} value={s.size} onChange={e => handleSizeChange(idx, 'size', e.target.value)} placeholder="Size (M, L, XL...)" required />
                                                <input type="number" style={{ ...inputStyle, flex: 1 }} value={s.stock_qty} onChange={e => handleSizeChange(idx, 'stock_qty', e.target.value)} placeholder="Quantity" required />
                                                {formData.sizes.length > 1 && (
                                                    <button type="button" onClick={() => removeSize(idx)} style={{ background: 'rgba(37,99,235,0.1)', border: 'none', color: '#2563eb', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg,#2563eb,#60a5fa)', color: '#fff', border: 'none', padding: 14, borderRadius: 12, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 20px rgba(37,99,235,0.3)' }}>
                                        {selectedProduct ? 'Update Product' : 'Create Product'}
                                    </button>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: 14, borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
