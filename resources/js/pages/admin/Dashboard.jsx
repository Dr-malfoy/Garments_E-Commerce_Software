import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Card = ({ label, value, sub, icon, color, bg }) => (
    <div className="group relative bg-[var(--admin-card-bg)] p-8 rounded-[32px] premium-shadow border border-[var(--admin-border)] hover:border-[#2563eb]/20 transition-all duration-500 overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--admin-input-bg)] group-hover:bg-[#2563eb]/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-colors"></div>
        
        <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xl" style={{ backgroundColor: color }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
            </div>
            {sub && <span className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-3 py-1 rounded-full">{sub}</span>}
        </div>
        
        <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] mb-2">{label}</p>
            <h3 className="text-4xl font-black tracking-tighter text-[var(--admin-text-bright)]">{value}</h3>
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
        <div className="space-y-12 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-[var(--admin-text-bright)]">Control <span className="text-[#2563eb]">Center.</span></h1>
                    <p className="text-[var(--admin-text-muted)] font-bold uppercase tracking-widest text-[10px] mt-1">Real-time business intelligence dashboard</p>
                </div>
            </div>
            
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card label="Revenue" value={`৳${Number(stats.revenue).toLocaleString()}`} sub="+12.5%"
                    color="#2563eb"
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                />
                <Card label="Total Orders" value={stats.orders} sub="Today"
                    color="#6366f1"
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />}
                />
                <Card label="Inventory" value={stats.products} sub="Active"
                    color="#06b6d4"
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
                />
                <Card label="Audience" value={stats.customers} sub="Loyal"
                    color="#a855f7"
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />}
                />
            </div>

            {/* Cancel Requests Section */}
            {cancelRequests.length > 0 && (
                <div className="bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-[32px] overflow-hidden">
                    <div className="p-8 border-b border-[#ef4444]/10 flex items-center justify-between">
                        <div>
                            <h3 className="text-[#ef4444] font-black text-xl">Termination Requests</h3>
                            <p className="text-[#ef4444]/50 text-[10px] uppercase font-black tracking-widest mt-1">Urgent order cancellations pending</p>
                        </div>
                        <span className="bg-[#ef4444] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{cancelRequests.length} Pending</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#ef4444]/5">
                                    {['Slip ID', 'Customer', 'Amount', 'Actions'].map(h => (
                                        <th key={h} className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-[#ef4444]/60 border-b border-[#ef4444]/10">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {cancelRequests.map((order) => (
                                    <tr key={order.id} className="border-b border-[#ef4444]/5 hover:bg-[#ef4444]/5 transition-colors">
                                        <td className="p-6 text-[var(--admin-text-bright)] font-black">#{order.order_id}</td>
                                        <td className="p-6">
                                            <div className="font-bold text-[var(--admin-text-bright)]">{order.customer?.name}</div>
                                            <div className="text-[10px] text-[var(--admin-text-muted)]">{order.customer?.phone}</div>
                                        </td>
                                        <td className="p-6 text-[var(--admin-text-bright)] font-black">৳{parseFloat(order.total_amount || 0).toLocaleString()}</td>
                                        <td className="p-6">
                                            <div className="flex gap-4">
                                                <button onClick={() => handleCancelAction(order.id, 'approve')} className="px-6 py-2 bg-[#ef4444] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-[#ef4444]/20">Approve</button>
                                                <button onClick={() => handleCancelAction(order.id, 'reject')} className="px-6 py-2 bg-[var(--admin-input-bg)] text-[var(--admin-text-bright)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--admin-border)] transition-all">Reject</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Recent Orders Table */}
            <div className="bg-[var(--admin-card-bg)] border border-[var(--admin-border)] rounded-[48px] premium-shadow overflow-hidden">
                <div className="p-10 border-b border-[var(--admin-border)] flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-[var(--admin-text-bright)]">Recent Ledger</h3>
                        <p className="text-[var(--admin-text-muted)] text-[10px] uppercase font-black tracking-widest mt-1">Latest customer transactions & status</p>
                    </div>
                    <Link to="/admin/orders" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2563eb] hover:text-[#f53003] transition-colors flex items-center gap-2">
                        View Full Ledger 
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                </div>

                {loading ? (
                    <div className="p-24 text-center text-[var(--admin-text-muted)] text-[10px] uppercase font-black tracking-[0.4em] animate-pulse">Synchronizing Data...</div>
                ) : orders.length === 0 ? (
                    <div className="p-24 text-center">
                        <div className="w-20 h-20 bg-[var(--admin-input-bg)] rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-[var(--admin-text-muted)]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        </div>
                        <p className="text-[var(--admin-text-muted)] text-[10px] font-black uppercase tracking-widest">No transaction history found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[var(--admin-input-bg)]/30">
                                    {['Order ID', 'Customer', 'Amount', 'Status', 'Timestamp'].map(h => (
                                        <th key={h} className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] border-b border-[var(--admin-border)]">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => {
                                    const st = statusStyle(order.status);
                                    return (
                                        <tr key={order.id} className="border-b border-[var(--admin-border)]/50 hover:bg-[var(--admin-input-bg)]/20 transition-all duration-300">
                                            <td className="px-8 py-8 text-[#2563eb] font-black">#{order.order_id || order.id}</td>
                                            <td className="px-8 py-8">
                                                <div className="font-black text-[var(--admin-text-bright)]">{order.customer?.name || 'Guest'}</div>
                                                <div className="text-[9px] font-bold text-[var(--admin-text-muted)] uppercase tracking-widest">{order.items?.length || 0} Products</div>
                                            </td>
                                            <td className="px-8 py-8 text-[var(--admin-text-bright)] font-black text-lg">৳{parseFloat(order.total_amount || 0).toLocaleString()}</td>
                                            <td className="px-8 py-8">
                                                <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-8 text-[var(--admin-text-muted)] text-[10px] font-bold uppercase tracking-widest">
                                                {order.created_at ? new Date(order.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
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
