import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/storefront/Header';
import Footer from '../components/storefront/Footer';

const TrackOrder = () => {
    const [phone, setPhone] = useState('');
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({});

    useEffect(() => {
        axios.get('/api/public/settings').then(res => setSettings(res.data));
    }, []);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!phone) return;
        setLoading(true);
        try {
            const res = await axios.get(`/api/public/track-order/${phone}`);
            setOrders(res.data);
        } catch (error) {
            console.error('Tracking failed', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return '#f59e0b';
            case 'confirmed': return '#3b82f6';
            case 'processing': return '#8b5cf6';
            case 'shipped': return '#06b6d4';
            case 'delivered': return '#10b981';
            case 'cancelled': return '#ef4444';
            default: return '#706f6c';
        }
    };

    return (
        <div className="min-h-screen elegant-gradient-bg">
            <Header settings={settings} />

            <main className="max-w-4xl mx-auto px-4 py-24">
                <div className="space-y-12">
                    {/* Hero Section */}
                    <div className="text-center space-y-4">
                        <div className="inline-block px-6 py-2 bg-black/5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-[#1b1b18]">
                            Transparency
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#1b1b18]">Track Your <span className="text-gradient">Orders.</span></h1>
                        <p className="text-[#706f6c] font-bold text-lg max-w-lg mx-auto">Enter your phone number to see the current status of all your purchases.</p>
                    </div>

                    {/* Search Form */}
                    <div className="glass p-8 md:p-12 rounded-[40px] premium-shadow max-w-xl mx-auto">
                        <form onSubmit={handleTrack} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em] ml-2">Phone Number</label>
                                <div className="flex gap-4">
                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="flex-1 px-8 py-6 bg-white border-2 border-black/5 rounded-[24px] focus:border-[#1b1b18] outline-none text-sm font-bold transition-all shadow-sm"
                                        placeholder="Enter your phone number"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-10 bg-[#1b1b18] text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#f53003] transition-all transform active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? '...' : 'Track'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Results Section */}
                    {orders && (
                        <div className="space-y-8 animate-fade-in">
                            {orders.length === 0 ? (
                                <div className="text-center py-20 glass rounded-[40px]">
                                    <p className="text-[#706f6c] font-bold">No orders found for this phone number.</p>
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.id} className="glass overflow-hidden rounded-[40px] premium-shadow border border-white/20">
                                        <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between gap-8">
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-2xl font-black text-[#1b1b18]">#{order.order_id}</span>
                                                    <div 
                                                        className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white"
                                                        style={{ background: getStatusColor(order.status) }}
                                                    >
                                                        {order.status}
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    {order.items.map(item => (
                                                        <div key={item.id} className="flex gap-6 items-center">
                                                            <div className="w-16 h-20 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                                                <img src={`/storage/${item.product.image}`} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-black text-[#1b1b18]">{item.product.name}</h4>
                                                                <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Size: {item.size} • Qty: {item.qty}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="md:text-right flex flex-col justify-between items-start md:items-end gap-6">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em]">Order Date</p>
                                                    <p className="font-black text-[#1b1b18]">{new Date(order.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em]">Total Amount</p>
                                                    <p className="text-3xl font-black text-[#1b1b18]">{order.total_amount} Tk</p>
                                                </div>

                                                {/* Cancel Logic */}
                                                {order.status.toLowerCase() !== 'cancelled' && (
                                                    <div className="mt-4">
                                                        {order.cancel_requested ? (
                                                            <div className="px-6 py-3 bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                                                Waiting for response...
                                                            </div>
                                                        ) : (
                                                            ['pending', 'confirmed'].includes(order.status.toLowerCase()) && (
                                                                <button
                                                                    onClick={async () => {
                                                                        if (!confirm('Are you sure you want to request cancellation?')) return;
                                                                        try {
                                                                            await axios.post(`/api/public/orders/${order.id}/cancel-request`);
                                                                            handleTrack({ preventDefault: () => {} }); // Refresh
                                                                        } catch (e) {
                                                                            alert('Could not request cancellation');
                                                                        }
                                                                    }}
                                                                    className="px-6 py-3 border-2 border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                                                >
                                                                    Cancel Order
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Tracking Progress Bar */}
                                        <div className="bg-black/5 p-8 border-t border-white/10">
                                            <div className="relative flex justify-between items-center max-w-3xl mx-auto">
                                                {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, i) => {
                                                    const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
                                                    const currentStatus = order.status.toLowerCase();
                                                    const currentIdx = steps.indexOf(currentStatus);
                                                    
                                                    // If status is cancelled, we might want special handling, but for now we follow the path
                                                    const isCompleted = currentIdx !== -1 && i <= currentIdx;

                                                    return (
                                                        <div key={step} className="flex flex-col items-center gap-4 relative z-10">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-[#1b1b18] text-white shadow-xl' : 'bg-white text-black/10 border border-black/5'}`}>
                                                                {isCompleted ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg> : <span className="text-xs font-black">{i + 1}</span>}
                                                            </div>
                                                            <span className={`text-[9px] font-black uppercase tracking-widest ${isCompleted ? 'text-[#1b1b18]' : 'text-black/20'}`}>{step}</span>
                                                        </div>
                                                    );
                                                })}
                                                {/* Progress Line */}
                                                <div className="absolute top-5 left-0 right-0 h-0.5 bg-black/5 -z-10 mx-10">
                                                    <div 
                                                        className="h-full bg-[#1b1b18] transition-all duration-1000"
                                                        style={{ width: `${Math.min(100, Math.max(0, (['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(order.status.toLowerCase()) / 4) * 100))}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer settings={settings} />
        </div>
    );
};

export default TrackOrder;
