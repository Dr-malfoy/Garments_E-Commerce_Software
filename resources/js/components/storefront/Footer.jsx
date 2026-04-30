import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ settings }) => {
    return (
        <footer className="bg-[#1b1b18] text-white pt-32 pb-16 rounded-t-[60px] relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 pb-20 border-b border-white/5">
                    {/* Brand Info */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1b1b18] font-black text-xl italic shadow-2xl">
                                {settings.app_name?.[0] || 'G'}
                            </div>
                            <span className="text-2xl font-black tracking-tight uppercase">{settings.app_name || 'Garments'}</span>
                        </Link>
                        <p className="text-gray-400 text-sm font-bold leading-loose max-w-xs">
                            Redefining the standards of premium garments with a focus on sustainable craftsmanship and modern aesthetics.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Explore</h4>
                        <ul className="space-y-4 text-sm font-black uppercase tracking-widest text-gray-400">
                            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link to="/products" className="hover:text-white transition-colors">Catalog</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Support</Link></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Connect</h4>
                        <ul className="space-y-6 text-sm font-bold text-gray-400">
                            <li className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                </div>
                                <span>123 Fashion Ave, <br/> Dhaka, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <span>{settings.contact_email || 'hello@garments.com'}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Newsletter</h4>
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-gray-400">Subscribe for exclusive releases and insights.</p>
                            <div className="flex bg-white/5 p-2 rounded-2xl border border-white/5 focus-within:border-white transition-all">
                                <input type="email" placeholder="Your email" className="bg-transparent border-none outline-none px-4 text-xs flex-1 text-white font-bold" />
                                <button className="bg-white text-[#1b1b18] px-6 py-3 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#f53003] hover:text-white transition-all">Join</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 flex flex-col md:grid md:grid-cols-3 items-center gap-8 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                    <p className="text-center md:text-left">&copy; 2026 {settings.app_name || 'Garments'}.</p>
                    <div className="flex justify-center gap-12">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                    </div>
                    <p className="text-center md:text-right">Crafted with precision.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
