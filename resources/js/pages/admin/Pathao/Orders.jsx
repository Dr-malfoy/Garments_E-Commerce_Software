import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PathaoOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trackingInfo, setTrackingInfo] = useState(null);
    const [showTrackModal, setShowTrackModal] = useState(false);

    const fetchOrders = async () => {
        // In a real app, you would fetch orders that have Pathao consignment IDs
        // For now, we'll show a placeholder or empty list
        setLoading(false);
    };

    const handleTrack = async (consignmentId) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/pathao/track/${consignmentId}`);
            setTrackingInfo(res.data.data);
            setShowTrackModal(true);
        } catch (error) {
            alert('Tracking failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-[#1b1b18]">Courier <span className="text-[#f53003]">Orders.</span></h1>
                    <p className="text-black/40 font-bold uppercase tracking-widest text-[10px] mt-1">Track and manage Pathao shipments</p>
                </div>
            </div>

            <div className="bg-white rounded-[40px] premium-shadow border border-black/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/5">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Consignment ID</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Recipient</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Amount</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-black/40 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {loading ? (
                            <tr><td colSpan="5" className="px-8 py-20 text-center animate-pulse font-bold text-black/20">Loading shipments...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="5" className="px-8 py-20 text-center font-bold text-black/20 italic text-sm">No active Pathao shipments found.</td></tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order.id} className="hover:bg-black/[0.02] transition-colors">
                                    <td className="px-8 py-6 font-black text-[#1b1b18]">{order.consignment_id}</td>
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-sm text-[#1b1b18]">{order.recipient_name}</div>
                                        <div className="text-[10px] font-bold text-black/40">{order.recipient_phone}</div>
                                    </td>
                                    <td className="px-8 py-6 font-black text-sm">{order.amount} Tk</td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-[#f53003]/10 text-[#f53003] text-[9px] font-black uppercase tracking-widest rounded-full">
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => handleTrack(order.consignment_id)}
                                            className="px-6 py-2.5 bg-[#1b1b18] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#f53003] transition-all"
                                        >
                                            Track
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Tracking Modal */}
            {showTrackModal && trackingInfo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#1b1b18] text-white w-full max-w-xl rounded-[40px] p-10 premium-shadow animate-slide-up relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f53003]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                        
                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <h2 className="text-3xl font-black tracking-tight">Tracking Details</h2>
                            <button onClick={() => setShowTrackModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-[#f53003] rounded-2xl flex items-center justify-center shadow-lg shadow-[#f53003]/30">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Current Status</p>
                                    <h4 className="text-2xl font-black text-[#f53003]">{trackingInfo.order_status}</h4>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/10">
                                {trackingInfo.order_history?.map((event, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-px h-12 bg-white/10 relative mt-2">
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#f53003] rounded-full"></div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{event.time}</p>
                                            <p className="text-sm font-bold">{event.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PathaoOrders;
