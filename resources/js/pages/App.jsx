import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Storefront Components
import Header from '../components/storefront/Header';
import Hero from '../components/storefront/Hero';
import OfferCarousel from '../components/storefront/OfferCarousel';
import CategoryProducts from '../components/storefront/CategoryProducts';
import Footer from '../components/storefront/Footer';

const App = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [productsRes, categoriesRes, settingsRes] = await Promise.all([
                axios.get('/api/public/products'),
                axios.get('/api/public/categories'),
                axios.get('/api/public/settings')
            ]);
            setProducts(productsRes.data);
            setCategories(categoriesRes.data);
            setSettings(settingsRes.data);
        } catch (error) {
            console.error('Failed to fetch storefront data', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-black/5 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-[#f53003] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1b1b18] animate-pulse">GarmentsPro</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen elegant-gradient-bg selection:bg-[#1b1b18] selection:text-white overflow-x-hidden">
            <Header settings={settings} />
            
            <main className="page-transition">
                <Hero settings={settings} />
                
                {/* Visual Section: Featured Offers */}
                <section className="py-20 lg:py-32 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-8">
                            <div className="space-y-4 text-center md:text-left">
                                <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-[#1b1b18] leading-none">
                                    Exclusive <span className="text-gradient">Offers.</span>
                                </h2>
                                <p className="text-[#706f6c] font-bold uppercase tracking-[0.3em] text-xs">Unbeatable deals for the season</p>
                            </div>
                            <Link to="/products" className="px-10 py-5 bg-black/5 text-[#1b1b18] font-black text-xs uppercase tracking-[0.2em] rounded-full hover:bg-[#1b1b18] hover:text-white transition-all">
                                Shop Collection
                            </Link>
                        </div>
                    </div>
                    <OfferCarousel />
                </section>

                {/* Category Sliders */}
                <section className="py-32 rounded-[60px] premium-shadow relative z-10">
                    <CategoryProducts categories={categories} products={products} />
                </section>
                
                {/* Bold Call to Action */}
                <section className="relative py-40 overflow-hidden">
                    {/* Background Gradients */}
                    <div className="absolute inset-0 bg-[#1b1b18] z-0"></div>
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#f53003]/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3"></div>
                    
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
                        <div className="inline-block px-6 py-2 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                            The Philosophy
                        </div>
                        <h2 className="text-5xl lg:text-9xl font-black tracking-tighter leading-[0.8] text-white">
                            Quality That <br/> <span className="italic text-white/20">Never</span> Fades.
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-xl font-bold leading-relaxed">
                            We don't just sell clothes; we provide a lifestyle built on comfort, durability, and timeless aesthetic.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                            <Link to="/products" className="px-14 py-7 bg-white text-[#1b1b18] font-black text-xs uppercase tracking-[0.3em] rounded-[24px] hover:bg-[#f53003] hover:text-white transition-all shadow-2xl">
                                Start Shopping
                            </Link>
                            <Link to="/contact" className="px-14 py-7 border-2 border-white/10 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[24px] hover:bg-white/5 transition-all">
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Trust Markers */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                            {[
                                { label: 'Free Shipping', sub: 'Orders over 2000 Tk' },
                                { label: '24/7 Support', sub: 'Always here for you' },
                                { label: 'Secure Payment', sub: 'Encrypted transactions' },
                                { label: 'Money Back', sub: '30 day guarantee' }
                            ].map((marker, i) => (
                                <div key={i} className="space-y-2">
                                    <h4 className="text-lg font-black text-[#1b1b18] tracking-tight">{marker.label}</h4>
                                    <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">{marker.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer settings={settings} />
        </div>
    );
};

export default App;
