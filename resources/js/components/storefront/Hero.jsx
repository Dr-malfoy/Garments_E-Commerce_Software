import React from 'react';
import { Link } from 'react-router-dom';

const Hero = ({ settings }) => {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
            {/* Background Decorative Blurs */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#f53003]/5 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#2563eb]/5 rounded-full blur-[100px]"></div>
            
            <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Content */}
                    <div className="space-y-10 animate-fade-in text-center lg:text-left">
                        <div className="inline-flex items-center gap-3 px-5 py-2 glass rounded-full premium-shadow">
                            <span className="flex h-2 w-2 rounded-full bg-[#f53003] animate-ping"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1b1b18]">New Collection 2026</span>
                        </div>
                        
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-[#1b1b18]">
                            <span className="block italic opacity-40">Style</span>
                            <span className="block relative z-10">Beyond</span>
                            <span className="block text-gradient">Limits.</span>
                        </h1>
                        
                        <p className="text-xl text-[#706f6c] max-w-lg mx-auto lg:mx-0 leading-relaxed font-bold">
                            {settings.hero_desc || 'Experience the pinnacle of garment craftsmanship. Designed for those who demand perfection in every thread.'}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-4">
                            <Link to="/products" className="group relative px-12 py-6 bg-[#1b1b18] text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all hover:bg-[#f53003] hover:-translate-y-1">
                                Explore Store
                                <div className="absolute inset-0 rounded-2xl bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                            </Link>
                            <Link to="/contact" className="px-10 py-6 border-2 border-black/5 text-[#1b1b18] font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-black/5 transition-all">
                                Get In Touch
                            </Link>
                        </div>

                        {/* Stats or trust markers */}
                        <div className="flex items-center gap-12 justify-center lg:justify-start pt-8 border-t border-black/5">
                            <div>
                                <div className="text-2xl font-black text-[#1b1b18]">12K+</div>
                                <div className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Happy Clients</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-[#1b1b18]">4.9/5</div>
                                <div className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Global Rating</div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Side */}
                    <div className="relative hidden lg:block animate-float">
                        <div className="relative z-10 w-full aspect-[4/5] bg-gradient-to-br from-[#1b1b18] to-black rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden group">
                            {settings.hero_image ? (
                                <img src={`/storage/${settings.hero_image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-black">
                                    <svg className="w-48 h-48 text-white/5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99z"/></svg>
                                </div>
                            )}
                            {/* Floating Card */}
                            <div className="absolute bottom-8 left-8 right-8 glass p-6 rounded-3xl premium-shadow translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-1">Featured Item</div>
                                        <div className="text-lg font-black text-[#1b1b18]">Premium Silk Variant</div>
                                    </div>
                                    <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative Rings */}
                        <div className="absolute -top-12 -right-12 w-64 h-64 border-[30px] border-black/5 rounded-full -z-10"></div>
                        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#f53003]/10 rounded-full blur-[60px] -z-10"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
