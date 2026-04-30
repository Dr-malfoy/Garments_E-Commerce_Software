import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Card = ({ label, value, sub, icon, color, bg }) => (
    <div style={{ background: 'rgba(13,13,26,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, transition: 'all 0.2s', cursor: 'default', position: 'relative', overflow: 'hidden' }}
        onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${color}40`; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.4)`; }}
        onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
        <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, borderRadius: '0 16px 0 100%', background: bg, opacity: 0.4 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: 20, height: 20, color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
            </div>
            {sub && <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '3px 8px', borderRadius: 20, border: '1px solid rgba(34,197,94,0.15)' }}>{sub}</span>}
        </div>
        <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>{label}</p>
            <h3 style={{ fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, customers: 0 });
    const [orders, setOrders] = useState([]);
    const [cancelRequests, setCancelRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ordRes, prodRes] = await Promise.all([
                axios.get('/api/orders').catch(() => ({ data: [] })),
                axios.get('/api/products').catch(() => ({ data: [] })),
            ]);
            const ords = ordRes.data || [];
            const prods = prodRes.data || [];
            
            const revenue = ords.filter(o => o.status === 'delivered').reduce((s, o) => s + parseFloat(o.total_amount || 0), 0);
            const customers = new Set(ords.map(o => o.customer?.phone || o.id)).size;
            
            setStats({ orders: ords.length, revenue: revenue.toFixed(0), products: prods.length, customers });
            setOrders(ords.slice(0, 8));
            setCancelRequests(ords.filter(o => o.cancel_requested));
        } catch (e) {
            console.error('Fetch failed', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCancelAction = async (orderId, action) => {
        try {
            await axios.post(`/api/orders/${orderId}/${action}-cancel`);
            fetchData();
        } catch (e) {
            alert('Action failed');
        }
    };

    const statusStyle = (s) => {
        const map = {
            pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
            confirmed: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
            processing: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' },
            shipped: { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)' },
            delivered: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
            cancelled: { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.15)' },
        };
        return map[s] || map.cancelled;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>Dashboard</h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Real-time overview of your garments business</p>
            </div>
            
            {/* KPI Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
                <Card label="Total Revenue" value={`৳${Number(stats.revenue).toLocaleString()}`} sub="This month"
                    color="#2563eb" bg="rgba(37,99,235,0.12)"
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                />
                <Card label="Total Orders" value={stats.orders} sub="+12% this week"
                    color="#6366f1" bg="rgba(99,102,241,0.12)"
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />}
                />
                <Card label="Products" value={stats.products} sub="In catalog"
                    color="#06b6d4" bg="rgba(6,182,212,0.12)"
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
                />
                <Card label="Customers" value={stats.customers} sub="Registered"
                    color="#a855f7" bg="rgba(168,85,247,0.12)"
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />}
                />
            </div>

            {/* Cancel Requests Section */}
            {cancelRequests.length > 0 && (
                <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h3 style={{ color: '#ef4444', fontWeight: 800, fontSize: 16, margin: 0 }}>Cancellation Requests</h3>
                            <p style={{ color: 'rgba(239,68,68,0.5)', fontSize: 12, marginTop: 3, fontWeight: 500 }}>Customers waiting for order termination</p>
                        </div>
                        <span style={{ background: '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800 }}>{cancelRequests.length} Pending</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(239,68,68,0.02)' }}>
                                    {['Slip ID', 'Customer', 'Phone', 'Amount', 'Current Status', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(239,68,68,0.6)', borderBottom: '1px solid rgba(239,68,68,0.1)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {cancelRequests.map((order, i) => (
                                    <tr key={order.id} style={{ borderBottom: i < cancelRequests.length - 1 ? '1px solid rgba(239,68,68,0.05)' : 'none' }}>
                                        <td style={{ padding: '14px 20px', color: '#fff', fontWeight: 700, fontSize: 13 }}>#{order.order_id}</td>
                                        <td style={{ padding: '14px 20px', color: '#fff', fontSize: 13 }}>{order.customer?.name}</td>
                                        <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{order.customer?.phone}</td>
                                        <td style={{ padding: '14px 20px', color: '#fff', fontWeight: 700, fontSize: 13 }}>৳{parseFloat(order.total_amount || 0).toLocaleString()}</td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#ef4444' }}>{order.status}</span>
                                        </td>
                                        <td style={{ padding: '14px 20px', display: 'flex', gap: 8 }}>
                                            <button onClick={() => handleCancelAction(order.id, 'approve')} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>Approve</button>
                                            <button onClick={() => handleCancelAction(order.id, 'reject')} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>Reject</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Recent Orders Table */}
            <div style={{ background: 'rgba(13,13,26,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 16, margin: 0 }}>Recent Orders</h3>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 3, fontWeight: 500 }}>Latest customer transactions</p>
                    </div>
                    <a href="/admin/orders" style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                        View All →
                    </a>
                </div>

                {loading ? (
                    <div style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div style={{ padding: 48, textAlign: 'center' }}>
                        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <svg style={{ width: 24, height: 24, color: 'rgba(255,255,255,0.2)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, fontWeight: 500 }}>No orders yet. Orders will appear here once customers place them.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                    {['Order ID', 'Customer', 'Amount', 'Items', 'Status', 'Date'].map(h => (
                                        <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, i) => {
                                    const st = statusStyle(order.status);
                                    return (
                                        <tr key={order.id} style={{ borderBottom: i < orders.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', transition: 'background 0.15s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '14px 20px', color: '#2563eb', fontWeight: 700, fontSize: 13 }}>#{order.order_id || order.id}</td>
                                            <td style={{ padding: '14px 20px', color: '#fff', fontWeight: 600, fontSize: 13 }}>{order.customer?.name || 'Guest'}</td>
                                            <td style={{ padding: '14px 20px', color: '#fff', fontWeight: 700, fontSize: 13 }}>৳{parseFloat(order.total_amount || 0).toLocaleString()}</td>
                                            <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{order.items?.length || 0} item(s)</td>
                                            <td style={{ padding: '14px 20px' }}>
                                                <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'capitalize', color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 12, whiteSpace: 'nowrap' }}>
                                                {order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
