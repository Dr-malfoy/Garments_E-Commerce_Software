import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterLowStock, setFilterLowStock] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchInventory();
    }, [filterLowStock]);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const url = filterLowStock ? '/api/inventory/low-stock' : '/api/inventory';
            const response = await axios.get(url);
            setInventory(response.data);
        } catch (error) {
            console.error('Failed to fetch inventory', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQty = async (sizeId, currentQty, delta) => {
        const newQty = Math.max(0, currentQty + delta);
        setUpdatingId(sizeId);
        try {
            await axios.patch(`/api/inventory/size/${sizeId}`, { stock_qty: newQty });
            setInventory(inventory.map(item => ({
                ...item,
                sizes: item.sizes.map(s => s.id === sizeId ? { ...s, stock_qty: newQty } : s)
            })));
        } catch (error) {
            console.error('Failed to update stock', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredInventory = inventory.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) || 
        item.code.toLowerCase().includes(search.toLowerCase())
    );

    const inputStyle = {
        width: '100%', padding: '14px 16px 14px 44px', borderRadius: 12, outline: 'none',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        color: '#fff', fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>Inventory Management</h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Monitor stock levels and adjust variants in real-time</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* Search & Filter Bar */}
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 280 }}>
                        <svg style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'rgba(255,255,255,0.3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input style={inputStyle} placeholder="Search by product name or code..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <button onClick={() => setFilterLowStock(!filterLowStock)}
                        style={{ background: filterLowStock ? '#2563eb' : 'rgba(255,255,255,0.05)', color: '#fff', border: filterLowStock ? 'none' : '1px solid rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        {filterLowStock ? 'Showing Low Stock' : 'Filter Low Stock'}
                    </button>
                </div>

                {/* Grid of Cards */}
                {loading ? (
                    <div style={{ padding: 100, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>Scanning stock distribution...</div>
                ) : filteredInventory.length === 0 ? (
                    <div style={{ padding: 100, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>No matching inventory records found.</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                        {filteredInventory.map(item => (
                            <div key={item.id} style={{ background: 'rgba(13,13,26,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 20, transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(37,99,235,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'none'; }}
                            >
                                {/* Item Info */}
                                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                    <div style={{ width: 64, height: 64, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', flexShrink: 0 }}>
                                        {item.image ? <img src={`/storage/${item.image}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)', fontWeight: 900, fontSize: 24 }}>{item.name[0]}</div>}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{item.code} • {item.category?.name || 'General'}</div>
                                    </div>
                                </div>

                                {/* Sizes Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    {item.sizes.map(s => (
                                        <div key={s.id} style={{ padding: '12px 14px', background: s.stock_qty <= 10 ? 'rgba(37,99,235,0.08)' : 'rgba(255,255,255,0.02)', border: s.stock_qty <= 10 ? '1px solid rgba(37,99,235,0.2)' : '1px solid rgba(255,255,255,0.05)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>{s.size}</div>
                                                <div style={{ color: s.stock_qty <= 10 ? '#f87171' : '#fff', fontWeight: 900, fontSize: 16 }}>{s.stock_qty}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                <button disabled={updatingId === s.id} onClick={() => updateQty(s.id, s.stock_qty, -1)}
                                                    style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 900 }}>-</button>
                                                <button disabled={updatingId === s.id} onClick={() => updateQty(s.id, s.stock_qty, 1)}
                                                    style={{ width: 28, height: 28, borderRadius: 6, background: '#2563eb', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 900 }}>+</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div>
                                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Aggregated Stock</div>
                                        <div style={{ color: '#fff', fontSize: 24, fontWeight: 900, lineHeight: 1, marginTop: 4 }}>
                                            {item.sizes.reduce((acc, s) => acc + s.stock_qty, 0)}
                                            <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.3)', marginLeft: 6 }}>units</span>
                                        </div>
                                    </div>
                                    <div style={{ padding: '6px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                                        {item.sizes.length} Variants
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
