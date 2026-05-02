import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/storefront/Header';
import Footer from '../components/storefront/Footer';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product;

    const [quantity, setQuantity] = useState(1);
    const [calculatedPrice, setCalculatedPrice] = useState(product?.price || 0);
    const [appliedOffer, setAppliedOffer] = useState(null);
    const [settings, setSettings] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        district: '',
        thana: '',
        area: '',
        pathao_city_id: '',
        pathao_zone_id: '',
        pathao_area_id: '',
        size: '',
        notes: ''
    });

    const [cities, setCities] = useState([]);
    const [zones, setZones] = useState([]);
    const [areas, setAreas] = useState([]);
    const [deliveryCharge, setDeliveryCharge] = useState(140);

    const [loading, setLoading] = useState(false);
    const [fetchingSettings, setFetchingSettings] = useState(true);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        if (!product) {
            navigate('/');
            return;
        }
        fetchSettings();
        fetchPathaoCities();
    }, [product]);

    useEffect(() => {
        calculateBestPrice();
    }, [quantity, product]);

    const fetchPathaoCities = async () => {
        try {
            const res = await axios.get('/api/public/pathao/cities');
            setCities(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch cities', error);
        }
    };

    const handleCityChange = async (cityId, cityName) => {
        setFormData({ ...formData, pathao_city_id: cityId, district: cityName, pathao_zone_id: '', pathao_area_id: '' });
        setZones([]);
        setAreas([]);
        try {
            const res = await axios.get(`/api/public/pathao/zones/${cityId}`);
            setZones(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch zones', error);
        }
    };

    const handleZoneChange = async (zoneId, zoneName) => {
        setFormData({ ...formData, pathao_zone_id: zoneId, thana: zoneName, pathao_area_id: '' });
        setAreas([]);
        try {
            const res = await axios.get(`/api/public/pathao/areas/${zoneId}`);
            setAreas(res.data.data || []);
            // After selecting zone, we can estimate price
            calculatePathaoPrice(zoneId);
        } catch (error) {
            console.error('Failed to fetch areas', error);
        }
    };

    const calculatePathaoPrice = async (zoneId) => {
        try {
            const res = await axios.post('/api/public/pathao/check-price', {
                store_id: 1, // Default store for now
                recipient_city_id: formData.pathao_city_id,
                recipient_zone_id: zoneId,
                item_type: 2, // Parcel
                item_weight: 0.5, // Default weight
                delivery_type: 48 // Normal
            });
            if (res.data.data) {
                setDeliveryCharge(res.data.data.price);
            }
        } catch (error) {
            console.error('Failed to calculate Pathao price', error);
        }
    };

    const calculateBestPrice = () => {
        if (!product) return;
        
        let remainingQty = quantity;
        let totalPrice = 0;
        let bestOffer = null;

        if (product.combo_offers && product.combo_offers.length > 0) {
            const sortedOffers = [...product.combo_offers].sort((a, b) => b.quantity - a.quantity);
            for (const offer of sortedOffers) {
                if (remainingQty >= offer.quantity) {
                    const bundles = Math.floor(remainingQty / offer.quantity);
                    totalPrice += bundles * parseFloat(offer.price);
                    remainingQty %= offer.quantity;
                    if (!bestOffer) bestOffer = offer;
                }
            }
        }
        totalPrice += remainingQty * parseFloat(product.price);
        setCalculatedPrice(totalPrice);
        setAppliedOffer(bestOffer);
    };

    const fetchSettings = async () => {
        try {
            const res = await axios.get('/api/public/settings');
            setSettings(res.data);
        } catch (error) {
            console.error('Failed to fetch settings', error);
        } finally {
            setFetchingSettings(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.size) {
            alert('Please select a size');
            return;
        }
        if (!formData.pathao_area_id) {
            alert('Please select your delivery area');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('/api/public/orders', {
                ...formData,
                product_id: product.id,
                quantity: quantity,
                unit_price: product.price,
                total_price: calculatedPrice,
                delivery_charge: deliveryCharge,
                combo_offer_name: appliedOffer ? appliedOffer.name : null
            });
            setOrderId(response.data.order_id);
            setOrderSuccess(true);
        } catch (error) {
            console.error('Order failed', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen elegant-gradient-bg flex items-center justify-center p-4">
                <div className="glass p-12 md:p-16 rounded-[48px] premium-shadow max-w-lg w-full text-center space-y-8 animate-fade-in">
                    <div className="w-24 h-24 bg-[#1b1b18] rounded-[32px] flex items-center justify-center mx-auto mb-4 shadow-2xl animate-float">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-[#1b1b18] tracking-tighter uppercase">Order <br/> Confirmed</h2>
                        <p className="text-[#706f6c] font-bold text-lg leading-relaxed">
                            Thank you for your purchase. <br/>
                            Order ID: <span className="text-[#f53003] font-black">#{orderId}</span>
                        </p>
                    </div>
                    <Link 
                        to="/"
                        className="inline-block w-full py-6 bg-[#1b1b18] text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-[#f53003] transition-all transform active:scale-95"
                    >
                        Back to Atelier
                    </Link>
                </div>
            </div>
        );
    }

    if (fetchingSettings) return null;

    return (
        <div className="min-h-screen elegant-gradient-bg">
            <Header settings={settings} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 page-transition">
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    
                    {/* Left: Product Summary */}
                    <div className="lg:col-span-5 space-y-10 animate-fade-in">
                        <div className="space-y-6">
                            <div className="inline-block px-4 py-2 bg-black/5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-[#1b1b18]">
                                Order Summary
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#1b1b18] leading-[0.9]">Complete Your <br/> <span className="text-gradient">Purchase.</span></h2>
                        </div>

                        <div className="glass p-10 rounded-[40px] premium-shadow space-y-8">
                            <div className="flex gap-8 items-center pb-8 border-b border-black/5">
                                <div className="w-32 h-40 bg-white rounded-[24px] overflow-hidden shadow-lg flex-shrink-0">
                                    {product?.image ? (
                                        <img src={`/storage/${product.image}`} className="w-full h-full object-cover" alt={product.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-[#fff2f2]">
                                            <svg className="w-12 h-12 text-[#f53003]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-black text-[#1b1b18] tracking-tight">{product?.name}</h4>
                                    <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em]">{product?.code}</p>
                                    <div className="text-xl font-black text-[#1b1b18] pt-2">{product?.price} Tk / piece</div>
                                 </div>
                             </div>

                             <div className="space-y-4">
                                 <div className="flex items-center justify-between p-4 bg-black/5 rounded-2xl">
                                     <span className="text-xs font-black uppercase tracking-wider text-black/40">Quantity</span>
                                     <div className="flex items-center gap-6">
                                         <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-black hover:bg-[#1b1b18] hover:text-white transition-all shadow-sm">-</button>
                                         <span className="text-xl font-black text-[#1b1b18]">{quantity}</span>
                                         <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-black hover:bg-[#1b1b18] hover:text-white transition-all shadow-sm">+</button>
                                     </div>
                                 </div>

                                 {appliedOffer && (
                                     <div className="p-4 bg-[#10b981]/5 border border-[#10b981]/20 rounded-2xl flex items-center gap-3 animate-pulse">
                                         <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                                         <span className="text-[10px] font-black text-[#10b981] uppercase tracking-widest">Applied: {appliedOffer.name}</span>
                                     </div>
                                 )}
                                 
                                 <div className="space-y-4 pt-4">
                                     <div className="flex justify-between text-sm font-bold text-[#706f6c]">
                                         <span className="uppercase tracking-widest">Unit Price</span>
                                         <span className="text-[#1b1b18]">{product?.price} Tk</span>
                                     </div>
                                     <div className="flex justify-between text-sm font-bold text-[#706f6c]">
                                         <span className="uppercase tracking-widest">Subtotal ({quantity} items)</span>
                                         <span className="text-[#1b1b18]">{calculatedPrice} Tk</span>
                                     </div>
                                     <div className="flex justify-between text-sm font-bold text-[#706f6c]">
                                         <span className="uppercase tracking-widest">Courier Fee</span>
                                         <span className="text-[#1b1b18]">{deliveryCharge} Tk</span>
                                     </div>
                                     <div className="flex justify-between items-center pt-6 border-t border-black/5">
                                         <span className="text-lg font-black uppercase tracking-[0.3em] text-black/30">Total</span>
                                         <span className="text-3xl font-black text-[#1b1b18]">{(parseFloat(calculatedPrice) + parseFloat(deliveryCharge)).toFixed(2)} Tk</span>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>

                    {/* Right: Delivery Form */}
                    <div className="lg:col-span-7 glass p-10 md:p-16 rounded-[48px] premium-shadow animate-slide-in-right">
                        <h3 className="text-2xl font-black tracking-tight mb-12 text-[#1b1b18] uppercase tracking-[0.2em]">Delivery Details</h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em] ml-2">Identity</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-8 py-6 bg-white border-2 border-black/5 rounded-[24px] focus:border-[#1b1b18] outline-none text-sm font-bold transition-all shadow-sm"
                                        placeholder="Full name"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em] ml-2">Reach</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-8 py-6 bg-white border-2 border-black/5 rounded-[24px] focus:border-[#1b1b18] outline-none text-sm font-bold transition-all shadow-sm"
                                        placeholder="Phone number"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em] ml-2">Select Dimensions</label>
                                <div className="flex flex-wrap gap-4">
                                    {product?.sizes?.map(s => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, size: s.size })}
                                            className={`min-w-[80px] h-[80px] rounded-2xl font-black text-sm uppercase transition-all flex items-center justify-center ${formData.size === s.size ? 'bg-[#1b1b18] text-white shadow-2xl scale-110' : 'bg-white text-[#706f6c] border border-black/5 hover:border-[#1b1b18]'}`}
                                        >
                                            {s.size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em] ml-2">City</label>
                                    <select
                                        required
                                        value={formData.pathao_city_id}
                                        onChange={(e) => handleCityChange(e.target.value, e.target.options[e.target.selectedIndex].text)}
                                        className="w-full px-8 py-6 bg-white border-2 border-black/5 rounded-[24px] focus:border-[#1b1b18] outline-none text-sm font-bold transition-all shadow-sm"
                                    >
                                        <option value="">Select City</option>
                                        {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em] ml-2">Zone</label>
                                    <select
                                        required
                                        disabled={!zones.length}
                                        value={formData.pathao_zone_id}
                                        onChange={(e) => handleZoneChange(e.target.value, e.target.options[e.target.selectedIndex].text)}
                                        className="w-full px-8 py-6 bg-white border-2 border-black/5 rounded-[24px] focus:border-[#1b1b18] outline-none text-sm font-bold transition-all shadow-sm disabled:opacity-50"
                                    >
                                        <option value="">Select Zone</option>
                                        {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em] ml-2">Area</label>
                                    <select
                                        required
                                        disabled={!areas.length}
                                        value={formData.pathao_area_id}
                                        onChange={(e) => setFormData({ ...formData, pathao_area_id: e.target.value, area: e.target.options[e.target.selectedIndex].text })}
                                        className="w-full px-8 py-6 bg-white border-2 border-black/5 rounded-[24px] focus:border-[#1b1b18] outline-none text-sm font-bold transition-all shadow-sm disabled:opacity-50"
                                    >
                                        <option value="">Select Area</option>
                                        {areas.map(a => <option key={a.area_id} value={a.area_id}>{a.area_name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em] ml-2">Estimated Charge</label>
                                    <div className="w-full px-8 py-6 bg-black/5 rounded-[24px] text-sm font-black text-[#1b1b18] flex items-center">
                                        {deliveryCharge} Tk
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em] ml-2">Notes & Logistics</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-8 py-6 bg-white border-2 border-black/5 rounded-[24px] focus:border-[#1b1b18] outline-none text-sm font-bold transition-all shadow-sm resize-none"
                                    placeholder="Specific instructions (optional)"
                                    rows="3"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-8 bg-[#1b1b18] text-white rounded-[32px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-[#f53003] transform active:scale-[0.98] transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Processing Order...' : 'Confirm Transaction'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer settings={settings} />
        </div>
    );
};

export default Checkout;
