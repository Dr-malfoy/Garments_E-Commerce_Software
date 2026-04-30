import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPricing = () => {
    const [offers, setOffers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        quantity: 2,
        price: '',
        is_active: true,
        product_ids: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [offersRes, productsRes] = await Promise.all([
                axios.get('/api/combo-offers'),
                axios.get('/api/products')
            ]);
            setOffers(offersRes.data);
            setProducts(productsRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (offer) => {
        setSelectedOffer(offer);
        setFormData({
            name: offer.name,
            quantity: offer.quantity,
            price: offer.price,
            is_active: !!offer.is_active,
            product_ids: offer.products.map(p => p.id)
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this offer?')) return;
        try {
            await axios.delete(`/api/combo-offers/${id}`);
            fetchData();
        } catch (error) {
            alert('Failed to delete offer');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedOffer) {
                await axios.put(`/api/combo-offers/${selectedOffer.id}`, formData);
            } else {
                await axios.post('/api/combo-offers', formData);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert('Failed to save offer. Please check all fields.');
        }
    };

    const toggleProduct = (id) => {
        const ids = [...formData.product_ids];
        const index = ids.indexOf(id);
        if (index > -1) ids.splice(index, 1);
        else ids.push(id);
        setFormData({ ...formData, product_ids: ids });
    };

    const inputStyle = {
        width: '100%', padding: '12px 16px', borderRadius: 10, outline: 'none',
        background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)',
        color: 'var(--admin-text-bright)', fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading modules...</div>;

    return (
        <div className="admin-page-transition">
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--admin-text-bright)', margin: 0 }}>Combo Pricing</h1>
                    <p style={{ fontSize: 14, color: 'var(--admin-text-muted)', marginTop: 4 }}>Create and manage volume-based combo offers</p>
                </div>
                <button 
                    onClick={() => { setSelectedOffer(null); setFormData({ name: '', quantity: 2, price: '', is_active: true, product_ids: [] }); setIsModalOpen(true); }}
                    style={{ padding: '12px 24px', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}
                >
                    Create Offer
                </button>
            </div>

            <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-border)', borderRadius: 18, overflow: 'hidden', backdropFilter: 'var(--admin-glass-blur)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--admin-table-header)' }}>
                            {['Offer Name', 'Min Quantity', 'Combo Price', 'Applied Products', 'Status', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--admin-text-muted)', borderBottom: '1px solid var(--admin-border)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {offers.map(offer => (
                            <tr key={offer.id} style={{ borderBottom: '1px solid var(--admin-border)', transition: 'background 0.2s' }}>
                                <td style={{ padding: '16px 20px' }}>
                                    <div style={{ fontWeight: 700, color: 'var(--admin-text-bright)' }}>{offer.name}</div>
                                </td>
                                <td style={{ padding: '16px 20px' }}>
                                    <span style={{ fontWeight: 700, color: '#2563eb' }}>{offer.quantity} Pieces</span>
                                </td>
                                <td style={{ padding: '16px 20px' }}>
                                    <div style={{ fontWeight: 900, color: '#10b981' }}>{offer.price} TK</div>
                                </td>
                                <td style={{ padding: '16px 20px', maxWidth: 300 }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                        {offer.products.map(p => (
                                            <span key={p.id} style={{ fontSize: 9, padding: '2px 6px', background: 'var(--admin-input-bg)', color: 'var(--admin-text-muted)', borderRadius: 4, border: '1px solid var(--admin-border)' }}>
                                                {p.name}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ padding: '16px 20px' }}>
                                    <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: offer.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: offer.is_active ? '#10b981' : '#ef4444' }}>
                                        {offer.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 20px' }}>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => handleEdit(offer)} style={{ p: 6, background: 'transparent', border: 'none', color: '#2563eb', cursor: 'pointer' }}>
                                            <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button onClick={() => handleDelete(offer.id)} style={{ p: 6, background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                            <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }} onClick={() => setIsModalOpen(false)} />
                    <div style={{ position: 'relative', width: '100%', maxWidth: 600, background: 'var(--admin-card-bg)', borderRadius: 24, border: '1px solid var(--admin-border)', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', overflow: 'hidden', backdropFilter: 'var(--admin-glass-blur)' }}>
                        <form onSubmit={handleSubmit}>
                            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h2 style={{ margin: 0, color: 'var(--admin-text-bright)', fontSize: 20, fontWeight: 900 }}>{selectedOffer ? 'Edit Offer' : 'Create Offer'}</h2>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)' }}>
                                    <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <div style={{ padding: 32, maxHeight: '60vh', overflowY: 'auto' }}>
                                <div style={{ display: 'grid', gap: 20 }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--admin-text-muted)', marginBottom: 8, letterSpacing: '0.05em' }}>Offer Name</label>
                                        <input style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Buy 2 for 1000 TK" required />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--admin-text-muted)', marginBottom: 8, letterSpacing: '0.05em' }}>Min Quantity</label>
                                            <input type="number" style={inputStyle} value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} min="2" required />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--admin-text-muted)', marginBottom: 8, letterSpacing: '0.05em' }}>Combo Price (TK)</label>
                                            <input type="number" style={inputStyle} value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--admin-text-muted)', marginBottom: 8, letterSpacing: '0.05em' }}>Select Products</label>
                                        <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid var(--admin-border)', borderRadius: 12, padding: 12, display: 'grid', gap: 8, background: 'rgba(0,0,0,0.02)' }}>
                                            {products.map(p => (
                                                <div key={p.id} onClick={() => toggleProduct(p.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', borderRadius: 8, background: formData.product_ids.includes(p.id) ? 'rgba(37,99,235,0.1)' : 'transparent', transition: 'all 0.2s' }}>
                                                    <div style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid #2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.product_ids.includes(p.id) ? '#2563eb' : 'transparent' }}>
                                                        {formData.product_ids.includes(p.id) && <svg style={{ width: 10, height: 10, color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                    <span style={{ fontSize: 13, fontWeight: 600, color: formData.product_ids.includes(p.id) ? '#2563eb' : 'var(--admin-text-bright)' }}>{p.name} ({p.code})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} />
                                        <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--admin-text-bright)' }}>Offer is Active</label>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '24px 32px', background: 'rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 24px', background: 'transparent', border: 'none', color: 'var(--admin-text-muted)', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ padding: '12px 32px', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>
                                    {selectedOffer ? 'Update Offer' : 'Create Offer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPricing;
