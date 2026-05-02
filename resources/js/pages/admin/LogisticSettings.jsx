import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LogisticSettings = () => {
    const [couriers, setCouriers] = useState([]);
    const courierMeta = {
        pathao: { icon: 'P', color: '#f53003' },
        steadfast: { icon: 'S', color: '#2563eb' },
        courier: { icon: 'C', color: '#1b1b18' }
    };
    
    const [selectedCourier, setSelectedCourier] = useState(null);
    const [formData, setFormData] = useState({
        title: '', charges: 0, client_id: '', client_secret: '',
        email: '', password: '', grant_type: 'password', store_id: '',
        secret_key: '', is_active: false
    });
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCouriers();
    }, []);

    const fetchCouriers = async () => {
        try {
            const res = await axios.get('/api/logistic-settings');
            setCouriers(res.data);
        } catch (error) {
            console.error('Failed to fetch couriers', error);
        }
    };

    const openSetup = async (courier) => {
        setSelectedCourier(courier);
        setLoading(true);
        try {
            const res = await axios.get(`/api/logistic-settings/${courier.name}`);
            if (res.data && res.data.name) {
                // Sanitize null values to empty strings
                const sanitized = { ...res.data };
                Object.keys(sanitized).forEach(key => {
                    if (sanitized[key] === null) sanitized[key] = '';
                });
                setFormData(sanitized);
            } else {
                setFormData({
                    title: courier.title || courier.name, charges: 0, client_id: '', client_secret: '',
                    email: '', password: '', grant_type: 'password', store_id: '',
                    secret_key: '', is_active: false
                });
            }
            setShowModal(true);
        } catch (error) {
            console.error('Failed to fetch settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateSecret = async () => {
        try {
            const res = await axios.post('/api/logistic-settings/generate-secret');
            setFormData({ ...formData, secret_key: res.data.secret_key });
        } catch (error) {
            console.error('Failed to generate secret', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`/api/logistic-settings/${selectedCourier.name}`, formData);
            setShowModal(false);
            fetchCouriers();
            alert('Settings saved successfully');
        } catch (error) {
            alert('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-12 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-[var(--admin-text-bright)]">Logistics <span className="text-[#f53003]">Settings.</span></h1>
                    <p className="text-[var(--admin-text-muted)] font-bold uppercase tracking-widest text-[10px] mt-1">Manage courier services & delivery charges</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {couriers.map((courier) => {
                    const meta = courierMeta[courier.name] || { icon: courier.name[0].toUpperCase(), color: '#1b1b18' };
                    return (
                        <div 
                            key={courier.id}
                            className="group relative bg-[var(--admin-card-bg)] p-8 rounded-[32px] premium-shadow border border-[var(--admin-border)] hover:border-[#f53003]/20 transition-all duration-500 overflow-hidden"
                        >
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--admin-input-bg)] group-hover:bg-[#f53003]/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-colors"></div>
                            
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xl" style={{ backgroundColor: meta.color }}>
                                    {meta.icon}
                                </div>
                                
                                <button 
                                    onClick={() => openSetup(courier)}
                                    className="w-10 h-10 rounded-xl bg-[var(--admin-input-bg)] hover:bg-[#f53003] hover:text-white flex items-center justify-center transition-all group/icon"
                                >
                                    <svg className="w-5 h-5 group-hover/icon:rotate-90 transition-transform duration-500 text-[var(--admin-text-muted)] group-hover/icon:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-[var(--admin-text-bright)]">{courier.title || courier.name}</h3>
                                <div className="flex items-center gap-3 mt-4">
                                    <div className={`w-2 h-2 rounded-full ${courier.is_active ? 'bg-green-500 animate-pulse' : 'bg-[var(--admin-border)]'}`}></div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${courier.is_active ? 'text-green-500' : 'text-[var(--admin-text-muted)]'}`}>
                                        {courier.is_active ? 'Service Active' : 'Offline / Inactive'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-[var(--admin-border)] flex justify-between items-center relative z-10">
                                <div>
                                    <p className="text-[10px] font-bold text-[var(--admin-text-muted)] uppercase tracking-widest">Base Charge</p>
                                    <p className="text-lg font-black text-[var(--admin-text-bright)]">৳{courier.charges || 0}</p>
                                </div>
                                <button 
                                    onClick={() => openSetup(courier)}
                                    className="px-5 py-2 bg-[var(--admin-input-bg)] hover:bg-[#f53003] text-[var(--admin-text-bright)] hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                >
                                    Setup
                                </button>
                            </div>
                        </div>
                    );
                })}

                <button className="bg-[var(--admin-card-bg)] border-4 border-dashed border-[var(--admin-border)] p-8 rounded-[32px] flex flex-col items-center justify-center gap-4 group hover:bg-[var(--admin-input-bg)] hover:border-[#f53003]/20 transition-all duration-500">
                    <div className="w-14 h-14 rounded-full bg-[var(--admin-input-bg)] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-[var(--admin-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)]">Add New Courier</span>
                </button>
            </div>

            {/* Setup Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
                    <div className="bg-[var(--admin-card-bg)] w-full max-w-4xl rounded-[48px] p-12 premium-shadow my-auto animate-slide-up relative border border-[var(--admin-border)]">
                        <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 w-12 h-12 flex items-center justify-center rounded-full bg-[var(--admin-input-bg)] hover:bg-[#f53003] text-[var(--admin-text-muted)] hover:text-white transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="flex items-center gap-6 mb-12">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xl" style={{ backgroundColor: selectedCourier.color || '#1b1b18' }}>
                                {selectedCourier.icon || selectedCourier.name[0].toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tight text-[var(--admin-text-bright)]">{selectedCourier.name} Setup</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)]">Enter your merchant API credentials</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] ml-4">Title</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-8 py-5 bg-[var(--admin-input-bg)] text-[var(--admin-text-bright)] rounded-3xl font-bold border-none focus:ring-2 focus:ring-[#f53003]/20" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] ml-4">Delivery Charges</label>
                                <input type="number" value={formData.charges} onChange={e => setFormData({...formData, charges: e.target.value})} className="w-full px-8 py-5 bg-[var(--admin-input-bg)] text-[var(--admin-text-bright)] rounded-3xl font-bold border-none focus:ring-2 focus:ring-[#f53003]/20" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] ml-4">Client ID</label>
                                <input type="text" value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} className="w-full px-8 py-5 bg-[var(--admin-input-bg)] text-[var(--admin-text-bright)] rounded-3xl font-bold border-none focus:ring-2 focus:ring-[#f53003]/20" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] ml-4">Client Secret</label>
                                <input type="password" value={formData.client_secret} onChange={e => setFormData({...formData, client_secret: e.target.value})} className="w-full px-8 py-5 bg-[var(--admin-input-bg)] text-[var(--admin-text-bright)] rounded-3xl font-bold border-none focus:ring-2 focus:ring-[#f53003]/20" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] ml-4">Email</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-8 py-5 bg-[var(--admin-input-bg)] text-[var(--admin-text-bright)] rounded-3xl font-bold border-none focus:ring-2 focus:ring-[#f53003]/20" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] ml-4">Password</label>
                                <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-8 py-5 bg-[var(--admin-input-bg)] text-[var(--admin-text-bright)] rounded-3xl font-bold border-none focus:ring-2 focus:ring-[#f53003]/20" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] ml-4">Grant Type</label>
                                <input type="text" value={formData.grant_type} onChange={e => setFormData({...formData, grant_type: e.target.value})} className="w-full px-8 py-5 bg-[var(--admin-input-bg)] text-[var(--admin-text-bright)] rounded-3xl font-bold border-none focus:ring-2 focus:ring-[#f53003]/20" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] ml-4">Store ID</label>
                                <input type="text" value={formData.store_id} onChange={e => setFormData({...formData, store_id: e.target.value})} className="w-full px-8 py-5 bg-[var(--admin-input-bg)] text-[var(--admin-text-bright)] rounded-3xl font-bold border-none focus:ring-2 focus:ring-[#f53003]/20" />
                            </div>
                            
                            <div className="col-span-2 space-y-4 pt-6 border-t border-[var(--admin-border)]">
                                <div className="flex justify-between items-end gap-4">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] ml-4">Webhook Secret Key</label>
                                        <input type="text" value={formData.secret_key} onChange={e => setFormData({...formData, secret_key: e.target.value})} className="w-full px-8 py-5 bg-[var(--admin-input-bg)] text-[var(--admin-text-bright)] rounded-3xl font-bold border-none focus:ring-2 focus:ring-[#f53003]/20" placeholder="Automatically generated" />
                                    </div>
                                    <button type="button" onClick={handleGenerateSecret} className="px-8 py-5 bg-[#f53003] text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-[#f53003]/20">Generate</button>
                                </div>
                            </div>

                            <div className="col-span-2 flex items-center gap-4 pt-6">
                                <button type="button" onClick={() => setFormData({...formData, is_active: !formData.is_active})} className={`w-14 h-8 rounded-full transition-all relative ${formData.is_active ? 'bg-[#f53003]' : 'bg-[var(--admin-input-bg)]'}`}>
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.is_active ? 'left-7' : 'left-1'}`}></div>
                                </button>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)]">Service Status: {formData.is_active ? 'Active' : 'Inactive'}</span>
                            </div>

                            <div className="col-span-2 mt-8">
                                <button type="submit" disabled={loading} className="w-full py-8 bg-[#f53003] text-white rounded-[32px] font-black text-xs uppercase tracking-[0.4em] hover:brightness-110 transition-all shadow-2xl shadow-[#f53003]/20 disabled:opacity-50">
                                    {loading ? 'Saving Changes...' : 'Save Configuration'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LogisticSettings;
