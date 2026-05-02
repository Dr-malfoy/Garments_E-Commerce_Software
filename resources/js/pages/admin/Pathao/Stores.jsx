import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PathaoStores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newStore, setNewStore] = useState({
        name: '', contact_name: '', contact_number: '', address: '',
        city_id: '', zone_id: '', area_id: ''
    });
    const [cities, setCities] = useState([]);
    const [zones, setZones] = useState([]);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        fetchStores();
        fetchCities();
    }, []);

    const fetchStores = async () => {
        try {
            const res = await axios.get('/api/pathao/stores');
            setStores(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch stores', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCities = async () => {
        try {
            const res = await axios.get('/api/pathao/cities');
            setCities(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch cities', error);
        }
    };

    const handleCityChange = async (cityId) => {
        setNewStore({ ...newStore, city_id: cityId, zone_id: '', area_id: '' });
        try {
            const res = await axios.get(`/api/pathao/zones/${cityId}`);
            setZones(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch zones', error);
        }
    };

    const handleZoneChange = async (zoneId) => {
        setNewStore({ ...newStore, zone_id: zoneId, area_id: '' });
        try {
            const res = await axios.get(`/api/pathao/areas/${zoneId}`);
            setAreas(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch areas', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/pathao/stores', newStore);
            setShowModal(false);
            fetchStores();
        } catch (error) {
            alert('Failed to create store');
        }
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-[#1b1b18]">Pickup <span className="text-[#f53003]">Stores.</span></h1>
                    <p className="text-black/40 font-bold uppercase tracking-widest text-[10px] mt-1">Manage your merchant pickup locations</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="px-8 py-4 bg-[#1b1b18] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#f53003] transition-all shadow-xl"
                >
                    Add Store
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-64 bg-black/5 animate-pulse rounded-[32px]"></div>)
                ) : (
                    stores.map(store => (
                        <div key={store.store_id} className="bg-white p-8 rounded-[32px] premium-shadow border border-black/5 group hover:bg-[#1b1b18] transition-all duration-500">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-black/5 group-hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors">
                                    <svg className="w-6 h-6 text-[#1b1b18] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                </div>
                                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest rounded-full">Active</span>
                            </div>
                            <h3 className="text-xl font-black text-[#1b1b18] group-hover:text-white transition-colors mb-2">{store.store_name}</h3>
                            <p className="text-black/40 group-hover:text-white/40 text-xs font-bold transition-colors">{store.store_address}</p>
                            
                            <div className="mt-8 pt-8 border-t border-black/5 group-hover:border-white/10 space-y-4">
                                <div className="flex items-center gap-3">
                                    <svg className="w-4 h-4 text-[#f53003]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    <span className="text-[10px] font-black text-[#1b1b18] group-hover:text-white uppercase tracking-widest">{store.store_contact_number}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Store Modal Placeholder */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-[40px] p-10 premium-shadow animate-slide-up">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-black tracking-tight">New Store</h2>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Store Name</label>
                                <input type="text" value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value})} className="w-full px-6 py-4 bg-black/5 rounded-2xl font-bold text-sm border-none" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Contact Name</label>
                                <input type="text" value={newStore.contact_name} onChange={e => setNewStore({...newStore, contact_name: e.target.value})} className="w-full px-6 py-4 bg-black/5 rounded-2xl font-bold text-sm border-none" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Phone Number</label>
                                <input type="text" value={newStore.contact_number} onChange={e => setNewStore({...newStore, contact_number: e.target.value})} className="w-full px-6 py-4 bg-black/5 rounded-2xl font-bold text-sm border-none" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">City</label>
                                <select onChange={e => handleCityChange(e.target.value)} className="w-full px-6 py-4 bg-black/5 rounded-2xl font-bold text-sm border-none" required>
                                    <option value="">Select City</option>
                                    {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
                                </select>
                            </div>
                            {/* ... more fields ... */}
                            <div className="col-span-2 mt-6">
                                <button type="submit" className="w-full py-5 bg-[#1b1b18] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-[#f53003] transition-all shadow-xl">
                                    Create Store
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PathaoStores;
