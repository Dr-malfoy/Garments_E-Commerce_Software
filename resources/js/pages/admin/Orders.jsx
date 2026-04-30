import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/orders/${orderId}`, { status: newStatus });
            fetchOrders();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const statusMap = {
        pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
        confirmed: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
        processing: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' },
        shipped: { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)' },
        delivered: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
        cancelled: { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.15)' },
    };

    const selectStyle = (s) => ({
        padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'capitalize',
        background: statusMap[s]?.bg || 'rgba(255,255,255,0.05)',
        color: statusMap[s]?.color || '#fff',
        border: `1px solid ${statusMap[s]?.border || 'rgba(255,255,255,0.1)'}`,
        outline: 'none', cursor: 'pointer', appearance: 'none'
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>Order Ledger</h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Monitor and fulfill customer requests across your store</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* Header Action */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={fetchOrders} 
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg className={loading ? 'animate-spin' : ''} style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Sync Registry
                    </button>
                </div>

                {/* Table Card */}
                <div style={{ background: 'rgba(13,13,26,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                    {['Slip ID', 'Customer', 'Logistics Address', 'Financials', 'Fulfillment Status', 'Action'].map(h => (
                                        <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>Synchronizing order ledger...</td></tr>
                                ) : orders.length === 0 ? (
                                    <tr><td colSpan="6" style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>No orders detected.</td></tr>
                                ) : orders.map((order, i) => (
                                    <tr key={order.id} style={{ borderBottom: i < orders.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ color: '#2563eb', fontWeight: 800, fontSize: 14 }}>#{order.order_id}</div>
                                            <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 600, marginTop: 4 }}>{new Date(order.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{order.customer?.name || 'Guest'}</div>
                                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, marginTop: 2 }}>{order.customer?.phone}</div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {order.customer?.district}, {order.customer?.area}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>৳{(parseFloat(order.total_amount) + parseFloat(order.delivery_charge || 0)).toLocaleString()}</div>
                                            <div style={{ color: 'rgba(34,197,94,0.6)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', marginTop: 2 }}>Paid via COD</div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                <select value={order.status} onChange={e => handleStatusChange(order.id, e.target.value)} style={selectStyle(order.status)}>
                                                    {Object.keys(statusMap).map(k => <option key={k} value={k} style={{background: '#0d0d1a', color: '#fff'}}>{k}</option>)}
                                                </select>
                                                <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'inherit', opacity: 0.5 }}>
                                                    <svg style={{ width: 10, height: 10 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <button onClick={() => setSelectedOrder(order)} 
                                                style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                                            >
                                                View Slip
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Slip Modal */}
                {selectedOrder && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }} onClick={() => setSelectedOrder(null)} />
                        <div style={{ position: 'relative', width: '100%', maxWidth: 600, background: '#0d0d1a', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 50px 100px rgba(0,0,0,0.8)', overflow: 'hidden' }}>
                            <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)' }}>
                                <div>
                                    <h2 style={{ margin: 0, color: '#fff', fontSize: 20, fontWeight: 900 }}>Invoice #{selectedOrder.order_id}</h2>
                                    <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Placed on {new Date(selectedOrder.created_at).toLocaleString()}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
                                    <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <div style={{ padding: 32 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#2563eb', letterSpacing: '0.1em', marginBottom: 12 }}>Customer Info</label>
                                        <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>{selectedOrder.customer?.name}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 500, marginTop: 4 }}>{selectedOrder.customer?.phone}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, lineHeight: 1.6, marginTop: 12 }}>
                                            {selectedOrder.customer?.area}, {selectedOrder.customer?.thana}<br />
                                            {selectedOrder.customer?.district}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <label style={{ display: 'block', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#2563eb', letterSpacing: '0.1em', marginBottom: 12 }}>Order Logistics</label>
                                        <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 20, background: statusMap[selectedOrder.status]?.bg, color: statusMap[selectedOrder.status]?.color, border: `1px solid ${statusMap[selectedOrder.status]?.border}`, fontSize: 12, fontWeight: 800, textTransform: 'capitalize' }}>
                                            {selectedOrder.status}
                                        </div>
                                        <div style={{ marginTop: 20, color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }}>PAYMENT METHOD</div>
                                        <div style={{ color: '#fff', fontWeight: 800, fontSize: 14, marginTop: 4 }}>Cash on Delivery</div>
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 16 }}>Financial Breakdown</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 500 }}>
                                            <span>Cart Subtotal</span>
                                            <span>৳{parseFloat(selectedOrder.total_amount).toLocaleString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 500 }}>
                                            <span>Delivery & Logistics</span>
                                            <span>৳{parseFloat(selectedOrder.delivery_charge || 0).toLocaleString()}</span>
                                        </div>
                                        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: 24, fontWeight: 900 }}>
                                            <span style={{ letterSpacing: '-0.5px' }}>Total Due</span>
                                            <span style={{ color: '#2563eb' }}>৳{(parseFloat(selectedOrder.total_amount) + parseFloat(selectedOrder.delivery_charge || 0)).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                                    <button onClick={() => window.print()} style={{ flex: 1, background: '#fff', color: '#000', border: 'none', padding: 14, borderRadius: 12, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 20px rgba(255,255,255,0.1)' }}>Print Invoice</button>
                                    <button onClick={() => setSelectedOrder(null)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: 14, borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
