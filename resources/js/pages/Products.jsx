import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/storefront/Header';
import Footer from '../components/storefront/Footer';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
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
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.category_id === parseInt(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    if (loading) return null;

    return (
        <div className="min-h-screen elegant-gradient-bg">
            <Header settings={settings} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 page-transition">
                {/* Hero Section of Products */}
                <div className="text-center mb-20 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#1b1b18]">
                        The <span className="text-gradient">Catalog.</span>
                    </h1>
                    <p className="text-[#706f6c] font-bold uppercase tracking-[0.3em] text-xs">Explore our latest craftsmanship</p>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16">
                    {/* Filter Sidebar */}
                    <aside className="lg:col-span-3 space-y-12">
                        <div className="glass p-8 rounded-[32px] premium-shadow sticky top-32">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-8">Categories</h2>
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => setSelectedCategory('all')}
                                    className={`text-left px-6 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${selectedCategory === 'all' ? 'bg-[#1b1b18] text-white shadow-xl translate-x-2' : 'text-[#706f6c] hover:bg-black/5'}`}
                                >
                                    All Styles
                                </button>
                                {categories.map(cat => (
                                    <button 
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`text-left px-6 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${selectedCategory === cat.id ? 'bg-[#1b1b18] text-white shadow-xl translate-x-2' : 'text-[#706f6c] hover:bg-black/5'}`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-9 space-y-12">
                        {/* Modern Search */}
                        <div className="relative group">
                            <input 
                                type="text" 
                                placeholder="Search by name or product code..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-16 pr-8 py-6 bg-white border-2 border-black/5 rounded-[24px] focus:border-[#1b1b18] outline-none text-sm font-bold transition-all shadow-sm focus:shadow-2xl"
                            />
                            <svg className="w-6 h-6 absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#1b1b18] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                            {filteredProducts.length === 0 ? (
                                <div className="col-span-full py-32 text-center glass rounded-[40px] border-dashed border-2 border-black/10">
                                    <div className="text-6xl mb-6">🔍</div>
                                    <p className="text-xl font-black text-[#1b1b18]">No results match your search.</p>
                                    <button onClick={() => {setSearch(''); setSelectedCategory('all');}} className="mt-4 px-8 py-3 bg-[#1b1b18] text-white text-[10px] font-black uppercase tracking-widest rounded-full">Reset Filters</button>
                                </div>
                            ) : filteredProducts.map((product) => (
                                <div 
                                    key={product.id} 
                                    className="group cursor-pointer hover-lift"
                                    onClick={() => navigate('/checkout', { state: { product } })}
                                >
                                    <div className="relative aspect-[4/5] bg-white rounded-[32px] overflow-hidden premium-shadow">
                                        {product.image ? (
                                            <img src={`/storage/${product.image}`} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#fff2f2]">
                                                <svg className="w-16 h-16 text-[#f53003]/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                            </div>
                                        )}
                                        {/* Overlay Info */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                                            <div className="bg-white py-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#1b1b18] shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                Checkout Now
                                            </div>
                                        </div>
                                        {/* Tag */}
                                        <div className="absolute top-6 right-6 glass px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#1b1b18]">
                                            {product.category?.name || 'General'}
                                        </div>
                                    </div>
                                    <div className="mt-8 px-2 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-black text-[#1b1b18] tracking-tight line-clamp-1">{product.name}</h3>
                                            <span className="text-xl font-black text-[#1b1b18]">{product.price} Tk</span>
                                        </div>
                                        <p className="text-xs font-bold text-[#706f6c] uppercase tracking-widest">Code: {product.code}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer settings={settings} />
        </div>
    );
};

export default Products;
