import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryProducts = ({ categories, products }) => {
    const navigate = useNavigate();

    const categoryData = categories.map(cat => ({
        ...cat,
        items: products.filter(p => p.category_id === cat.id)
    })).filter(cat => cat.items.length > 0);

    const scrollRef = useRef({});

    const scroll = (catId, direction) => {
        const container = scrollRef.current[catId];
        if (container) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="space-y-32">
            {categoryData.map((category) => (
                <div key={category.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="flex justify-between items-end gap-8 border-b border-black/5 pb-8">
                        <div className="space-y-3">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#1b1b18]">{category.name}</h2>
                            <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.4em]">Handcrafted Excellence</p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => scroll(category.id, 'left')}
                                className="w-14 h-14 rounded-2xl bg-white border border-black/5 flex items-center justify-center hover:bg-[#1b1b18] hover:text-white transition-all premium-shadow group"
                            >
                                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button 
                                onClick={() => scroll(category.id, 'right')}
                                className="w-14 h-14 rounded-2xl bg-white border border-black/5 flex items-center justify-center hover:bg-[#1b1b18] hover:text-white transition-all premium-shadow group"
                            >
                                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>

                    <div 
                        ref={el => scrollRef.current[category.id] = el}
                        className="flex flex-nowrap gap-10 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {category.items.map((product) => (
                            <div 
                                key={product.id} 
                                className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start group cursor-pointer hover-lift"
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
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                                        <div className="glass py-4 rounded-xl text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#1b1b18]">
                                            Quick Order
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 px-2 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-black text-[#1b1b18] tracking-tight truncate">{product.name}</h3>
                                            <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em]">{product.code}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-black text-[#1b1b18] whitespace-nowrap">{product.price} Tk</div>
                                        </div>
                                    </div>
                                    
                                    {product.combo_offers?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {product.combo_offers.map(offer => (
                                                <div key={offer.id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f53003]/5 border border-[#f53003]/20 rounded-full animate-pulse">
                                                    <span className="w-2 h-2 rounded-full bg-[#f53003]"></span>
                                                    <span className="text-[9px] font-black text-[#f53003] uppercase tracking-wider">
                                                        {offer.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
};

export default CategoryProducts;
